# SuiSaaj — Ladies Boutique & Bespoke Tailoring

A modern, responsive single-page website for a Ladies Boutique & Custom Tailoring studio, built with **React**, **Vite**, **Node.js**, **Express**, and **Nodemailer**.

## Features
- **Modern Indian Boutique Design**: Blush pink, warm beige, ivory white, and brushed rose-gold palette with editorial serif + sans typography.
- **Complete Sections**:
  - Sticky responsive Header with navigation and *Book an Appointment* CTA
  - Full-width Hero banner (*"Stitching Dreams, Styling You"*)
  - *About Us* studio story
  - *Our Services* (8 bespoke tailoring & boutique service cards with direct enquiry pre-selection)
  - *Gallery* (filterable, hover-animated showcase with lightbox preview and easily replaceable local images)
  - *Why Choose Us* (6 core boutique promises)
  - *Contact & Enquiry Form* with validation, loading state, duplicate-submission prevention, and confirmation/error feedback
  - Click-to-call, WhatsApp quick enquiry, Instagram link, configurable Google Maps embed, and sticky mobile contact bar
- **Secure Email Delivery**:
  - Enquiries are posted to `POST /api/enquiry` and delivered directly to `OWNER_EMAIL` via Nodemailer SMTP.
  - All SMTP credentials stay strictly in server-side environment variables (`.env`), never in frontend code.

## Setup Instructions

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   Copy `.env.example` to `.env` and fill in your SMTP and boutique contact details:
   ```bash
   cp .env.example .env
   ```
   Key server-only variables in `.env`:
   - `OWNER_EMAIL`: The boutique owner's inbox that receives all enquiries.
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`: Your email provider's SMTP settings (for Gmail, create a Google App Password and use `smtp.gmail.com`, port `465`, `SMTP_SECURE=true`).
   - `ALLOWED_ORIGIN`: Allowed frontend origin(s) for CORS (defaults to `https://sanjaybeniwal.github.io,http://localhost:5173`).
   - `SMTP_MOCK=false`: Set to `true` only if you want to test form submissions offline without sending real emails.

3. **Run in development**
   Starts both the Express API (`localhost:5000`) and Vite frontend (`localhost:5173`):
   ```bash
   npm run dev
   ```

4. **Build and run in production**
   ```bash
   npm run build
   npm start
   ```
   The Express server serves the built frontend and `/api/enquiry` together on `PORT` (default `5000`).

5. **Run backend tests**
   ```bash
   npm test
   ```

## Live Hosting on GitHub Pages + Automated Push

This repo includes [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) for automatic live deployment to **GitHub Pages** whenever code is pushed to `main`.

### 1. Enable GitHub Pages (one-time setup)
1. Push your code to GitHub (`git push -u origin main`).
2. Open your repository on GitHub: **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. Your site will automatically deploy to:
   `https://sanjaybeniwal.github.io/SuiSaaj/`

### 2. Enable Live Email Form on GitHub Pages
GitHub Pages hosts static files only (it cannot run the Node.js + Nodemailer server). To make the enquiry form send real emails from your live GitHub Pages site:
1. Deploy the Express + Nodemailer backend (`npm start`) to a Node host such as Render, Railway, or Fly.io with your `.env` SMTP variables and `ALLOWED_ORIGIN=https://sanjaybeniwal.github.io`.
2. In your GitHub repo, go to **Settings → Secrets and variables → Actions → Variables** and add:
   - `VITE_ENQUIRY_API_URL` = `https://your-backend-domain.com/api/enquiry`
3. Re-run the GitHub Actions workflow (or push a new commit) so the live frontend sends enquiries to your Node backend.

### 3. Automated Test, Build & Push Command
Whenever you make updates locally, run one command to test, build, commit, and push to `main` (which automatically updates the live GitHub Pages site):
```bash
npm run push:live -- "Describe your update"
```

## Replacing Gallery & Studio Images
All images live in `public/images/` and are referenced in `src/data/boutiqueData.js`.
To update any photo, simply replace the corresponding `.jpg` file in `public/images/` (or update the path in `src/data/boutiqueData.js`).
