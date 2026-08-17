# Stage Blocks - MVP (Stage 1)

Theater rehearsal coordination platform built with React, Tailwind CSS, and Supabase.

## Installation

1. **Extract the ZIP file**

2. **Install dependencies**
```bash
npm install
```

3. **Create .env file**
Copy `.env.example` to `.env` and add your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Start development server**
```bash
npm run dev
```

The app will open at `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── layout/         (Header, Sidebar, AppLayout)
│   └── common/         (Button, Card, Chip, Toast)
├── pages/              (All main pages)
├── hooks/              (Custom React hooks)
├── lib/                (Supabase client)
├── designTokens.js     (Colors, spacing, typography)
├── App.jsx             (Main app component)
└── main.jsx            (Entry point)
```

## MVP Pages

- **LoginPage** - Google OAuth login
- **ProjectSelectorPage** - Select/create projects
- **Dashboard** - Main app hub with project info
- **ProjectSetupPage** - One page with 4 tabs (Details, Cast, Characters, Script)
- **StageDirectionsPage** - One page with 2 tabs (Blocks, Full Script)
- **ProfileSettingsPage** - User profile settings
- **RehearsalNotesPage** - Placeholder for Stage 2

## Navigation

- **Sidebar** - Always visible on desktop, hamburger menu on mobile/tablet
- **Mobile-first responsive** - Works on phones, tablets, and desktops
- **Tailwind CSS** - All styling with Tailwind utilities

## Build for Production

```bash
npm run build
```

Output files will be in the `dist/` folder ready for deployment to Vercel.

## Technology Stack

- **Frontend**: React 18 + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Build Tool**: Vite
- **Font**: Cormorant Garamond

## Design System

All colors, spacing, typography, and design tokens are defined in `src/designTokens.js` for consistency across the app.

Colors:
- Sidebar: #A0696B (pale burgundy)
- Background: #F5F5F5 (light gray)
- Cards: #FFFFFF (white)
- Buttons: #A68C2C (gold)
- Text: #333333 (primary), #888888 (muted)
