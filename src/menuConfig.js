// Menu configuration - single source of truth for all navigation
// Structure: { label, path, submenu: [] }

export const menuConfig = [
  { label: 'Dashboard', path: '/dashboard' },
  {
    label: 'Projects',
    path: '/projects',
    submenu: [
      { label: 'Project Selector', path: '/projects' },
      { label: 'Cast & Crew', path: '/cast-crew' },
      { label: 'Characters', path: '/characters' },
      { label: 'Ticket sales', path: '/ticket-sales' },
    ],
  },
  {
    label: 'Stage Directions',
    path: '/stage-directions',
    submenu: [
      { label: 'Blocks', path: '/stage-directions/blocks' },
      { label: 'Full Script', path: '/stage-directions/full-script' },
    ],
  },
  {
    label: 'Rehearsal Notes',
    path: '/rehearsal-notes',
    submenu: [
      { label: 'Most Recent', path: '/rehearsal-notes/most-recent' },
      { label: 'Rehearsal Calendar', path: '/rehearsal-notes/calendar' },
      { label: 'Notes by Scenes', path: '/rehearsal-notes/by-scenes' },
    ],
  },
  {
    label: 'Calendars',
    path: '/calendars',
    submenu: [
      { label: 'Rehearsal Calendar', path: '/calendars/rehearsal' },
      { label: 'Production Timeline', path: '/calendars/timeline' },
      { label: 'Event Calendar', path: '/calendars/events' },
    ],
  },
  {
    label: 'Communication & News',
    path: '/communications',
    submenu: [
      { label: 'Communications from PM', path: '/communications/pm' },
      { label: 'Group Conversation', path: '/communications/group' },
      { label: 'News', path: '/communications/news' },
    ],
  },
  {
    label: 'Show Cues',
    path: '/show-cues',
    submenu: [
      { label: 'Sound', path: '/show-cues/sound' },
      { label: 'Music', path: '/show-cues/music' },
      { label: 'Microphones', path: '/show-cues/microphones' },
      { label: 'Lighting', path: '/show-cues/lighting' },
      { label: 'Cue Setup', path: '/show-cues/setup' },
    ],
  },
  {
    label: 'Equipment',
    path: '/equipment',
    submenu: [
      { label: 'Costume', path: '/equipment/costume' },
      { label: 'Stage Props', path: '/equipment/props' },
      { label: 'Production Equipment', path: '/equipment/production' },
      { label: 'Equipment List', path: '/equipment/list' },
    ],
  },
  { label: 'Settings', path: '/profile' },
]

// Helper function to find which menu section a path belongs to
export const getMenuSectionForPath = (pathname) => {
  for (const item of menuConfig) {
    if (item.submenu) {
      const submenuItem = item.submenu.find(sub => pathname.includes(sub.path.split('/')[1]))
      if (submenuItem || pathname.includes(item.path.split('/')[1])) {
        return item.label
      }
    } else if (pathname.includes(item.path.split('/')[1])) {
      return item.label
    }
  }
  return null
}