.PHONY: build-layer yarn

setup_aws_config:
	docker-compose run --rm infra ./bin/setup_aws_config

start:
	docker-compose up app dynamodb
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

deploy: build-layer yarn
	docker-compose run --rm app yarn run deploy --stage dev
remove:
	docker-compose run --rm app yarn run remove --stage dev
