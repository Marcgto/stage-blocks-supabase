export default function PageDescriptor({ description }) {
  return (
    <div style={{
      width: '460px',
      backgroundColor: '#5A2020',
      border: '2px solid #A68C2C',
      borderRadius: '4px',
      padding: '1rem',
      marginBottom: '1.5rem',
      color: '#A68C2C',
      fontSize: '14px',
      lineHeight: '1.6',
      margin: '0 auto 1.5rem auto'
    }}>
      {description}
    </div>
  );
}