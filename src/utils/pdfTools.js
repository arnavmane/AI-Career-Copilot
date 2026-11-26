import { jsPDF } from 'jspdf';

const BREAKDOWN_LABELS = [
  ['keyword_match', 'Keyword Match', 25],
  ['skills_alignment', 'Skills Alignment', 20],
  ['experience_relevance', 'Experience Relevance', 20],
  ['education_certifications', 'Education & Certifications', 10],
  ['achievements_impact', 'Achievements & Impact', 10],
  ['ats_formatting', 'ATS Formatting', 10],
  ['role_alignment', 'Role Alignment', 5],
];

export function downloadPdfReport(analysis) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const margin = 48;
  const maxWidth = doc.internal.pageSize.getWidth() - margin * 2;
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = 54;

  const write = (text, size = 11, bold = false) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    for (const line of doc.splitTextToSize(text, maxWidth)) {
      if (y + 18 > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += size + 5;
    }
    y += 6;
  };

  const score = Math.min(100, Math.max(0, Math.round(analysis.ats_score)));
  const rec = analysis.recommendation;
  const exp = analysis.experience_match;
  const kw = analysis.keyword_analysis;

  write('AI Career Copilot - Resume Report', 18, true);
  write(`Generated on ${new Date().toLocaleDateString()}`, 10);
  write(`ATS Match Score: ${score} / 100${rec?.verdict ? ` (${rec.verdict})` : ''}`, 14, true);

  write('Summary', 13, true);
  write(analysis.summary || 'No summary provided.');
  if (rec?.priority_action) write(`Priority Action: ${rec.priority_action}`);

  if (analysis.score_breakdown) {
    write('Score Breakdown', 13, true);
    BREAKDOWN_LABELS.forEach(([key, label, max]) => {
      const value = Math.min(max, Math.max(0, Math.round(Number(analysis.score_breakdown[key]) || 0)));
      write(`${label}: ${value} / ${max}`);
    });
  }

  if (exp) {
    write('Experience Alignment', 13, true);
    write(`Required: ${exp.required_experience || '-'}`);
    write(`Candidate: ${exp.candidate_experience || '-'}`);
    write(`Assessment: ${exp.assessment || '-'}`);
  }

  write('Strengths', 13, true);
  (analysis.strengths || []).forEach((item) => write(`• ${item}`));

  write('Recommended Improvements', 13, true);
  (analysis.improvements || []).forEach((item) => write(`• ${item}`));

  write('Keyword Analysis', 13, true);
  if (kw?.matched?.length) write(`Matched: ${kw.matched.join(', ')}`);
  if (kw?.partially_matched?.length) write(`Partially Matched: ${kw.partially_matched.join(', ')}`);
  const missing = kw?.missing?.length ? kw.missing : analysis.missing_keywords || [];
  write(`Missing: ${missing.join(', ') || 'None detected.'}`);

  doc.save('ai-career-copilot-report.pdf');
}
