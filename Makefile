
##### MAGIC VARIABLES #####

SHELL=/bin/bash # default: /bin/sh

VPATH=docs:src:webpack:ops:built:built/static # search path for prereqs & targets

md_template=./docs/template.html
md_body=./docs/body.html
drfrank=bash drfrank.sh
pandoc=pandoc -f markdown -t html
webpack=node_modules/.bin/webpack
about=docs/about.md

##### CALCULATED VARIABLES #####

md=$(shell find ./docs -type f -name "*.md")
js=$(shell find ./src -type f -name "*.js*")
css=$(shell find ./src -type f -name "*.scss")

md_out=$(subst docs/,built/static/,$(subst .md,.html,$(md)))

##### RULES #####
# first rule is the default

all: certbot nginx

deploy:
	docker build -f ops/certbot.Dockerfile -t bohendo/bjvm-certbot:0.1 .
	docker push bohendo/bjvm-certbot:0.1
	docker build -f ops/nginx.Dockerfile -t bohendo/bjvm-nginx:0.1 .
	docker push bohendo/bjvm-nginx:0.1

certbot: certbot.Dockerfile
	docker build -f ops/certbot.Dockerfile -t bjvm-certbot .

nginx: nginx.Dockerfile nginx.conf client.bundle.js style.css
	docker build -f ops/nginx.Dockerfile -t bjvm-nginx .

server.bundle.js: node_modules webpack/server.prod.js $(js)
	$(webpack) --config webpack/server.prod.js

client.bundle.js: node_modules webpack/client.common.js webpack/client.prod.js $(js)
	$(webpack) --config webpack/client.prod.js

style.css: node_modules $(css)
	$(webpack) --config webpack/client.prod.js

node_modules: package.json package-lock.json
	npm install

# Build docs pages
# targets: target-pattern: prereq-patterns
# $< is an auto var for the first prereq
# $* is an auto var for the stem ie %
$(md_out): built/static/%.html: docs/%.md $(about) $(md_template)

	mkdir -p built/static/
	$(pandoc) $< > $(md_body)
	cp -f $(md_template) built/static/$*.html
	sed -i '/<!--#include body-->/r '"$(md_body)" "$(static)/$*.html"
	sed -i '/<!--#include body-->/d' "built/static/$*.html"
	rm $(md_body)

# readme and about: same thing
$(about): README.md
	cp -f README.md $(about)

clean:
	rm -rf built/*

