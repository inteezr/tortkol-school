import React from 'react';

export const AnimatedBackground: React.FC = () => (
  <div className="fx-bg" aria-hidden="true">
    <div className="blob b1" />
    <div className="blob b2" />
    <div className="blob b3" />
    <div className="fx-grain" />
    <svg className="fx-orbit" viewBox="0 0 1000 1000">
      <circle cx="500" cy="500" r="480" />
      <circle cx="500" cy="500" r="360" />
      <circle cx="500" cy="500" r="240" />
      <circle className="dot d1" cx="500" cy="20" r="9" />
      <circle className="dot d2" cx="860" cy="500" r="7" />
      <circle className="dot d3" cx="260" cy="500" r="6" />
    </svg>
  </div>
);
