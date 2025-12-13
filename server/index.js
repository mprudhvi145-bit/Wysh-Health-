import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import rateLimit from 'express-rate-limit';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import multer from 'multer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'wysh-secure-dev-secret-key-change-in-prod';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  console.warn("⚠️  WARNING: GOOGLE_CLIENT_ID is not set in server/.env. Google Auth will fail.");
}

// Multer setup
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// --- In-Memory Mock Database (Mirrors Prisma Schema) ---

const users = [
  {
    id: 'usr_doc_1',
    name: 'Dr. Sarah Chen',
    email: 'doctor@wysh.com',
    password: 'password', 
    role: 'doctor',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
    specialty: 'Cardiology'
  },
  {
    id: 'usr_pat_1',
    name: 'Alex Doe',
    email: 'alex@example.com',
    password: 'password',
    role: 'patient',
    avatar: 'https://ui-avatars.com/api/?name=Alex+Doe&background=random'
  }
];

const patients = [
  { 
    id: 'p1', 
    userId: 'usr_pat_1', 
    name: 'Alex Doe', 
    age: 34, 
    bloodType: 'O+', 
    allergies: ['Peanuts'], 
    chronicConditions: ['Arrhythmia'], 
    lastVisit: '2024-10-12',
    status: 'Stable'
  },
  { 
    id: 'p2', 
    userId: 'usr_pat_2', // Mock user
    name: 'Maria Garcia', 
    age: 29, 
    bloodType: 'A-', 
    allergies: [], 
    chronicConditions: ['Pregnancy'], 
    lastVisit: '2024-10-15',
    status: 'Active' 
  },
  { 
    id: 'p3', 
    userId: 'usr_pat_3', 
    name: 'John Smith', 
    age: 45, 
    bloodType: 'B+', 
    allergies: ['Penicillin'], 
    chronicConditions: ['Hypertension'], 
    lastVisit: '2024-10-10',
    status: 'Critical'
  },
];

// Clinical tables
const clinicalRecords = {
  prescriptions: [
    {
      id: 'rx_demo_1',
      patientId: 'p1',
      doctorId: 'usr_doc_1',
      doctorName: 'Dr. Sarah Chen',
      date: '2024-10-12',
      status: 'Active',
      notes: 'Take with food',
      medications: [
        { name: 'Metoprolol', dosage: '50mg', frequency: 'Twice daily', duration: '30 days' }
      ]
    }
  ],
  labOrders: [
    {
      id: 'lab_demo_1',
      patientId: 'p1',
      doctorId: 'usr_doc_1',
      testName: 'Lipid Panel',
      category: 'Blood',
      priority: 'Routine',
      status: 'Completed',
      dateOrdered: '2024-10-12'
    }
  ],
  clinicalNotes: [
    {
      id: 'note_1',
      patientId: 'p1',
      doctorId: 'usr_doc_1',
      doctorName: 'Dr. Sarah Chen',
      type: 'Visit Summary',
      subject: 'Follow-up on Arrhythmia',
      content: 'Patient reports mild palpitations. BP 120/80. No new symptoms. Advised to continue medication.',
      createdAt: '2024-10-12T10:30:00Z',
      isPrivate: false
    }
  ],
  auditLogs: []
};

// --- Helper: Audit Logging ---
const logAudit = (userId, action, resource, details = {}) => {
  const log = {
    id: `log_${Date.now()}`,
    userId,
    action,
    resource,
    details,
    timestamp: new Date().toISOString()
  };
  clinicalRecords.auditLogs.unshift(log);
  console.log(`[AUDIT] ${action} by ${userId} on ${resource}`);
};

// --- Middleware ---

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '100kb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false
});

app.use('/api/', limiter);

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// --- Auth Routes ---

app.post('/api/auth/google', async (req, res) => {
  try {
    const { token, role = 'patient' } = req.body;
    const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;
    let user = users.find(u => u.email === email);

    if (!user) {
      user = {
        id: `usr_${Math.random().toString(36).substr(2, 9)}`,
        name,
        email,
        role,
        avatar: picture,
        googleId,
        linkedGoogle: true
      };
      users.push(user);
    }
    const authToken = generateToken(user);
    res.json({ user, token: authToken });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(401).json({ error: 'Invalid Google Token' });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && (u.password === password || u.password === undefined));
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  
  logAudit(user.id, 'LOGIN', 'Auth');
  const token = generateToken(user);
  res.json({ user, token });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role } = req.body;
  if (users.find(u => u.email === email)) return res.status(400).json({ error: 'User already exists' });
  const newUser = {
    id: `usr_${Math.random().toString(36).substr(2, 9)}`,
    name,
    email,
    password, 
    role: role || 'patient',
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`
  };
  users.push(newUser);
  logAudit(newUser.id, 'REGISTER', 'Auth');
  const token = generateToken(newUser);
  res.status(201).json({ user: newUser, token });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.sendStatus(404);
  res.json({ user });
});

// --- Clinical Workflows (Doctor APIs) ---

// 1. Search Patients
app.get('/api/clinical/patients', authenticateToken, (req, res) => {
  if (req.user.role !== 'doctor') return res.sendStatus(403);
  
  const { query } = req.query;
  let results = patients;
  if (query) {
    const q = query.toLowerCase();
    results = patients.filter(p => p.name.toLowerCase().includes(q));
  }
  
  // Minimal logging for search to avoid spam, but useful for compliance
  // logAudit(req.user.id, 'SEARCH_PATIENT', 'PatientIndex'); 
  
  res.json({ data: results });
});

// 2. Get Patient Details (Chart View)
app.get('/api/clinical/patients/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'doctor') return res.sendStatus(403);

  const patient = patients.find(p => p.id === req.params.id);
  if (!patient) return res.status(404).json({ error: 'Patient not found' });
  
  logAudit(req.user.id, 'VIEW_CHART', `Patient:${patient.id}`);

  // Aggregate Clinical Data
  const patientRx = clinicalRecords.prescriptions.filter(rx => rx.patientId === patient.id);
  const patientLabs = clinicalRecords.labOrders.filter(lab => lab.patientId === patient.id);
  const patientNotes = clinicalRecords.clinicalNotes.filter(n => n.patientId === patient.id);
  
  res.json({ 
    data: { 
      ...patient, 
      prescriptions: patientRx, 
      labOrders: patientLabs,
      clinicalNotes: patientNotes
    } 
  });
});

// 3. Create Prescription
app.post('/api/clinical/prescriptions', authenticateToken, (req, res) => {
  if (req.user.role !== 'doctor') return res.sendStatus(403);
  
  const { patientId, medications, notes } = req.body;
  
  const newRx = {
    id: `rx_${Math.random().toString(36).substr(2, 9)}`,
    patientId,
    doctorId: req.user.id,
    doctorName: req.user.name,
    medications,
    notes,
    date: new Date().toISOString().split('T')[0],
    status: 'Active'
  };
  
  clinicalRecords.prescriptions.unshift(newRx);
  logAudit(req.user.id, 'CREATE_RX', `Patient:${patientId}`, { rxId: newRx.id });
  
  res.status(201).json({ data: newRx });
});

// 4. Order Lab Test
app.post('/api/clinical/labs', authenticateToken, (req, res) => {
  if (req.user.role !== 'doctor') return res.sendStatus(403);

  const { patientId, testName, category, priority } = req.body;

  const newLab = {
    id: `lab_${Math.random().toString(36).substr(2, 9)}`,
    patientId,
    doctorId: req.user.id,
    testName,
    category,
    priority,
    status: 'Ordered',
    dateOrdered: new Date().toISOString().split('T')[0]
  };

  clinicalRecords.labOrders.unshift(newLab);
  logAudit(req.user.id, 'ORDER_LAB', `Patient:${patientId}`, { labId: newLab.id });

  res.status(201).json({ data: newLab });
});

// 5. Create Clinical Note
app.post('/api/clinical/notes', authenticateToken, (req, res) => {
  if (req.user.role !== 'doctor') return res.sendStatus(403);

  const { patientId, type, subject, content, isPrivate } = req.body;

  const newNote = {
    id: `note_${Math.random().toString(36).substr(2, 9)}`,
    patientId,
    doctorId: req.user.id,
    doctorName: req.user.name,
    type,
    subject,
    content,
    isPrivate: isPrivate || false,
    createdAt: new Date().toISOString()
  };

  clinicalRecords.clinicalNotes.unshift(newNote);
  logAudit(req.user.id, 'CREATE_NOTE', `Patient:${patientId}`, { noteId: newNote.id });

  res.status(201).json({ data: newNote });
});

// --- AI Service ---

const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

app.post('/api/ai/health-insight', authenticateToken, async (req, res) => {
  if (!ai) return res.status(503).json({ error: 'AI Service not configured.' });
  try {
    const { prompt, systemInstruction } = req.body;
    
    logAudit(req.user.id, 'AI_QUERY', 'Gemini');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || "You are Wysh AI, a helpful healthcare assistant.",
        maxOutputTokens: 500,
      }
    });
    return res.json({ text: response.text, status: 'success' });
  } catch (error) {
    console.error('Gemini Proxy Error:', error);
    res.status(500).json({ error: 'AI processing error' });
  }
});

app.post('/api/ai/document-extract', authenticateToken, upload.single('file'), async (req, res) => {
  if (!ai) return res.status(503).json({ error: 'AI Service not configured.' });
  try {
    const file = req.file;
    const { documentType } = req.body;
    if (!file) return res.status(400).json({ error: 'No file uploaded.' });

    logAudit(req.user.id, 'AI_DOC_EXTRACT', `Type:${documentType}`);

    const base64Data = file.buffer.toString('base64');
    const mimeType = file.mimetype;

    const prompt = `
      Analyze this medical document (${documentType}).
      Extract the following information in strict JSON format:
      1. summary: A concise 1-sentence summary of the document.
      2. diagnosis: An array of strings representing diagnoses found.
      3. medications: An array of objects, each containing 'name', 'dosage', 'frequency', 'duration'.
      4. labs: An array of objects, each containing 'test', 'value', 'unit', 'range', 'flag' (High/Low/Normal).
      5. notes: Any additional doctor instructions or next steps.
      6. confidence: A number between 0 and 1 indicating extraction confidence.

      If a field is not present, return an empty array or null strings.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { inlineData: { mimeType, data: base64Data } },
        { text: prompt }
      ],
      config: { responseMimeType: 'application/json' }
    });

    let cleanText = response.text;
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/```json/g, '').replace(/```/g, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/```/g, '');
    }
    
    const extractedData = JSON.parse(cleanText.trim());
    return res.json({ success: true, data: extractedData });

  } catch (error) {
    console.error('Document Extraction Error:', error);
    res.status(500).json({ error: 'Failed to analyze document.' });
  }
});

app.listen(PORT, () => {
  console.log(`Wysh Backend running on http://localhost:${PORT}`);
});