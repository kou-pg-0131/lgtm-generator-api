.PHONY: build-layer yarn

setup_aws_config:
	docker-compose run --rm infra ./bin/setup_aws_config

start:
	docker-compose up app dynamodb
test:
	docker-compose run --rm app yarn run test
lint:
	docker-compose run --rm app yarn run lint
yarn:
	docker-compose run --rm app yarn install --check-files
build-layer:
	docker run --rm \
		--volume "$$(pwd)/layers/imageMagick/lib:/lambda/opt/lib" \
		--volume "$$(pwd)/layers/imageMagick/bin:/lambda/opt/bin" \
		lambci/yumda:2 yum -y install ImageMagick

tfinit:
	docker-compose run --rm --workdir /app/terraform/envs/dev infra terraform init
tfplan:
	docker-compose run --rm --workdir /app/terraform/envs/dev infra terraform plan
tfrefresh:
	docker-compose run --rm --workdir /app/terraform/envs/dev infra terraform refresh
tfshow:
	docker-compose run --rm --workdir /app/terraform/envs/dev infra terraform show
tfapply:
	docker-compose run --rm --workdir /app/terraform/envs/dev infra terraform apply
tfdestroy:
	docker-compose run --rm --workdir /app/terraform/envs/dev infra terraform destroy

deploy: build-layer yarn
	docker-compose run --rm app yarn run deploy --stage dev
remove:
	docker-compose run --rm app yarn run remove --stage dev
