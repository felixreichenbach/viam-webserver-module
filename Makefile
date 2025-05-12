
ifneq (,$(wildcard test.make))
	include test.make
    export $(shell sed 's/=.*//' test.make)
endif

module: bin/webserver
	tar czf module.tar.gz bin/webserver meta.json

run: build/index.html  Makefile
	go run cmd/run/cmd-run.go

build/index.html: *.json src/*.css src/*.ts src/routes/*.svelte src/lib/*.ts node_modules
	NODE_ENV=development npm run build

lint:
	gofmt -w .

bin/webserver: bin *.go cmd/module/*.go *.mod Makefile build/index.html
	go build -o bin/webserver cmd/module/cmd.go

updaterdk:
	go get go.viam.com/rdk@latest
	go mod tidy


bin:
	-mkdir bin

node_modules: package.json
	npm install

clean:
	rm -rf bin
	rm -rf node_modules
	rm -f module.tar.gz
	rm -rf build
