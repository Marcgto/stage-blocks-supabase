import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function ScenesSetupPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const [scenes, setScenes] = useState([]);
  const [sceneName, setSceneName] = useState('');
  const [sceneScript, setSceneScript] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [expandedScene, setExpandedScene] = useState(null);

  // Fetch scenes on load
  useEffect(() => {
    fetchScenes();
  }, [projectId]);

  const fetchScenes = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('scenes')
        .select('*')
        .eq('project_id', projectId)
        .order('sequence', { ascending: true });

      if (fetchError) throw fetchError;
      setScenes(data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching scenes:', err);
      setError('Failed to load scenes');
    } finally {
      setLoading(false);
    }
  };

  const handleAddScene = async (e) => {
    e.preventDefault();
    
    if (!sceneName.trim()) {
      setError('Please enter a scene name');
      return;
    }

    try {
      // Get the current user from auth
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('Not authenticated');

      // Calculate sequence (add to end)
      const maxSequence = scenes.length > 0 
        ? Math.max(...scenes.map(s => s.sequence || 0))
        : 0;

      const { data, error: insertError } = await supabase
        .from('scenes')
        .insert([
          {
            project_id: projectId,
            user_id: user.id,
            name: sceneName.trim(),
            script_text: sceneScript.trim(),
            sequence: maxSequence + 1
          }
        ])
        .select();

      if (insertError) throw insertError;

      // Add to local state
      setScenes([...scenes, data[0]]);
      setSceneName('');
      setSceneScript('');
      setError('');
    } catch (err) {
      console.error('Error adding scene:', err);
      setError('Failed to add scene');
    }
  };

  const handleDeleteScene = async (sceneId) => {
    try {
      const { error: deleteError } = await supabase
        .from('scenes')
        .delete()
        .eq('id', sceneId);

      if (deleteError) throw deleteError;

      setScenes(scenes.filter(s => s.id !== sceneId));
      setDeleteConfirm(null);
      setError('');
    } catch (err) {
      console.error('Error deleting scene:', err);
      setError('Failed to delete scene');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#4A1A1A] text-white flex items-center justify-center">
        <p className="text-lg">Loading scenes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#4A1A1A] text-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#A68C2C] mb-2">Scenes</h1>
          <p className="text-gray-300">Create scenes and add script text</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900 border-2 border-red-700 rounded-lg text-red-100">
            {error}
          </div>
        )}

        {/* Add Scene Form */}
        <form onSubmit={handleAddScene} className="mb-8 p-6 bg-[#5A2020] rounded-lg border-2 border-[#A68C2C]">
          <h2 className="text-xl font-bold text-[#A68C2C] mb-4">Add New Scene</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-[#A68C2C] font-semibold mb-2">
                Scene Name
              </label>
              <input
                type="text"
                value={sceneName}
                onChange={(e) => setSceneName(e.target.value)}
                placeholder="e.g., You'll Be Back"
                className="w-full px-4 py-2 bg-[#3A1A1A] border-2 border-[#A68C2C] text-white placeholder-gray-500 rounded-lg focus:outline-none focus:border-[#D4A574]"
              />
            </div>

            <div>
              <label className="block text-[#A68C2C] font-semibold mb-2">
                Script Text (Optional)
              </label>
              <textarea
                value={sceneScript}
                onChange={(e) => setSceneScript(e.target.value)}
                placeholder="Paste your script or lyrics here..."
                rows="6"
                className="w-full px-4 py-2 bg-[#3A1A1A] border-2 border-[#A68C2C] text-white placeholder-gray-500 rounded-lg focus:outline-none focus:border-[#D4A574] resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#A68C2C] text-[#4A1A1A] font-bold rounded-lg hover:bg-[#D4A574] transition-colors"
            >
              Add Scene
            </button>
          </div>
        </form>

        {/* Scenes List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#A68C2C] mb-4">
            Scenes ({scenes.length})
          </h2>

          {scenes.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>No scenes added yet</p>
              <p className="text-sm mt-2">Add a scene above to get started</p>
            </div>
          ) : (
            scenes.map((scene) => (
              <div
                key={scene.id}
                className="w-full bg-[#5A2020] border-2 border-[#A68C2C] rounded-lg overflow-hidden"
              >
                {/* Scene Header (always visible) */}
                <div className="p-4 flex justify-between items-center cursor-pointer hover:bg-[#6B2C2C] transition-colors"
                  onClick={() => setExpandedScene(expandedScene === scene.id ? null : scene.id)}>
                  <div className="flex-1">
                    <div className="text-white font-semibold text-lg">{scene.name}</div>
                    {scene.script_text && (
                      <div className="text-gray-400 text-sm mt-1">
                        {scene.script_text.length} characters
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <span className="text-[#A68C2C] text-sm">
                      {expandedScene === scene.id ? '▼' : '▶'}
                    </span>
                  </div>
                </div>

                {/* Expanded Script Text */}
                {expandedScene === scene.id && scene.script_text && (
                  <div className="border-t-2 border-[#A68C2C] p-4 bg-[#4A1A1A]">
                    <div className="text-gray-200 whitespace-pre-wrap text-sm mb-4 max-h-48 overflow-y-auto">
                      {scene.script_text}
                    </div>
                  </div>
                )}

                {/* Delete Button */}
                {expandedScene === scene.id && (
                  <div className="border-t-2 border-[#A68C2C] p-4 bg-[#4A1A1A] flex justify-end">
                    <button
                      onClick={() => setDeleteConfirm(scene.id)}
                      className="px-4 py-2 bg-red-900 text-red-200 hover:bg-red-800 border border-red-700 rounded transition-colors font-semibold"
                    >
                      Delete Scene
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#5A2020] border-2 border-[#A68C2C] rounded-lg p-6 max-w-sm">
              <h3 className="text-xl font-bold text-[#A68C2C] mb-4">
                Delete Scene?
              </h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this scene? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border-2 border-[#A68C2C] text-[#A68C2C] rounded hover:bg-[#4A1A1A] transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteScene(deleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-900 text-red-200 hover:bg-red-800 border-2 border-red-700 rounded transition-colors font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-12 flex justify-between">
          <button
            onClick={() => navigate(`/project/${projectId}/details`)}
            className="px-8 py-3 border-2 border-[#A68C2C] text-[#A68C2C] rounded hover:bg-[#5A2020] transition-colors font-bold"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}
