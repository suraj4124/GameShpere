const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const fixIndexes = async () => {
    try {
        const connection = mongoose.connection;

        connection.once('open', async () => {
            console.log('MongoDB Connected');
            try {
                // Access the native collection
                const collection = connection.db.collection('users');

                // List indexes to verify
                const indexes = await collection.indexes();
                console.log('Current Indexes:', indexes);

                // Drop the problematic index if it exists
                const indexExists = indexes.some(idx => idx.name === 'mobile_1');
                if (indexExists) {
                    await collection.dropIndex('mobile_1');
                    console.log('Successfully dropped "mobile_1" index.');
                } else {
                    console.log('"mobile_1" index not found.');
                }

                process.exit();
            } catch (error) {
                console.error('Error managing indexes:', error);
                process.exit(1);
            }
        });

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

fixIndexes();
