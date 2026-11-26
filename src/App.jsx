import { useState } from 'react';
import Header from './components/Header.jsx';
import AnalyzerForm from './components/AnalyzerForm.jsx';
import Results from './components/Results.jsx';
import { analyzeResumeWithGemini } from './utils/analyzeResume.js';
import { downloadPdfReport } from './utils/pdfTools.js';

export default function App() {
  const [resume, setResume] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(null);

  async function handleAnalyze() {
    const cleanResume = resume.trim();
    const cleanJob = jobDesc.trim();

    if (cleanResume.length < 50 || cleanJob.length < 50) {
      setAnalysis(null);
      setError('Please enter your full resume and job description (at least 50 characters each).');
      return;
    }

    if (cleanResume.length > 15000 || cleanJob.length > 15000) {
      setAnalysis(null);
      setError('Resume and job description must be under 15,000 characters each.');
      return;
    }

    setError('');
    setAnalysis(null);
    setLoading(true);

    try {
      const result = await analyzeResumeWithGemini(cleanResume, cleanJob);
      setAnalysis(result);
    } catch (err) {
      setError(err.message || 'Analysis failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <main className="container">
        <Header />

        <AnalyzerForm
          resume={resume}
          onResumeChange={setResume}
          jobDesc={jobDesc}
          onJobDescChange={setJobDesc}
          loading={loading}
          error={error}
          onAnalyze={handleAnalyze}
        />

        {analysis && (
          <Results
            analysis={analysis}
            onDownloadPdf={() => downloadPdfReport(analysis)}
          />
        )}
      </main>
    </div>
  );
}
