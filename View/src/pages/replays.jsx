import { useSearchParams } from "react-router-dom";

function ReplaysPage({ lang }) {
  const [searchParams] = useSearchParams();
  const date = searchParams.get("date"); // e.g., 2026-03-04
  const slot = searchParams.get("slot"); // e.g., 23:00:00-00:00:00

  const texts = {
    ar: { title: "إعادة المباراة", cam: "كاميرا", mapTitle: "توزيع الكاميرات في الملعب" },
    en: { title: "Match Replay", cam: "Camera", mapTitle: "Camera Positions Map" }
  };
  const t = texts[lang];

  // Camera 1 is now the only active one
  const cameraMap = { 1: 1601 };
const downloadReplay = (camNum) => {
  const camId = cameraMap[camNum];
  if (!camId) return;
  if (!date || !slot) return alert("Missing date or slot");

  const safeSlot = slot.replace(/:/g, "-");
  const fileName = `cam${camId}-${date}-${safeSlot}-part1.mp4`;
  const url = `https://ummahacademy.ly/recordings/${fileName}`;
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
};

  return (
    <div className="replays-page">
      <style>{`
        .replays-page { padding: 40px 5%; text-align: center; color: white; font-family: sans-serif; }
        .info-header { margin-bottom: 30px; }
        .field-map { 
          width: 100%; max-width: 600px; height: 350px; background: #064e3b; 
          margin: 20px auto; border: 4px solid white; position: relative; border-radius: 10px;
          box-shadow: 0 0 20px rgba(0,0,0,0.5);
        }
        .center-line { position: absolute; left: 50%; top: 0; bottom: 0; width: 2px; background: white; }
        .center-circle { 
          position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); 
          width: 80px; height: 80px; border: 2px solid white; border-radius: 50%; 
        }
        .cam-spot {
          position: absolute; background: #fbbf24; color: #020617; 
          width: 30px; height: 30px; border-radius: 50%; font-weight: bold;
          display: flex; align-items: center; justify-content: center; border: 2px solid black;
          cursor: pointer;
        }
        /* Camera 1 moved to the bottom center (old Cam 3 spot) */
        .cam1 { bottom: 10px; left: 50%; transform: translateX(-50%); }
        
        /* Styling for disabled states */
        .disabled {
          background: #475569 !important;
          border-color: #1e293b !important;
          color: #94a3b8 !important;
          cursor: not-allowed !important;
          opacity: 0.6;
        }

        .links-container { display: flex; flex-direction: column; gap: 15px; max-width: 400px; margin: 30px auto; }
        .cam-link { 
          background: #0f172a; padding: 15px; border-radius: 8px; border: 1px solid #fbbf24;
          color: #fbbf24; text-decoration: none; font-weight: bold; transition: 0.3s;
          cursor: pointer;
        }
        .cam-link:hover:not(.disabled) { background: #fbbf24; color: #020617; }
      `}</style>

      <div className="info-header">
        <h1 style={{color: '#fbbf24'}}>{t.title}</h1>
        <p>{date} | {slot}</p>
      </div>

      <h3>{t.mapTitle}</h3>
      <div className="field-map">
        <div className="center-line"></div>
        <div className="center-circle"></div>
        
        {/* Only Cam 1 is active and positioned at the bottom center */}
        <div className="cam-spot cam1" onClick={() => downloadReplay(1)}>1</div>
        
        {/* Visual placeholders for disabled cameras (optional, kept for layout context) */}
        <div className="cam-spot disabled" style={{top: '10px', left: '10px'}}>2</div>
        <div className="cam-spot disabled" style={{top: '10px', right: '10px'}}>3</div>
      </div>

      <div className="links-container">
        <button className="cam-link" onClick={() => downloadReplay(1)}>🎥 {t.cam} 1</button>
        <button className="cam-link disabled" disabled>🎥 {t.cam} 2 ({lang === 'ar' ? 'غير متاح' : 'Unavailable'})</button>
        <button className="cam-link disabled" disabled>🎥 {t.cam} 3 ({lang === 'ar' ? 'غير متاح' : 'Unavailable'})</button>
      </div>
    </div>
  );
}

export default ReplaysPage;