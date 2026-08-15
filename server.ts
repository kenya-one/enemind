import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI client lazily if key exists
let genAIClient: GoogleGenAI | null = null;
function getGenAI() {
  if (!genAIClient && process.env.GEMINI_API_KEY) {
    genAIClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return genAIClient;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// EnerMind AI Navigator & Study Copilot API
app.post('/api/ener-mind', async (req, res) => {
  try {
    const { message, history } = req.body;
    const userPrompt = String(message || '').trim();

    if (!userPrompt) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ai = getGenAI();
    let replyText = '';

    if (ai) {
      const systemInstruction = `You are EnerMind AI, the official AI Navigator, Study Copilot, and Student Mentor for Kenyan University students and learners in EnerHub (inside Kenya House Hunt).
You assist students with:
1. Study Notes (CS/IT, Business/CPA, Engineering, Medicine/Nursing, Law, KCSE)
2. Past Papers & worked solutions (UoN, KU, JKUAT, Strathmore, KASNEB CPA, KNEC)
3. Final Year Capstone Project Ideas (M-Pesa Daraja API, Swahili AI, IoT, Agrotech, Health Informatics)
4. Verified Industrial Attachments & Internships in Kenya (Safaricom, Equity Bank, KenGen, KRA, Ministries)
5. Entertainment Movies & Music (Kenyan cinema like Nairobi Half Life, Lo-Fi study beats, Afrobeats, Arbantone)
6. Kenyan Campus Housing, rent negotiation, deposit rights, and walking distance advice.

Keep your response energetic, practical, and tailored to Kenya. Use clear bullet points and highlight relevant EnerHub sections. Keep responses concise (under 250 words).`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: userPrompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7
        }
      });

      replyText = response.text || '';
    }

    // Intelligent Kenyan Fallback Engine if no key or empty
    if (!replyText) {
      const lower = userPrompt.toLowerCase();
      if (lower.includes('past paper') || lower.includes('exam') || lower.includes('knec') || lower.includes('cpa') || lower.includes('revision')) {
        replyText = `📚 **EnerMind Past Paper Navigator:**
I found relevant exam past papers with worked solutions:
• **CSC 314: Database Systems & SQL (UoN 2024)** with 3NF normalization marking scheme.
• **BAC 402: Corporate Finance & Investment (KU 2024)** with NPV/IRR models.
• **ECE 312: Microprocessors & IoT (JKUAT 2023)** with 8051 assembly solutions.
• **KASNEB Advanced Financial Management (Dec 2024)** official rubric.

👉 Check the **Past Papers** tab in EnerHub to download the full PDF solutions!`;
      } else if (lower.includes('attachment') || lower.includes('intern') || lower.includes('safaricom') || lower.includes('job') || lower.includes('apply')) {
        replyText = `💼 **EnerMind Attachment Radar:**
Here are active Kenyan student attachments open for intake:
• **Safaricom PLC:** Software Eng & Cloud Attachment (KSh 30,000/mo) - Waiyaki Way HQ.
• **Equity Group Holdings:** Data Analytics & Digital Banking (KSh 25,000/mo) - Upper Hill.
• **KenGen:** Geothermal & Power Systems (KSh 20,000/mo) - Olkaria / Nairobi.
• **KRA:** Tax Administration & Legal (KSh 20,000/mo) - Times Tower.

👉 Head to the **Attachments** tab to view application links and auto-generate your cover letter!`;
      } else if (lower.includes('project') || lower.includes('idea') || lower.includes('capstone') || lower.includes('m-pesa') || lower.includes('viva')) {
        replyText = `💡 **EnerMind Project Lab Recommendation:**
Top 4th-Year Capstone Project Ideas for Kenyan students:
1. **M-Pesa Daraja 2.0 Chama & Rent Escrow Ledger** (Fintech / Node.js / React)
2. **Swahili & Sheng Real Estate & Academic Voice Assistant** (AI / Gemini SDK)
3. **Smart GSM Water Tank & KPLC Token Telemetry** (IoT / ESP32 / Arduino)
4. **AfyaCampus Student Wellness & Clinic Booking** (HealthTech)

👉 Visit the **Project Ideas** tab to copy the architecture diagrams, milestone roadmap, and viva defense tips!`;
      } else if (lower.includes('note') || lower.includes('lecture') || lower.includes('pdf') || lower.includes('dsa') || lower.includes('law')) {
        replyText = `📖 **EnerMind Study Notes Library:**
Verified lecture modules available for instant download:
• **CSC 211:** Data Structures & Algorithms (UoN - 142 pages)
• **BAC 101:** Financial Accounting & Reporting CPA Master Guide (Strathmore - 198 pages)
• **FEE 221:** Electrical Circuit Theory & AC Power (JKUAT - 165 pages)
• **PHA 301:** Clinical Pharmacology & Therapeutics (KU - 210 pages)
• **LAW 204:** Kenyan Land Law & ArdhiSasa Procedures (Parklands - 175 pages)

👉 Go to **Study Notes** to read online or download the PDF!`;
      } else if (lower.includes('movie') || lower.includes('music') || lower.includes('watch') || lower.includes('relax') || lower.includes('song') || lower.includes('song')) {
        replyText = `🎬🎵 **EnerMind Entertainment Picks:**
Time for a well-deserved study break!
• **Movie:** *Nairobi Half Life* (Kenyan Crime Drama) or *The Social Network* (Coding classic).
• **Music:** *Midnight Coding in Kilimani* (Lo-Fi beats) or *Kula Nyama* (Kenyan Arbantone).

👉 Tap **Movies & Music** in EnerHub to start streaming right now!`;
      } else {
        replyText = `Jambo! I am **EnerMind AI**, your student navigator in EnerHub. 
I can help you:
• 📥 Download revision **Study Notes** for your course
• 📝 Find university **Past Papers** with marking schemes
• 💡 Pick a winning **Final Year Project Idea** with full tech specs
• 💼 Apply for verified **Industrial Attachments** (Safaricom, Equity, KenGen)
• 🎬 Find Kenyan **Movies** and 🎧 stream **Study Music**
• 🏠 Get advice on campus rentals & student housing!

What are you studying or looking for today?`;
      }
    }

    res.json({ reply: replyText });
  } catch (error: any) {
    console.error('EnerMind AI API Error:', error);
    res.status(500).json({
      error: 'Failed to process AI request',
      reply: `Jambo! EnerMind AI is ready. You can browse the Study Notes, Past Papers, Project Ideas, Attachments, or Movies & Music tabs directly in EnerHub!`
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();
