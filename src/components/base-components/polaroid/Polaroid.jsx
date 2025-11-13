import React from 'react';
import './Polaroid.css';

const Polaroid = ({ image, name }) => {
  return (
    <div className="polaroid">
      <div className="polaroid-image">
        <img src={image} alt={name} />
      </div>
      <div className="polaroid-caption">
        <span>{name}</span>
      </div>
    </div>
  );
};

export default Polaroid;