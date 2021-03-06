
$(shell mkdir -p build/static)

##### MAGIC VARIABLES #####

v=latest
me=$(shell whoami)

SHELL=/bin/bash # default: /bin/sh
VPATH=src:ops:build:build/static # search path for prereqs & targets

webpack=node_modules/.bin/webpack

##### CALCULATED VARIABLES #####

# Input files
client=$(shell find client -type f)
nodejs=$(shell find nodejs -type f)
php=$(shell find php -type f)

sol=$(shell find contracts -type f -name "*.sol")

# Output files
artifacts=$(subst contracts/,build/contracts/,$(subst .sol,.json,$(sol)))

##### RULES #####
# first rule is the default

all: bjtj-image dealer.js bjtj.zip
	@true

bjtj.zip: client.bundle.js $(php)
	mkdir -p build/bjtj/js/
	cp -rf php/* build/bjtj
	cp -f build/static/client.bundle.js build/bjtj/js/
	cd build && zip -r bjtj.zip bjtj/*
	rm -rf build/bjtj

deploy: bjtj-image dealer.js
	docker push $(me)/bjtj:$v

build/dealer.js: $(artifacts) ops/preload-dealer.js ops/console.sh
	echo 'var dealerData = ' | tr -d '\n\r' > build/dealer.js
	cat build/contracts/Dealer.json >> build/dealer.js
	echo >> build/dealer.js
	cat ops/preload-dealer.js >> build/dealer.js

build/bjtj-image: Dockerfile nodejs.bundle.js client.bundle.js
	docker build -f ops/Dockerfile -t $(me)/bjtj:$v -t bjtj:$v .
	touch build/bjtj-image

nodejs.bundle.js: node_modules webpack.nodejs.js $(artifacts) $(nodejs)
	$(webpack) --config ops/webpack.nodejs.js

client.bundle.js: node_modules webpack.client.js $(artifacts) $(client)
	$(webpack) --config ops/webpack.client.js

$(artifacts): $(sol)
	@echo $(artifacts) $(sol)
	truffle compile

node_modules: package.json
	npm install

