import React from 'react';

export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,
  className = '',
  ...props
}) => {
  const baseClass = `btn btn-${variant} btn-${size} ${fullWidth ? 'btn-block' : ''} ${className}`.trim();

  return (
    <button
      type={type}
      className={baseClass}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <span className="btn-loading-wrapper">
          <span className="spinner-inline" aria-hidden="true" />
          <span>Cargando...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
