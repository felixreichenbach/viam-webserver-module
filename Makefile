BIN_OUTPUT_PATH = bin
TOOL_BIN = bin/gotools/$(shell uname -s)-$(shell uname -m)
UNAME_S ?= $(shell uname -s)
GOPATH = $(HOME)/go/bin
export PATH := ${PATH}:$(GOPATH)

build: format update-rdk
	rm -f $(BIN_OUTPUT_PATH)/webserver
	go build $(LDFLAGS) -o $(BIN_OUTPUT_PATH)/webserver main.go

module.tar.gz: build
	rm -f $(BIN_OUTPUT_PATH)/module.tar.gz
	tar czf $(BIN_OUTPUT_PATH)/module.tar.gz $(BIN_OUTPUT_PATH)/webserver meta.json

clean:
	rm -rf $(BIN_OUTPUT_PATH)/webserver $(BIN_OUTPUT_PATH)/module.tar.gz webserver $(BIN_OUTPUT_PATH)/web-app

format:
	gofmt -w -s .

update-rdk:
	go get go.viam.com/rdk@latest
	go mod tidy

web:
	cd webserver/web-app && npm install
	cd webserver/web-app && npm run build
