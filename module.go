package webserver

import (
	"context"
	"embed"
	"io/fs"

	"github.com/erh/vmodutils"
	"go.viam.com/rdk/components/generic"
	"go.viam.com/rdk/logging"
	"go.viam.com/rdk/resource"
)

//go:embed build/*
var staticFS embed.FS

func DistFS() (fs.FS, error) {
	return fs.Sub(staticFS, "build")
}

var Model = resource.NewModel("hpe-automotive", "service", "sealant-check-ui")

func init() {
	resource.RegisterComponent(
		generic.API,
		Model,
		resource.Registration[resource.Resource, resource.NoNativeConfig]{
			Constructor: newServer,
		})
}

func newServer(ctx context.Context, deps resource.Dependencies, config resource.Config, logger logging.Logger) (resource.Resource, error) {
	fs, err := DistFS()
	if err != nil {
		return nil, err
	}

	return vmodutils.NewWebModuleAndStart(config.ResourceName(), fs, logger, config.Attributes.Int("port", 8888))
}
