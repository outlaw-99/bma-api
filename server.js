const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

/* ── FIREBASE ADMIN ── */
admin.initializeApp({
  credential: admin.credential.cert({
    projectId     : process.env.FIREBASE_PROJECT_ID,
    clientEmail   : process.env.FIREBASE_CLIENT_EMAIL,
    privateKey    : process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  })
});

/* ── BREVO SMTP ── */
const transporter = nodemailer.createTransport({
  host   : 'smtp-relay.brevo.com',
  port   : 587,
  secure : false,
  auth   : {
    user : process.env.BREVO_USER,
    pass : process.env.BREVO_PASS
  }
});

/* ── RESET PASSWORD ENDPOINT ── */
app.post('/send-reset-email', async (req, res) => {
  const { email } = req.body;
  if(!email) return res.status(400).json({ error: 'Email required' });

  try {
    /* Generate real Firebase reset link */
    const resetLink = await admin.auth().generatePasswordResetLink(email, {
      url: 'https://2onion.netlify.app'
    });

    /* Send BMA styled email via Brevo SMTP */
    await transporter.sendMail({
      from    : '"BLACK MARKET" <' + process.env.BREVO_USER + '>',
      to      : email,
      subject : 'Reset your BLACK MARKET password',
      html    : `
<div style="font-family:'Courier New',monospace;max-width:480px;margin:0 auto;background:#0a0a0a;background-image:radial-gradient(ellipse at top,#0d1a0d 0%,#000000 70%);border:1px solid #00ff41;box-shadow:0 0 40px rgba(0,255,65,0.15)">
  <div style="padding:24px;text-align:center;border-bottom:1px solid #00ff41;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,65,0.03) 2px,rgba(0,255,65,0.03) 4px)">
    <div style="font-size:2rem;margin-bottom:8px">🧅</div>
    <p style="margin:0;font-size:0.6rem;color:#00ff41;letter-spacing:6px;opacity:0.6">TOR NETWORK · ENCRYPTED</p>
    <h1 style="margin:8px 0 4px;font-size:1.4rem;color:#00ff41;letter-spacing:4px;text-shadow:0 0 15px #00ff41">BLACK MARKET</h1>
    <p style="margin:0;font-size:0.6rem;color:#00ff41;letter-spacing:8px;opacity:0.5">ASSOCIATION</p>
    <div style="margin-top:10px;font-size:0.55rem;color:#00ff41;opacity:0.4">bmaxyz3k7r2onion.onion</div>
  </div>
  <div style="padding:6px 16px;background:#000;border-bottom:1px solid #003300">
    <p style="margin:0;font-size:0.6rem;color:#00ff41;opacity:0.5">&gt; CONN: ESTABLISHED · END-TO-END ENCRYPTED · 3 HOPS</p>
  </div>
  <div style="padding:28px 24px">
    <p style="color:#00ff41;font-size:0.65rem;letter-spacing:3px;margin:0 0 6px;opacity:0.7">// SECURE MESSAGE RECEIVED</p>
    <p style="color:#00ff41;font-size:0.65rem;letter-spacing:3px;margin:0 0 24px;opacity:0.5">// AGENT: ${email}</p>
    <div style="border:1px solid #003300;padding:16px;background:#050f05;margin-bottom:24px">
      <p style="margin:0;color:#00cc33;font-size:0.8rem;line-height:2">
        &gt; AGENT IDENTIFIED<br>
        &gt; PASSWORD RESET TRIGGERED<br>
        &gt; <span style="color:#ff4444">WARNING: IF NOT YOU — ABORT</span>
      </p>
    </div>
    <!-- JOKER FACE -->
    <div style="text-align:center;margin:20px 0 28px">
      <div style="display:inline-block;position:relative">
        <div style="width:120px;height:120px;border-radius:50%;background:linear-gradient(135deg,#0a0000,#1a0000);border:2px solid #cc0000;position:relative;overflow:hidden;box-shadow:0 0 25px rgba(200,0,0,0.4);margin:0 auto">
          <div style="position:absolute;top:0;left:0;right:0;height:60%;background:rgba(255,255,255,0.05)"></div>
          <div style="position:absolute;top:7px;left:0;right:0;text-align:center;font-size:0.38rem;color:#cc0000;letter-spacing:2px;opacity:0.5">HA HA HA</div>
          <div style="position:absolute;top:34px;left:20px;width:24px;height:26px;background:#000;border-radius:50% 50% 45% 45%;border:1.5px solid #cc0000;overflow:hidden">
            <div style="position:absolute;bottom:3px;left:50%;transform:translateX(-50%);width:10px;height:12px;background:#1a0000;border-radius:50%"></div>
            <div style="position:absolute;top:4px;left:6px;width:5px;height:5px;background:#cc0000;border-radius:50%"></div>
          </div>
          <div style="position:absolute;top:34px;right:20px;width:24px;height:26px;background:#000;border-radius:50% 50% 45% 45%;border:1.5px solid #cc0000;overflow:hidden">
            <div style="position:absolute;bottom:3px;left:50%;transform:translateX(-50%);width:10px;height:12px;background:#1a0000;border-radius:50%"></div>
            <div style="position:absolute;top:4px;right:6px;width:5px;height:5px;background:#cc0000;border-radius:50%"></div>
          </div>
          <div style="position:absolute;top:62px;left:50%;transform:translateX(-50%);width:9px;height:7px;background:#4a0000;border-radius:50%"></div>
          <div style="position:absolute;top:55px;left:8px;width:18px;height:2px;background:#cc0000;transform:rotate(35deg);border-radius:2px"></div>
          <div style="position:absolute;top:55px;right:8px;width:18px;height:2px;background:#cc0000;transform:rotate(-35deg);border-radius:2px"></div>
          <div style="position:absolute;bottom:18px;left:50%;transform:translateX(-50%);width:76px;height:22px;border-bottom:3px solid #cc0000;border-radius:0 0 55px 55px"></div>
          <div style="position:absolute;bottom:20px;left:50%;transform:translateX(-50%);display:flex;gap:1px">
            <div style="width:7px;height:9px;background:rgba(255,255,255,0.75);border-radius:0 0 3px 3px"></div>
            <div style="width:7px;height:11px;background:rgba(255,255,255,0.85);border-radius:0 0 3px 3px"></div>
            <div style="width:7px;height:9px;background:rgba(255,255,255,0.75);border-radius:0 0 3px 3px"></div>
            <div style="width:7px;height:7px;background:rgba(255,255,255,0.6);border-radius:0 0 3px 3px"></div>
            <div style="width:7px;height:9px;background:rgba(255,255,255,0.75);border-radius:0 0 3px 3px"></div>
          </div>
          <div style="position:absolute;bottom:8px;left:20px;width:3px;height:10px;background:#cc0000;border-radius:0 0 3px 3px;opacity:0.8"></div>
          <div style="position:absolute;bottom:5px;right:24px;width:3px;height:13px;background:#cc0000;border-radius:0 0 3px 3px;opacity:0.7"></div>
        </div>
      </div>
      <div style="margin-top:10px;color:#cc0000;font-size:0.6rem;letter-spacing:4px;opacity:0.7">🃏 WHY SO SERIOUS?</div>
    </div>
    <p style="margin:0 0 24px;color:#559955;line-height:1.9;font-size:0.85rem;text-align:center">A reset request was intercepted for your BLACK MARKET account. Click below to regain access. This link self-destructs in <span style="color:#00ff41">60 minutes</span>.</p>
    <div style="text-align:center;margin:28px 0">
      <a href="${resetLink}" style="background:transparent;color:#00ff41;text-decoration:none;padding:14px 36px;font-family:'Courier New',monospace;font-weight:900;font-size:0.9rem;display:inline-block;letter-spacing:4px;border:1px solid #00ff41;box-shadow:0 0 18px rgba(0,255,65,0.3),inset 0 0 18px rgba(0,255,65,0.05)">[ RESET ACCESS ]</a>
    </div>
    <div style="border:1px solid #002200;padding:12px;background:#020a02;margin-top:8px">
      <p style="margin:0;color:#336633;font-size:0.65rem;line-height:2;opacity:0.8">
        &gt; DO NOT SHARE THIS LINK<br>
        &gt; DO NOT FORWARD THIS EMAIL<br>
        &gt; THIS MESSAGE WILL NOT BE LOGGED
      </p>
    </div>
  </div>
  <div style="background:#000;padding:14px 16px;border-top:1px solid #003300;text-align:center">
    <p style="margin:0 0 4px;color:#00ff41;font-size:0.6rem;letter-spacing:3px;opacity:0.4">© BLACK MARKET ASSOCIATION</p>
    <p style="margin:0;color:#336633;font-size:0.55rem;opacity:0.3;word-break:break-all">SHA256: e3b0c44298fc1c149afb4c8996fb92427ae41e4649b934ca495991b7852b855</p>
  </div>
  <div style="background:#0a0a0a;padding:14px 20px;border-top:1px dashed #1a1a1a;text-align:center">
    <p style="margin:0;color:#444;font-size:0.65rem;line-height:1.8;font-family:Arial,sans-serif">⚠️ This email is from a gaming community platform.<br>BLACK MARKET ASSOCIATION is a fictional roleplay game — not a real dark web service.<br>If you did not request this, simply ignore it.</p>
  </div>
</div>`
    });

    res.json({ ok: true });

  } catch(err) {
    console.error('Reset error:', err.message);
    res.status(400).json({ error: err.message });
  }
});

app.get('/', (req, res) => res.json({ status: 'BMA API running' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('BMA API running on port', PORT));
