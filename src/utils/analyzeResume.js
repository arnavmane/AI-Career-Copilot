export async function analyzeResumeWithGemini(resume, jobDesc) {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resume, jobDesc }),
  });

  const rawText = await response.text();
  let data = null;
  try {
    data = rawText ? JSON.parse(rawText) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.error || `Request failed: ${response.status}`);
  }
  if (!data) {
    throw new Error('Server returned an empty or invalid response.');
  }
  return data;
}
