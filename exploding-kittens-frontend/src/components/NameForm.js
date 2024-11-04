import React, { useState } from 'react';
import axios from 'axios';
import backgroundVideo from '../assets/Exploding.mp4';

function NameForm({ onNameSubmit }) {
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://backend-emittr2-h3ou.onrender.com/api/user', { name });
      onNameSubmit(name); 
      setErrorMessage('');
    } catch (error) {
      console.error('Error submitting name:', error);
      setErrorMessage('Failed to submit name. Please try again.');
    }
  };

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      overflow: 'hidden',
    }}>
      {/* Background Video */}
      <video 
        autoPlay 
        loop 
        muted 
        style={{
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          zIndex: '-1'
        }}
      >
        <source src={backgroundVideo} type="video/mp4" />
      </video>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}>
        {/* Blurred Box Wrapper */}
        <div style={{
          backdropFilter: 'blur(10px)',
          borderRadius: '15px',
          padding: '40px',
          maxWidth: '300px',
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
          textAlign: 'center',
        }}>
          <h1 style={{            
            color: '#f57400',
            marginBottom: '20px',
            fontSize: '24px',
            fontWeight: 'bold'
          }}>
            Exploding Kittens 😸
          </h1>
          <form onSubmit={handleSubmit} style={{
            width: '100%',        
            display: 'flex',      
            flexDirection: 'column', 
            alignItems: 'center', 
          }}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Your Name"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid #f57400',
                color: '#f57400',
                padding: '10px',
                borderRadius: '5px',
                marginBottom: '15px',
                width: '100%',
                outline: 'none',
                fontSize: '16px',
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: '#f57400',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bolder',
                width: '100%',
              }}
            >
              Game on
            </button>
            {errorMessage && <p style={{ color: '#f57400', marginTop: '10px' }}>{errorMessage}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default NameForm;
