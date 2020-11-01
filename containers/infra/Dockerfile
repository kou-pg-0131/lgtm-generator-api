FROM amazon/aws-cli:2.0.56
WORKDIR /app

RUN yum -y update
RUN yum -y install wget unzip

# install terraform
RUN wget -P /tmp https://releases.hashicorp.com/terraform/0.13.5/terraform_0.13.5_linux_amd64.zip \
 && unzip /tmp/terraform_0.13.5_linux_amd64.zip -d /usr/local/bin/

ENTRYPOINT [""]
