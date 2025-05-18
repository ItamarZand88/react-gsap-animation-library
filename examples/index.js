import React, { useState } from 'react';
import BasicExample from './BasicExample';
import TextExample from './TextExample';
import AdvancedExample from './AdvancedExample';
import InteractiveExample from './InteractiveExample';

const Examples = () => {
  const [activePage, setActivePage] = useState('basic');

  const renderContent = () => {
    switch (activePage) {
      case 'basic':
        return <BasicExample />;
      case 'text':
        return <TextExample />;
      case 'advanced':
        return <AdvancedExample />;
      case 'interactive':
        return <InteractiveExample />;
      default:
        return <BasicExample />;
    }
  };

  const NavButton = ({ id, label }) => (
    <button
      onClick={() => setActivePage(id)}
      style={{
        padding: '10px 20px',
        backgroundColor: activePage === id ? '#3498db' : 'transparent',
        color: activePage === id ? 'white' : '#333',
        border: activePage === id ? 'none' : '1px solid #ddd',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: activePage === id ? 'bold' : 'normal',
      }}
    >
      {label}
    </button>
  );

  return (
    <div>
      <div
        style={{
          backgroundColor: 'white',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          padding: '20px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: '1000px',
            margin: '0 auto',
          }}
        >
          <h1
            style={{
              margin: '0 0 20px 0',
              fontSize: '24px',
              color: '#333',
            }}
          >
            React-GSAP Animation Library Examples
          </h1>
          <div
            style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
            }}
          >
            <NavButton id="basic" label="Basic Components" />
            <NavButton id="text" label="Text Animations" />
            <NavButton id="interactive" label="Interactive Elements" />
            <NavButton id="advanced" label="Advanced Scroll Effects" />
          </div>
        </div>
      </div>

      <div>{renderContent()}</div>

      <footer
        style={{
          textAlign: 'center',
          padding: '40px 20px',
          backgroundColor: '#f5f5f5',
          marginTop: '40px',
        }}
      >
        <div
          style={{
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          <h3 style={{ marginBottom: '10px' }}>React-GSAP Animation Library</h3>
          <p>
            A comprehensive collection of reusable, animated UI components powered by GSAP.
            Create stunning animations with minimal effort.
          </p>
          <p
            style={{
              marginTop: '20px',
              fontSize: '14px',
              color: '#666',
            }}
          >
            View on{' '}
            <a
              href="https://github.com/ItamarZand88/react-gsap-animation-library"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#3498db' }}
            >
              GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Examples;