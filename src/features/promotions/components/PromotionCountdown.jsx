import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

export const PromotionCountdown = ({ targetHours = 8 }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: targetHours, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Generar un tiempo límite coherente con el día de hoy hasta medianoche
    const updateCountdown = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const diff = Math.max(0, endOfDay.getTime() - now.getTime());
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatPad = (num) => String(num).padStart(2, '0');

  return (
    <div className="promo-countdown-box">
      <Timer size={15} className="countdown-icon" />
      <span className="countdown-text">La oferta finaliza en:</span>
      <span className="countdown-digits">
        {formatPad(timeLeft.hours)}:{formatPad(timeLeft.minutes)}:{formatPad(timeLeft.seconds)}
      </span>
    </div>
  );
};

export default PromotionCountdown;
