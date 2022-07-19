const { Lambda } = require('aws-sdk');

const { NODE_ENV = '', AWS_EDGE_URL = '', AWS_REGION = 'us-east-1' } = process.env;

const invoke = async (name, data) => {
    if (NODE_ENV !== 'test') {
        throw new Error('Can only run on a test.');
    }

    const apiConfig = {
        endpoint: AWS_EDGE_URL,
        region: AWS_REGION
    };
    const lambda = new Lambda(apiConfig);

    const response = await lambda
        .invoke({
            FunctionName: name,
            Payload: JSON.stringify(data),
            InvocationType: "RequestResponse"
        })
        .promise();

    const payload = response.$response.data?.Payload ?? '';

    return payload ? JSON.parse(payload.toString()) : {};
};

module.exports = { invoke };
