const { Endpoint, SQS } = require('aws-sdk');

const {
    NODE_ENV = '',
    AWS_KEY_ID = '',
    AWS_SECRET_ID = '',
    LOCALSTACK_HOSTNAME = '' // used when accessing other aws services in the localstack docker container from a lambda in the same container - automatically given
} = process.env;

const sqsConfigEnv = {
    signatureVersion: 'v4',
    accessKeyId: AWS_KEY_ID,
    secretAccessKey: AWS_SECRET_ID
};

if (NODE_ENV === 'local' || NODE_ENV === 'test') {
    const endpoint = `http://${LOCALSTACK_HOSTNAME}:4566`;
    sqsConfigEnv.endpoint = new Endpoint(endpoint);
}

class SqsService {

    constructor(sqsConfig = sqsConfigEnv) {
        this.client = new SQS(sqsConfig);
    }

    getClient() {
        return this.client;
    }
}

module.exports = SqsService;