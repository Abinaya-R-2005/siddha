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
app.use((req, res, next) => {
    console.log(`[DEBUG] ${req.method} ${req.url}`);
    next();
});
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
    name: { type: String, required: true },
    category: { type: String, enum: ['MRB', 'AIAPGET'], required: true },
    code: String
});
// Composite unique constraint to allow same subject name in different categories
SubjectSchema.index({ name: 1, category: 1 }, { unique: true });
const Subject = mongoose.model('Subject', SubjectSchema);

const initializeSubjects = async () => {
    try {
        const count = await Subject.countDocuments();
        if (count === 0) {
            const defaults = ['Noi Naadal', 'Maruthuvam', 'Gunapadam', 'Sirappu Maruthuvam', 'Varma Kalai'];
            const initialSubjects = [];
            ['MRB', 'AIAPGET'].forEach(cat => {
                defaults.forEach(name => {
                    initialSubjects.push({ name, category: cat });
                });
            });
            await Subject.insertMany(initialSubjects);
            console.log('✅ Default subjects initialized for MRB and AIAPGET');
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
    gender: String,
    dob: String,
    age: String,
    regNo: String,
    course: String,
    year: String,
    mobile: String,
    address: String,
    expertise: String, // Maps to bio
    category: { type: String, enum: ['MRB', 'AIAPGET'], default: 'MRB' },
    studentId: { type: String, unique: true, sparse: true },
    // New Academic Fields
    ugCollege: String,
    ugYear: String,
    pgCollege: String,
    pgYear: String,
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    lastActive: Date
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

const AdminUserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['faculty', 'admin'], default: 'faculty' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' }, // Admin defaults to approved
    lastActive: Date
}, { timestamps: true });

const AdminUser = mongoose.model('AdminUser', AdminUserSchema);

const QuestionBankSchema = new mongoose.Schema({
    title: String,
    subject: String,
    category: { type: String, enum: ['MRB', 'AIAPGET'], default: 'MRB' },
    difficulty: String,
    filename: String,
    filenames: [String],
    questions: [{
        question: String,
        options: [String],
        answer: Number,
        filename: String
    }],
    questionsCount: { type: Number, default: 0 },
    attempts: { type: Number, default: 0 },
    negativeMarking: { type: Boolean, default: false },
    duration: { type: Number, default: 60 }, // Duration in minutes
    status: { type: String, enum: ['draft', 'published', 'disabled'], default: 'published' },
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
    answers: [Number], // Student's selected option indices
    correctAnswers: [Number], // Correct option indices at time of attempt
    date: { type: Date, default: Date.now }
}, { timestamps: true });

const Attempt = mongoose.model('Attempt', AttemptSchema);

const ReAttemptRequestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    testId: { type: mongoose.Schema.Types.ObjectId, ref: 'QuestionBank', required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    message: String
}, { timestamps: true });

const ReAttemptRequest = mongoose.model('ReAttemptRequest', ReAttemptRequestSchema);

const ReviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    text: { type: String, required: true },
    rating: { type: Number, default: 5 },
    image: String,
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, { timestamps: true });

const Review = mongoose.model('Review', ReviewSchema);

// --- MIDDLEWARE ---

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error(`[AUTH] Token Verification Failed: ${err.message}`);
        res.status(401).json({ message: 'Invalid token' });
    }
};

const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role !== 'admin') {
            console.warn(`[AUTH] Admin access denied for user ${req.user.id} (role: ${req.user.role})`);
            return res.status(403).json({ message: 'Admin only' });
        }
        next();
    });
};

const verifyEducator = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role !== 'admin' && req.user.role !== 'faculty') {
            console.warn(`[AUTH] Educator access denied for user ${req.user.id} (role: ${req.user.role})`);
            return res.status(403).json({ message: 'Access denied: Educators only' });
        }
        next();
    });
};

// --- ROUTES ---

// 1. Auth & Profile
app.post('/api/auth/register', async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existsStudent = await User.findOne({ email });
        const existsAdmin = await AdminUser.findOne({ email });
        if (existsStudent || existsAdmin) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        // Admins are approved by default, others start as pending
        // Admins are approved by default, others start as pending
        const status = role === 'admin' ? 'approved' : 'pending';

        let newUser;
        if (role === 'faculty' || role === 'admin') {
            newUser = new AdminUser({ ...req.body, password: hashedPassword, status });
        } else {
            newUser = new User({ ...req.body, password: hashedPassword, status });
        }
        await newUser.save();

        if (status === 'pending') {
            return res.status(201).json({
                message: 'Registration successful. Please wait for admin approval before logging in.',
                status: 'pending'
            });
        }

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
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (user.status === 'pending') {
            return res.status(403).json({ message: 'Your account is pending admin approval.' });
        }
        if (user.status === 'rejected') {
            return res.status(403).json({ message: 'Your account registration has been rejected.' });
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

app.delete('/api/admin/users/:id', verifyAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        await Attempt.deleteMany({ userId: req.params.id });
        await ReAttemptRequest.deleteMany({ userId: req.params.id });
        res.json({ message: 'Student and related data deleted successfully' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin Review Endpoints
app.get('/api/admin/pending-registrations', verifyAdmin, async (req, res) => {
    try {
        const studentPending = await User.find({ status: 'pending' }).select('-password');
        const facultyPending = await AdminUser.find({ status: 'pending' }).select('-password');
        res.json([...studentPending, ...facultyPending]);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.put('/api/admin/approve-registration/:id', verifyAdmin, async (req, res) => {
    try {
        let user = await User.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
        if (!user) {
            user = await AdminUser.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
        }
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User registration approved', user });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.put('/api/admin/reject-registration/:id', verifyAdmin, async (req, res) => {
    try {
        let user = await User.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });
        if (!user) {
            user = await AdminUser.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });
        }
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User registration rejected', user });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// 3. Question Bank Management
app.get('/api/admin/question-banks', verifyEducator, async (req, res) => {
    try {
        const banks = await QuestionBank.find().sort({ createdAt: -1 });
        res.json(banks);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post('/api/admin/question-banks', verifyEducator, upload.array('files', 10), async (req, res) => {
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
            duration: req.body.duration ? parseInt(req.body.duration) : 60,
            category: req.body.category || 'MRB',
            status: req.body.status || 'published',
            startTime: req.body.startTime ? new Date(req.body.startTime) : null,
            endTime: req.body.endTime ? new Date(req.body.endTime) : null
        });
        await newBank.save();
        res.status(201).json(newBank);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.delete('/api/admin/question-banks/:id', verifyEducator, async (req, res) => {
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
// Toggle Status (Separate route to avoid Multer issues with simple updates)
app.patch('/api/admin/question-banks/:id/status', verifyEducator, async (req, res) => {
    try {
        const { status } = req.body;
        console.log(`[PATCH] ${req.params.id} -> ${status}`);

        if (!['draft', 'published', 'disabled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const bank = await QuestionBank.findByIdAndUpdate(
            req.params.id,
            { status: status },
            { new: true, runValidators: false }
        );

        if (!bank) {
            console.error(`Bank not found: ${req.params.id}`);
            return res.status(404).json({ message: 'Question bank not found' });
        }

        console.log(`Status updated to ${bank.status}`);
        res.json({ message: 'Status updated', status: bank.status });
    } catch (err) {
        console.error("PATCH status error:", err);
        res.status(500).json({ message: err.message });
    }
});

app.put('/api/admin/question-banks/:id', verifyEducator, upload.array('files', 100), async (req, res) => {
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
        if (req.body.duration !== undefined) {
            bank.duration = parseInt(req.body.duration);
        }
        if (req.body.status !== undefined) {
            bank.status = req.body.status;
        }
        if (req.body.category !== undefined) {
            bank.category = req.body.category;
        }
        // Timing removed as per user request
        bank.startTime = null;
        bank.endTime = null;

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
        const { category } = req.query;
        let query = {};
        if (category) query.category = category;
        const subjects = await Subject.find(query).sort({ name: 1 });
        res.json(subjects);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post('/api/admin/subjects', verifyAdmin, async (req, res) => {
    try {
        const { name, category } = req.body;
        if (!name || !category) return res.status(400).json({ message: 'Subject name and category required' });

        const exists = await Subject.findOne({ name, category });
        if (exists) return res.status(400).json({ message: 'Subject already exists in this category' });

        const newSubject = new Subject({ name, category });
        await newSubject.save();
        res.status(201).json(newSubject);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.put('/api/admin/subjects/:id', verifyAdmin, async (req, res) => {
    try {
        const { name, category } = req.body;
        const subject = await Subject.findById(req.params.id);
        if (!subject) return res.status(404).json({ message: 'Subject not found' });

        if (name) subject.name = name;
        if (category) subject.category = category;

        await subject.save();
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
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const attempts = await Attempt.find({ userId: req.user.id });
        const attemptedTestIds = attempts.map(a => a.testId ? a.testId.toString() : '');

        const requests = await ReAttemptRequest.find({ userId: req.user.id });

        const tests = await QuestionBank.find({
            status: 'published',
            category: user.category
        }).select('-questions.answer');

        const testsWithStatus = tests.map(t => {
            const reqForTest = requests.find(r => r.testId.toString() === t._id.toString());
            return {
                ...t._doc,
                hasAttempted: attemptedTestIds.includes(t._id.toString()),
                requestStatus: reqForTest ? reqForTest.status : null
            };
        });

        res.json(testsWithStatus);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Re-attempt Request Routes
app.post('/api/user/tests/:id/request-reattempt', verifyToken, async (req, res) => {
    try {
        const existing = await ReAttemptRequest.findOne({ userId: req.user.id, testId: req.params.id, status: 'pending' });
        if (existing) return res.status(400).json({ message: 'Request already pending' });

        const request = new ReAttemptRequest({
            userId: req.user.id,
            testId: req.params.id
        });
        await request.save();
        res.status(201).json({ message: 'Request sent to admin' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.get('/api/admin/reattempt-requests', verifyAdmin, async (req, res) => {
    try {
        const requests = await ReAttemptRequest.find()
            .populate('userId', 'fullName email')
            .populate('testId', 'title subject')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.put('/api/admin/reattempt-requests/:id', verifyAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        const request = await ReAttemptRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ message: 'Request not found' });

        request.status = status;
        await request.save();

        // Removed Attempt.deleteOne to keep history accessible via Review button

        res.json({ message: `Request ${status}` });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Review Routes
app.post('/api/user/reviews', verifyToken, async (req, res) => {
    try {
        const { text, rating } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const review = new Review({
            userId: user._id,
            name: user.fullName,
            role: user.expertise || (user.category === 'MRB' ? 'MRB Aspirant' : 'AIAPGET Aspirant'),
            text,
            rating,
            image: "https://images.unsplash.com/photo-1559839734-2b71f1e9cbee?auto=format&fit=crop&q=80&w=200&h=200", // Default image or user image if available
            status: 'pending'
        });
        await review.save();
        res.status(201).json({ message: 'Review submitted for approval', review });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.get('/api/reviews/approved', async (req, res) => {
    try {
        const reviews = await Review.find({ status: 'approved' }).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.get('/api/admin/reviews', verifyAdmin, async (req, res) => {
    try {
        const reviews = await Review.find().populate('userId', 'fullName email').sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.put('/api/admin/reviews/:id', verifyAdmin, async (req, res) => {
    try {
        const updates = req.body;
        const review = await Review.findByIdAndUpdate(req.params.id, updates, { new: true });
        res.json(review);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.delete('/api/admin/reviews/:id', verifyAdmin, async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.json({ message: 'Review deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.get('/api/user/tests/:id', verifyToken, async (req, res) => {
    try {
        const test = await QuestionBank.findById(req.params.id).select('-questions.answer');
        if (!test) return res.status(404).json({ message: 'Test not found' });

        const attempt = await Attempt.findOne({ userId: req.user.id, testId: req.params.id });
        const request = await ReAttemptRequest.findOne({ userId: req.user.id, testId: req.params.id, status: 'pending' });

        res.json({
            ...test.toObject(),
            hasAttempted: !!attempt,
            requestStatus: request ? request.status : null
        });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post('/api/user/tests/:id/submit', verifyToken, async (req, res) => {
    try {
        const { answers } = req.body; // Array of selected option indices
        const test = await QuestionBank.findById(req.params.id);
        if (!test) return res.status(404).json({ message: 'Test not found' });

        const existingAttempt = await Attempt.findOne({ userId: req.user.id, testId: req.params.id });
        const reattemptApproved = await ReAttemptRequest.findOne({ userId: req.user.id, testId: req.params.id, status: 'approved' });

        if (existingAttempt && !reattemptApproved) {
            return res.status(403).json({ message: 'Test already attempted and no re-attempt is approved' });
        }

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
            subject: test.subject,
            answers: answers,
            correctAnswers: test.questions.map(q => q.answer)
        });
        await attempt.save();

        if (reattemptApproved) {
            await ReAttemptRequest.deleteOne({ _id: reattemptApproved._id });
        }

        test.attempts += 1;
        await test.save();

        // Clear any re-attempt requests for this test
        await ReAttemptRequest.deleteMany({ userId: req.user.id, testId: req.params.id });

        res.json({
            message: "Test submitted successfully",
            score: percentage,
            correct: correctCount,
            total: test.questions.length,
            answers: test.questions.map(q => q.answer) // Return correct answers for immediate review
        });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.get('/api/user/tests/:id/preview', verifyToken, async (req, res) => {
    try {
        const test = await QuestionBank.findById(req.params.id);
        if (!test) {
            console.error(`Preview Failed: Test ${req.params.id} not found`);
            return res.status(404).json({ message: 'Test metadata not found' });
        }

        const attempt = await Attempt.findOne({ userId: req.user.id, testId: req.params.id }).sort({ createdAt: -1 });
        if (!attempt) {
            console.error(`Preview Failed: No attempt for User ${req.user.id} on Test ${req.params.id}`);
            return res.status(404).json({ message: 'Attempt record not found' });
        }

        res.json({ test, attempt });
    } catch (err) {
        console.error('Preview Error:', err);
        res.status(500).json({ message: err.message });
    }
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
    try {
        const adminEmail = 'admin@siddhaveda.com';
        const exists = await AdminUser.findOne({ email: adminEmail });
        if (!exists) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await AdminUser.create({ fullName: 'Admin', email: adminEmail, password: hashedPassword, role: 'admin' });
            console.log('🚀 Admin Ready in AdminUser DB: admin@siddhaveda.com / admin123');
        }
    } catch (err) {
        console.error('Error creating initial admin:', err.message);
    }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`📡 Server: http://localhost:${PORT}`));