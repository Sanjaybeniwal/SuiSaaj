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
   - `SMTP_MOCK=false`: Set to `true` only if you want to test form submissions offline without sending real emails.

   Configurable frontend variables (`VITE_*` — public, never put secrets here):
   - `VITE_BOUTIQUE_NAME`, `VITE_PHONE_DISPLAY`, `VITE_PHONE_RAW`, `VITE_WHATSAPP_NUMBER`
   - `VITE_INSTAGRAM_URL`, `VITE_BOUTIQUE_ADDRESS`, `VITE_GOOGLE_MAPS_EMBED_URL`, `VITE_GOOGLE_MAPS_LINK`

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

## Replacing Gallery & Studio Images
All images live in `public/images/` and are referenced in `src/data/boutiqueData.js`.
To update any photo, simply replace the corresponding `.jpg` file in `public/images/` (or update the path in `src/data/boutiqueData.js`).
