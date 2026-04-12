import { useRef } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import StatsBadges from './components/StatsBadges.jsx';
import Features from './components/Features.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import Showcase from './components/Showcase.jsx';
import UploadSection from './components/UploadSection.jsx';
import Footer from './components/Footer.jsx';

function App() {
  const uploadRef = useRef(null);

  const scrollToUpload = () => {
    uploadRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="App">
      <Navbar onTryNow={scrollToUpload} />
      <Hero onGetStarted={scrollToUpload} />
      <StatsBadges />
      <Features />
      <HowItWorks />
      <Showcase />
      <div ref={uploadRef}>
        <UploadSection />
      </div>
      <Footer />
    </div>
  );
}

export default App;