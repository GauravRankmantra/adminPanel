import React, { useState, useEffect } from 'react';

const Success = ({ message }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 4000); // Hide after 4 seconds

    return () => clearTimeout(timer);
  }, []);

  return isVisible ? (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%) scale(1)',
        backgroundColor: 'rgba(220, 252, 231, 0.95)',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        textAlign: 'center',
        minWidth: '300px',
        transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
        opacity: 1,
      }}
      className="success-animation"
    >
      <div
        style={{
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          backgroundColor: '#48BB78',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '25px',
          transform: 'scale(1.1)',
          transition: 'transform 0.2s ease-in-out',
        }}
        onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
        onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="white"
          width="40"
          height="40"
        >
          <path
            fillRule="evenodd"
            d="M16.72 7.72a.75 75 0 011.06 1.06l-7.5 7.5a.75 75 0 01-1.06 0l-4.5-4.5a.75 75 0 011.06-1.06L9 14.44l6.66-6.66z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <span
        style={{
          fontSize: '1.6rem',
          fontWeight: '700',
          color: '#2D3748',
          marginBottom: '15px',
          transition: 'color 0.3s ease-in-out',
        }}
        onMouseOver={(e) => (e.currentTarget.style.color = '#1A202C')}
        onMouseOut={(e) => (e.currentTarget.style.color = '#2D3748')}
      >
        Success!
      </span>
      <span style={{ color: '#4A5568', transition: 'color 0.3s ease-in-out' }}>
        {message}
      </span>
      <style>
        {`
          .success-animation {
            animation: fadeInOut 4s ease-out forwards;
          }

          @keyframes fadeInOut {
            0% {
              opacity: 0;
              transform: translate(-50%, -50%) scale(0.8);
            }
            10% {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
            }
            90% {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
            }
            100% {
              opacity: 0;
              transform: translate(-50%, -50%) scale(0.8);
            }
          }
        `}
      </style>
    </div>
  ) : null;
};

export default Success;