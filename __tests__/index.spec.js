const { setUp, tearDown, invokeLambda, collection, getAttributes } = require('./helper');
jest.setTimeout(10000)

beforeAll(async () => {
    await setUp();
});

afterAll(async () => {
    await tearDown();
});

describe('Lambda E2E test', () => {
    it('should return an error when lambda is called with no imageName', async () => {
        const response = await invokeLambda();
        expect(response.statusCode).toBe(404);
        const body = JSON.parse(response.body);
        expect(body.error).toBe('No image sent');
    })

    it('should return an error when lambda is called with wrong imageName', async () => {
        const response = await invokeLambda('wrong-image.jpg');
        expect(response.statusCode).toBe(404);
        const body = JSON.parse(response.body);
        expect(body.error).toBe('Image does not exist');
    })

    it('should return successfully when lambda is called with actual imageName in bucket', async () => {
        const image = 'test-start-images.jpg';
        const response = await invokeLambda(image);
        expect(response.statusCode).toBe(200);
        const body = JSON.parse(response.body);
        expect(body.message).toBe('Image has been queued for processing');

        // see if image has an entry in mongo
        const logs = await collection('processImageLogs');
        expect(logs.length ?? 0).toBe(1);
        expect(logs[0].key).toBe(image);

        // see if there is message in queue
        const attributes = await getAttributes();
        expect(attributes.Attributes.ApproximateNumberOfMessages ?? "0").toBe("1")
    })
})