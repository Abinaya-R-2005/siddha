const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --- CONFIGURATION ---
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/siddha';
const JWT_SECRET = 'siddha_veda_intelligence_secret_key_2024';

// --- DATABASE CONNECTION ---
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
        createInitialAdmin();
    })
    .catch(err => console.error('❌ MongoDB Connection Error:', err.message));

// --- FILE UPLOAD SETUP ---
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, `qb-${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

// --- MODELS ---

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'faculty', 'admin'], default: 'student' },
    // Student fields
    regNo: String,
    course: String,
    year: String,
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

const QuestionBankSchema = new mongoose.Schema({
    title: String,
    subject: String,
    difficulty: String,
    filename: String,
    questionsCount: { type: Number, default: 0 },
    attempts: { type: Number, default: 0 }
}, { timestamps: true });

const QuestionBank = mongoose.model('QuestionBank', QuestionBankSchema);

const AttemptSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    testId: { type: mongoose.Schema.Types.ObjectId, ref: 'QuestionBank' },
    score: { type: Number, required: true },
    subject: String,
    date: { type: Date, default: Date.now }
}, { timestamps: true });

const Attempt = mongoose.model('Attempt', AttemptSchema);

// --- MIDDLEWARE ---

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
        next();
    });
};

// --- ROUTES ---

// 1. Auth
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, email: user.email, role: user.role, fullName: user.fullName } });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// 2. Admin Dashboard Stats
app.get('/api/admin/dashboard-stats', verifyAdmin, async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalTests = await QuestionBank.countDocuments();
        res.json({
            stats: { totalStudents, totalTests, globalAverage: 78, activeToday: 12 },
            charts: {
                subjectMastery: [
                    { name: 'Noi Naadal', score: 82 }, { name: 'Gunapadam', score: 65 }, { name: 'Maruthuvam', score: 88 }
                ],
                performanceTrend: [
                    { month: 'Jan', score: 60 }, { month: 'Feb', score: 75 }
                ]
            }
        });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// 3. Question Bank Upload
app.post('/api/admin/question-banks', verifyAdmin, upload.single('file'), async (req, res) => {
    try {
        const newBank = new QuestionBank({ ...req.body, filename: req.file.filename });
        await newBank.save();
        res.status(201).json(newBank);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// 4. Student Progress Analytics

app.get('/api/user/progress', verifyToken, async (req, res) => {
    try {
        const attempts = await Attempt.find({ userId: req.user.id }).sort({ date: 1 });
        
        if (attempts.length === 0) return res.json({ data: null });

        // Calculate Stats
        const avgScore = (attempts.reduce((a, b) => a + b.score, 0) / attempts.length).toFixed(1);
        let improvement = 0;
        if (attempts.length >= 2) {
            improvement = (attempts[attempts.length - 1].score - attempts[attempts.length - 2].score).toFixed(1);
        }

        // Aggregate Subject Mastery
        const subjectStats = await Attempt.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(req.user.id) } },
            { $group: { _id: "$subject", avg: { $avg: "$score" } } }
        ]);

        res.json({
            data: {
                history: attempts.map(a => ({ 
                    date: new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
                    score: a.score 
                })),
                stats: { avgScore, improvement, totalTests: attempts.length, rank: "Level 1" },
                subjectMastery: subjectStats.map(s => ({ subject: s._id, A: s.avg, fullMark: 100 }))
            }
        });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// 5. Submit Test Result (Mocking an exam finish)
app.post('/api/user/submit-test', verifyToken, async (req, res) => {
    try {
        const { score, subject, testId } = req.body;
        const newAttempt = new Attempt({ userId: req.user.id, score, subject, testId });
        await newAttempt.save();
        res.json({ message: "Score saved successfully" });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// --- HELPER: INITIAL ADMIN ---
async function createInitialAdmin() {
    const adminEmail = 'admin@siddhaveda.com';
    const exists = await User.findOne({ email: adminEmail });
    if (!exists) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.create({ fullName: 'Admin', email: adminEmail, password: hashedPassword, role: 'admin' });
        console.log('🚀 Admin Ready: admin@siddhaveda.com / admin123');
    }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`📡 Server: http://localhost:${PORT}`));