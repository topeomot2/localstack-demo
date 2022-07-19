const { Collection, Db, MongoClient } = require('mongodb');


class DbService {

    constructor(mongoUrl) {
        this.client = new MongoClient(mongoUrl);
    }

    async initialize() {
        await this.client.connect();
    }

    static async create(mongoUrl) {
        const obj = new DbService(mongoUrl);
        await obj.initialize();
        return obj;
    }

    getCollection(name) {
        return this.getDb().collection(name);
    }

    getClient() {
        return this.client;
    }

    getDb() {
        return this.client.db();
    }

    async close() {
        await this.client.close();
    }
}

module.exports = DbService;