const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION ---
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/siddha';
const JWT_SECRET = 'siddha_veda_intelligence_secret_key_2024'; // Hardcoded as per user preference to simplify .env

mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of default 30s
})
    .then(() => {
        console.log('✅ Connected to MongoDB');
        createInitialAdmin();
    })
    .catch(err => {
        console.error('❌ Could not connect to MongoDB. Please check if your IP is whitelisted in MongoDB Atlas.');
        console.error('Error details:', err.message);
    });

const createInitialAdmin = async () => {
    try {
        const adminEmail = 'admin@siddhaveda.com';
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (!existingAdmin) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);
            const admin = new User({
                fullName: 'System Administrator',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin'
            });
            await admin.save();
            console.log('Admin account created: admin@siddhaveda.com / admin123');
        }
    } catch (err) {
        console.error('Error creating admin:', err);
    }
};

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, 'qb-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// --- MODELS ---
const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'faculty', 'admin'], default: 'student' },

    // Common fields
    gender: String,
    dob: Date,
    age: Number,
    mobile: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    bloodGroup: String,
    nationality: String,

    // Student specific
    studentId: String,
    school: String,
    course: String,
    year: String,
    regNo: String,
    academicYear: String,
    parentName: String,
    parentMobile: String,
    occupation: String,
    residenceType: String,

    // Faculty specific
    facultyId: String,
    currentAddress: String,
    permanentAddress: String,
    qualification: String,
    degree: String,
    yearPassing: String,
    university: String,
    designation: String,
    department: String,
    teachingExp: Number,
    industryExp: Number,
    expertise: String,
    doj: Date,
    empType: String,
    salaryGrade: String,
    aadhar: String,

}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

const QuestionBankSchema = new mongoose.Schema({
    title: String,
    subject: String,
    difficulty: String,
    filename: String,
    originalName: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    questionsCount: { type: Number, default: 0 },
    attempts: { type: Number, default: 0 }
}, { timestamps: true });

const QuestionBank = mongoose.model('QuestionBank', QuestionBankSchema);

// --- MIDDLEWARE ---
const verifyAdmin = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== 'admin') return res.status(403).json({ message: 'Admin access only' });
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

// --- ROUTES ---

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, role, ...details } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            email,
            password: hashedPassword,
            role: role || 'student',
            ...details
        });

        await user.save();
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, email: user.email, role: user.role, fullName: user.fullName } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, email: user.email, role: user.role, fullName: user.fullName } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin Routes
app.get('/api/admin/dashboard-stats', verifyAdmin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalFaculty = await User.countDocuments({ role: 'faculty' });
        const totalTests = await QuestionBank.countDocuments();

        // Mock data for graphs to match Figma
        const subjectMastery = [
            { name: 'Noi Naadal', score: 82 },
            { name: 'Maruthuvam', score: 75 },
            { name: 'Gunapadam', score: 78 },
            { name: 'Sirappu Maruthuvam', score: 71 },
            { name: 'Varma Kalai', score: 69 },
        ];

        const performanceTrend = [
            { month: 'Aug', score: 65 },
            { month: 'Sep', score: 68 },
            { month: 'Oct', score: 72 },
            { month: 'Nov', score: 71 },
            { month: 'Dec', score: 75 },
            { month: 'Jan', score: 76 },
            { month: 'Feb', score: 78 },
        ];

        res.json({
            stats: {
                totalUsers,
                totalStudents,
                totalTests,
                globalAverage: 78.5, // Mock
                activeToday: 89 // Mock
            },
            charts: {
                subjectMastery,
                performanceTrend
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/admin/users', verifyAdmin, async (req, res) => {
    try {
        // Exclude admin users
        const users = await User.find({ role: { $ne: 'admin' } }).sort({ createdAt: -1 }).select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/admin/question-banks', verifyAdmin, async (req, res) => {
    try {
        const banks = await QuestionBank.find().sort({ createdAt: -1 });
        res.json(banks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/admin/question-banks', verifyAdmin, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const newBank = new QuestionBank({
            title: req.body.title,
            subject: req.body.subject,
            difficulty: req.body.difficulty,
            filename: req.file.filename,
            originalName: req.file.originalname,
            uploadedBy: req.user.id,
            questionsCount: Math.floor(Math.random() * 100) + 50 // Mocking question count extraction
        });

        await newBank.save();
        res.status(201).json(newBank);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
