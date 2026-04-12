import { useState, useRef } from 'react';
import '../App.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const MODES = [
  { value: 'sharpen', label: 'Sharpen / Deblur' },
  { value: 'scratch', label: 'Scratch Removal' },
];

function UploadSection() {
  const [mode, setMode]               = useState('sharpen');
  const [inputFile, setInputFile]     = useState(null);
  const [inputPreview, setInputPreview] = useState(null);
  const [outputUrl, setOutputUrl]     = useState(null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [dragOver, setDragOver]       = useState(false);
  const fileInputRef                  = useRef(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setInputFile(file);
    setInputPreview(URL.createObjectURL(file));
    setOutputUrl(null);
    setError(null);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const onSubmit = async () => {
    if (!inputFile) return;
    setLoading(true);
    setError(null);
    setOutputUrl(null);

    try {
      const form = new FormData();
      form.append('image', inputFile);
      form.append('mode', mode);

      const res = await fetch(`${API_BASE}/restore`, { method: 'POST', body: form });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server error ${res.status}`);
      }

      const blob = await res.blob();
      setOutputUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError(err.message || 'Something went wrong. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const onDownload = () => {
    if (!outputUrl) return;
    const a = document.createElement('a');
    a.href = outputUrl;
    a.download = 'revived_image.png';
    a.click();
  };

  return (
    <section className="upload-section" id="upload">
      <h2>Ready to revive?</h2>
      <p>Drop your photo. Watch it transform in seconds.</p>

      <div className="upload-container">

        {/* Dropzone */}
        <div
          className={`dropzone ${dragOver ? 'drag-over' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
        >
          <div className="dropzone-icon">☁️</div>
          <h3>{inputFile ? inputFile.name : 'Drag & drop image here'}</h3>
          <p>{inputFile ? 'Click to change file' : 'JPG, PNG, or TIFF up to 20MB'}</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </div>

        {/* Mode + Button row */}
        <div className="upload-row">
          <div className="mode-select">
            <select value={mode} onChange={(e) => setMode(e.target.value)}>
              {MODES.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          <button
            className="revive-btn"
            onClick={onSubmit}
            disabled={!inputFile || loading}
          >
            {loading ? '⏳ Processing...' : '⚡ Revive Image'}
          </button>
        </div>

        {/* Error */}
        {error && <div className="error-message">⚠️ {error}</div>}

        {/* Results */}
        {(inputPreview || outputUrl) && (
          <div className="results">
            <div className="result-card">
              <div className="result-card-label">Original</div>
              {inputPreview && <img src={inputPreview} alt="Original" />}
            </div>
            <div className="result-card">
              <div className="result-card-label">Restored</div>
              {outputUrl ? (
                <>
                  <img src={outputUrl} alt="Restored" />
                  <a href="#" className="download-link" onClick={(e) => { e.preventDefault(); onDownload(); }}>
                    ⬇ Download PNG
                  </a>
                </>
              ) : (
                <div className="result-placeholder">
                  {loading ? '⏳ Processing...' : '🖼️ Result will appear here'}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

export default UploadSection;