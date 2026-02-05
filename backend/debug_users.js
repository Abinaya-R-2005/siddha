const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/siddha';

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');

        // Define a minimal schema just to read roles
        const UserSchema = new mongoose.Schema({
            fullName: String,
            email: String,
            role: String
        }, { strict: false });

        const User = mongoose.model('User', UserSchema);

        const users = await User.find({});
        console.log('Total Users Found:', users.length);
        console.log('--- User List ---');
        users.forEach(u => {
            console.log(`Name: ${u.fullName}, Email: ${u.email}, Role: '${u.role}'`);
        });

        mongoose.disconnect();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
