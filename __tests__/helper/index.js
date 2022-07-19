const { Endpoint } = require('aws-sdk');
const DbService = require('../../src/services/db.service');
const S3Service = require('../../src/services/s3.service');
const SqsService = require('../../src/services/sqs.service');
const { cleanTestDb, closeTestDb, getCollection } = require('./dbhelper');
const { clearBuckets, loadS3 } = require('./s3helper');
const { clearQueue, setUpQueue, getQueueAttributes } = require('./sqshelper')
const { invoke } = require('./lambdaHelper')

const { NODE_ENV = 'local',
    MONGO_URL = 'mongodb://localhost:27017/localstack-test'
} = process.env;

let dbService;
let s3Service;
let sqsService;

const setUp = async () => {
    if (NODE_ENV !== 'test') {
        throw new Error('Can only run on test and local Node Environment.');
    }

    // clear db
    if (!dbService) dbService = await DbService.create(MONGO_URL);
    await cleanTestDb(dbService);

    if (!s3Service)
        s3Service = new S3Service({
            signatureVersion: 'v4',
            endpoint: new Endpoint(`http://localhost:4566`),
            s3ForcePathStyle: true
        });

    if (!sqsService)
        sqsService = new SqsService({
            signatureVersion: 'v4',
            endpoint: new Endpoint(`http://localhost:4566`),
            region: 'us-east-1'
        });

    await clearBuckets(s3Service);
    await loadS3(s3Service);
    await clearQueue(sqsService);
    await setUpQueue(sqsService)

}

const tearDown = async () => {
    if (NODE_ENV !== 'test') {
        throw new Error('Can only run on test and local Node Environment.');
    }

    if (!dbService) dbService = await DbService.create(MONGO_URL);
    await cleanTestDb(dbService);
    await closeTestDb(dbService);

    if (!s3Service)
        s3Service = new S3Service({
            signatureVersion: 'v4',
            endpoint: new Endpoint(`http://localhost:4566`),
            s3ForcePathStyle: true
        });

    if (!sqsService)
        sqsService = new SqsService({
            signatureVersion: 'v4',
            endpoint: new Endpoint(`http://localhost:4566`),
            region: 'us-east-1'
        });

    await clearBuckets(s3Service);
    await clearQueue(sqsService);

}

const invokeLambda = async (imageName = '') => {
    return await invoke('localstack-demo-local-start', { image: imageName });
};

const collection = async (name) => {
    if (!dbService) dbService = await DbService.create(MONGO_URL ?? '');
    return getCollection(dbService, name);
};

const getAttributes = async () => {
    if (!sqsService)
        sqsService = new SqsService({
            signatureVersion: 'v4',
            endpoint: new Endpoint(`http://localhost:4566`),
            region: 'us-east-1'
        });

    return await getQueueAttributes(sqsService);
}


module.exports = {
    setUp,
    tearDown,
    invokeLambda,
    collection,
    getAttributes
}