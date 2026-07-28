const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini AI Client if API key is provided
const getGeminiModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("⚠️ GEMINI_API_KEY is not set in environment variables. Falling back to intelligent rule-based responses.");
    return null;
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
};

/**
 * Generate AI Match Explanation and Action Plan
 */
const generateAIRecommendation = async (studentProfile, scholarship, ruleMatch) => {
  try {
    const model = getGeminiModel();
    if (!model) {
      return {
        aiSummary: `You have a ${ruleMatch.matchScore}% match for ${scholarship.title}.`,
        actionPlan: "1. Prepare required certificates. 2. Verify income & CGPA documents. 3. Submit application on official portal before deadline.",
      };
    }

    const prompt = `
Act as an expert AI Scholarship Counselor for Indian students.
Analyze this student profile against the scholarship criteria and provide a brief personalized summary and 3-step action plan.

Student Profile:
- Name: ${studentProfile.name || "Student"}
- CGPA: ${studentProfile.cgpa || "N/A"}
- Branch/Degree: ${studentProfile.degree || ""} ${studentProfile.branch || ""}
- Family Income: ₹${studentProfile.familyIncome || "N/A"}
- State: ${studentProfile.state || "N/A"}
- Category: ${studentProfile.category || "General"}

Scholarship Scheme:
- Title: ${scholarship.title}
- Provider: ${scholarship.provider}
- Eligible Criteria: ${scholarship.eligibility}
- Amount: ₹${scholarship.amount}
- Rule Match Score: ${ruleMatch.matchScore}%

Return JSON strictly in this format:
{
  "aiSummary": "2 short sentences explaining why the student matches or how to improve.",
  "actionPlan": "Numbered 3-step application guidance."
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    if (jsonStart !== -1 && jsonEnd !== -1) {
      return JSON.parse(text.substring(jsonStart, jsonEnd + 1));
    }
  } catch (err) {
    console.error("Gemini AI API Error:", err.message);
  }

  return {
    aiSummary: `Matched with ${ruleMatch.matchScore}% calculated eligibility based on profile criteria.`,
    actionPlan: `1. Keep marksheets and income certificate ready.\n2. Apply via ${scholarship.applyLink}\n3. Complete submission prior to ${new Date(scholarship.deadline).toLocaleDateString()}`,
  };
};

/**
 * AI Chatbot Response Generator for Student Inquiries
 */
const chatWithAI = async (userMessage, contextData = {}) => {
  try {
    const model = getGeminiModel();
    if (!model) {
      return {
        reply: `Here is guidance regarding your request: For official government scholarships in India, register on the National Scholarship Portal (scholarships.gov.in) or state ePASS portals. Always ensure your income certificate, Aadhaar, and caste certificates are updated!`,
      };
    }

    const prompt = `
You are ScholarMatch AI, an empathetic and highly knowledgeable AI Assistant for Indian Government Schemes and Scholarships.
User Query: "${userMessage}"

Relevant Context / Profile Data: ${JSON.stringify(contextData)}

Provide a clear, helpful, accurate response (under 200 words) answering eligibility, required documents, deadlines, or application procedures in bullet points where appropriate.
`;

    const result = await model.generateContent(prompt);
    return { reply: result.response.text() };
  } catch (err) {
    console.error("Gemini Chat Error:", err.message);
    return {
      reply: "I am currently experiencing high traffic. Generally, keep your Aadhaar card, income certificate, bank account details, and last semester marksheets ready when applying for government scholarships!",
    };
  }
};

module.exports = {
  generateAIRecommendation,
  chatWithAI,
};
