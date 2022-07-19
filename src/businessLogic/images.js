const { NODE_ENV = 'local',
    INPUT_BUCKET = 'image-input-store',
    OUTPUT_BUCKET = 'image-output-store',
    IMAGE_INPUT_QUEUE = 'image-input-queue'
} = process.env;

const setUpForProcessing = async ({ s3Service, dbService, sqsService }, imageName) => {

    try {
        // check if image occurs
        console.log(imageName);
        await s3Service.getClient().headObject({ Bucket: INPUT_BUCKET, Key: imageName }).promise();
    } catch (error) {
        console.log(error);
        throw new Error('Image does not exist');
    }

    // add start processing to mongodb
    let log = {
        key: imageName,
        bucket: INPUT_BUCKET,
        createdAt: new Date(),
        status: 'notStarted'
    }

    try {
        const response = await dbService.getCollection('processImageLogs').insertOne(log);
        log.processId = response.insertedId;

        // send to queue
        const { QueueUrl = '' } = await sqsService.getClient().getQueueUrl({ QueueName: IMAGE_INPUT_QUEUE }).promise();
        await sqsService.getClient().sendMessage({ QueueUrl, MessageBody: JSON.stringify(log) }).promise();
        return true;
    } catch (error) {
        console.log(error);
        throw new Error('Issue with initiating process, try again later.');
    }


}

module.exports = {
    setUpForProcessing
}