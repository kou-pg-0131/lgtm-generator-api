FROM lambci/lambda:build-nodejs12.x
ENV HOME /root

RUN yum -y update \
 && yum -y install \
      java-1.8.0-openjdk.x86_64 \
      ImageMagick

ENV PATH $HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH
RUN curl -o- -L https://yarnpkg.com/install.sh | bash -s -- --version 1.22.10
