import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = "AIzaSyBH0KEa_eAf9HMH2XVvtdT2g_clqP4i7qs";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash", // Supports image + text
});

export async function runWithImage(base64Image, scenario) {
  try {
    const mimeType = "image/jpeg"; // or "image/png"
    const prompt = `
    You are an emergency response assistant.
    
    Analyze the provided image and determine if it depicts an emergency, a warning situation, or is inappropriate (not a valid incident or crime, or a useless image like a cartoon).
    
    Based on your analysis, return a JSON object.
    
    If the image depicts an EMERGENCY:
    {
      "scenario": "emergency",
      "incidentType": "short summary",
      "reportType": "e.g. fire, accident, medical emergency",
      "location": "if known or inferred",
      "report": "a brief description of the emergency situation"
    }
    
    If the image depicts a WARNING situation:
    {
      "scenario": "warning",
      "incidentType": "short summary",
      "reportType": "e.g. hazard, potential danger, suspicious activity",
    
      "report": "a brief description of the potential danger or suspicious activity in 40-50 words"
    }
    
    If the image is INAPPROPRIATE (not a valid incident, crime, or is a useless image):
    {
      "scenario": "inappropriate",
      "reason": "brief explanation of why the image is inappropriate"
    }
    
    Only respond with valid JSON, no extra text. Be very strict in identifying inappropriate content.
    `;

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType,
                data: base64Image,
              },
            },
          ],
        },
      ],
    });

    const responseText = await result.response.text();
    const cleaned = responseText.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Gemini AI Error:", err);
    throw err;
  }
}