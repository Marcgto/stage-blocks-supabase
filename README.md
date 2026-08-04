## User Flows

### Project Manager Flow

1. Google Login → LoginPage
2. Project Selector → ProjectSelectorPage (grid of projects)
3. Main Menu → MainMenuPage (hub with menu buttons)
   - Project Details (active, clickable)
   - Blocks (disabled, planned feature)
   - Full Script (disabled, planned feature)
4. Project Details → ProjectDetailsPage (setup hub with 3 sections)
   - Characters (add, edit, delete)
   - Members (add, invite, assign characters)
   - Scenes (add, edit, delete scenes with blocks)

### Actor Flow (Planned)

1. Click share link with token
2. Access MainMenuPage (actor view)
3. Choose between Blocks and Full Script

## Technology Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Supabase (PostgreSQL, Authentication)
- Authentication: Google OAuth
- Hosting: Vercel
- Styling: Theatrical color scheme (Burgundy #5A2020, Gold #A68C2C)

## Database Schema

### Tables

- `projects` - Project metadata
- `characters` - Character names per project
- `project_members` - Invited actors and crew with login tracking
- `scenes` - Scenes with script text and ordering
- `blocks` - Blocks within scenes with stage directions
- `scene_character_assignments` - Links characters to scenes
- `block_character_directions` - Stage directions per character per block

All tables include Row Level Security (RLS) policies scoped to project owner (user_id).

## Color Scheme

- Background: Dark Burgundy #4A1A1A
- Primary: Burgundy #5A2020
- Hover State: Darker Burgundy #6B2C2C
- Accent: Gold #A68C2C
- Text: Gold #A68C2C on burgundy backgrounds

All buttons use theatrical block aesthetic: 160px by 160px squares with 2px gold borders, 4px rounded corners.

## Features

### Current Implementation (MVP)

- Google OAuth login
- Project creation and selection
- Main Menu (central hub for all features)
- Project Details setup (Characters, Members, Scenes sections)
- Dark theatrical UI with block-based design
- Row Level Security on all database tables
- Project isolation per user
- Live deployment on Vercel

### In Development

- Character setup and management

### Planned Features

- Blocks view for actors
- Full Script view for actors
- Actor invite system with email
- Token-based share links for actors
- Personal notes for actors
- Real-time collaboration
- Share links with token-based access
- Email notifications
- Performance optimizations

## Getting Started

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Navigate to http://localhost:5173
4. Login with Google
5. Create or select a project
6. Enter Main Menu
7. Click "Project Details" to set up your project

## Deployment

The app is live at: https://stage-blocks-supabase.vercel.app

### To Deploy Locally

1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Add environment variables in Vercel:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_KEY
4. Vercel automatically builds and deploys

## Supabase Setup

The following database schema has been implemented:

1. Characters table - stores character names per project
2. Project Members table - stores invited members with email and login tracking
3. Scene Character Assignments table - links characters to scenes
4. Block Character Directions table - stores stage directions per character per block
5. Extended Scenes table - added sequence and script_text columns
6. Extended Blocks table - added scene_id, sequence, and script_text columns

All tables include appropriate indexes and RLS policies for data isolation.

## Navigation Structure

- ProjectSelectorPage → MainMenuPage (select a project)
- MainMenuPage (hub) → ProjectDetailsPage (click Project Details button)
- ProjectDetailsPage → CharacterSetupPage (click Characters button)
- ProjectDetailsPage → Scene Editor (click Scenes button - future)
- Scene Editor → Block Editor (click a block - future)
- All pages include back buttons to return to previous screen

## Development Notes

- Project Managers are identified by their Google account ownership
- All data is scoped to projects via Row Level Security policies
- Theatrical design applied consistently across all pages
- Future versions will support multiple user roles (Project Manager, Actor, Crew)
- Button states indicate available features (enabled vs disabled)
- Character section is currently being developed

## Session History

Session 1: MVP player with basic movement in Godot
Session 2: Google OAuth and project infrastructure setup
Session 3: Project Manager interface with Main Menu and Project Details hub
Session 4: Deployment to Vercel and character setup development