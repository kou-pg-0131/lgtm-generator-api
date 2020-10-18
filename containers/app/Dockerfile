FROM lambci/lambda:build-nodejs12.x
ENV HOME /root

RUN yum -y update

# install yarn
ENV PATH $HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH
RUN curl -o- -L https://yarnpkg.com/install.sh | bash -s -- --version 1.22.10

# install packages for canvas
RUN yum -y install \
      cairo-devel \
      pango-devel \
      libjpeg-turbo-devel
