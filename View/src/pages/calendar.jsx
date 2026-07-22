import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CalendarPage({ lang }) {
  const navigate = useNavigate();
  
  // 1. Setup Date Boundaries
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day

  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2);

  // State manages which month is currently displayed
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const texts = {
    ar: { title: "اختر التاريخ", next: "التالي", prev: "السابق" },
    en: { title: "Select Date", next: "Next", prev: "Prev" }
  };
  const t = texts[lang];

  // Calendar Calculation Logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleDateClick = (day) => {
    const selectedDate = new Date(year, month, day);
    
    // Final validation check before navigating
    if (selectedDate >= twoDaysAgo && selectedDate <= today) {
      const formattedMonth = String(month + 1).padStart(2, '0');
      const formattedDay = String(day).padStart(2, '0');
      const selected = `${year}-${formattedMonth}-${formattedDay}`;
      navigate(`/slots?date=${selected}`);
    }
  };

  const changeMonth = (offset) => {
    setCurrentDate(new Date(year, month + offset, 1));
  };

  return (
    <div className="calendar-page">
      <style>{`
        .calendar-page { 
          padding: 20px 5%; 
          text-align: center; 
          color: white; 
          direction: ${lang === 'ar' ? 'rtl' : 'ltr'};
          font-family: sans-serif;
        }
        
        .calendar-container { 
          width: 100%;
          max-width: 450px; 
          margin: 20px auto; 
          background: #0f172a; 
          border-radius: 12px; 
          padding: 15px; 
          border: 1px solid rgba(251, 191, 36, 0.4); 
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        .calendar-header { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          margin-bottom: 20px; 
        }

        .month-label { 
          font-size: 1.1rem; 
          font-weight: bold; 
          color: #fbbf24; 
          text-transform: capitalize;
        }

        .calendar-grid { 
          display: grid; 
          grid-template-columns: repeat(7, 1fr); 
          gap: 8px; 
        }

        .day-box { 
          aspect-ratio: 1 / 1; 
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer; 
          border-radius: 8px; 
          transition: 0.2s; 
          background: rgba(255,255,255,0.05); 
          font-size: 0.9rem;
          font-weight: 500;
        }

        /* Highlight the active selectable days */
        .day-box:not(.disabled):hover { 
          background: #fbbf24; 
          color: #020617; 
          transform: scale(1.1);
        }

        .day-box.disabled {
          background: #1e293b !important;
          color: #475569 !important;
          cursor: not-allowed !important;
          opacity: 0.4;
        }

        .nav-btn { 
          background: transparent; 
          border: 1px solid #fbbf24; 
          color: #fbbf24; 
          padding: 8px 15px; 
          cursor: pointer; 
          border-radius: 6px; 
          font-size: 0.8rem;
          transition: 0.3s;
        }
        
        .nav-btn:hover {
          background: #fbbf24;
          color: #020617;
        }

        .empty { opacity: 0; pointer-events: none; }

        @media (max-width: 400px) {
          .calendar-container { padding: 10px; }
          .calendar-grid { gap: 5px; }
          .day-box { font-size: 0.8rem; border-radius: 4px; }
          .month-label { font-size: 1rem; }
        }
      `}</style>
      
      <h2 style={{ color: '#fbbf24', marginTop: '20px' }}>{t.title}</h2>
      
      <div className="calendar-container">
        <div className="calendar-header">
          <button className="nav-btn" onClick={() => changeMonth(-1)}>{t.prev}</button>
          <span className="month-label">
            {currentDate.toLocaleString(lang, { month: 'long', year: 'numeric' })}
          </span>
          <button className="nav-btn" onClick={() => changeMonth(1)}>{t.next}</button>
        </div>
        
        <div className="calendar-grid">
          {/* Weekday Labels */}
          {(lang === 'en' 
            ? ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] 
            : ['أحد', 'إثن', 'ثلا', 'أرب', 'خميس', 'جمعة', 'سبت']
          ).map(d => (
            <div key={d} style={{ color: '#64748b', fontSize: '0.7rem', paddingBottom: '5px' }}>{d}</div>
          ))}

          {/* Empty boxes for start of month */}
          {Array(firstDayOfMonth).fill(null).map((_, i) => (
            <div key={`empty-${i}`} className="empty" />
          ))}

          {/* Logic for Active and Disabled days */}
          {days.map(d => {
            const cellDate = new Date(year, month, d);
            // Check if day is within the 3-day window
            const isSelectable = cellDate >= twoDaysAgo && cellDate <= today;

            return (
              <div 
                key={d} 
                className={`day-box ${!isSelectable ? 'disabled' : ''}`} 
                onClick={() => isSelectable && handleDateClick(d)}
              >
                {d}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;