'use strict';
const DbService = require('../services/db.service');
const S3Service = require('../services/s3.service');
const SqsService = require('../services/sqs.service');
const { setUpForProcessing } = require('../businessLogic/images');

const { NODE_ENV = 'local',
    MONGO_URL = 'mongodb://core-db:27017/localstack-test'
} = process.env;
module.exports.handler = async (event) => {

    try {
        const imageName = event.image ?? '';
        if (!imageName) {
            throw new Error('No image sent');
        }

        const dbService = await DbService.create(MONGO_URL);
        const s3Service = new S3Service();
        const sqsService = new SqsService();

        await setUpForProcessing({ dbService, s3Service, sqsService }, imageName);
        return {
            statusCode: 200,
            body: JSON.stringify(
                {
                    message: 'Image has been queued for processing'
                },
                null,
                2
            ),
        };
    } catch (error) {
        console.log(error);
        return {
            statusCode: 404,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                error: error.message
            })
        };
    }


};
