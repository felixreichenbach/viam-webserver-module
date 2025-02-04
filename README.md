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

| Name   | Type    | Inclusion | Description                                                     |
| ------ | ------- | --------- | --------------------------------------------------------------- |
| `port` | integer | Optional  | Configure the port the webserver listens on. Default is `33333` |

### Example configuration:

```json
{
  "port": 33333
}
```

## Create Svelte template single page application

```
npx sv create my-app
cd my-app
npm install
```

## Change to static adapter

```
npm i -D @sveltejs/adapter-static
```

For [single page applications](https://svelte.dev/docs/kit/single-page-apps#Usage) you have to replace the `auto adapter`import with the `static adapter`:

```
import adapter from '@sveltejs/adapter-static';
```

And pass a fallback page into the adapter constructor:

```
adapter: adapter({
	fallback: '200.html' // may differ from host to host
})
```

## Build my-app

```
npm run build
```

## Run local development environment

```
npm run dev

```

## TODO

- [ ] wait for mdns support by the TypeScript SDK

