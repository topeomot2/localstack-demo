process.env.AWS_KEY_ID = '123';
process.env.AWS_SECRET_ID = 'XYZ';
process.env.AWS_EDGE_URL = 'http://localhost:4566';
process.env.IMAGE_INPUT_QUEUE = 'image-input-queue';
process.env.IMAGE_INITIATE_PROCESS_LAMBDA = 'image-initiate-process';
process.env.IMAGE_PROCESSOR_LAMBDA = 'image-processor';
process.env.INPUT_BUCKET = 'image-input-store';
process.env.OUTPUT_BUCKET = 'image-output-store';
process.env.MONGO_URL = 'mongodb://localhost:27017/localstack-test';