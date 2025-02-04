BIN_OUTPUT_PATH = bin
TOOL_BIN = bin/gotools/$(shell uname -s)-$(shell uname -m)
UNAME_S ?= $(shell uname -s)
GOPATH = $(HOME)/go/bin
export PATH := ${PATH}:$(GOPATH)

build: format update-rdk web
	rm -f $(BIN_OUTPUT_PATH)/webserver
	go build $(LDFLAGS) -o $(BIN_OUTPUT_PATH)/webserver main.go
	rm -rf $(BIN_OUTPUT_PATH)/my-app
	cp -r my-app/build $(BIN_OUTPUT_PATH)/my-app
	

module.tar.gz: build
	rm -f $(BIN_OUTPUT_PATH)/module.tar.gz
	tar czf $(BIN_OUTPUT_PATH)/module.tar.gz $(BIN_OUTPUT_PATH)/webserver $(BIN_OUTPUT_PATH)/my-app meta.json

setup:
	if [ "$(UNAME_S)" = "Linux" ]; then \
		sudo apt-get install -y apt-utils coreutils tar libnlopt-dev libjpeg-dev pkg-config; \
	fi
	# remove unused imports
	go install golang.org/x/tools/cmd/goimports@latest
	find . -name '*.go' -exec $(GOPATH)/goimports -w {} +


clean:
	rm -rf $(BIN_OUTPUT_PATH)/webserver $(BIN_OUTPUT_PATH)/module.tar.gz webserver $(BIN_OUTPUT_PATH)/my-app

format:
	gofmt -w -s .

update-rdk:
	go get go.viam.com/rdk@latest
	go mod tidy

web:
	cd my-app && npm install
	cd my-app && npm run build