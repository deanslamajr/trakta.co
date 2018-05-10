.PHONY: image

IMAGE=traktaco
DOCKER_COMPOSE_SERVICE_NAME=traktaco

image: Dockerfile
	docker build -t $(IMAGE) .

# `make dev`
# spins up container for local development
dev: image
	docker-compose up

# `make bash`
# connects to running docker container and provides bash access
bash:
	docker-compose exec $(DOCKER_COMPOSE_SERVICE_NAME) bash