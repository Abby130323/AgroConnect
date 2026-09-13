import React from 'react';
import { Activity, Clock, CheckCircle2, Package, RefreshCw } from 'lucide-react';

export const RecentActivityWidget = ({
  activities = [],
  title = 'Registro de Actividad Reciente',
}) => {
  const defaultActivities = [
    { id: 1, text: 'Sincronización con MockAPI completada', time: 'Hace 5 min', icon: CheckCircle2, type: 'success' },
    { id: 2, text: 'Control de stock actualizado en Carnes de Res', time: 'Hace 18 min', icon: RefreshCw, type: 'info' },
    { id: 3, text: 'Nuevo lote de Aguacate Hass verificado', time: 'Hace 45 min', icon: Package, type: 'warning' },
  ];

  const items = activities.length > 0 ? activities : defaultActivities;

  return (
    <div className="dashboard-widget-card">
      <div className="widget-header">
        <div className="d-flex align-items-center gap-2">
          <Activity size={20} className="text-primary" />
          <h3 className="widget-title">{title}</h3>
        </div>
        <span className="badge badge-neutral text-xs">Eventos de Sistema</span>
      </div>

      <div className="activity-timeline mt-3">
        {items.map((act) => {
          const IconComp = act.icon || Activity;
          return (
            <div key={act.id} className="timeline-item">
              <div className={`timeline-icon-bubble bubble-${act.type || 'info'}`}>
                <IconComp size={14} />
              </div>
              <div className="timeline-content">
                <span className="timeline-text">{act.text}</span>
                <span className="timeline-time">
                  <Clock size={12} className="inline-icon mr-1" />
                  {act.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivityWidget;
