import React, { useState } from 'react';
import './Post.css';
import Polaroid from '../../base-components/polaroid/Polaroid';

const Post = ({ author, timestamp, content, image, polaroids = [] }) => {
  const [showAllPolaroids, setShowAllPolaroids] = useState(false);
  
  const displayedPolaroids = showAllPolaroids ? polaroids : polaroids.slice(0, 6);
  
  return (
    <div className="post">
      <div className="post-header">
        <img src={author.avatar} alt="" className="author-avatar" />
        <div className="post-info">
          <h3 className="author-name">{author.name}</h3>
          <span className="timestamp">{timestamp}</span>
        </div>
      </div>
      
      <p className="post-content">{content}</p>
      
      {image && (  // Only render if image prop exists
        <div className="post-image-container">
          <img src={image} alt="" className="post-image" />
        </div>
      )}
      
      <div className="polaroids-section">
        {displayedPolaroids.map((polaroid, index) => (
          <div key={index} className={`polaroid-wrapper ${index % 2 === 0 ? 'tilt-left' : 'tilt-right'}`}>
            <Polaroid 
              image={polaroid.image}
              name={polaroid.name}
            />
          </div>
        ))}
      </div>
      
      <div className="post-actions">
        {polaroids.length > 6 && (
          <button 
            className="toggle-polaroids-btn"
            onClick={() => setShowAllPolaroids(!showAllPolaroids)}
          >
            {showAllPolaroids ? '↑ See Less Polaroids' : '↓ See more Polaroids'}
          </button>
        )}
        <button className="add-polaroid-btn">
          <span className="camera-icon">📷</span> Add Polaroid
        </button>
      </div>
    </div>
  );
};

export default Post;