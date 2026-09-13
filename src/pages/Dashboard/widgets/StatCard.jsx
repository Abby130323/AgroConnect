import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: IconComponent,
  trend,
  variant = 'default', // 'default', 'success', 'warning', 'info'
}) => {
  return (
    <div className={`stat-card stat-card-${variant}`}>
      <div className="stat-card-header">
        <span className="stat-card-title">{title}</span>
        {IconComponent && (
          <div className="stat-card-icon-wrapper">
            <IconComponent size={20} />
          </div>
        )}
      </div>

      <div className="stat-card-value">{value}</div>

      {(subtitle || trend) && (
        <div className="stat-card-footer">
          {trend && (
            <span className={`stat-card-trend trend-${trend.direction || 'up'}`}>
              {trend.direction === 'down' ? '↓' : '↑'} {trend.text}
            </span>
          )}
          {subtitle && <span className="stat-card-subtitle">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};

export default StatCard;
