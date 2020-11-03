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
	docker-compose run --rm app cp \
		/lib64/libblkid.so.1 \
		/lib64/libjpeg.so.62 \
		/lib64/libpangocairo-1.0.so.0 \
		/lib64/libpng15.so.15 \
		/lib64/libcairo.so.2 \
		/lib64/libmount.so.1 \
		/lib64/libpangoft2-1.0.so.0 \
		/lib64/libuuid.so.1 \
		/lib64/libfreetype.so.6 \
		/lib64/libpango-1.0.so.0 \
		/lib64/libpixman-1.so.0 \
		./layers/canvas/lib/

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
