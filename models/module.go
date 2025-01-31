package models

import (
	"context"
	"crypto/tls"
	"net/http"

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
}

// Validate ensures all parts of the config are valid and important fields exist.
// Returns implicit dependencies based on the config.
// The path is the JSON path in your robot's config (not the `Config` struct) to the
// resource being validated; e.g. "components.0".
func (cfg *Config) Validate(path string) ([]string, error) {
	// Add config validation code here
	return nil, nil
}

type webserverService struct {
	name resource.Name

	logger logging.Logger
	cfg    *Config

	cancelCtx  context.Context
	cancelFunc func()

	webserver *http.Server

	/* Uncomment this if your model does not need to reconfigure. */
	// resource.TriviallyReconfigurable

	// Uncomment this if the model does not have any goroutines that
	// need to be shut down while closing.
	// resource.TriviallyCloseable

}

func newWebserver(ctx context.Context, deps resource.Dependencies, rawConf resource.Config, logger logging.Logger) (resource.Resource, error) {
	conf, err := resource.NativeConfig[*Config](rawConf)
	if err != nil {
		return nil, err
	}

	cancelCtx, cancelFunc := context.WithCancel(context.Background())

	s := &webserverService{
		name:       rawConf.ResourceName(),
		logger:     logger,
		cfg:        conf,
		cancelCtx:  cancelCtx,
		cancelFunc: cancelFunc,
	}
	// TODO: Add port from config
	const port = ":33333"
	// Instantiate a new http server
	s.webserver = &http.Server{
		Addr:    port,
		Handler: http.HandlerFunc(serveFile),
		TLSConfig: &tls.Config{
			ClientAuth: tls.NoClientCert,
		},
	}
	// Start the server
	go func() {
		if err := s.webserver.ListenAndServe(); err != nil {
			s.logger.Errorf("Failed to start server: %v", err)
		}
	}()
	s.logger.Infof("Server started on http://localhost%v", port)

	return s, nil
}

func (s *webserverService) Name() resource.Name {
	return s.name
}

func (s *webserverService) Reconfigure(ctx context.Context, deps resource.Dependencies, conf resource.Config) error {
	// Put reconfigure code here
	s.logger.Infof("Server started on http://localhost:8080")
	return nil
}

func (s *webserverService) NewClientFromConn(ctx context.Context, conn rpc.ClientConn, remoteName string, name resource.Name, logger logging.Logger) (resource.Resource, error) {
	panic("not implemented")
}

func (s *webserverService) DoCommand(ctx context.Context, cmd map[string]interface{}) (map[string]interface{}, error) {
	panic("not implemented")
}

func (s *webserverService) Close(context.Context) error {
	// Put close code here
	s.cancelFunc()
	return nil
}

func serveFile(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path == "/" {
		http.ServeFile(w, r, "./static/example.html")
		return
	}
	http.NotFound(w, r)
}
