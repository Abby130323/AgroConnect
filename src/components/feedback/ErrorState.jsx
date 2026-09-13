import React from 'react';
import { AlertCircle } from 'lucide-react';

export const ErrorState = ({
  title = 'Inconveniente al procesar la solicitud',
  error,
  onRetry,
}) => {
  const errorMessage = typeof error === 'string' 
    ? error 
    : error?.message || 'Error de comunicación con el servicio REST.';

  return (
    <div className="error-state-card" role="alert">
      <div className="error-state-icon-wrapper">
        <AlertCircle size={48} className="text-danger" />
      </div>
      <h3 className="error-state-title">{title}</h3>
      <p className="error-state-details">{errorMessage}</p>

      {onRetry && (
        <button
          type="button"
          className="btn btn-primary mt-3"
          onClick={onRetry}
        >
          Reintentar Operación
        </button>
      )}
    </div>
  );
};

export default ErrorState;
