const { GoogleGenerativeAI } = require("@google/generative-ai");

const DEFAULT_MODEL = "gemini-1.5-flash";

const getGeminiModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("⚠️ GEMINI_API_KEY is not set. Falling back to a safe rule-based response.");
    return null;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: DEFAULT_MODEL });
  } catch (error) {
    console.error("Failed to initialize Gemini client:", error.message);
    return null;
  }
};

const sanitizeText = (value) => {
  if (value === null || value === undefined) return "";
  return String(value).trim();
};

const parseStructuredJson = (text) => {
  if (!text) return null;

  const cleaned = sanitizeText(text)
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    return null;
  }

  try {
    return JSON.parse(cleaned.substring(start, end + 1));
  } catch (error) {
    console.warn("Unable to parse Gemini JSON response:", error.message);
    return null;
  }
};

const normalizeArray = (value, fallback = []) => {
  if (Array.isArray(value)) {
    return value.filter((item) => sanitizeText(item)).slice(0, 6);
  }

  if (sanitizeText(value)) {
    return [sanitizeText(value)];
  }

  return fallback;
};

const buildFallbackRecommendation = (studentProfile, scholarship, ruleMatch) => {
  const summary = `You have a ${ruleMatch.matchScore}% match for ${scholarship.title}. This indicates a solid fit based on your academic and financial profile, with a few areas that may still need attention before applying.`;
  const whyQualified = ruleMatch.qualified
    ? ["Your profile appears to meet the core academic and financial criteria.", "The scholarship is likely relevant to your course, state, and category profile."]
    : ["Some eligibility factors may not be fully aligned with the scholarship requirements.", "You may need to strengthen your profile or target a more suitable scheme."];
  const whyRejected = ruleMatch.qualified
    ? ["The scholarship may still require final document verification and timely submission."]
    : ["Income, category, CGPA, or state criteria may not fully meet the scholarship threshold.", "A few mandatory documents may be missing or incomplete."];
  const roadmap = [
    "Gather all required certificates, marksheets, and income proof.",
    "Verify your course, category, and state eligibility before applying.",
    "Submit the application through the official portal before the deadline.",
  ];
  const applicationTips = [
    "Apply early to avoid last-minute portal issues.",
    "Double-check your application number and uploaded documents.",
    "Keep both soft and hard copies of all certificates ready.",
  ];

  const documents = Array.isArray(scholarship.requiredDocuments) && scholarship.requiredDocuments.length > 0
    ? scholarship.requiredDocuments
    : ["Aadhaar Card", "Income Certificate", "Marksheets/Transcripts", "Caste Certificate", "Domicile Certificate"];

  const approvalProbability = `${Math.max(20, Math.min(95, ruleMatch.matchScore + 5))}%`;

  return {
    summary,
    whyQualified,
    whyRejected,
    roadmap,
    applicationTips,
    documents,
    approvalProbability,
    aiSummary: summary,
    actionPlan: roadmap.join("\n"),
  };
};

const buildRecommendationPayload = (studentProfile, scholarship, ruleMatch, parsedJson) => {
  const fallback = buildFallbackRecommendation(studentProfile, scholarship, ruleMatch);

  const payload = {
    summary: sanitizeText(parsedJson?.summary) || fallback.summary,
    whyQualified: normalizeArray(parsedJson?.whyQualified, fallback.whyQualified),
    whyRejected: normalizeArray(parsedJson?.whyRejected, fallback.whyRejected),
    roadmap: normalizeArray(parsedJson?.roadmap, fallback.roadmap),
    applicationTips: normalizeArray(parsedJson?.applicationTips, fallback.applicationTips),
    documents: normalizeArray(parsedJson?.documents, fallback.documents),
    approvalProbability: sanitizeText(parsedJson?.approvalProbability) || fallback.approvalProbability,
  };

  return {
    ...payload,
    aiSummary: payload.summary,
    actionPlan: payload.roadmap.join("\n"),
  };
};

/**
 * Generate AI Match Explanation and Action Plan
 */
const generateAIRecommendation = async (studentProfile, scholarship, ruleMatch) => {
  try {
    const model = getGeminiModel();
    if (!model) {
      return buildFallbackRecommendation(studentProfile, scholarship, ruleMatch);
    }

    const profileName = sanitizeText(studentProfile?.name || studentProfile?.fullName || studentProfile?.full_name || "Student");
    const cgpa = sanitizeText(studentProfile?.cgpa || studentProfile?.gpa || "N/A");
    const degree = sanitizeText(studentProfile?.degree || studentProfile?.course || "");
    const branch = sanitizeText(studentProfile?.branch || "");
    const income = sanitizeText(studentProfile?.familyIncome || studentProfile?.annualIncome || studentProfile?.income || "N/A");
    const state = sanitizeText(studentProfile?.state || "N/A");
    const category = sanitizeText(studentProfile?.category || "General");

    const prompt = `
You are an expert scholarship counselor for Indian students.
Analyze the student profile against the scholarship and return strict JSON only.

Student Profile:
- Name: ${profileName}
- CGPA: ${cgpa}
- Course/Degree: ${degree} ${branch}
- Family Income: ₹${income}
- State: ${state}
- Category: ${category}

Scholarship Scheme:
- Title: ${sanitizeText(scholarship?.title || "Scholarship")}
- Provider: ${sanitizeText(scholarship?.provider || "Provider")}
- Eligibility: ${sanitizeText(scholarship?.eligibility || "")}
- Amount: ₹${sanitizeText(scholarship?.amount || "N/A")}
- Rule Match Score: ${sanitizeText(ruleMatch?.matchScore || 0)}%

Return valid JSON with this exact structure:
{
  "summary": "2-3 sentence summary of the fit",
  "whyQualified": ["reason 1", "reason 2"],
  "whyRejected": ["issue 1", "issue 2"],
  "roadmap": ["step 1", "step 2", "step 3"],
  "applicationTips": ["tip 1", "tip 2"],
  "documents": ["document 1", "document 2"],
  "approvalProbability": "High/Medium/Low or 65%"
}
Do not add markdown fences or commentary.
`;

    const result = await model.generateContent(prompt);
    const parsed = parseStructuredJson(result?.response?.text?.());

    if (parsed) {
      return buildRecommendationPayload(studentProfile, scholarship, ruleMatch, parsed);
    }
  } catch (error) {
    console.error("Gemini AI Recommendation Error:", error.message);
  }

  return buildFallbackRecommendation(studentProfile, scholarship, ruleMatch);
};

/**
 * AI Chatbot Response Generator for Student Inquiries
 */
const chatWithAI = async (userMessage, contextData = {}) => {
  try {
    const model = getGeminiModel();
    if (!model) {
      return {
        reply: "For scholarships in India, begin by checking your eligibility, collecting Aadhaar, income, caste, and mark sheet documents, and applying through the official portal before the deadline. If you want, I can help you compare schemes based on your profile.",
      };
    }

    const profileSummary = JSON.stringify(contextData || {});
    const prompt = `
You are ScholarMatch AI, an empathetic and knowledgeable assistant for Indian government schemes and scholarships.
Answer the user's question clearly and briefly in plain language.

User Query: ${sanitizeText(userMessage)}

Relevant Context: ${profileSummary}

Focus on one or more of these topics when relevant:
- Eligibility
- Required documents
- Deadlines
- Application process
- Government schemes
- Scholarships
- Career advice

Keep the response under 180 words, use short bullet points if helpful, and avoid making up official rules.
`;

    const result = await model.generateContent(prompt);
    const reply = sanitizeText(result?.response?.text?.());
    return { reply: reply || "I can help with scholarship eligibility, documents, deadlines, and application steps. Share your course, income, and state for a more tailored answer." };
  } catch (error) {
    console.error("Gemini Chat Error:", error.message);
    return {
      reply: "I am currently experiencing a temporary issue. In the meantime, keep your Aadhaar card, income certificate, bank details, and latest marksheets ready when applying for government scholarships.",
    };
  }
};

module.exports = {
  generateAIRecommendation,
  chatWithAI,
};
