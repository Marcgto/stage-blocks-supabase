import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import LoginPage from './pages/LoginPage';
import ProjectSelectorPage from './pages/ProjectSelectorPage';
import MainMenuPage from './pages/MainMenuPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import CharacterSetupPage from './pages/CharacterSetupPage';
import MembersSetupPage from './pages/MembersSetupPage';
import ScenesSetupPage from './pages/ScenesSetupPage';
import BlocksPage from './pages/BlocksPage';
import FullScriptPage from './pages/FullScriptPage';
import ActorViewPage from './pages/ActorViewPage';



export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription?.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#4A1A1A'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🎭</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#A68C2C', marginBottom: '2rem' }}>Stage Blocks</div>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #A68C2C',
            borderTop: '3px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
        </div>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {!session ? (
          <>
            <Route path="/" element={<LoginPage />} />
            <Route path="/actor" element={<ActorViewPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            <Route path="/" element={<ProjectSelectorPage />} />
            <Route path="/project/:projectId" element={<MainMenuPage />} />
            <Route path="/project/:projectId/details" element={<ProjectDetailsPage />} />
            <Route path="/project/:projectId/characters" element={<CharacterSetupPage />} />
            <Route path="/project/:projectId/members" element={<MembersSetupPage />} />
            <Route path="/project/:projectId/scenes" element={<ScenesSetupPage />} />
            <Route path="/project/:projectId/blocks" element={<BlocksPage />} />
            <Route path="/project/:projectId/full-script" element={<FullScriptPage />} />
            <Route path="/actor" element={<ActorViewPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}