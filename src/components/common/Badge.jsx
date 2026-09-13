import React from 'react';

export const Badge = ({
  children,
  variant = 'default', // success, danger, warning, info, category, neutral
  size = 'md',
  className = '',
}) => {
  return (
    <span className={`badge badge-${variant} badge-${size} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
