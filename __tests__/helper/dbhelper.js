
const cleanTestDb = async (dbService) => {
    const collection = 'processImageLogs';

    const collectionsInDb = await dbService.getDb().listCollections().toArray();
    const collectionNames = {};
    collectionsInDb.forEach((c) => {
        collectionNames[c.name] = true;
    });

    if (collectionNames[collection]) {
        // drop collection
        await dbService.getCollection(collection).drop();
    }
};

const closeTestDb = async (dbService) => {
    dbService.close();
};

const getCollection = async (dbService, name) => {
    return await dbService.getCollection(name).find().toArray();
};

module.exports = { cleanTestDb, closeTestDb, getCollection }