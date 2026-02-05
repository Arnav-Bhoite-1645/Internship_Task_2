import React from 'react';
import '../styles/components.css';

const Card = ({ children, className = '' }) => {
  return (
    <section className={`card ${className}`}>
      {children}
    </section>
  );
};

export default Card;
