import '../App.css';

const cards = [
  {
    icon: '✨',
    tag: 'Completed',
    title: 'Sharpening',
    desc: 'Recover lost details and eliminate motion blur instantly.',
  },
  {
    icon: '🩹',
    tag: 'Completed',
    title: 'Scratch Removal',
    desc: 'Automatically patch physical damage, dust, and fold lines.',
  },
  {
    icon: '🔍',
    tag: 'Completed',
    title: 'Deblurring',
    desc: 'Intelligent focus correction for out-of-focus snapshots.',
  },
  {
    icon: '🎨',
    tag: 'Coming Soon',
    title: 'Colorization',
    desc: 'Transform B&W history into vibrant, natural-looking reality.',
  },
];

function Features() {
  return (
    <section className="features" id="features">
      <div className="features-header">
        <h2>With ReviveAI, your photos work for you...</h2>
        <div>
          <p>
            Advanced AI models trained on millions of historical archives to
            ensure pixel-perfect accuracy.
          </p>
          <a href="#showcase" className="see-showcase-btn">
            See Showcase →
          </a>
        </div>
      </div>

      <div className="features-grid">
        {cards.map((c) => (
          <div key={c.title} className="feature-card">
            <div className="feature-icon">{c.icon}</div>
            <div className="feature-tag">{c.tag}</div>
            <h3>{c.title}</h3>
            <p>{c.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;