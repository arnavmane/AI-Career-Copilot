export default function AnalyzerForm({
  resume,
  onResumeChange,
  jobDesc,
  onJobDescChange,
  loading,
  error,
  onAnalyze,
}) {
  return (
    <section className="panel-wrap">
      <div className="input-grid">
        <div className="glass-card">
          <div className="card-top">
            <h2>Your Resume</h2>
            <span className="mono-value">{resume.length} / 15000</span>
          </div>
          <textarea
            value={resume}
            onChange={(e) => onResumeChange(e.target.value)}
            maxLength={15000}
            placeholder="Paste your full resume text here..."
          />
        </div>

        <div className="glass-card">
          <div className="card-top">
            <h2>Job Description</h2>
            <span className="mono-value">{jobDesc.length} / 15000</span>
          </div>
          <textarea
            value={jobDesc}
            onChange={(e) => onJobDescChange(e.target.value)}
            maxLength={15000}
            placeholder="Paste the job description here..."
          />
        </div>
      </div>

      <div className="center-row">
        <button className="keycap-btn" onClick={onAnalyze} disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze Resume'}
        </button>
      </div>

      {error && <div className="error-box">{error}</div>}
    </section>
  );
}
