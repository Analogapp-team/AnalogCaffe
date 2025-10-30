import React from 'react';
import './FollowButton.css';

const FollowButton = ({ following = false, onFollowChange }) => {
  const handleClick = (e) => {
    e.preventDefault();
    if (onFollowChange) {
      onFollowChange(!following);
    }
  };

  return (
    <button 
      type="button"
      className={`follow-button ${following ? 'following' : ''}`}
      onClick={handleClick}
      aria-pressed={following}
      role="switch"
    >
      {following ? (
        <>
          <span className="check-icon" aria-hidden="true">✓</span>
          Following
        </>
      ) : (
        'Follow'
      )}
    </button>
  );
};

export default FollowButton;