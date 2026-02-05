import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Scene3.css";
import RoundBottomFlask3D from "../components/three/RoundBottomFlask3D";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const solutionData = {
  lemon: { name: "Lemon Juice", type: "acid", color: "#fde68a" },
  vinegar: { name: "Vinegar", type: "acid", color: "#cbd5e1" },
  hcl: { name: "Hydrochloric Acid (HCl)", type: "acid", color: "#cbd5e1" },
  soap: { name: "Soap Solution", type: "base", color: "#bfdbfe" },
  naoh: { name: "Sodium Hydroxide (NaOH)", type: "base", color: "#cbd5e1" },
  baking: { name: "Baking Soda", type: "base", color: "#cbd5e1" },
  water: { name: "Water", type: "neutral", color: "#cbd5e1" },
  salt: { name: "Salt Solution", type: "neutral", color: "#cbd5e1" }
};


export default function Scene3() {
  const navigate = useNavigate();


  const [rack, setRack] = useState([true, true, true, true]);
  const [tubes, setTubes] = useState([]);
  const [solution, setSolution] = useState("");
  const [dragItem, setDragItem] = useState(null);
  const [pouring, setPouring] = useState(false);
  const [trash, setTrash] = useState([]);
  const [activeLitmusId, setActiveLitmusId] = useState(null);
  const [observationText, setObservationText] = useState("");
  const [studentGuess, setStudentGuess] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
const [litmusInput, setLitmusInput] = useState(""); // for submerged litmus colour
const [predictedNature, setPredictedNature] = useState(""); // for acid/base/neutral
const [feedbackText, setFeedbackText] = useState(""); // educational feedback


  const showObservation = (id, text) => {
  setActiveLitmusId(id);
  setObservationText(text);

  setTimeout(() => {
    setActiveLitmusId(null);
  }, 7000); // auto-close after 7 seconds
};

  const actualResult =
  tubes.length > 0 && tubes[0].solution
    ? tubes[0].solution.type
    : "";


  const [steps, setSteps] = useState({
    s1: false,
    s2: false,
    s3: false,
    s4: false
  });


  const onDragStart = item => setDragItem(item);


  /* === DRAG TUBE TO BENCH === */
  const dropTubeOnBench = () => {
    if (dragItem?.type !== "tube") return;


    setRack(r =>
      r.map((v, i) => (i === dragItem.index ? "ghost" : v))
    );


    setTubes(t => [
      ...t,
      { id: Date.now(), solution: null, fill: 0, litmus: [] }
    ]);


    setSteps(s => ({ ...s, s1: true }));
  };


  /* === POUR SOLUTION === */
  const startPour = index => {
    if (!solution) return;


    setPouring(true);
    let fill = 0;


    const interval = setInterval(() => {
      fill += 4;
      setTubes(t => {
        const copy = [...t];
        copy[index].fill = fill;
        return copy;
      });


      if (fill >= 70) {
        clearInterval(interval);
        setPouring(false);


        setTubes(t => {
          const copy = [...t];
          copy[index].solution = solutionData[solution];
          return copy;
        });


        setSteps(s => ({ ...s, s2: true }));
      }
    }, 80);
  };


const insertLitmus = (index, initialColor) => {
  const tube = tubes[index];
  if (!tube.solution || tube.litmus.length >= 2) return;


  const isBlue = initialColor === "blue";


  // Decide final color after reaction
  const finalColor =
    tube.solution.type === "acid"
      ? "#dc2626" // red
      : tube.solution.type === "base"
      ? "#2563eb" // blue
      : isBlue
      ? "#2563eb" // neutral → blue unchanged
      : "#dc2626"; // neutral → red unchanged


  const litmusId = Date.now();


  // 1️⃣ Insert litmus with ORIGINAL colour
   const newLitmus = {
  id: litmusId,
  original: isBlue ? "#2563eb" : "#dc2626",
  reacted: finalColor,
  shown: false,
  observation:
    tube.solution.type === "acid"
      ? isBlue
        ? "Blue litmus turned red"
        : "No change observed"
      : tube.solution.type === "base"
      ? isBlue
        ? "No change observed"
        : "Red litmus turned blue"
      : "No change observed"
};



  setTubes(t =>
    t.map((tb, i) =>
      i === index
        ? { ...tb, litmus: [...tb.litmus, newLitmus] }
        : tb
    )
  );


  setSteps(s => ({ ...s, s3: true }));


  // 2️⃣ Change colour AFTER delay (reaction)
  setTimeout(() => {
    setTubes(t =>
      t.map((tb, i) =>
        i === index
          ? {
              ...tb,
              litmus: tb.litmus.map(l =>
                l.id === litmusId ? { ...l, color: l.final } : l
              )
            }
          : tb
      )
    );


    setSteps(s => ({ ...s, s4: true }));
  }, 800);
};

// ------------------- NEW -----------------------
  const evaluateObservation = () => {
    // Check if any litmus is inside test tube 1
    if (!tubes[0]?.litmus?.length) {
      setFeedbackText("⚠️ No litmus paper in the solution yet.");
      return;
    }

    const litmus = tubes[0].litmus[0]; // first litmus only

    // Determine actual observed color
    const actualColor =
      litmus.reacted === "#dc2626"
        ? "red"
        : litmus.reacted === "#2563eb"
        ? "blue"
        : "no change";

    // Normalize student input
    const input = litmusInput.trim().toLowerCase();

    let feedback = "";

    if (input === actualColor) {
      feedback = `✅ Correct! The submerged part of the litmus turned ${actualColor}.`;
    } else if (
      (input === "red" && actualColor === "blue") ||
      (input === "blue" && actualColor === "red")
    ) {
      feedback =
        "❌ Almost there. Remember: blue litmus turns red in acids, and red litmus turns blue in bases.";
    } else if (
      input === "no colour" ||
      input === "no color" ||
      input === "no colour change" ||
      input === "no color change"
    ) {
      feedback = `❌ Not quite. There *was* a color change — it turned ${actualColor}.`;
    } else {
      feedback = `❌ Incorrect. The actual observed color was ${actualColor}. Try again.`;
    }

    setFeedbackText(feedback);
  };
// ------------------- END NEW -------------------


  /* === TRASH === */
  const dropInTrash = () => {
  if (dragItem?.type !== "litmus") return;


  setTubes(t =>
    t.map(tube => ({
      ...tube,
      litmus: tube.litmus.filter(l => l.id !== dragItem.id)
    }))
  );


  setTrash(tr => [...tr, dragItem]);
  setDragItem(null);
};


  const clearTrash = () => setTrash([]);


  const resetBench = () => {
    setRack([true, true, true, true]);
    setTubes([]);
    setSolution("");
    setTrash([]);
    setSteps({ s1: false, s2: false, s3: false, s4: false });
  };


  return (
    <>
      {/* HEADER */}
      <header className="top-bar">
        <h2>Scene 3 – Using Litmus Indicator</h2>
        <div className="nav-buttons">
          <button onClick={() => navigate("/")}>◀ Previous</button>
          <button onClick={() => navigate("/")}>Exit ▶</button>
        </div>
      </header>


      <div className="lab-layout">
        {/* LEFT PANEL */}
        <aside className="panel left">
          <h3>Apparatus Shelf</h3>


          <div className="card">
            <h4>Test Tube Rack</h4>


            <div className="rack-middle">
              <div className="rack-top">
                {rack.map((_, i) => (
                  <div key={i} className="hole" />
                ))}
              </div>


              <div className="tubes">
                {rack.map((v, i) => (
                  <div
                    key={i}
                    className={`rack-tube-3d ${v === "ghost" ? "ghost" : ""}`}
                    draggable={v === true}
                    onDragStart={() =>
                      v === true && onDragStart({ type: "tube", index: i })
                    }
                  />
                ))}
              </div>


              <div className="rack-bottom" />
            </div>
          </div>


          <div className="card">
  <h4>Round Bottom Flask</h4>

<div
  draggable
  onDragStart={() => {
    setPouring(true);
    onDragStart({ type: "beaker" });
  }}
  onDragEnd={() => setPouring(false)}
>

    <div className="flask-3d-wrapper">
      <Canvas camera={{ position: [0, 2.2, 4], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 8, 4]} intensity={1} />

        <RoundBottomFlask3D
          position={[0, -0.8, 0]}// ⬇ moved down
          liquidColor={solutionData[solution]?.color}
          liquidLevel={0.65}
          tilt={pouring}
        />

        <OrbitControls enableZoom={false} enableRotate={false} />
      </Canvas>
    </div>

    {/* KEEP THIS — UI LOGIC */}
    <select
      value={solution}
      onChange={e => setSolution(e.target.value)}
    >
      <option value="">Select solution</option>
      {Object.entries(solutionData).map(([k, v]) => (
        <option key={k} value={k}>{v.name}</option>
      ))}
    </select>

    {solution && (
  <div className="solution-info">
    <span
      className="solution-dot"
      style={{ background: solutionData[solution].color }}
    />
    <span className="solution-name">
      {solutionData[solution].name}
    </span>
  </div>
)}

  </div>
</div>



          <div className="card">
            <h4>Litmus Paper</h4>
            <div className="litmus-shelf">
              <div
                className="litmus-3d blue"
                draggable
                onDragStart={() =>
                  onDragStart({ type: "litmus", color: "blue" })
                }
              />
              <div
                className="litmus-3d red"
                draggable
                onDragStart={() =>
                  onDragStart({ type: "litmus", color: "red" })
                }
              />
            </div>
          </div>


                    <div className="card">
            <h4>Quick Tutorial</h4>
            <iframe
              src="https://www.youtube.com/embed/0rZkK3s2H4Y"
              title="Litmus Test"
              allowFullScreen
            />
          </div>


        </aside>


       {/* CENTER PANEL */}
<main className="panel center">
  <h3 className="bench-title">Laboratory Bench</h3>

  <div
    className="bench"
    onDragOver={e => e.preventDefault()}
    onDrop={dropTubeOnBench}
  >
    {/* === REALISTIC BENCH TEST TUBE RACK === */}
    <div className="bench-rack">
      <div className="bench-rack-side left" />

      <div className="bench-rack-middle">
        {/* TOP HOLES */}
        <div className="bench-rack-top">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="bench-hole" />
          ))}
        </div>

        {/* TEST TUBES */}
        <div className="bench-rack-tubes">
          {[0, 1, 2, 3].map(i => {
            const tube = tubes[i];
            return (
              <div key={i} className="bench-slot">
                {tube && (
                  <div
                    className="test-tube-3d"
                    onDragOver={e => e.preventDefault()}
                    onDrop={() =>
                      dragItem?.type === "beaker" && startPour(i)
                    }
                  >
                    <div className="tube-label">
                      Test Tube {i + 1}
                    </div>

                    <div
                      className="tube-liquid"
                      style={{
                        height: `${tube.fill}%`,
                        background: tube.solution?.color
                      }}
                    />

                    {tube.solution && (
                      <div className="solution-label">
                        {tube.solution.name}
                      </div>
                    )}

                    {/* LITMUS */}
                    {tube.litmus.map((l, idx) => (
                      <div
                        key={l.id}
                        className="litmus-in-tube gradual"
                        draggable
                        onDragStart={() =>
                          onDragStart({ type: "litmus", id: l.id })
                        }
                        onClick={() => {
                          if (l.shown) return;

                          setTubes(t =>
                            t.map((tb, ti) =>
                              ti === i
                                ? {
                                    ...tb,
                                    litmus: tb.litmus.map(x =>
                                      x.id === l.id
                                        ? { ...x, shown: true }
                                        : x
                                    )
                                  }
                                : tb
                            )
                          );

                          showObservation(l.id, l.observation);
                        }}
                        style={{
                          left: idx === 0 ? "38%" : "62%"
                        }}
                      >
                        <div
                          className="litmus-top"
                          style={{ background: l.original }}
                        />
                        <div
                          className="litmus-bottom"
                          style={{ background: l.reacted }}
                        />

                        {activeLitmusId === l.id && (
                          <div className="observation-popup">
                            <span>{observationText}</span>
                            <div className="popup-arrow" />
                          </div>
                        )}
                      </div>
                    ))}

                    {/* DROP ZONE */}
                    <div
                      className="tube-dropzone"
                      onDragOver={e => e.preventDefault()}
                      onDrop={() =>
                        dragItem?.type === "litmus" &&
                        insertLitmus(i, dragItem.color)
                      }
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* BOTTOM BASE */}
        <div className="bench-rack-bottom" />
      </div>

      <div className="bench-rack-side right" />
    </div>

    {/* RESET */}
    <button className="reset-btn" onClick={resetBench}>
      Reset
    </button>

    {/* TRASH */}
    <div
      className="trash-3d"
      onDragOver={e => e.preventDefault()}
      onDrop={dropInTrash}
      onClick={clearTrash}
    >
      <strong>TRASH</strong>
    </div>
  </div>
</main>

        {/* RIGHT PANEL — RESTORED */}
        <aside className="panel right">


          <div className="card">
            <h4>Animated Procedure</h4>
            <div className="animation-preview" />
              <div className="mini-tube">
             <div className="mini-liquid" />
             <div className="mini-litmus" />
          </div>


  <p className="anim-caption">
    Dip litmus paper into solution
  </p>
</div>
         
         
<div className="card">
  <h3> Expirement Procedure </h3>


  <div className="checklist">
    <label>
      <input type="checkbox" checked={steps.s1} readOnly />
      Drag test tube to lab bench
    </label>


    <label>
      <input type="checkbox" checked={steps.s2} readOnly />
      Select solution & pour
    </label>


    <label>
      <input type="checkbox" checked={steps.s3} readOnly />
      Insert litmus paper
    </label>


    <label>
      <input type="checkbox" checked={steps.s4} readOnly />
      Observe colour change
    </label>
  </div>
</div>


<div className="card">
  <h4> Observation, Data & Results</h4>


  <table className="analysis-table">
    <thead>
      <tr>
        <th>Parameter</th>
        <th>Student Input</th>
      </tr>
    </thead>


<tbody>
  <tr>
    <td>Submerged Litmus Colour</td>
    <td>
      <input
        type="text"
        placeholder="Red / Blue / No change"
        value={litmusInput}
        onChange={e => setLitmusInput(e.target.value)}
      />
      <button onClick={evaluateObservation}>Check Observation</button>
      {feedbackText && <p className="feedback">{feedbackText}</p>}
    </td>
  </tr>

  <tr>
    <td>Predicted Nature</td>
    <td>
      <select
        value={predictedNature}
        onChange={e => setPredictedNature(e.target.value)}
      >
        <option value="">Select</option>
        <option value="acid">Acid</option>
        <option value="base">Base</option>
        <option value="neutral">Neutral</option>
      </select>
    </td>
  </tr>

  <tr>
    <td>Reveal Correct Result</td>
    <td>
      <button
        className="eye-btn"
        onClick={() => setShowAnswer(!showAnswer)}
      >
        👁️ {showAnswer ? "Hide" : "Show"}
      </button>
    </td>
  </tr>

{showAnswer && (
  <tr className="answer-row">
    <td>Actual Result</td>
    <td>
      <strong>{actualResult.toUpperCase()}</strong>

      <p className="explanation">
        ❌ Incorrect answer. Litmus colour change doesn't
        match the chemical behaviour of this solution.
      </p>

      <p className="explanation">
        ✅ Correct answer is <strong>{actualResult}</strong>
        <br />
        {actualResult === "acid" &&
          "Acids turn blue litmus paper red."}
        {actualResult === "base" &&
          "Bases turn red litmus paper blue."}
        {actualResult === "neutral" &&
          "Neutral solutions do not change litmus colour."}
      </p>
    </td>
  </tr>
)}

</tbody>

  </table>
</div>
        </aside>
      </div>
    </>
  );
}
