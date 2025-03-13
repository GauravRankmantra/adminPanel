const Loading = () => {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black for blur
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backdropFilter: 'blur(2px)',
          zIndex: 1000, // Ensure it's on top
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slightly transparent white
            padding: '30px 40px',
            borderRadius: '15px',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '50px',
              height: '50px',
              border: '5px solid #3498db',
              borderTop: '5px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1.2s linear infinite',
              marginBottom: '20px',
            }}
          ></div>
          <span
            style={{
              fontSize: '1.4rem',
              fontWeight: '600',
              color: '#333',
              textAlign: 'center',
            }}
          >
            Loading... Uploading song
          </span>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      </div>
    );
  };
  
  export default Loading;