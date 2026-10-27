# Charlemagne Jerusalem — Digital Calling Card & Personal Portfolio

An interactive, responsive digital business card and personal portfolio built for modern mobile and desktop browsers.

Built for the homework assignment requiring:
- **QR Code Scanning**: Live scannable QR code with dual modes (Web Portfolio Link and Direct vCard).
- **Personal Portfolio**: Detailed showcase of cybersecurity experience, national and global CTF rankings, certifications, projects, technical skills, and educational background.
- **Save to Contact Info**: Instant 1-click "Save to Contacts" feature that exports a complete `.vcf` (vCard 3.0 / RFC 6350) file with cell number `(+63) 969-168-3923`, email `jerusalemcharlemagne@gmail.com`, profile photo, and social links.

---

## 🌟 Key Features

### 1. Interactive 3D Calling Card
- Physical card-like 3D flip effect (`preserve-3d`) with front and back faces.
- **Front Face**: Displays verified 2x2 ID photo, name, cybersecurity specialization, PHINMA Saint Jude College affiliation, cell phone, email, and quick action pills.
- **Back Face**: Displays the high-contrast live QR code, mode selector, and scan guidance.

### 2. Smart Dual-Mode QR Code
- **Web Portfolio Mode**: Scans to open the live web portfolio in any smartphone camera/browser.
- **Direct vCard Mode (Offline)**: Scans straight into the phone's native address book (iOS Contacts / Google Contacts) without requiring an internet connection.
- **Export QR Badge**: 1-click button to download the QR code formatted with name and contact header as a PNG image for printing on paper cards or resume headers.
- **Custom URL Support**: Easily customize or update the QR code target URL to point to your live GitHub Pages or Vercel link.

### 3. Contact Integration (vCard .vcf)
- Formats standard vCard 3.0 data containing:
  - Full Name: `Charlemagne Jerusalem`
  - Cell Phone: `(+63) 969-168-3923`
  - Email: `jerusalemcharlemagne@gmail.com`
  - Location: `Manila, Philippines`
  - Organization: `PHINMA Saint Jude College Manila` / `CyberwireZ`
  - Profile Photo: Embedded Base64 PNG image so contacts show your photo automatically.
  - Social Links: LinkedIn, TryHackMe, and Hack The Box profiles.

### 4. Comprehensive Personal Portfolio
- **Profile Overview**: Summary of ethical hacking, web pentesting, OSINT, and network defense focus.
- **Global & National CTF Rankings**:
  - 3rd ASEAN Cyber Shield (ACS) 2025 (Busan, South Korea) — Top 15 Student Team representing the Philippines
  - Hack4Gov NCR 2025 — Top 8 Individual Scorer, Top 12/20 Universities
  - Hack The Box University CTF 2025: Tinsel Trouble — Top 2 in Philippines, #115 globally (out of 1,014 teams)
  - Hack The Box Cyber Apocalypse 2026: The Salt Crown — Top 26 globally with Team CyberwireZ
  - TryHackMe Top 1% worldwide ranking
  - Hack The Box Professional rank
- **Industry Certifications**:
  - Certified Red Team Analyst (CRTA)
  - APISec Certified Practitioner
  - HTB Certified Web Exploitation Specialist (CWES) Path
  - HTB Junior Cybersecurity Analyst (CJCA) Path
- **Technical Skills Matrix**: Offensive security tools (Burp Suite, OWASP ZAP), operating systems (Kali Linux, Parrot, WSL2), scripting (Python, Bash, PowerShell), and AI security.
- **Projects & Leadership**: Custom CTF lab architecture, AI in cybersecurity, CyberwireZ staff & tech support, and HTB mentorship.
- **Downloadable CV**: Direct download button serving the official `Jerusalem_Charlemagne_CV.pdf`.

### 5. Design & User Experience
- **Clean Minimalist Light aesthetic**: High-contrast, clean typography, refined borders, and professional layout.
- **Dark Mode Toggle**: Optional sleek dark theme with persistent user preference stored in `localStorage`.
- **Mobile Action Dock**: Bottom quick bar on mobile devices for 1-tap calling, emailing, saving contact, and viewing QR.

---

## 🚀 How to Run Locally

Because this project is built with standard web technologies (HTML5, modern CSS3, and Vanilla JavaScript), it has **zero runtime dependencies** and runs instantly.

### Option A: Using Python (Recommended)
Open your terminal in this directory and start a local HTTP server:

```bash
python3 -m http.server 8080
```

Then open your browser and navigate to:
```
http://localhost:8080
```

### Option B: Using Node.js / `npx`
```bash
npx serve .
```

### Option C: Direct File Opening
You can also double-click `index.html` to open it directly in Google Chrome, Microsoft Edge, Firefox, or Safari.

---

## 🌐 How to Deploy for Homework Submission (Free & Fast)

To submit a live URL to your teacher:

### Deploy with GitHub Pages (Free)
1. Initialize git and push this folder to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of digital calling card portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/digital-calling-card.git
   git push -u origin main
   ```
2. Go to your GitHub repository **Settings** &rarr; **Pages**.
3. Under **Build and deployment**, select **Source: Deploy from a branch** and choose `main` / `root`. Click **Save**.
4. Your website will be live at `https://<your-username>.github.io/digital-calling-card/`.
5. Open your live site, click **Change Link** under the calling card, enter your live GitHub Pages URL, and download your updated QR code!

---

## 📁 File Structure

```
digital-calling-card/
├── index.html                      # Semantic HTML5 layout
├── styles.css                      # Clean Minimalist Light styling + Dark theme
├── app.js                          # 3D card flip, vCard export, dual-mode QR engine
├── qrcode.min.js                   # Standalone, offline-ready QR code library
├── README.md                       # Homework documentation
└── assets/
    ├── avatar.png                  # Formal 2x2 ID portrait
    ├── favicon.svg                 # Custom monogram icon
    └── Jerusalem_Charlemagne_CV.pdf # Official CV for direct download
```

---

&copy; 2026 Charlemagne Jerusalem. All rights reserved.
