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
        initializeSubjects();
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
    const allowedTypes = ['application/json', 'application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false); // Accept but maybe handle error later if strictly needed, or return error here.
        // Formulter error handling to work well, we might need to handle it in the route.
        // Let's just return true for now to avoid the multer error crashing the app if the frontend sends a weird type,
        // but frontend validation should catch it. Actually, returning error is better.
        cb(new Error('Invalid file type. Only JSON, PDF, and Images are allowed!'), false);
    }
};

const upload = multer({ storage, fileFilter });

// --- MODELS ---

const SubjectSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    code: String
});
const Subject = mongoose.model('Subject', SubjectSchema);

const initializeSubjects = async () => {
    try {
        const count = await Subject.countDocuments();
        if (count === 0) {
            const defaults = ['Noi Naadal', 'Maruthuvam', 'Gunapadam', 'Sirappu Maruthuvam', 'Varma Kalai'];
            await Subject.insertMany(defaults.map(name => ({ name })));
            console.log('✅ Default subjects initialized');
        }
    } catch (error) {
        console.error('Error initializing subjects:', error);
    }
};

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

const AdminUserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['faculty', 'admin'], default: 'faculty' },
    lastActive: Date
}, { timestamps: true });

const AdminUser = mongoose.model('AdminUser', AdminUserSchema);

const QuestionBankSchema = new mongoose.Schema({
    title: String,
    subject: String,
    difficulty: String,
    filename: String, // Deprecated, kept for backward compatibility
    filenames: [String], // Stores multiple file paths
    questions: [{
        question: String,
        options: [String],
        answer: Number, // Index of the correct option
        filename: String // Image for this specific question
    }],
    questionsCount: { type: Number, default: 0 },
    attempts: { type: Number, default: 0 },
    negativeMarking: { type: Boolean, default: false },
    startTime: { type: Date },
    endTime: { type: Date }
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
        // Registration is for Students mainly.
        // If checking for admin registration (unlikely public), we'd need more logic.
        // Assuming student registration for now.

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
        const { email, password, role: loginType } = req.body;
        let user;
        let collectionName = 'User';

        if (loginType === 'faculty') {
            user = await AdminUser.findOne({ email });
            collectionName = 'AdminUser';
        } else {
            // Default to Student check
            user = await User.findOne({ email });
            if (user && user.role !== 'student') {
                return res.status(403).json({ message: 'Please use the Admin/Faculty login.' });
            }
        }

        if (!user || !(await bcrypt.compare(password, user.password))) {
            // If checking Admin and not found, user might exist in User DB?
            // User requested separate DB checks. So strictly fail.
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
        let user;
        if (req.user.role === 'admin' || req.user.role === 'faculty') {
            user = await AdminUser.findById(req.user.id).select('-password');
        } else {
            user = await User.findById(req.user.id).select('-password');
        }
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

app.post('/api/admin/question-banks', verifyAdmin, upload.array('files', 10), async (req, res) => {
    try {
        let questions = [];
        let questionsCount = 0;

        // Process Manual Questions
        if (req.body.manualQuestions) {
            try {
                questions = JSON.parse(req.body.manualQuestions);

                // Map uploaded files to questions that expect them
                let fileIdx = 0;
                questions = questions.map(q => {
                    if (q.file !== undefined || q.preview !== undefined || q.hasImage) { // Legacy or marker
                        // ... we'll use a better marker
                    }
                    return q;
                });

                // Actually, the new frontend sends questions with 'file' removed but 'hasImage' or similar can be used.
                // Let's use 'hasNewFile' as the marker.
                questions = questions.map(q => {
                    if (q.hasNewFile && req.files && req.files[fileIdx]) {
                        q.filename = req.files[fileIdx].filename;
                        fileIdx++;
                    }
                    delete q.hasNewFile;
                    return q;
                });

                questionsCount = questions.length; // Fixed: Use questions.length directly after processing
            } catch (pErr) {
                console.error("Failed to parse manual questions:", pErr);
                return res.status(400).json({ message: "Invalid question data format" });
            }
        }

        const filenames = req.files ? req.files.map(f => f.filename) : [];

        const newBank = new QuestionBank({
            ...req.body,
            filename: filenames.length > 0 ? filenames[0] : null,
            filenames: filenames,
            questions: questions,
            questionsCount: questionsCount || req.body.questionsCount || 0,
            negativeMarking: req.body.negativeMarking === 'true' || req.body.negativeMarking === true,
            startTime: req.body.startTime ? new Date(req.body.startTime) : null,
            endTime: req.body.endTime ? new Date(req.body.endTime) : null
        });
        await newBank.save();
        res.status(201).json(newBank);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.delete('/api/admin/question-banks/:id', verifyAdmin, async (req, res) => {
    try {
        const bank = await QuestionBank.findById(req.params.id);
        if (!bank) return res.status(404).json({ message: 'Not found' });

        // Helper to safely delete file
        const deleteFile = (filename) => {
            if (!filename) return;
            try {
                const filePath = path.join(uploadDir, filename);
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            } catch (e) {
                console.error(`Failed to delete file ${filename}:`, e);
            }
        };

        // Delete legacy single file
        if (bank.filename) deleteFile(bank.filename);

        // Delete multiple files
        if (bank.filenames && bank.filenames.length > 0) {
            bank.filenames.forEach(f => deleteFile(f));
        }

        await QuestionBank.findByIdAndDelete(req.params.id);
        res.json({ message: 'Question bank deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.put('/api/admin/question-banks/:id', verifyAdmin, upload.array('files', 100), async (req, res) => {
    try {
        const { title, subject, difficulty } = req.body;
        const bank = await QuestionBank.findById(req.params.id);
        if (!bank) return res.status(404).json({ message: 'Question bank not found' });

        // Update metadata
        if (title) bank.title = title;
        if (subject) bank.subject = subject;
        if (difficulty) bank.difficulty = difficulty;
        if (req.body.negativeMarking !== undefined) {
            bank.negativeMarking = req.body.negativeMarking === 'true' || req.body.negativeMarking === true;
        }
        if (req.body.startTime !== undefined) {
            bank.startTime = req.body.startTime ? new Date(req.body.startTime) : null;
        }
        if (req.body.endTime !== undefined) {
            bank.endTime = req.body.endTime ? new Date(req.body.endTime) : null;
        }

        // Initialize with existing state
        let finalFilenames = bank.filenames && bank.filenames.length > 0 ? bank.filenames : (bank.filename ? [bank.filename] : []);
        let finalQuestions = bank.questions || [];

        // Process Updates & New Files
        if (req.body.updatedQuestions) {
            try {
                const incomingQuestions = JSON.parse(req.body.updatedQuestions);

                // Identify deleted files
                // Existing files in the bank
                const existingFilenames = bank.filenames || [];
                // Filenames kept in the incoming update (excluding new files which don't have filenames yet)
                const keptFilenames = incomingQuestions.filter(q => q.filename && !q.hasNewFile).map(q => q.filename);
                const filesToDelete = existingFilenames.filter(f => !keptFilenames.includes(f));

                filesToDelete.forEach(filename => {
                    const filePath = path.join(uploadDir, filename);
                    if (fs.existsSync(filePath)) {
                        try { fs.unlinkSync(filePath); } catch (e) {
                            console.error("Failed to delete file:", filename, e);
                        }
                    }
                });

                // Map new files to questions
                let fileIdx = 0;
                finalQuestions = incomingQuestions.map(q => {
                    if (q.hasNewFile && req.files && req.files[fileIdx]) {
                        q.filename = req.files[fileIdx].filename;
                        fileIdx++;
                    }
                    delete q.hasNewFile;
                    return q;
                });

                finalFilenames = finalQuestions.filter(q => q.filename).map(q => q.filename);
            } catch (err) {
                console.error("Update failed logic:", err);
                return res.status(400).json({ message: "Invalid update data" });
            }
        }

        // Apply final changes
        bank.filenames = finalFilenames;
        bank.filename = finalFilenames.length > 0 ? finalFilenames[0] : null;
        bank.questions = finalQuestions;
        bank.questionsCount = finalQuestions.length;

        await bank.save();
        res.json(bank);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.get('/api/admin/question-banks/:id/download', verifyAdmin, async (req, res) => {
    try {
        const bank = await QuestionBank.findById(req.params.id);
        if (!bank) return res.status(404).json({ message: 'Not found' });

        // Check if there are multiple files
        if (bank.filenames && bank.filenames.length > 0) {
            const mainFile = bank.filenames[0];
            const filePath = path.join(uploadDir, mainFile);
            if (fs.existsSync(filePath)) {
                return res.download(filePath, mainFile);
            }
        }
        else if (bank.filename) {
            const filePath = path.join(uploadDir, bank.filename);
            if (fs.existsSync(filePath)) {
                return res.download(filePath, bank.filename);
            }
        }

        // If no file, or file missing, generate JSON
        const jsonData = JSON.stringify(bank.questions || [], null, 2);
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="${bank.title.replace(/[^a-z0-9]/gi, '_')}.json"`);
        res.send(jsonData);
    } catch (err) {
        console.error("Download error:", err);
        res.status(500).json({ message: err.message });
    }
});

// --- SUBJECTS ---
app.get('/api/subjects', async (req, res) => {
    try {
        const subjects = await Subject.find().sort({ name: 1 });
        res.json(subjects);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post('/api/admin/subjects', verifyAdmin, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: 'Subject name required' });

        const exists = await Subject.findOne({ name });
        if (exists) return res.status(400).json({ message: 'Subject already exists' });

        const newSubject = new Subject({ name });
        await newSubject.save();
        res.status(201).json(newSubject);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.put('/api/admin/subjects/:id', verifyAdmin, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: 'Subject name required' });

        const subject = await Subject.findByIdAndUpdate(req.params.id, { name }, { new: true });
        if (!subject) return res.status(404).json({ message: 'Subject not found' });

        res.json(subject);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.delete('/api/admin/subjects/:id', verifyAdmin, async (req, res) => {
    try {
        await Subject.findByIdAndDelete(req.params.id);
        res.json({ message: 'Subject deleted' });
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
        let correctCount = 0;
        let wrongCount = 0;

        test.questions.forEach((q, idx) => {
            if (answers[idx] === q.answer) {
                correctCount++;
            } else if (answers[idx] !== null && answers[idx] !== undefined && answers[idx] !== '') {
                wrongCount++;
            }
        });

        if (test.negativeMarking) {
            score = correctCount - (wrongCount * 0.25);
            if (score < 0) score = 0;
        } else {
            score = correctCount;
        }

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
    const exists = await AdminUser.findOne({ email: adminEmail });
    if (!exists) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await AdminUser.create({ fullName: 'Admin', email: adminEmail, password: hashedPassword, role: 'admin' });
        console.log('🚀 Admin Ready in AdminUser DB: admin@siddhaveda.com / admin123');
    }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`📡 Server: http://localhost:${PORT}`));