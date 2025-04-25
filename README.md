# Viam SPA Module

## Use this module

The module contains a Viam generic service which runs a http server pointing to the `my-app` directory. This directory contains a Svelte single page application created as explained here [Create Svelte Template App](## Create Svelte template single page application)

Write your webapplication inside of `my-app`.

### Prerquisits

1. Install [go](https://go.dev/doc/install)
2. Install [node](https://nodejs.org/en/download/)

### Local web application development

```
cd my-app
npm run dev
```

Build the Viam module:

```
make module.tar.gz
```

Add the path to `module.tar.gz` to your local Viam module configuration and start viam-server.

## Webserver module configuration

### Attributes

The following attributes are available for this model:

| Name             | Type    | Inclusion | Description                                                              |
| ---------------- | ------- | --------- | ------------------------------------------------------------------------ |
| `camera_name`    | string  | Optional  | Configure the name of the camera to be used. Default is `camera`         |
| `vision_name`    | string  | Optional  | Configure the name of the vision service to be used. Default is `vision` |
| `port`           | integer | Optional  | Configure the port the webserver listens on. Default is `33332`          |
| `remote_address` | string  | Optional  | Configure the machine's remote address. Default is `localhost`           |

### Example configuration:

```json
{
  "camera_name": "name of the camera",
  "vision_name": "name of the vision service",
  "remote_address": "part.machine.viam.cloud",
  "port": 33332
}
```

## Create Svelte template single page application

See `my-app` folder

## TODO

- [ ] wait for mdns support by the TypeScript SDK
