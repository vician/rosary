live:
	docker run --rm -it -p 8000:8000 -v ${PWD}:/docs squidfunk/mkdocs-material

build:
	docker run --rm -it -v ${PWD}:/docs squidfunk/mkdocs-material build

test: build
	docker run --rm -it -v ${PWD}/site:/site registry.gitlab.com/vician/dockerhub/linkchecker linkchecker /site
