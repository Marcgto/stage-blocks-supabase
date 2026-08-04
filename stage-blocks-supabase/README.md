## User Flows

### Project Manager Flow

1. **Google Login** → LoginPage
2. **Project Selector** → ProjectSelectorPage (grid of projects)
3. **Main Menu** → MainMenuPage (hub with 3 buttons)
   - Project Details (active, clickable)
   - Stage Directions (grayed out, coming soon)
   - Full Script (grayed out, coming soon)
4. **Project Details** → ProjectDetailsPage (setup hub)
   - Characters section (add/edit/delete)
   - Members section (add/invite/assign characters)
   - Scenes section (add/edit/delete scenes with blocks)

### Actor Flow (Future)

1. Click share link with token
2. Access MainMenuPage (actor view)
3. Choose between Stage Directions and Full Script

## Technology Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth)
- **Authentication:** Google OAuth
- **Styling:** Theatrical color scheme (Burgundy #5A2020, Gold #A68C2C)

## Database Schema

### Tables

- `projects` - Project metadata
- `characters` - Character names per project
- `project_members` - Invited actors/crew with login tracking
- `scenes` - Scenes with script text and ordering
- `blocks` - Blocks within scenes with stage directions
- `scene_character_assignments` - Links characters to scenes
- `block_character_directions` - Stage directions per character per block

All tables include RLS policies scoped to project owner (user_id).

## Color Scheme

- **Background:** Dark Burgundy `#4A1A1A`
- **Primary:** Burgundy `#5A2020`
- **Hover:** Darker Burgundy `#6B2C2C`
- **Accent:** Gold `#A68C2C`
- **Text:** Gold `#A68C2C` on burgundy backgrounds

All buttons use theatrical block aesthetic: 160px × 160px squares with 2px gold borders.

## Key Features

### MVP (Session 3)

- ✅ Google OAuth login
- ✅ Project creation and selection
- ✅ Main Menu (hub for all features)
- ✅ Project Details (Characters + Members + Scenes + Blocks setup)
- ✅ Dark theatrical UI with block-based design
- 🔄 Stage Directions view (coming)
- 🔄 Full Script view (coming)
- 🔄 Actor invite system with email (coming)

### Future Phases

- Actor view with access control
- Personal notes for actors
- Real-time collaboration
- Share links with token-based access
- Email notifications
- Performance optimizations

## Getting Started

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Navigate to `http://localhost:5173`
4. Login with Google
5. Create or select a project
6. Enter Main Menu
7. Click "Project Details" to set up your project

## Supabase Setup

All 10 SQL queries have been run to create:
1. Characters table
2. Project Members table
3. Scene Character Assignments table
4. Block Character Directions table
5. Extended Scenes table (sequence, script_text columns)
6. Extended Blocks table (scene_id, sequence, script_text columns)

## Navigation

- **ProjectSelectorPage** → MainMenuPage (click project)
- **MainMenuPage** (hub) → ProjectDetailsPage (click "Project Details")
- **ProjectDetailsPage** → Scene Editor (click scene block)
- **Scene Editor** → Block Editor (click block)
- All pages have "← Back" buttons to previous screen

## Notes

- Project Managers are identified by their Google account ownership of projects
- All data is scoped to projects via RLS policies
- Theatrical styling applied across all pages for immersive experience
- Future versions will support multiple user roles (PM, Actor, Crew)