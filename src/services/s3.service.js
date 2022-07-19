const { Endpoint, S3 } = require('aws-sdk');

const {
    NODE_ENV = '',
    AWS_KEY_ID = '',
    AWS_SECRET_ID = '',
    LOCALSTACK_HOSTNAME = '' // used when accessing other aws services in the localstack docker container from a lambda in the same container - automatically given
} = process.env;

const s3ConfigEnv = {
    signatureVersion: 'v4',
    accessKeyId: AWS_KEY_ID,
    secretAccessKey: AWS_SECRET_ID
};

if (NODE_ENV === 'local' || NODE_ENV === 'test') {
    const endpoint = `http://${LOCALSTACK_HOSTNAME}:4566`;
    s3ConfigEnv.endpoint = new Endpoint(endpoint);
    s3ConfigEnv.s3ForcePathStyle = true;
}

class S3Service {

    constructor(s3Config = s3ConfigEnv) {
        this.client = new S3(s3Config);
    }

    getClient() {
        return this.client;
    }
}

module.exports = S3Service;