live:
	docker run --rm -it -p 8000:8000 -v ${PWD}:/docs squidfunk/mkdocs-material sh -c "pip install -q -r requirements.txt && mkdocs serve -a 0.0.0.0:8000"

build:
	docker run --rm -it -v ${PWD}:/docs squidfunk/mkdocs-material sh -c "pip install -q -r requirements.txt && mkdocs build"

test: build
	docker run --rm -it -v ${PWD}/site:/site registry.gitlab.com/vician/dockerhub/linkchecker linkchecker /site

local-live:
	.venv/bin/mkdocs serve

local-build:
	.venv/bin/mkdocs build
