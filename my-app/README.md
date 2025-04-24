# Viam Svelte Sample Application

This is an example of a Viam web application using Svelte. Feel free to create your own from scratch using the instructions here [`sv`](https://github.com/sveltejs/cli) or change the the example contained in this repository.

## Local Development

To run the application locally you can provide machine credentials via the following VITE `.env`file:

````json
VITE_CONFIGS='{"<- your part id ->": {
  "host": "aaaaa.xxxxx.viam.cloud",
  "credentials": {
    "type": "api-key" ,
    "payload": "xxxxxxx",
    "authEntity": "xxxxxxx"
  },
  "signalingAddress": "https://app.viam.com:443"
}}'


Once you've created the `.env`file (optional) and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
````

## Building

To create a production version of your app / module:

```bash
make module.tar.gz
```

## Adapter Configuration

Changed in svelte.config.js to "@sveltejs/adapter-static"
[adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
