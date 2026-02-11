const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI not found in .env');
    process.exit(1);
}

async function approveAll() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const UserSchema = new mongoose.Schema({ status: String }, { strict: false });
        // Use different model names to avoid collision if they are already defined elsewhere in some shared state, 
        // though here it's a fresh process.
        const User = mongoose.model('User', UserSchema);
        const AdminUser = mongoose.model('AdminUser', UserSchema);

        console.log('Approving students...');
        const res1 = await User.updateMany({}, { $set: { status: 'approved' } });
        console.log('Approving faculty/admins...');
        const res2 = await AdminUser.updateMany({}, { $set: { status: 'approved' } });

        console.log(`✅ Success! Force approved ${res1.modifiedCount} students and ${res2.modifiedCount} faculty members.`);

        await mongoose.disconnect();
        console.log('Disconnected.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

approveAll();
