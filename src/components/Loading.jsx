import React from 'react';

const Loading = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f4f8', // Light background
        animation: 'fadeIn 1s ease-in-out', // Fade-in animation
      }}
    >
      <div
        style={{
          border: '8px solid #e0e0e0', // Light grey border
          borderTop: '8px solid #3498db', // Blue top border
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          animation: 'spin 1.5s linear infinite', // Spinning animation
        }}
      ></div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
           @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default Loading;