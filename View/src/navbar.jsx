import { useState } from "react"; // Added useState
import { Link, useNavigate } from "react-router-dom";

const texts = {
  ar: { about: "عن الملعب", replays: "اعادات المباريات", lang: "EN" },
  en: { about: "About", replays: "Replays", lang: "ع" }
};

function Navbar({ lang, setLang }) {
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu
  const navigate = useNavigate();
  const t = texts[lang];

  const changeLang = () => {
    setLang(lang === "ar" ? "en" : "ar");
    setIsOpen(false);
  };

  const goHomeAbout = () => {
    setIsOpen(false);
    navigate("/");
    setTimeout(() => {
      const about = document.querySelector(".full-section"); 
      if (about) about.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  return (
    <nav className="navbar">
      <style>
        {`
          .navbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 5%;
            background: #020617;
            color: white;
            border-bottom: 1px solid rgba(251, 191, 36, 0.2);
            position: sticky;
            top: 0;
            z-index: 1000;
            direction: ${lang === "ar" ? "rtl" : "ltr"};
          }

          .logo-img { max-height: 50px; transition: 0.3s ease; }

          /* Desktop Links */
          .nav-links { display: flex; gap: 35px; align-items: center; }
          .nav-link { 
            color: #ffffff; 
            text-decoration: none; 
            font-size: 16px; 
            font-weight: 500;
            cursor: pointer; 
            transition: 0.3s;
          }
          .nav-link:hover { color: #fbbf24; }

          /* Hamburger Icon */
          .hamburger {
            display: none;
            flex-direction: column;
            gap: 5px;
            cursor: pointer;
            background: none;
            border: none;
          }
          .hamburger span {
            display: block;
            width: 25px;
            height: 3px;
            background: #fbbf24;
            border-radius: 2px;
            transition: 0.3s;
          }

          .lang-btn { 
            background: transparent; 
            border: 2px solid #fbbf24; 
            padding: 6px 16px; 
            border-radius: 4px; 
            cursor: pointer; 
            color: #fbbf24; 
            font-weight: bold;
          }

          /* Mobile Responsive Logic */
          @media (max-width: 768px) {
            .hamburger { display: flex; }

            .nav-links {
              position: absolute;
              top: 70px; /* Adjust based on navbar height */
              left: 0;
              right: 0;
              background: #020617;
              flex-direction: column;
              padding: 20px;
              gap: 20px;
              border-bottom: 2px solid #fbbf24;
              display: ${isOpen ? "flex" : "none"};
              text-align: center;
            }

            .nav-right { display: ${isOpen ? "block" : "none"}; margin-top: 10px; }
            
            /* If Arabic, adjust absolute positioning for alignment */
            ${lang === 'ar' ? '.nav-links { text-align: right; }' : ''}
          }
        `}
      </style>

      {/* Left: Logo */}
      <div className="nav-left">
        <Link to="/" className="logo-link" onClick={() => setIsOpen(false)}>
          <img src="/images/logo.png" alt="Logo" className="logo-img" />
        </Link>
      </div>

      {/* Hamburger Button (Visible on Mobile) */}
      <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        <span style={{ transform: isOpen ? 'rotate(45deg) translate(5px, 6px)' : '' }}></span>
        <span style={{ opacity: isOpen ? 0 : 1 }}></span>
        <span style={{ transform: isOpen ? 'rotate(-45deg) translate(5px, -7px)' : '' }}></span>
      </button>

      {/* Right: Links & Lang */}
      <div className={`nav-links ${isOpen ? "active" : ""}`}>
        <span className="nav-link" onClick={goHomeAbout}>
          {t.about}
        </span>

        <Link className="nav-link" to="/calendar" onClick={() => setIsOpen(false)}>
          {t.replays}
        </Link>

        {/* Language button moves inside the menu on mobile */}
        <div className="nav-right">
          <button className="lang-btn" onClick={changeLang}>
            {t.lang}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;