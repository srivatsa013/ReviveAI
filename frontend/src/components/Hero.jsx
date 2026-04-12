import '../App.css';

function Hero({ onGetStarted }) {
  return (
    <section className="hero">
      <div className="particle-bg sparkle" />
      <div className="glow" />

      <div className="hero-content">
        <div className="hero-left">
          <div className="thumbnail">
            <img src="/images/hero-image.jpg" alt="Restored photo" />
          </div>
          <p>
            ReviveAI uses next-generation neural networks to breathe life into
            your old, damaged, or blurry photos. Experience cinematic clarity
            in seconds.
          </p>
          <button className="get-started-btn" onClick={onGetStarted}>
            Get Started →
          </button>
        </div>

        <div className="hero-right">
          <h1 className="hero-headline">
            Restore your<br />
            <span className="accent">memories.</span><br />
            Revive every<br />
            detail.
          </h1>
        </div>
      </div>
    </section>
  );
}

export default Hero;