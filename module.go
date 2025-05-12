package sealantcheckui

import (
	"context"
	"crypto/tls"
	"embed"
	"encoding/json"
	"fmt"
	"io/fs"
	"net/http"
	"os"
	"time"

	"go.viam.com/rdk/logging"
	"go.viam.com/rdk/resource"
	"go.viam.com/rdk/services/generic"
	"go.viam.com/utils/rpc"
)

var (
	Model = resource.ModelNamespace("hpe-automotive").WithFamily("service").WithModel("sealant-check-ui")
)

//go:embed build
var staticFS embed.FS

func init() {
	resource.RegisterService(generic.API, Model,
		resource.Registration[resource.Resource, *Config]{
			Constructor: newWebserver,
		},
	)
}

type Config struct {
	Port          int    `json:"port"`
	RemoteAddress string `json:"remote_address"`
	CameraName    string `json:"camera_name"`
	VisionName    string `json:"vision_name"`
}

func (cfg *Config) Validate(path string) ([]string, error) {
	if cfg.Port > 65535 {
		return nil, resource.NewConfigValidationError(path, fmt.Errorf("invalid port number %d at %s, port must be between 1 and 65535", cfg.Port, path))
	}
	return nil, nil
}

type webserverService struct {
	name resource.Name

	logger logging.Logger
	cfg    *Config

	cancelCtx  context.Context
	cancelFunc func()

	server *http.Server

	resource.TriviallyCloseable
	resource.AlwaysRebuild
}

func newWebserver(ctx context.Context, deps resource.Dependencies, rawConf resource.Config, logger logging.Logger) (resource.Resource, error) {
	conf, err := resource.NativeConfig[*Config](rawConf)
	if err != nil {
		return nil, err
	}

	cancelCtx, cancelFunc := context.WithCancel(context.Background())

	port := 33333
	if conf.Port != 0 {
		port = conf.Port
	}

	s := &webserverService{
		name:       rawConf.ResourceName(),
		logger:     logger,
		cfg:        conf,
		cancelCtx:  cancelCtx,
		cancelFunc: cancelFunc,
	}

	mux := http.NewServeMux()

	var fsToUse fs.FS = staticFS
	/*
		{
			local := os.DirFS("webserver/")
			temp, err := local.Open("web-app/build/index.html")
			if err == nil {
				logger.Infof("using local")
				fsToUse = local
				temp.Close()
			}
		}
	*/

	fsToUse, err = fs.Sub(fsToUse, "web-app/build")
	if err != nil {
		return nil, err
	}
	mux.Handle("/", http.FileServerFS(fsToUse))

	// Handle the /data.json endpoint
	mux.HandleFunc("/data.json", func(w http.ResponseWriter, r *http.Request) {
		s.logger.Infof("Received request for /data.json")
		json, err := s.GetDialConfig(ctx)
		if err != nil {
			s.logger.Errorf("Error getting dial config: %v", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		w.Header()["Content-Type"] = []string{"application/json"}
		w.Header()["Access-Control-Allow-Origin"] = []string{"*"}

		w.Write(json)
	})

	// Instantiate a new http server
	s.server = &http.Server{
		Addr:    fmt.Sprintf(":%d", port), // TODO: Bind to localhost
		Handler: mux,
		TLSConfig: &tls.Config{
			ClientAuth: tls.NoClientCert,
		},
	}
	// Start the server
	go func() {
		if err := s.server.ListenAndServe(); err != nil {
			s.logger.Errorf("Failed to start server: %v", err)
		}
	}()
	s.logger.Infof("Server started on http://localhost:%v", port)

	return s, nil
}

func (s *webserverService) Name() resource.Name {
	return s.name
}

func (s *webserverService) NewClientFromConn(ctx context.Context, conn rpc.ClientConn, remoteName string, name resource.Name, logger logging.Logger) (resource.Resource, error) {
	panic("not implemented")
}

func (s *webserverService) DoCommand(ctx context.Context, cmd map[string]interface{}) (map[string]interface{}, error) {
	panic("not implemented")
}

func (s *webserverService) Close(ctx context.Context) error {
	// Put close code here
	// Gracefully shut down the HTTP server
	if s.server != nil {
		shutdownCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
		defer cancel()
		if err := s.server.Shutdown(shutdownCtx); err != nil {
			return err
		}
	}
	s.cancelFunc()
	return nil
}

// GetDialConfig retrieves the dial configuration to be used to connect to the viam machine
// It returns a JSON object containing the machine's part ID, host, signaling address, and credentials
func (s *webserverService) GetDialConfig(ctx context.Context) ([]byte, error) {

	partID := os.Getenv("VIAM_MACHINE_PART_ID")
	if partID == "" {
		s.logger.Error("VIAM_MACHINE_PART_ID environment variable not set")
		return nil, fmt.Errorf("VIAM_MACHINE_PART_ID environment variable not set")
	}

	host := "localhost"
	if s.cfg.RemoteAddress != "" {
		s.logger.Infof("Using remote address: %s", s.cfg.RemoteAddress)
		host = s.cfg.RemoteAddress
	}

	apiKey := os.Getenv("VIAM_API_KEY")
	if apiKey == "" {
		s.logger.Error("VIAM_API_KEY environment variable not set")
		return nil, fmt.Errorf("VIAM_API_KEY environment variable not set")
	}

	apiKeyID := os.Getenv("VIAM_API_KEY_ID")
	if apiKeyID == "" {
		s.logger.Error("VIAM_API_KEY_ID environment variable not set")
		return nil, fmt.Errorf("VIAM_API_KEY_ID environment variable not set")
	}

	data := map[string]interface{}{
		"dialConfig": map[string]interface{}{
			partID: map[string]interface{}{
				"host":             host,
				"signalingAddress": "https://app.viam.com:443",
				"credentials": map[string]interface{}{
					"type":       "api-key",
					"authEntity": apiKeyID,
					"payload":    apiKey,
				},
			},
		},
		"webConfig": map[string]interface{}{
			"cameraName": s.cfg.CameraName,
			"visionName": s.cfg.VisionName,
		}}

	js, err := json.Marshal(data)
	if err != nil {
		s.logger.Error("error marshalling data %v", err)
		return nil, err
	}
	return js, nil

}
