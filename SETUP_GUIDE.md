# Stage Blocks MVP - Setup & Deployment Guide

## 📋 Quick Start

### 1. **Download & Install**
```bash
# Navigate to project folder
cd StageBlocks_Fresh

# Download all required libraries
npm install
```

### 2. **Add Your Credentials**
Create a `.env` file in the root folder (same level as `package.json`):

```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id_here
```

Get these values from:
- **Supabase URL & Key**: Supabase project settings → API
- **Google OAuth ID**: Google Cloud Console → OAuth 2.0 credentials

### 3. **Run Locally**
```bash
npm run dev
```
Visit `http://localhost:5173` in your browser.

### 4. **Deploy to Vercel**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```
Follow prompts to connect your GitHub repo and Vercel account.

---

## 🎯 Project Overview

**Stage Blocks MVP** is a React + Supabase web app for theater groups to coordinate rehearsals.

### **7 Pages Included:**

1. **LoginPage** — Google OAuth sign-in
2. **ProjectSelectorPage** — Create/select projects
3. **Dashboard** — Project overview with sidebar navigation
4. **ProjectSetupPage** — Setup project details with 4 tabs:
   - **Details Tab** — Overview, unlock logic for cast/characters/scenes
   - **Cast & Crew Tab** — Add/manage members (email, name)
   - **Characters Tab** — Add/manage characters, assign members, add ensemble
   - **Script Tab** — Add scenes with optional script text, drag-to-reorder
5. **StageDirectionsPage** — View stage directions (2 tabs, Stage 2 features)
   - **Blocks Tab** — Coming soon (Stage 2)
   - **Full Script Tab** — Coming soon (Stage 2)
6. **ProfileSettingsPage** — User settings
7. **RehearsalNotesPage** — Placeholder for Stage 2

---

## 🔧 Technology Stack

- **Frontend**: React + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Auth**: Google OAuth
- **Deploy**: Vercel
- **Font**: Cormorant Garamond
- **Dev Tool**: Vite

---

## 📁 Folder Structure

```
StageBlocks_Fresh/
├── src/
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── ProjectSelectorPage.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ProjectSetupPage.jsx (← 1390 lines, 4 working tabs)
│   │   ├── StageDirectionsPage.jsx (← 2 placeholder tabs)
│   │   ├── ProfileSettingsPage.jsx
│   │   └── RehearsalNotesPage.jsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── AppLayout.jsx
│   │   └── common/
│   │       ├── Button.jsx
│   │       ├── Card.jsx
│   │       ├── Chip.jsx
│   │       └── Toast.jsx
│   ├── hooks/
│   │   └── useProject.js
│   ├── lib/
│   │   └── supabase.js
│   ├── App.jsx
│   ├── main.jsx
│   ├── designTokens.js
│   └── index.css
├── tailwind.config.js
├── vite.config.js
├── package.json
├── postcss.config.js
├── index.html
└── README.md
```

---

## 🎨 Design & Colors

**Color Palette** (built into designTokens.js):
- Sidebar: `#A0696B` (pale burgundy)
- Background: `#F5F5F5` (light gray)
- Cards: `#FFFFFF` (white)
- Buttons: `#A68C2C` (gold)
- Text Primary: `#333333` (dark gray)
- Text Muted: `#888888` (medium gray)

**Font**: Cormorant Garamond (serif, elegant)

**Responsive Breakpoints**:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

---

## ✅ What's Working (Stage 1 MVP)

### ✅ **Fully Functional:**
- ✅ Google OAuth login
- ✅ Project creation & selection
- ✅ Dashboard with project info
- ✅ **ProjectSetupPage with 4 working tabs:**
  - ✅ Details Tab — Navigate between cast/characters/scenes
  - ✅ Cast & Crew Tab — Full CRUD for members
  - ✅ Characters Tab — Full CRUD for characters, assign members
  - ✅ Script Tab — Full CRUD for scenes, drag-to-reorder scripts
- ✅ Sidebar navigation on all pages
- ✅ Profile settings page
- ✅ Mobile-responsive design
- ✅ All Supabase queries working

### ⏳ **Coming in Stage 2:**
- Calendar integration
- Show Cues system
- Equipment tracking
- Rehearsal Notes (functional)
- Communications/notifications

---

## 🚀 Deployment Checklist

Before deploying to Vercel:

- [ ] `.env` file created with Supabase + Google OAuth credentials
- [ ] `npm install` ran without errors
- [ ] `npm run dev` starts locally without errors
- [ ] All 7 pages load and navigate correctly
- [ ] Login works with Google OAuth
- [ ] Can create a project
- [ ] Can add members, characters, scenes
- [ ] Drag-to-reorder scenes works
- [ ] Mobile view looks good on phone

---

## 🔗 Database Tables (Supabase)

Your Supabase project should have these tables:

- `projects` — Project info
- `project_members` — Cast & crew members
- `characters` — Named characters
- `character_assignments` — Character-to-member assignments
- `scenes` — Scene/script data
- `auth.users` — Google OAuth users (auto-created by Supabase)

---

## 📞 Troubleshooting

**"Module not found" error?**
```bash
rm -rf node_modules
npm install
```

**Supabase connection error?**
- Check `.env` file has correct URL and key
- Verify Supabase project is active

**Google OAuth not working?**
- Check Google Client ID in `.env`
- Verify `redirectTo` in OAuth config matches your deployed URL

**Sidebar not showing?**
- Check browser console for errors

---

## 📝 Notes for Marc

**What was built:**
- ProjectSetupPage: 1390 lines with full CRUD for members, characters, scenes
- All data persists to Supabase
- Mobile-first responsive design
- Theater color scheme (burgundy + gold)

**Architecture:**
- State management: React hooks (useState, useEffect)
- Database: Supabase (PostgreSQL)
- Auth: Google OAuth via Supabase
- UI: Styled inline (no CSS-in-JS library needed)

**Next Steps (Stage 2):**
1. Get theater group feedback from MVP
2. Build Rehearsal Notes functionality
3. Add Calendar + Show Cues
4. Consider Expo/React Native conversion if needed

---

**Questions?** Check the PROJECT_CONTEXT.md file for detailed info on this rebuild.
