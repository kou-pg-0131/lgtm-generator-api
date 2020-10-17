import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'lgtn-generator-api',
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    profile: 'default',
    region: 'us-east-1',
    runtime: 'nodejs12.x',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
  },
  functions: {
    createLgtm: {
      handler: 'src/interfaces/controllers/handlers/lgtms.create',
      events: [
        {
          http: {
            method: 'post',
            path: '/v1/lgtms',
          }
        }
      ]
    }
  }
}

module.exports = serverlessConfiguration;
