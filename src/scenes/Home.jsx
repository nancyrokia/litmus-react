import { useNavigate } from "react-router-dom";
import "./Home.css";


export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-root">

      {/* CHEM IONS */}
      <div className="ion h ion1">H⁺</div>
      <div className="ion oh ion2">OH⁻</div>
      <div className="ion h ion3">H⁺</div>
      <div className="ion oh ion4">OH⁻</div>

      {/* BUBBLES */}
      <div className="bubble" style={{ left: "15%", animationDelay: "0s" }} />
      <div className="bubble" style={{ left: "30%", animationDelay: "2s" }} />
      <div className="bubble" style={{ left: "50%", animationDelay: "4s" }} />
      <div className="bubble" style={{ left: "70%", animationDelay: "1s" }} />

      {/* MAIN CARD */}
      <div className="card">
        <h1>🧪 CEMASTEA Virtual Chemistry Lab</h1>

        <p className="subtitle">
          Acids & Bases using Red Cabbage Indicator
        </p>

        <p className="description">
          Step into a futuristic virtual laboratory where you prepare a natural
          indicator, test acidic and basic substances, observe colour changes,
          and scientifically classify solutions — safely and interactively.
        </p>

        <div className="litmus"></div>

        <button onClick={() => navigate("/scene3")}>
          ▶ Start Experiment
        </button>

        <div className="note">
          Interactive • Safe • Curriculum-Aligned
        </div>
      </div>

    </div>
  );
}
