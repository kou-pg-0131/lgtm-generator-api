.PHONY: yarn

setup_aws_config:
	docker-compose run --rm infra ./bin/setup_aws_config

yarn:
	docker-compose run --rm app yarn install --check-files

deploy: yarn
	docker-compose run --rm app yarn run deploy --stage dev
remove:
	docker-compose run --rm app yarn run remove --stage dev
