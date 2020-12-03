import React from 'react';

export default function Preloader() {
  return (
    <div className="preloader">
      <i className="preloader__spinner" />
      <span className="preloader__title">Идет поиск...</span>
    </div>
  );
}
