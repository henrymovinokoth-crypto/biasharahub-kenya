# BiasharaHub Kenya 🇰🇪
> Modern Marketplace & Advertising Platform with Safaricom M-Pesa Integration.
> **Owner & Payment Recipient:** Henry Okoth (**0181288331**)

---

## 🌟 What This Platform Does

1. **Goods & Products Marketplace**: People can buy and sell electronics, vehicles, fashion, hardware, household items, etc.
2. **Business & Work Directory**: Local service providers (plumbers, electricians, salons, IT services, consultants) can showcase their businesses.
3. **Institution & Education Ads**: Colleges, schools, universities, hospitals, and training institutions can advertise intakes and courses.
4. **Job Vacancies & Gigs**: Employers and companies can post vacancies, requirements, salary ranges, and application links.
5. **M-Pesa Payment Gate**: Users must pay before their advertisement is published live.
   - Shows payment recipient: **Henry Okoth**
   - Recipient M-Pesa Number: **`0181288331`**
   - Direct verification code input (`mpesa_code`) to prevent fraud.
6. **Administrator Control Panel**: Henry Okoth can:
   - View all incoming advertisements & pending payments
   - Cross-check Safaricom M-Pesa codes
   - One-click **Approve & Publish**, **Feature**, or **Reject** listings
   - Track total revenue earned in KSh
   - Customize listing fee prices directly from the dashboard

---

## 📁 Project Architecture & Files

```
website/
├── package.json           # Project configurations & dependencies
├── server.js              # Express web server & REST API
├── database.js            # Database manager & pre-seeded demo listings
├── schema.sql             # SQL database schema (SQLite / PostgreSQL / MySQL)
├── render.yaml            # 1-click cloud configuration for Render
├── .env.example           # Sample environment variables
├── data/                  # Persistent data storage (JSON/SQLite)
│   ├── listings.json      # Stored listings
│   └── settings.json      # M-Pesa & rate configurations
└── public/                # Frontend website files
    ├── index.html         # Homepage: Search, filters, products, services & jobs
    ├── post.html          # Submit Ad form with M-Pesa payment guide
    ├── listing.html       # Individual listing detail view with WhatsApp & Call
    ├── admin.html         # Admin dashboard for Henry Okoth
    ├── deploy-guide.html  # Interactive step-by-step free deployment guide
    ├── css/
    │   └── style.css      # Modern responsive styling & M-Pesa theme
    └── js/
        ├── app.js         # Marketplace filtering & search
        ├── post.js        # Multi-category fee calculation & submission
        ├── listing.js     # Single listing renderer & WhatsApp click-to-chat
        └── admin.js       # Admin authentication & payment approvals
```

---

## 🚀 How to Run Locally

1. Open PowerShell or Command Prompt in the project folder:
   ```powershell
   cd "c:\Users\henry movin\Desktop\website"
   ```
2. Start the server:
   ```powershell
   npm start
   ```
3. Open your web browser:
   - **Marketplace**: [http://localhost:3000](http://localhost:3000)
   - **Post an Ad**: [http://localhost:3000/post.html](http://localhost:3000/post.html)
   - **Admin Portal**: [http://localhost:3000/admin.html](http://localhost:3000/admin.html)
     - *Admin Password:* `0987@henry`

---

## ☁️ How to Deploy for 100% Free (Step-by-Step)

### Option 1: Render.com (Recommended - 100% Free Web Service)
1. **Push your code to GitHub**:
   - Go to [github.com](https://github.com), sign up for free, and click **New Repository**.
   - Name it `biasharahub-kenya`.
   - Upload the files in this folder (either via GitHub browser upload or `git push`).
2. **Create free service on Render**:
   - Go to [render.com](https://render.com) and click **Get Started for Free** (sign in with GitHub).
   - Click **New +** > **Web Service**.
   - Select your repository `biasharahub-kenya`.
   - Fill in:
     - **Name**: `biasharahub-kenya`
     - **Runtime**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: Select **Free**
   - Click **Deploy Web Service**!
3. **Your Live Website**:
   - In less than 2 minutes, Render will give you a public URL like:
     `https://biasharahub-kenya.onrender.com`
   - It comes with free SSL (`https://`), works on all phones and computers globally!

---

## 💰 M-Pesa Payment Flow Summary

1. User goes to **Post Advertisement** (`/post.html`).
2. User selects category:
   - **Products / Goods:** KSh 100
   - **Business / Work Profile:** KSh 200
   - **Job Vacancy:** KSh 300
   - **Institution / College Ad:** KSh 500
3. The website presents clear instructions:
   - Open M-Pesa -> Send Money
   - Enter **0181288331**
   - Confirm Recipient Name is **Henry Okoth**
   - Enter M-Pesa PIN
4. User pastes their Safaricom Confirmation Code (e.g. `SLG8912301`) and phone number.
5. In the **Admin Portal** (`/admin.html`), Henry Okoth checks his phone SMS, matches the code, and clicks **"Approve & Publish"**!
