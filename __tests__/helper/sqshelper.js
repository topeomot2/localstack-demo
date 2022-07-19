

const { NODE_ENV = 'local',
    IMAGE_INPUT_QUEUE = 'image-input-queue'
} = process.env;

const clearQueue = async (sqsService) => {
    if (!['test', 'local'].includes(NODE_ENV)) {
        throw new Error('Can only run on a test.');
    }

    try {
        const { QueueUrl = '' } = await sqsService.getClient().getQueueUrl({ QueueName: IMAGE_INPUT_QUEUE }).promise();
        await sqsService.getClient().deleteQueue({ QueueUrl }).promise();
    } catch (error) {

    }
}

const setUpQueue = async (sqsService) => {
    if (!['test', 'local'].includes(NODE_ENV)) {
        throw new Error('Can only run on a test.');
    }


    try {
        await sqsService.getClient().getQueueUrl({ QueueName: IMAGE_INPUT_QUEUE }).promise();

    } catch (error) {
        await sqsService.getClient().createQueue({ QueueName: IMAGE_INPUT_QUEUE }).promise();
    }
}

const getQueueAttributes = async (sqsService) => {
    if (!['test', 'local'].includes(NODE_ENV)) {
        throw new Error('Can only run on a test.');
    }

    try {
        const { QueueUrl = '' } = await sqsService.getClient().getQueueUrl({ QueueName: IMAGE_INPUT_QUEUE }).promise();
        return await sqsService.getClient().getQueueAttributes({ QueueUrl, AttributeNames: ['All'] }).promise();
    } catch (error) {
        console.log(error)
        return {}
    }
}

module.exports = {
    clearQueue,
    setUpQueue,
    getQueueAttributes
}

