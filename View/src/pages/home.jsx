import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const texts = {
  ar: {
    heroTitle: "أكادمية الأمة ترحب بكم",
    heroSubtitle: "اختر اليوم والساعة للحصول على إعادة مباراتك",
    aboutBtn: "عن الملعب",
    replaysBtn: "إعادات المباريات",
    trainingTitle: "تدريب الناشئين",
    trainingText: "نوفر برامج تدريب احترافية لتطوير مهارات اللاعبين الشباب تحت إشراف مدربين معتمدين.",
    bookingTitle: "حجز الملعب",
    bookingText: "يمكنك حجز الملعب بسهولة في أي وقت وإدارة مواعيدك بكل مرونة وسرعة.",
    locationTitle: "موقعنا وتواصل معنا",
    locationText: "تفضل بزيارتنا أو اتصل بنا لحجز موعدك.",
    contactLabel: "للتواصل:",
  },
  en: {
    heroTitle: "Welcome to Our Field",
    heroSubtitle: "Choose your day and hour to get your replay",
    aboutBtn: "About Field",
    replaysBtn: "Match Replays",
    trainingTitle: "Youth Training",
    trainingText: "Professional training programs to develop young players under certified coaches.",
    bookingTitle: "Field Booking",
    bookingText: "Easily book the field anytime and manage your schedule with flexibility and speed.",
    locationTitle: "Location & Contact",
    locationText: "Visit us at our premium facility or call us to book your slot.",
    contactLabel: "Contact Us:",
  }
};

function Home({ lang }) {
  const aboutRef = useRef(null);
  const navigate = useNavigate();
  const t = texts[lang];

  const scrollToAbout = () => {
    aboutRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="home">
      <style>
        {`
          .home { 
            direction: ${lang === "ar" ? "rtl" : "ltr"}; 
            width: 100%; 
            background: #020617; 
            overflow-x: hidden; 
          }
          
          /* Hero Section */
          .hero {
            position: relative;
            width: 100%;
            height: 90vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background: url('/images/field1.jpeg') center/cover no-repeat;
            color: white;
            text-align: center;
          }
          .hero::after {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(to bottom, rgba(2,6,23,0.3) 0%, rgba(2,6,23,0.8) 100%);
            z-index: 1;
          }
          .hero-content { z-index: 2; padding: 20px; max-width: 800px; }
          .hero-title { 
            font-size: clamp(2.2rem, 8vw, 4rem); 
            margin-bottom: 10px; 
            color: #fbbf24; 
            text-shadow: 2px 2px 10px rgba(0,0,0,0.9); 
          }
          .hero-subtitle {
            font-size: clamp(1rem, 3vw, 1.3rem);
            color: #e2e8f0;
            margin-bottom: 35px;
            font-weight: 400;
            text-shadow: 1px 1px 5px rgba(0,0,0,0.8);
          }

          /* Buttons */
          .hero-buttons { display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; }
          .hero-btn {
            padding: 14px 30px;
            font-size: 16px;
            font-weight: 700;
            border-radius: 8px;
            cursor: pointer;
            transition: 0.3s;
            border: 2px solid #fbbf24;
            background: transparent;
            color: #fbbf24;
          }
          .hero-btn.solid { background: #fbbf24; color: #020617; }
          .hero-btn:hover { background: #fbbf24; color: #020617; transform: translateY(-3px); box-shadow: 0 5px 15px rgba(251, 191, 36, 0.4); }

          /* Generic Full Section */
          .full-section {
            position: relative;
            width: 100%;
            min-height: 500px;
            display: flex;
            align-items: center;
            overflow: hidden;
          }
          .section-bg {
            position: absolute;
            inset: 0;
            background-size: cover;
            background-position: center;
            transition: transform 8s ease-out;
          }
          .full-section:hover .section-bg { transform: scale(1.05); }

          .gold-overlay {
            position: absolute;
            inset: 0;
            background: ${lang === 'ar' 
              ? 'linear-gradient(to left, rgba(2,6,23,0.9) 20%, rgba(2,6,23,0.3) 80%)' 
              : 'linear-gradient(to right, rgba(2,6,23,0.9) 20%, rgba(2,6,23,0.3) 80%)'};
            z-index: 1;
          }

          .section-content {
            position: relative;
            z-index: 2;
            max-width: 1280px;
            margin: 0 auto;
            width: 100%;
            padding: 60px 5%;
          }
          .content-box { max-width: 550px; }
          .section-title { 
            font-size: clamp(1.8rem, 5vw, 2.8rem); 
            color: #fbbf24; 
            margin-bottom: 20px; 
          }
          .section-text { 
            font-size: clamp(1.1rem, 2vw, 1.25rem); 
            line-height: 1.7; 
            color: #ffffff; 
            text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
          }

          /* Location & Contact Combined Grid */
          .location-section {
            padding: 80px 5%;
            background: #020617;
            text-align: center;
          }
          .contact-grid {
            display: grid;
            grid-template-columns: 1fr 350px;
            gap: 30px;
            max-width: 1200px;
            margin: 40px auto 0;
            align-items: start;
          }
          .map-container {
            width: 100%;
            height: 400px;
            border: 2px solid #fbbf24;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 0 20px rgba(251, 191, 36, 0.2);
          }
          .map-container iframe { width: 100%; height: 100%; border: none; filter: grayscale(1) invert(0.9); }

          .contact-info {
            background: rgba(251, 191, 36, 0.05);
            border: 1px solid rgba(251, 191, 36, 0.3);
            border-radius: 12px;
            padding: 40px 20px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            height: 100%;
            text-align: center;
          }
          .contact-item {
            margin: 15px 0;
            color: #fbbf24;
            font-size: 1.5rem;
            font-weight: 700;
            text-decoration: none;
            transition: 0.3s;
          }
          .contact-item:hover { transform: scale(1.05); color: white; }
          .contact-label { color: #e2e8f0; font-size: 1rem; margin-bottom: 10px; opacity: 0.8; }

          /* MOBILE RESPONSIVENESS */
          @media(max-width: 992px) {
            .contact-grid { grid-template-columns: 1fr; }
            .contact-info { height: auto; padding: 30px; }
          }
          @media(max-width: 768px) {
            .hero { height: 75vh; }
            .section-content { text-align: center; }
            .content-box { max-width: 100%; }
            .gold-overlay { background: rgba(2,6,23,0.6); }
            .map-container { height: 300px; }
          }
        `}
      </style>

      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">{t.heroTitle}</h1>
          <p className="hero-subtitle">{t.heroSubtitle}</p>
          <div className="hero-buttons">
            <button className="hero-btn" onClick={scrollToAbout}>
              {t.aboutBtn}
            </button>
            <button className="hero-btn solid" onClick={() => navigate("/calendar")}>
              {t.replaysBtn}
            </button>
          </div>
        </div>
      </section>

      {/* ================= ABOUT SECTIONS ================= */}
      <div ref={aboutRef}>
        <section className="full-section">
          <div className="section-bg" style={{ backgroundImage: "url('/images/team.jpg')" }}></div>
          <div className="gold-overlay"></div>
          <div className="section-content">
            <div className="content-box">
              <h3 className="section-title">{t.trainingTitle}</h3>
              <p className="section-text">{t.trainingText}</p>
            </div>
          </div>
        </section>

        <section className="full-section" style={{ justifyContent: lang === 'ar' ? 'flex-start' : 'flex-end' }}>
          <div className="section-bg" style={{ backgroundImage: "url('/images/field1.jpeg')" }}></div>
          <div className="gold-overlay" style={{ 
            background: lang === 'ar' 
            ? 'linear-gradient(to right, rgba(2,6,23,0.9) 20%, rgba(2,6,23,0.3) 80%)' 
            : 'linear-gradient(to left, rgba(2,6,23,0.9) 20%, rgba(2,6,23,0.3) 80%)' 
          }}></div>
          <div className="section-content" style={{ display: 'flex', justifyContent: lang === 'ar' ? 'flex-start' : 'flex-end' }}>
            <div className="content-box">
              <h3 className="section-title">{t.bookingTitle}</h3>
              <p className="section-text">{t.bookingText}</p>
            </div>
          </div>
        </section>
      </div>

      {/* ================= LOCATION & CONTACT SECTION ================= */}
      <section className="location-section">
        <h3 className="section-title">{t.locationTitle}</h3>
        <p className="section-text">{t.locationText}</p>
        
        <div className="contact-grid">
          <div className="map-container">
            <iframe 
              title="map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1675.3381810919832!2d13.217139314664948!3d32.88028133249117!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13a8930006f3206f%3A0x54b69180d767504b!2z2KfZg9in2K_ZitmF2YrYqSDYp9mE2KfZhdip!5e0!3m2!1sen!2sly!4v1772289864344!5m2!1sen!2sly" 
              allowFullScreen="" 
              loading="lazy"
            ></iframe>
          </div>

          <div className="contact-info">
            <span className="contact-label">{t.contactLabel}</span>
            <a href="tel:+218918776464" className="contact-item">0918776464</a>
            <a href="tel:+2180929191918" className="contact-item">0929191918</a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;