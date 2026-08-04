export default function AppHeader({ projectName }) {
  return (
    <div style={{
      display: 'flex',
      gap: '20px',
      marginBottom: '1.5rem',
      width: '100%',
      justifyContent: 'center'
    }}>
      {/* Left Block - Stage Blocks Branding */}
      <div style={{
        width: '220px',
        height: '80px',
        backgroundColor: '#5A2020',
        border: '2px solid #A68C2C',
        borderRadius: '4px',
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        flexShrink: 0
      }}>
        <div style={{
          fontSize: '24px'
        }}>🎭</div>
        <h1 style={{
          fontSize: '20px',
          fontWeight: 600,
          color: '#A68C2C',
          margin: 0,
          textAlign: 'center'
        }}>
          Stage Blocks
        </h1>
      </div>

      {/* Right Block - Project Name (empty on ProjectSelectorPage) */}
      <div style={{
        width: '220px',
        height: '80px',
        backgroundColor: '#5A2020',
        border: '2px solid #A68C2C',
        borderRadius: '4px',
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        {projectName && (
          <h2 style={{
            fontSize: '20px',
            fontWeight: 600,
            color: '#A68C2C',
            margin: 0,
            textAlign: 'center',
            wordBreak: 'break-word'
          }}>
            {projectName}
          </h2>
        )}
      </div>
    </div>
  );
}
