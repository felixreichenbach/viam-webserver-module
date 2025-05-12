
module.tar.gz: bin/webserver build/index.html meta.json
	tar czf module.tar.gz bin/webserver meta.json

bin/webserver: lint *.go cmd/module/*.go *.mod Makefile build/index.html
	go build -o bin/webserver cmd/module/cmd.go

lint:
	gofmt -w .

node_modules: package.json
	npm install

build/index.html: *.json src/*.css src/*.ts src/routes/*.svelte src/lib/*.ts node_modules
#	npm run build disabled for cloud build

updaterdk:
	go get go.viam.com/rdk@latest
	go mod tidy

clean:
	rm -rf .svelte-kit
	rm -rf bin
	rm -rf build
	rm -rf node_modules
	rm -f module.tar.gz

