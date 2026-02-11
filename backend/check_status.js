const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

async function checkUsers() {
    try {
        await mongoose.connect(MONGODB_URI);
        const User = mongoose.connection.db.collection('users');
        const users = await User.find({}).toArray();
        console.log('--- USERS ---');
        users.forEach(u => console.log(`${u.email}: status="${u.status}"`));

        const target = users.find(u => u.email === '22ucs138@kamarajengg.edu.in');
        if (target) {
            console.log('\n--- TARGET USER FOUND ---');
            console.log(JSON.stringify(target, null, 2));
        } else {
            console.log('\n--- TARGET USER NOT FOUND IN USERS ---');
        }

        const AdminUser = mongoose.connection.db.collection('adminusers');
        const admins = await AdminUser.find({}).toArray();
        console.log('\n--- ADMIN USERS ---');
        admins.forEach(a => console.log(`${a.email}: status="${a.status}"`));

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}
checkUsers();
