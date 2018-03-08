
##### MAGIC VARIABLES #####

SHELL=/bin/bash # default: /bin/sh
VPATH=src:ops:build:build/static # search path for prereqs & targets

$(shell mkdir -p build/static)

webpack=node_modules/.bin/webpack

##### CALCULATED VARIABLES #####

#v=$(shell grep "\"version\"" package.json | egrep -o [0-9.]*)
v=latest

# Input files
client=$(shell find client -type f)
server=$(shell find server -type f)

sol=$(shell find contracts -type f -name "*.sol")

# Output files
artifacts=$(subst contracts/,build/contracts/,$(subst .sol,.json,$(sol)))

##### RULES #####
# first rule is the default

all: bjvm-image
	@true

deploy: bjvm-image
	docker push `whoami`/bjvm:$v

build/bjvm-image: Dockerfile server.bundle.js client.bundle.js
	docker build -f ops/Dockerfile -t `whoami`/bjvm:$v -t bjvm:$v .
	touch build/bjvm-image

server.bundle.js: node_modules webpack.server.js $(artifacts) $(server)
	$(webpack) --config ops/webpack.server.js

client.bundle.js: node_modules webpack.client.js $(artifacts) $(client)
	$(webpack) --config ops/webpack.client.js

$(artifacts): $(sol)
	truffle compile

node_modules: package.json package-lock.json
	npm install

