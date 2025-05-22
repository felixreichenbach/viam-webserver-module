# Viam SPA Module

## Use this module

The module contains a Viam generic service which runs a http server. The webserver points to the `build` directory which is created once you build the app `npm run build`.
The `src` directory contains a Svelte single page application which can easily be replaced.

### Prerquisits

1. Install [go](https://go.dev/doc/install)
2. Install [node](https://nodejs.org/en/download/)

### Local web application development

```
npm install

npm run dev
```

Build the Viam module local:

```
npm run build

make module.tar.gz
```

Add the path to `module.tar.gz` to your local Viam module configuration and start viam-server.

## Webserver module configuration

### Attributes

The following attributes are available for this model:

| Name                | Type    | Inclusion | Description                                                                         |
| ------------------- | ------- | --------- | ----------------------------------------------------------------------------------- |
| `port`              | integer | Optional  | Configure the port the webserver listens on. Default is `8888`                      |
| `camera`            | string  | Required  | The name of the camera you want to use with the vision service                      |
| `vision`            | string  | Required  | The name of the vision service you want to use with the camera                      |
| `thresholds`        | object  | Optional  | Holds threshold values for area, length and shape                                   |
| `thresholds.area`   | integer | Optional  | Acceptable difference betwenn detected area and reference area. Defaults to `0`     |
| `thresholds.length` | integer | Optional  | Acceptable difference betwenn detected length and reference length. Defaults to `0` |
| `thresholds.shape`  | integer | Optional  | Acceptable difference betwenn detected shape and reference shape. Defaults to `0`   |

### Example configuration:

```json
{
  "port": 33333,
  "camera": "camera",
  "vision": "vision",
  "thresholds": {
    "area": 100,
    "length": 100,
    "shape": 100
  }
}
```

## Less obvious features

You can access the Viam configuration in your frontend code using the `http://.../config.json` endpoint.

```json
{
  "name": "ui",
  "api": "rdk:service:generic",
  "model": "hpe-automotive:service:sealant-check-ui",
  "attributes": {
    "camera": "sealant-defect",
    "vision": "vision"
  }
}
```

## Build New Registry Module Version

Example:

```sh
viam module build start --version 0.1.5-rc5
```

## TODO

- [ ] wait for mdns support by the TypeScript SDK
