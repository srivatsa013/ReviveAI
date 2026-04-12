import '../App.css';

function Navbar({ onTryNow }) {
  return (
    <nav className="navbar">
      <div className="logo">
        <div className="logo-title">
          <span className="bolt">⚡</span>
          ReviveAI
        </div>
        <div className="tagline">Powered by Deep Learning</div>
      </div>

      <ul className="nav-links">
        <li><a href="#features">Features</a></li>
        <li><a href="#how-it-works">How It Works</a></li>
        <li><a href="#showcase">Showcase</a></li>
        <li><a href="#upload">Try It</a></li>
      </ul>

      <button className="try-now-btn" onClick={onTryNow}>
        Try It Now →
      </button>
    </nav>
  );
}

export default Navbar;