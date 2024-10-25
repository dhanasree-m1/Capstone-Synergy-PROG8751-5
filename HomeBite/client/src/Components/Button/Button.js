// src/components/Button/Button.js
import React from 'react';
import { Button as BootstrapButton } from 'react-bootstrap';
import './Button.scss';

const Button = ({ type, className, onClick, children }) => {
  const buttonClass = className.includes('btn-secondary') ? 'btn-secondary' : 'btn-primary';

  return (
    <BootstrapButton 
      type={type} 
      className={`custom-button ${buttonClass} ${className}`} 
      onClick={onClick}
    >
      {children}
    </BootstrapButton>
  );
};

export default Button;
