// server/index.js - Node + Express + sqlite3 + nodemailer
require('dotenv').config();
const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static frontend in / (public folder)
app.use(express.static(path.join(__dirname, '..', 'public')));

// Database (file registrations.db at repo root)
const dbFile = path.join(__dirname, '..', 'registrations.db');
const db = new sqlite3.Database(dbFile);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      modules TEXT,
      message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Nodemailer transport
function makeTransport(){
  const host = process.env.SMTP_HOST;
  if(!host) return null;
  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT||587),
    secure: (process.env.SMTP_SECURE === 'true'),
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
  });
}

app.post('/api/register', (req, res) => {
  const {name, email, phone, modules, message} = req.body || {};
  if(!name || !email) return res.status(400).json({success:false, error:'Nom et email requis.'});

  const modulesText = Array.isArray(modules) ? modules.join(', ') : (modules || '');
  const stmt = db.prepare(`INSERT INTO registrations (name,email,phone,modules,message) VALUES (?,?,?,?,?)`);
  stmt.run(name, email, phone || '', modulesText, message || '', function(err){
    if(err){
      console.error(err);
      return res.status(500).json({success:false, error:'Erreur base de données.'});
    }

    // send notification email to admin if configured
    const transporter = makeTransport();
    const admin = process.env.ADMIN_EMAIL;
    if(transporter && admin){
      const mail = {
        from: process.env.SMTP_FROM || (process.env.SMTP_USER || 'no-reply@example.com'),
        to: admin,
        subject: `Nouvelle inscription - ${name}`,
        text: `Nouvelle inscription:\n\nNom: ${name}\nEmail: ${email}\nTéléphone: ${phone || '-'}\nModules: ${modulesText || '-'}\nMessage:\n${message || '-'}\n\nConsultez la base de données pour plus de détails.`,
      };
      transporter.sendMail(mail, (err, info) => {
        if(err) console.error('Mail error:', err);
      });
    }

    return res.json({success:true, id: this.lastID});
  });
  stmt.finalize();
});

// Fallback to index.html for SPA-like behavior
app.get('*', (req,res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
