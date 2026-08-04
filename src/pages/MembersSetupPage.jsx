import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function MembersSetupPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const [members, setMembers] = useState([]);
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Fetch members on load
  useEffect(() => {
    fetchMembers();
  }, [projectId]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('project_members')
        .select('*')
        .eq('project_id', projectId)
        .order('sequence', { ascending: true });

      if (fetchError) throw fetchError;
      setMembers(data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching members:', err);
      setError('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    
    if (!memberName.trim() || !memberEmail.trim()) {
      setError('Please enter both name and email');
      return;
    }

    try {
      // Get the current user from auth
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('Not authenticated');

      // Calculate sequence (add to end)
      const maxSequence = members.length > 0 
        ? Math.max(...members.map(m => m.sequence || 0))
        : 0;

      const { data, error: insertError } = await supabase
        .from('project_members')
        .insert([
          {
            project_id: projectId,
            user_id: user.id,
            name: memberName.trim(),
            email: memberEmail.trim(),
            sequence: maxSequence + 1
          }
        ])
        .select();

      if (insertError) throw insertError;

      // Add to local state
      setMembers([...members, data[0]]);
      setMemberName('');
      setMemberEmail('');
      setError('');
    } catch (err) {
      console.error('Error adding member:', err);
      setError('Failed to add member');
    }
  };

  const handleDeleteMember = async (memberId) => {
    try {
      const { error: deleteError } = await supabase
        .from('project_members')
        .delete()
        .eq('id', memberId);

      if (deleteError) throw deleteError;

      setMembers(members.filter(m => m.id !== memberId));
      setDeleteConfirm(null);
      setError('');
    } catch (err) {
      console.error('Error deleting member:', err);
      setError('Failed to delete member');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#4A1A1A] text-white flex items-center justify-center">
        <p className="text-lg">Loading members...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#4A1A1A] text-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#A68C2C] mb-2">Members</h1>
          <p className="text-gray-300">Add members to your project</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900 border-2 border-red-700 rounded-lg text-red-100">
            {error}
          </div>
        )}

        {/* Add Member Form */}
        <form onSubmit={handleAddMember} className="mb-8 p-6 bg-[#5A2020] rounded-lg border-2 border-[#A68C2C]">
          <h2 className="text-xl font-bold text-[#A68C2C] mb-4">Add New Member</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-[#A68C2C] font-semibold mb-2">
                Member Name
              </label>
              <input
                type="text"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                placeholder="e.g., Sarah Jones"
                className="w-full px-4 py-2 bg-[#3A1A1A] border-2 border-[#A68C2C] text-white placeholder-gray-500 rounded-lg focus:outline-none focus:border-[#D4A574]"
              />
            </div>

            <div>
              <label className="block text-[#A68C2C] font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                placeholder="e.g., sarah@example.com"
                className="w-full px-4 py-2 bg-[#3A1A1A] border-2 border-[#A68C2C] text-white placeholder-gray-500 rounded-lg focus:outline-none focus:border-[#D4A574]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#A68C2C] text-[#4A1A1A] font-bold rounded-lg hover:bg-[#D4A574] transition-colors"
            >
              Add Member
            </button>
          </div>
        </form>

        {/* Members List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#A68C2C] mb-4">
            Members ({members.length})
          </h2>

          {members.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>No members added yet</p>
              <p className="text-sm mt-2">Add a member above to get started</p>
            </div>
          ) : (
            members.map((member) => (
              <div
                key={member.id}
                className="w-full p-4 bg-[#5A2020] border-2 border-[#A68C2C] rounded-lg flex justify-between items-start"
              >
                <div className="flex-1">
                  <div className="text-white font-semibold text-lg">{member.name}</div>
                  <div className="text-gray-300 text-sm mt-1">{member.email}</div>
                </div>

                <button
                  onClick={() => setDeleteConfirm(member.id)}
                  className="ml-4 px-3 py-1 bg-red-900 text-red-200 hover:bg-red-800 border border-red-700 rounded transition-colors text-sm font-semibold"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#5A2020] border-2 border-[#A68C2C] rounded-lg p-6 max-w-sm">
              <h3 className="text-xl font-bold text-[#A68C2C] mb-4">
                Delete Member?
              </h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this member? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border-2 border-[#A68C2C] text-[#A68C2C] rounded hover:bg-[#4A1A1A] transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteMember(deleteConfirm)}
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
