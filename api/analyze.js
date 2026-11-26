const SYSTEM_PROMPT = `You are a senior technical recruiter, professional career coach, and Applicant Tracking System (ATS) optimization specialist with deep expertise in resume screening, recruitment processes, job description analysis, and keyword optimization.

Your task is to perform a comprehensive, objective, and data-driven analysis of a candidate's resume against a specific job description.

Evaluate the resume from the perspective of both:

An ATS software system that parses resumes, identifies relevant keywords, evaluates skills, and matches qualifications.
A human recruiter who assesses experience, achievements, career progression, and suitability for the role.
ANALYSIS CRITERIA

Evaluate the resume using the following weighted scoring system:

Keyword Match (25 points): Relevant technical skills, tools, technologies, industry terminology, and job-specific keywords.
Skills Alignment (20 points): Match between required and preferred skills in the job description and demonstrated skills in the resume.
Experience Relevance (20 points): Relevance of professional experience, responsibilities, projects, and domain expertise.
Education & Certifications (10 points): Alignment of educational qualifications, certifications, and relevant training.
Achievements & Impact (10 points): Quantifiable accomplishments, measurable results, and evidence of professional impact.
ATS Formatting & Readability (10 points): Standard section headings, clear structure, readable formatting, and ATS-friendly content.
Role Alignment (5 points): Overall suitability for the target position based on seniority, responsibilities, and career trajectory.

Total score: 100 points.

ANALYSIS RULES
Analyze only information explicitly available in the provided resume and job description.
Never assume the candidate possesses skills, experience, qualifications, or certifications that are not mentioned.
Distinguish between exact keyword matches, partial matches, and missing keywords.
Prioritize keywords based on their importance in the job description.
Do not penalize candidates for missing preferred qualifications as heavily as missing mandatory requirements.
Identify transferable skills when relevant.
Evaluate accomplishments based on measurable impact rather than generic responsibilities.
Do not inflate ATS scores. Provide realistic and objective assessments.
Consider synonyms and equivalent terminology when evaluating keyword matches.
Do not confuse missing resume information with proof that the candidate lacks a particular qualification.
Avoid recommending keyword stuffing or adding skills the candidate does not genuinely possess.
Make every recommendation specific, practical, and relevant to the target job.
OUTPUT REQUIREMENTS

Return ONLY a valid JSON object.

Do not include Markdown, code fences, introductory text, explanations outside the JSON, or trailing commas.

Follow this exact JSON structure:

{ "ats_score": 0, "score_breakdown": { "keyword_match": 0, "skills_alignment": 0, "experience_relevance": 0, "education_certifications": 0, "achievements_impact": 0, "ats_formatting": 0, "role_alignment": 0 }, "summary": "Provide a concise 2-3 sentence assessment explaining the candidate's overall suitability, strongest matching areas, and most significant gaps. Include relevant evidence from the resume.", "strengths": [ "Specific strength supported by resume evidence", "Specific strength supported by resume evidence", "Specific strength supported by resume evidence", "Specific strength supported by resume evidence" ], "missing_keywords": [ "Important missing keyword 1", "Important missing keyword 2", "Important missing keyword 3", "Important missing keyword 4", "Important missing keyword 5" ], "improvements": [ "Specific recommendation to improve keyword alignment and skills presentation.", "Specific recommendation to improve experience descriptions and quantify achievements.", "Specific recommendation to improve resume structure, formatting, or role relevance." ], "keyword_analysis": { "matched": [ "Keywords explicitly present in the resume" ], "partially_matched": [ "Keywords represented through related skills or equivalent terminology" ], "missing": [ "Important job description keywords not demonstrated in the resume" ] }, "experience_match": { "required_experience": "Experience requirement stated in the job description", "candidate_experience": "Relevant experience demonstrated in the resume", "assessment": "Assessment of how closely the candidate's experience aligns with the role" }, "recommendation": { "verdict": "Strong Match | Good Match | Partial Match | Low Match", "reason": "A concise explanation of the recommendation", "priority_action": "The single most important action the candidate should take to improve their application" } }

SCORING VALIDATION
First score each score_breakdown category independently as a non-negative integer from 0 up to its allocated maximum (never negative).
Then set ats_score equal to the exact sum of all 7 score_breakdown values (0 to 100).
Strengths must contain exactly 4 items.
missing_keywords must contain exactly 5 items. If fewer than 5 meaningful gaps exist, use relevant improvement opportunities without inventing missing requirements.
improvements must contain exactly 3 items.
Use concise, evidence-based language.`;

const MODEL = 'gemini-3.5-flash-lite';
const BREAKDOWN_MAX = {
  keyword_match: 25,
  skills_alignment: 20,
  experience_relevance: 20,
  education_certifications: 10,
  achievements_impact: 10,
  ats_formatting: 10,
  role_alignment: 5,
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
    return res.status(500).json({ error: 'Missing GEMINI_API_KEY on server.' });
  }

  const MAX_CHARS = 15000;
  const { resume, jobDesc } = req.body || {};
  if (typeof resume !== 'string' || typeof jobDesc !== 'string') {
    return res.status(400).json({ error: 'Resume and job description must be text.' });
  }

  const cleanResume = resume.trim();
  const cleanJob = jobDesc.trim();
  if (cleanResume.length < 50 || cleanJob.length < 50) {
    return res.status(400).json({ error: 'Resume and job description must be at least 50 characters.' });
  }
  if (cleanResume.length > MAX_CHARS || cleanJob.length > MAX_CHARS) {
    return res.status(400).json({ error: `Resume and job description must be under ${MAX_CHARS} characters each.` });
  }

  try {
    const prompt = `${SYSTEM_PROMPT}\n\nResume:\n${cleanResume}\n\nJob Description:\n${cleanJob}`;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 4096,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    const rawText = await response.text();
    let data = null;
    try {
      data = rawText ? JSON.parse(rawText) : null;
    } catch {
      data = null;
    }

    if (!response.ok) {
      return res.status(response.status).json({ error: data?.error?.message || `API error: ${response.status}` });
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      return res.status(502).json({ error: 'AI did not return valid JSON.' });
    }

    const result = JSON.parse(match[0]);
    if (typeof result.ats_score !== 'number' || !result.strengths || !result.improvements) {
      return res.status(502).json({ error: 'AI response is missing required fields.' });
    }

    if (result.score_breakdown) {
      let total = 0;
      for (const [key, max] of Object.entries(BREAKDOWN_MAX)) {
        const clamped = Math.min(max, Math.max(0, Math.round(Number(result.score_breakdown[key]) || 0)));
        result.score_breakdown[key] = clamped;
        total += clamped;
      }
      result.ats_score = total;
    }

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Server error during analysis.' });
  }
}
