import React, { useState, useEffect } from 'react'
import { useAppContext } from '../components/common/PageWrapper'
import { colors, spacing, typography } from '../designTokens'
import Card from '../components/common/Card'
import { supabase } from '../lib/supabase'

const CastCrewPage = ({ currentProject }) => {
  const { user } = useAppContext()
  const [members, setMembers] = useState([])
  const [memberName, setMemberName] = useState('')
  const [memberEmail, setMemberEmail] = useState('')
  const [memberError, setMemberError] = useState('')
  const [memberSuccess, setMemberSuccess] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleteConfirmMember, setDeleteConfirmMember] = useState(null)

  useEffect(() => {
    if (currentProject) {
      fetchMembers()
    } else {
      setLoading(false)
    }
  }, [currentProject])

  const fetchMembers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('project_members')
        .select('*')
        .eq('project_id', currentProject.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setMembers(data || [])
      setMemberError('')
    } catch (err) {
      console.error('Error fetching members:', err)
      setMemberError('Failed to load members')
    } finally {
      setLoading(false)
    }
  }

  const handleAddMember = async (e) => {
    e.preventDefault()

    if (!memberName.trim() || !memberEmail.trim()) {
      setMemberError('Please enter both name and email')
      return
    }

    try {
      setMemberError('')
      setMemberSuccess('')

      // TODO: Implement invite system - for now just add to project_members
      const { data, error } = await supabase
        .from('project_members')
        .insert([{
          project_id: currentProject.id,
          user_id: user?.id,
          role: 'cast',
          invited_by: user?.id,
          invited_at: new Date().toISOString(),
        }])
        .select()

      if (error) throw error

      setMemberName('')
      setMemberEmail('')
      setMemberSuccess('Member added!')
      await fetchMembers()

      setTimeout(() => setMemberSuccess(''), 3000)
    } catch (err) {
      console.error('Error adding member:', err)
      setMemberError('Failed to add member')
    }
  }

  const handleDeleteMember = async (memberId) => {
    try {
      const { error } = await supabase
        .from('project_members')
        .delete()
        .eq('id', memberId)

      if (error) throw error

      setDeleteConfirmMember(null)
      setMemberSuccess('Member removed')
      await fetchMembers()

      setTimeout(() => setMemberSuccess(''), 3000)
    } catch (err) {
      console.error('Error deleting member:', err)
      setMemberError('Failed to remove member')
    }
  }

  if (!currentProject) {
    return (
      <Card style={{ padding: spacing.lg }}>
        <p style={{ color: colors.textPrimary }}>No project loaded. Go to Projects to load one.</p>
      </Card>
    )
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ color: colors.textPrimary, marginBottom: spacing.lg }}>Cast & Crew</h1>

        {memberError && <Card style={{ padding: spacing.md, marginBottom: spacing.lg, backgroundColor: '#FEF2F2' }}><p style={{ color: colors.error, margin: 0 }}>❌ {memberError}</p></Card>}
        {memberSuccess && <Card style={{ padding: spacing.md, marginBottom: spacing.lg, backgroundColor: '#F0F9F7' }}><p style={{ color: colors.success, margin: 0 }}>✓ {memberSuccess}</p></Card>}

        <Card style={{ padding: spacing.lg, marginBottom: spacing.lg }}>
          <h2 style={{ color: colors.textPrimary, marginTop: 0, marginBottom: spacing.md }}>Add Team Member</h2>
          <form onSubmit={handleAddMember}>
            <div style={{ marginBottom: spacing.md }}>
              <label style={{ display: 'block', color: colors.textPrimary, marginBottom: spacing.sm, fontWeight: 'bold' }}>Name</label>
              <input
                type="text"
                placeholder="Member Name"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                style={{
                  width: '100%',
                  padding: spacing.sm,
                  border: `1px solid ${colors.cardBorder}`,
                  borderRadius: '4px',
                  fontSize: typography.body,
                }}
              />
            </div>

            <div style={{ marginBottom: spacing.md }}>
              <label style={{ display: 'block', color: colors.textPrimary, marginBottom: spacing.sm, fontWeight: 'bold' }}>Email</label>
              <input
                type="email"
                placeholder="member@example.com"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: spacing.sm,
                  border: `1px solid ${colors.cardBorder}`,
                  borderRadius: '4px',
                  fontSize: typography.body,
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: spacing.sm,
                backgroundColor: colors.button,
                color: '#FFF',
                border: 'none',
                borderRadius: '4px',
                fontSize: typography.body,
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Add Member
            </button>
          </form>
        </Card>

        {loading ? (
          <p>Loading members...</p>
        ) : members.length === 0 ? (
          <p style={{ color: colors.textMuted }}>No team members yet.</p>
        ) : (
          <div>
            <h2 style={{ color: colors.textPrimary, marginBottom: spacing.md }}>Team Members ({members.length})</h2>
            {members.map(member => (
              <Card key={member.id} style={{ padding: spacing.lg, marginBottom: spacing.md, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ color: colors.textPrimary, margin: 0, marginBottom: spacing.xs, fontWeight: 'bold' }}>User ID: {member.user_id}</p>
                  <p style={{ color: colors.textMuted, margin: 0, fontSize: typography.small }}>Role: {member.role || 'N/A'}</p>
                </div>
                <button
                  onClick={() => setDeleteConfirmMember(member.id)}
                  style={{
                    padding: `${spacing.xs} ${spacing.sm}`,
                    backgroundColor: '#999',
                    color: '#FFF',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Remove
                </button>
              </Card>
            ))}
          </div>
        )}

        {deleteConfirmMember && (
          <Card style={{ padding: spacing.lg, backgroundColor: '#FEF2F2', position: 'fixed', bottom: spacing.lg, right: spacing.lg, maxWidth: '300px' }}>
            <p style={{ color: colors.error, margin: 0, marginBottom: spacing.sm }}>Remove this member?</p>
            <div style={{ display: 'flex', gap: spacing.sm }}>
              <button
                onClick={() => handleDeleteMember(deleteConfirmMember)}
                style={{
                  flex: 1,
                  padding: spacing.sm,
                  backgroundColor: colors.error,
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Remove
              </button>
              <button
                onClick={() => setDeleteConfirmMember(null)}
                style={{
                  flex: 1,
                  padding: spacing.sm,
                  backgroundColor: '#999',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </Card>
        )}
      </div>
    )
  }

export default CastCrewPage