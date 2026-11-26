const BREAKDOWN_FIELDS = [
  ['keyword_match', 'Keyword Match', 25],
  ['skills_alignment', 'Skills Alignment', 20],
  ['experience_relevance', 'Experience Relevance', 20],
  ['education_certifications', 'Education & Certifications', 10],
  ['achievements_impact', 'Achievements & Impact', 10],
  ['ats_formatting', 'ATS Formatting', 10],
  ['role_alignment', 'Role Alignment', 5],
];

export default function Results({ analysis, onDownloadPdf }) {
  const score = Math.min(100, Math.max(0, Math.round(analysis.ats_score)));
  const scoreDeg = (score / 100) * 360;
  const breakdown = analysis.score_breakdown || {};
  const keywords = analysis.keyword_analysis || {};
  const experience = analysis.experience_match;
  const recommendation = analysis.recommendation;
  const missingList = keywords.missing?.length ? keywords.missing : analysis.missing_keywords || [];

  return (
    <section className="panel-wrap">
      <div className="results-header">
        <h2>Detailed Review</h2>
        <button className="keycap-btn small-btn" onClick={onDownloadPdf}>
          Download PDF Report
        </button>
      </div>

      <div className="glass-card score-box">
        <div className="score-ring" style={{ '--score-deg': `${scoreDeg}deg` }}>
          <span className="score-number">{score}</span>
          <span className="score-label">/ 100</span>
        </div>
        <div className="score-details">
          {recommendation?.verdict && (
            <span className="verdict-badge">{recommendation.verdict}</span>
          )}
          <p className="summary-text">{analysis.summary}</p>
          {recommendation?.priority_action && (
            <p className="priority-box">
              <strong>Priority Action:</strong> {recommendation.priority_action}
            </p>
          )}
        </div>
      </div>

      {analysis.score_breakdown && (
        <div className="glass-card section-gap">
          <h3>Score Breakdown</h3>
          <div className="breakdown-list">
            {BREAKDOWN_FIELDS.map(([key, label, max]) => {
              const value = Math.min(max, Math.max(0, Math.round(Number(breakdown[key]) || 0)));
              const pct = (value / max) * 100;
              return (
                <div key={key} className="breakdown-row">
                  <div className="breakdown-top">
                    <span>{label}</span>
                    <span className="mono-value">
                      {value} / {max}
                    </span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {experience && (
        <div className="glass-card section-gap">
          <h3>Experience Alignment</h3>
          <div className="exp-grid">
            <div>
              <span className="meta-label">Required</span>
              <p className="meta-text">{experience.required_experience}</p>
            </div>
            <div>
              <span className="meta-label">Candidate</span>
              <p className="meta-text">{experience.candidate_experience}</p>
            </div>
            <div>
              <span className="meta-label">Assessment</span>
              <p className="meta-text">{experience.assessment}</p>
            </div>
          </div>
        </div>
      )}

      <div className="results-grid">
        <div className="glass-card">
          <h3>Strengths</h3>
          <ul className="result-list">
            {(analysis.strengths || []).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="glass-card">
          <h3>Recommended Improvements</h3>
          <ul className="result-list">
            {(analysis.improvements || []).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="glass-card">
        <h3>Keyword Analysis</h3>
        {keywords.matched?.length > 0 && (
          <div className="keyword-group">
            <span className="meta-label">Matched</span>
            <div className="keyword-list">
              {keywords.matched.map((word, i) => (
                <span key={i} className="keyword-chip matched">
                  {word}
                </span>
              ))}
            </div>
          </div>
        )}

        {keywords.partially_matched?.length > 0 && (
          <div className="keyword-group">
            <span className="meta-label">Partially Matched</span>
            <div className="keyword-list">
              {keywords.partially_matched.map((word, i) => (
                <span key={i} className="keyword-chip partial">
                  {word}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="keyword-group">
          <span className="meta-label">Missing</span>
          {missingList.length > 0 ? (
            <div className="keyword-list">
              {missingList.map((word, i) => (
                <span key={i} className="keyword-chip">
                  {word}
                </span>
              ))}
            </div>
          ) : (
            <p className="meta-text">None detected.</p>
          )}
        </div>
      </div>
    </section>
  );
}
