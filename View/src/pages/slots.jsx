import { useNavigate, useSearchParams } from "react-router-dom";

function SlotsPage({ lang }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const date = searchParams.get("date");

  const texts = {
    ar: { title: "الفترات الزمنية المتاحة لليوم:", suffix: "حدد موعداً" },
    en: { title: "Available slots for:", suffix: "Select a slot" }
  };
  const t = texts[lang];

  // Generate slots from 05:00 to 00:00 (19 slots total)
  const startHour = 17;
  const endHour = 24; 
  const slots = Array.from({ length: endHour - startHour }, (_, i) => {
    const currentHour = i + startHour;
    const nextHour = currentHour + 1;

const start = `${String(currentHour).padStart(2, "0")}:00:00`;
const end = nextHour === 24 ? "00:00:00" : `${String(nextHour).padStart(2, "0")}:00:00`;
return `${start}-${end}`;
    
    return `${start} - ${end}`;
  });

  return (
    <div className="slots-page">
      <style>{`
        .slots-page { padding: 40px 5%; text-align: center; color: white; direction: ${lang === 'ar' ? 'rtl' : 'ltr'}; font-family: sans-serif; }
        .slots-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px; max-width: 1000px; margin: 40px auto; }
        .slot-card { background: #0f172a; border: 1px solid rgba(251, 191, 36, 0.3); padding: 20px; border-radius: 8px; cursor: pointer; transition: 0.3s; }
        .slot-card:hover { border-color: #fbbf24; background: #fbbf24; color: #020617; transform: translateY(-3px); }
        .date-badge { background: #fbbf24; color: #020617; padding: 5px 15px; border-radius: 20px; font-weight: bold; }
      `}</style>

      <h2>{t.title} <span className="date-badge">{date}</span></h2>
      
      <div className="slots-grid">
        {slots.map((slot, index) => (
          <div key={index} className="slot-card" onClick={() => navigate(`/replays?date=${date}&slot=${slot}`)}>
            {slot}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SlotsPage;