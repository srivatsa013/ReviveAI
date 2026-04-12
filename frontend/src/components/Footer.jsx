import '../App.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">

        <div className="footer-brand">
          <div className="footer-logo">
            <span className="bolt">⚡</span> ReviveAI
          </div>
          <p>
            The world's leading AI platform for high-fidelity photo restoration
            and historical preservation. Bringing memories back to life.
          </p>
        </div>

        <div className="footer-section">
          <h4>Product</h4>
          <ul>
            <li><a href="#features">Features</a></li>
            <li><a href="#showcase">Showcase</a></li>
            <li><a href="#upload">Try It</a></li>
            <li>
              <a href="https://github.com/srivatsa013/ReviveAI" target="_blank" rel="noreferrer">
                GitHub
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Tech Stack</h4>
          <ul>
            <li><a href="https://www.tensorflow.org/" target="_blank" rel="noreferrer">TensorFlow</a></li>
            <li><a href="https://opencv.org/" target="_blank" rel="noreferrer">OpenCV</a></li>
            <li><a href="https://huggingface.co/" target="_blank" rel="noreferrer">Hugging Face</a></li>
            <li><a href="#">Flask + React</a></li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2025 ReviveAI. MIT License.</p>
        <p>Made with 💗 at ISTE-VIT</p>
      </div>
    </footer>
  );
}

export default Footer;