package models

import (
	"context"
	"crypto/tls"
	"fmt"
	"net/http"
	"time"

	"go.viam.com/rdk/logging"
	"go.viam.com/rdk/resource"
	"go.viam.com/rdk/services/generic"
	"go.viam.com/utils/rpc"
)

var (
	Webserver = resource.NewModel("viam-soleng", "service", "webserver")
	//errUnimplemented = errors.New("unimplemented")
)

func init() {
	resource.RegisterService(generic.API, Webserver,
		resource.Registration[resource.Resource, *Config]{
			Constructor: newWebserver,
		},
	)
}

type Config struct {
	/*
		Put config attributes here. There should be public/exported fields
		with a `json` parameter at the end of each attribute.

		Example config struct:
			type Config struct {
				Pin   string `json:"pin"`
				Board string `json:"board"`
				MinDeg *float64 `json:"min_angle_deg,omitempty"`
			}

		If your model does not need a config, replace *Config in the init
		function with resource.NoNativeConfig
	*/

	/* Uncomment this if your model does not need to be validated
	   and has no implicit dependecies. */
	// resource.TriviallyValidateConfig

	Port int `json:"port"`
}

// Validate ensures all parts of the config are valid and important fields exist.
// Returns implicit dependencies based on the config.
// The path is the JSON path in your robot's config (not the `Config` struct) to the
// resource being validated; e.g. "components.0".
func (cfg *Config) Validate(path string) ([]string, error) {
	// Add config validation code here
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

	/* Uncomment this if your model does not need to reconfigure. */
	// resource.TriviallyReconfigurable

	// Uncomment this if the model does not have any goroutines that
	// need to be shut down while closing.
	// resource.TriviallyCloseable
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

	// Define the directory to serve files from
	staticDir := "./my-app"

	// Create a file server handler
	fs := http.FileServer(http.Dir(staticDir))

	// Create a new ServeMux
	mux := http.NewServeMux()

	// Handle all requests by serving static files
	mux.Handle("/", fs)

	// Instantiate a new http server
	s.server = &http.Server{
		Addr:    fmt.Sprintf(":%d", port),
		Handler: fs,
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

/*
func (s *webserverService) Reconfigure(ctx context.Context, deps resource.Dependencies, conf resource.Config) error {
	// Put reconfigure code here

	return nil
}
*/

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
