import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useAppContext, withProject } from './components/common/PageWrapper'
import DashboardLayout from './components/layout/DashboardLayout'
import LoginPage from './pages/LoginPage'
import ProjectSelectorPage from './pages/ProjectSelectorPage'
import Dashboard from './pages/Dashboard'
import ProjectSetupPage from './pages/ProjectSetupPage'
import StageDirectionsPage from './pages/StageDirectionsPage'
import ProfileSettingsPage from './pages/ProfileSettingsPage'
import RehearsalNotesPage from './pages/RehearsalNotesPage'
import ProjectSettingsPage from './pages/ProjectSettingsPage'
import CastCrewPage from './pages/CastCrewPage'
import CharactersPage from './pages/CharactersPage'
import BlocksPage from './pages/BlocksPage'
import FullScriptPage from './pages/FullScriptPage'
import MostRecentNotesPage from './pages/MostRecentNotesPage'
import RehearsalCalendarPage from './pages/RehearsalCalendarPage'
import NotesByScenePage from './pages/NotesByScenePage'
import RehearsalCalendarCalPage from './pages/RehearsalCalendarCalPage'
import ProductionTimelinePage from './pages/ProductionTimelinePage'
import EventCalendarPage from './pages/EventCalendarPage'
import CommunicationsPMPage from './pages/CommunicationsPMPage'
import GroupConversationPage from './pages/GroupConversationPage'
import NewsPage from './pages/NewsPage'
import SoundCuesPage from './pages/SoundCuesPage'
import MusicCuesPage from './pages/MusicCuesPage'
import MicrophonesCuesPage from './pages/MicrophonesCuesPage'
import LightingCuesPage from './pages/LightingCuesPage'
import CueSetupPage from './pages/CueSetupPage'
import CostumePage from './pages/CostumePage'
import StagePropPage from './pages/StagePropPage'
import ProductionEquipmentPage from './pages/ProductionEquipmentPage'
import EquipmentListPage from './pages/EquipmentListPage'

// Wrap all pages with withProject HOC
const WrappedDashboard = withProject(Dashboard)
const WrappedProjectSelector = withProject(ProjectSelectorPage)
const WrappedProjectSettings = withProject(ProjectSettingsPage)
const WrappedCastCrew = withProject(CastCrewPage)
const WrappedCharacters = withProject(CharactersPage)
const WrappedStageDirections = withProject(StageDirectionsPage)
const WrappedBlocks = withProject(BlocksPage)
const WrappedFullScript = withProject(FullScriptPage)
const WrappedRehearsalNotes = withProject(RehearsalNotesPage)
const WrappedMostRecentNotes = withProject(MostRecentNotesPage)
const WrappedRehearsalCalendar = withProject(RehearsalCalendarPage)
const WrappedNotesByScene = withProject(NotesByScenePage)
const WrappedRehearsalCalendarCal = withProject(RehearsalCalendarCalPage)
const WrappedProductionTimeline = withProject(ProductionTimelinePage)
const WrappedEventCalendar = withProject(EventCalendarPage)
const WrappedCommunicationsPM = withProject(CommunicationsPMPage)
const WrappedGroupConversation = withProject(GroupConversationPage)
const WrappedNews = withProject(NewsPage)
const WrappedSoundCues = withProject(SoundCuesPage)
const WrappedMusicCues = withProject(MusicCuesPage)
const WrappedMicrophonesCues = withProject(MicrophonesCuesPage)
const WrappedLightingCues = withProject(LightingCuesPage)
const WrappedCueSetup = withProject(CueSetupPage)
const WrappedCostume = withProject(CostumePage)
const WrappedStageProp = withProject(StagePropPage)
const WrappedProductionEquipment = withProject(ProductionEquipmentPage)
const WrappedEquipmentList = withProject(EquipmentListPage)

function AppContent() {
  const { user } = useAppContext()

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />

        {/* Protected routes - all wrapped in DashboardLayout with persistent Sidebar */}
        {user ? (
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<WrappedDashboard />} />
            <Route path="/projects" element={<WrappedProjectSelector />} />
            <Route path="/project-settings" element={<WrappedProjectSettings />} />
            <Route path="/cast-crew" element={<WrappedCastCrew />} />
            <Route path="/characters" element={<WrappedCharacters />} />
            <Route path="/stage-directions" element={<WrappedStageDirections />} />
            <Route path="/stage-directions/blocks" element={<WrappedBlocks />} />
            <Route path="/stage-directions/full-script" element={<WrappedFullScript />} />
            <Route path="/rehearsal-notes" element={<WrappedRehearsalNotes />} />
            <Route path="/rehearsal-notes/most-recent" element={<WrappedMostRecentNotes />} />
            <Route path="/rehearsal-notes/calendar" element={<WrappedRehearsalCalendar />} />
            <Route path="/rehearsal-notes/by-scenes" element={<WrappedNotesByScene />} />
            <Route path="/calendars/rehearsal" element={<WrappedRehearsalCalendarCal />} />
            <Route path="/calendars/timeline" element={<WrappedProductionTimeline />} />
            <Route path="/calendars/events" element={<WrappedEventCalendar />} />
            <Route path="/communications/pm" element={<WrappedCommunicationsPM />} />
            <Route path="/communications/group" element={<WrappedGroupConversation />} />
            <Route path="/communications/news" element={<WrappedNews />} />
            <Route path="/show-cues/sound" element={<WrappedSoundCues />} />
            <Route path="/show-cues/music" element={<WrappedMusicCues />} />
            <Route path="/show-cues/microphones" element={<WrappedMicrophonesCues />} />
            <Route path="/show-cues/lighting" element={<WrappedLightingCues />} />
            <Route path="/show-cues/setup" element={<WrappedCueSetup />} />
            <Route path="/equipment/costume" element={<WrappedCostume />} />
            <Route path="/equipment/props" element={<WrappedStageProp />} />
            <Route path="/equipment/production" element={<WrappedProductionEquipment />} />
            <Route path="/equipment/list" element={<WrappedEquipmentList />} />
            <Route path="/profile" element={<ProfileSettingsPage />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  )
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

export default App