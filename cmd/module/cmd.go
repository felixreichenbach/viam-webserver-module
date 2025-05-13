package main

import (
	webserver "github.com/felixreichenbach/web-app-module"

	"go.viam.com/rdk/components/generic"
	"go.viam.com/rdk/module"
	"go.viam.com/rdk/resource"
)

func main() {
	module.ModularMain(
		resource.APIModel{API: generic.API, Model: webserver.Model},
	)

}
