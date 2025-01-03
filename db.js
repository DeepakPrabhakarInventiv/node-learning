const { MongoClient } = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'nodejs';

let db;

const connectToDatabase = async () => {
    try {
        const client = await MongoClient.connect(connectionURL, { useNewUrlParser: true });
        console.log('Connected to database');
        db = client.db(databaseName);
    } catch (error) {
        console.error('Unable to connect to database!', error);
    }
};

const getDb = () => {
    if (!db) {
        throw new Error('Database not initialized. Call connectToDatabase first.');
    }
    return db;
};

module.exports = { connectToDatabase, getDb };
