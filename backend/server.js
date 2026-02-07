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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({ storage, fileFilter });

// --- MODELS ---

// --- MODELS ---

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'faculty', 'admin'], default: 'student' },
    // Student & Profile fields
    regNo: String,
    course: String,
    year: String,
    mobile: String,
    address: String,
    expertise: String, // Maps to bio
    studentId: { type: String, unique: true, sparse: true },
    lastActive: Date
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

const QuestionBankSchema = new mongoose.Schema({
    title: String,
    subject: String,
    difficulty: String,
    filename: String, // For legacy/file uploads
    questions: [{
        question: String,
        options: [String],
        answer: Number // Index of the correct option
    }],
    questionsCount: { type: Number, default: 0 },
    attempts: { type: Number, default: 0 }
}, { timestamps: true });

const QuestionBank = mongoose.model('QuestionBank', QuestionBankSchema);

const AttemptSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    testId: { type: mongoose.Schema.Types.ObjectId, ref: 'QuestionBank' },
    score: { type: Number, required: true },
    totalQuestions: Number,
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
        res.status(401).json({ message: 'Invalid token' });
    }
};

const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
        next();
    });
};

// --- ROUTES ---

// 1. Auth & Profile
app.post('/api/auth/register', async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ ...req.body, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ token, user: { id: newUser._id, email: newUser.email, role: newUser.role, fullName: newUser.fullName } });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        user.lastActive = new Date();
        await user.save();
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, email: user.email, role: user.role, fullName: user.fullName } });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.get('/api/user/profile', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post('/api/user/update', verifyToken, async (req, res) => {
    try {
        const updates = req.body;
        const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
        res.json(user);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// 2. Admin: Dashboard Stats & Student List
app.get('/api/admin/dashboard-stats', verifyAdmin, async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalTests = await QuestionBank.countDocuments();

        // Calculate dynamic stats
        const allAttempts = await Attempt.find();
        const globalAverage = allAttempts.length > 0
            ? (allAttempts.reduce((acc, curr) => acc + curr.score, 0) / allAttempts.length).toFixed(1)
            : 0;

        const activeToday = await User.countDocuments({
            lastActive: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
        });

        res.json({
            stats: { totalStudents, totalTests, globalAverage, activeToday },
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

app.get('/api/admin/users', verifyAdmin, async (req, res) => {
    try {
        const users = await User.find({ role: 'student' }).select('-password');
        // Enhance user objects with stats
        const usersWithStats = await Promise.all(users.map(async (u) => {
            const attempts = await Attempt.find({ userId: u._id });
            const avg = attempts.length > 0 ? (attempts.reduce((a, b) => a + b.score, 0) / attempts.length).toFixed(1) : 0;
            return {
                ...u._doc,
                testsCompleted: attempts.length,
                averageScore: avg
            };
        }));
        res.json(usersWithStats);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// 3. Question Bank Management
app.get('/api/admin/question-banks', verifyAdmin, async (req, res) => {
    try {
        const banks = await QuestionBank.find().sort({ createdAt: -1 });
        res.json(banks);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post('/api/admin/question-banks', verifyAdmin, upload.single('file'), async (req, res) => {
    try {
        let questions = [];
        let questionsCount = 0;

        // Process Manual Questions (from Image uploads)
        if (req.body.manualQuestions) {
            try {
                questions = JSON.parse(req.body.manualQuestions);
                questionsCount = parseInt(req.body.questionsCount) || questions.length;
            } catch (pErr) {
                console.error("Failed to parse manual questions:", pErr);
                return res.status(400).json({ message: "Invalid question data format" });
            }
        }

        const newBank = new QuestionBank({
            ...req.body,
            filename: req.file ? req.file.filename : null,
            questions: questions,
            questionsCount: questionsCount || req.body.questionsCount || 0
        });
        await newBank.save();
        res.status(201).json(newBank);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.delete('/api/admin/question-banks/:id', verifyAdmin, async (req, res) => {
    try {
        const bank = await QuestionBank.findById(req.params.id);
        if (bank && bank.filename) {
            const filePath = path.join(uploadDir, bank.filename);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
        await QuestionBank.findByIdAndDelete(req.params.id);
        res.json({ message: 'Question bank deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.put('/api/admin/question-banks/:id', verifyAdmin, async (req, res) => {
    try {
        const { title, subject, difficulty } = req.body;
        const updated = await QuestionBank.findByIdAndUpdate(
            req.params.id,
            { title, subject, difficulty },
            { new: true }
        );
        res.json(updated);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.get('/api/admin/question-banks/:id/download', verifyAdmin, async (req, res) => {
    try {
        const bank = await QuestionBank.findById(req.params.id);
        if (!bank) return res.status(404).json({ message: 'Not found' });

        if (bank.filename) {
            const filePath = path.join(uploadDir, bank.filename);
            if (fs.existsSync(filePath)) {
                return res.download(filePath, bank.filename);
            }
        }

        const jsonData = JSON.stringify({ questions: bank.questions }, null, 2);
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="${bank.title.replace(/[^a-z0-9]/gi, '_')}.json"`);
        res.send(jsonData);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// 4. Student: Tests & Progress
app.get('/api/user/tests', verifyToken, async (req, res) => {
    try {
        const tests = await QuestionBank.find().select('-questions.answer'); // Hide answers
        res.json(tests);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.get('/api/user/tests/:id', verifyToken, async (req, res) => {
    try {
        const test = await QuestionBank.findById(req.params.id).select('-questions.answer');
        if (!test) return res.status(404).json({ message: 'Test not found' });
        res.json(test);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post('/api/user/tests/:id/submit', verifyToken, async (req, res) => {
    try {
        const { answers } = req.body; // Array of selected option indices
        const test = await QuestionBank.findById(req.params.id);
        if (!test) return res.status(404).json({ message: 'Test not found' });

        let score = 0;
        test.questions.forEach((q, idx) => {
            if (answers[idx] === q.answer) score++;
        });

        const percentage = ((score / test.questions.length) * 100).toFixed(1);

        const attempt = new Attempt({
            userId: req.user.id,
            testId: test._id,
            score: parseFloat(percentage),
            totalQuestions: test.questions.length,
            subject: test.subject
        });
        await attempt.save();

        test.attempts += 1;
        await test.save();

        res.json({
            score: percentage,
            correct: score,
            total: test.questions.length,
            message: "Test submitted successfully"
        });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

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