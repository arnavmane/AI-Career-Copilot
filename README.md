# AI Career Copilot

![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Gemini API](https://img.shields.io/badge/Google_Gemini-8E75B2?logo=googlegemini&logoColor=white)

An AI-powered resume analysis application that evaluates how well a candidate's resume matches a given job description using Google's **Gemini API**. It generates a structured ATS review with match scores, skill gap analysis, keyword identification, actionable recommendations, and a downloadable PDF report.


## Features

- **ATS Match Score & Verdict:** Displays a circular score gauge (0–100), overall evaluation summary, match verdict, and priority action recommendation.
- **7-Category Score Breakdown:** Evaluates resumes across Keyword Match (25), Skills Alignment (20), Experience Relevance (20), Education & Certifications (10), Achievements & Impact (10), ATS Formatting (10), and Role Alignment (5).
- **Experience & Keyword Analysis:** Provides side-by-side experience alignment and color-coded keyword chips for matched, partially matched, and missing keywords.
- **AI-Powered Resume Analysis:** Uses Google's Gemini API to generate structured JSON-based resume evaluations.
- **PDF Report Export:** Generates a formatted A4 resume analysis report (`ai-career-copilot-report.pdf`) using jsPDF.
- **Interactive Interface:** Allows users to submit their resume and target job description and view detailed analysis results.


## Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite 6, JavaScript |
| **AI Integration** | Google Gemini API (`generateContent`) |
| **PDF Generation** | jsPDF |
| **Styling** | CSS3, Google Fonts |
| **Development Tools** | VS Code, npm, Git |



## Getting Started 

### 1. Clone the Repository

```bash
git clone https://github.com/arnavmane/ai-career-copilot.git
cd ai-career-copilot
```

### 2. Install Dependencies

```bash
npm install
```


### 3. Configure Environment Variables

Create a `.env` file in the project root using `.env.example` as a template.

Add your Google Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Get your API key from [Google AI Studio](https://aistudio.google.com/).

### 4. Start the Development Server

```bash
npm run dev
```


The application will be available at:

```text
http://localhost:5173
```

Restart the development server whenever you modify the `.env` file.

### 5. Build for Production

```bash
npm run build
```

The optimized production bundle will be generated inside the `dist/` directory.

**Made by Arnav :)**

LinkedIn: [@arnavmane21](https://www.linkedin.com/in/arnavmane21/)  
GitHub: [@arnavmane](https://github.com/arnavmane)
