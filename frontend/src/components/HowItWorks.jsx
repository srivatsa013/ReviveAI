import { useState } from 'react';
import '../App.css';

const steps = [
  {
    title: 'Upload Your Image',
    desc: 'Drag and drop any old photo, even if it\'s heavily damaged.',
  },
  {
    title: 'Select Restoration Type',
    desc: 'Choose between sharpening, coloring, or full repair.',
  },
  {
    title: 'AI Processing',
    desc: 'Our neural engine processes your photo in under 10 seconds.',
  },
];

function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="how-it-works" id="how-it-works">
      <div className="how-it-works-content">

        <div>
          <h2>From degraded<br />to stunning.</h2>
          <div className="steps">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`step ${activeStep === i ? 'active' : 'inactive'}`}
                onClick={() => setActiveStep(i)}
              >
                <div className="step-number">0{i + 1}</div>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="before-after-card">
          <div className="side before-side">
            <img src="/images/before.png" alt="Before restoration" />
          </div>
          <div className="side">
            <img src="/images/after.png" alt="After restoration" />
          </div>
          <div className="before-after-label">BEFORE / AFTER</div>
        </div>

      </div>
    </section>
  );
}

export default HowItWorks;