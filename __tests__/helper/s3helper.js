const fs = require('fs');
const { images } = require('./data')

const { NODE_ENV = 'local',
    INPUT_BUCKET = 'image-input-store',
    OUTPUT_BUCKET = 'image-output-store',
} = process.env;


const clearBuckets = async (s3Service) => {
    if (!['test', 'local'].includes(NODE_ENV)) {
        throw new Error('Can only run on a test.');
    }

    try {
        // check if bucket exists
        const bucketExistsPromises = [];
        bucketExistsPromises.push(s3Service.getClient().headBucket({ Bucket: INPUT_BUCKET }).promise());
        await Promise.all(bucketExistsPromises);

        // list content of bucket
        const { Contents = [] } = await s3Service
            .getClient()
            .listObjectsV2({ Bucket: INPUT_BUCKET })
            .promise();
        const contents = Contents;

        if (contents.length > 0) {
            const keys = [];
            contents.forEach((content) => {
                if (content.Key) {
                    keys.push({ Key: content.Key });
                }
            });

            // delete bucket content
            await s3Service
                .getClient()
                .deleteObjects({
                    Bucket: INPUT_BUCKET,
                    Delete: {
                        Objects: keys
                    }
                })
                .promise();
        }



        // delete buckets
        const bucketDeletePromises = [];
        bucketDeletePromises.push(s3Service.getClient().deleteBucket({ Bucket: INPUT_BUCKET }).promise());
        await Promise.all(bucketDeletePromises);
    } catch (error) {
        return;
    }
};

const loadS3 = async (s3Service) => {
    if (!['test', 'local'].includes(NODE_ENV)) {
        throw new Error('Can only run on a test.');
    }

    // create s3 buckets
    const bucketCreatePromises = [];
    bucketCreatePromises.push(s3Service.getClient().createBucket({ Bucket: INPUT_BUCKET }).promise());
    await Promise.all(bucketCreatePromises);

    // fill s3 input  bucket with content from data

    const promises = [];
    const basePath = `${__dirname}/media/`;

    images.forEach((key) => {
        const fileStream = fs.createReadStream(`${basePath}${key}`);
        promises.push(
            s3Service
                .getClient()
                .upload({ Bucket: INPUT_BUCKET, Key: key, Body: fileStream })
                .promise()
        );
    });

    if (promises.length > 0) {
        try {
            await Promise.all(promises);
        } catch (error) {
            console.log(error);
        }
    }
};

const isInBucket = async (
    s3Service,
    key,
    bucket
) => {
    if (!['test', 'local'].includes(NODE_ENV)) {
        throw new Error('Can only run on a test.');
    }

    try {
        await s3Service.getClient().headObject({ Bucket: bucket, Key: key }).promise();
        return true;
    } catch (error) {
        return false;
    }
};


module.exports = {
    clearBuckets, loadS3, isInBucket
}