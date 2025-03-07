
import { toast } from "sonner";

// Static responses to use when no API key is provided
const aiResponses = [
  "I can help you stay focused and productive. Try setting a timer to work in focused intervals.",
  "Taking regular breaks is important for maintaining productivity. The Pomodoro technique suggests a 5-minute break after 25 minutes of focus.",
  "Did you know that staying hydrated can improve your cognitive function? Remember to drink water during your breaks.",
  "When feeling overwhelmed, try breaking your tasks into smaller, manageable chunks.",
  "Music without lyrics can help you maintain focus during work sessions.",
  "Setting clear goals for each focus session can help you stay on track and measure progress.",
  "If you're feeling distracted, try the 'two-minute rule' - if a task takes less than two minutes, do it immediately.",
  "Remember to stretch during your breaks. Physical movement helps refresh your mind.",
  "Multitasking can reduce productivity by up to 40%. Try focusing on one task at a time.",
  "Your workspace environment significantly impacts focus. Consider decluttering your desk for better concentration.",
  "Studies show that even brief exposure to nature can restore mental energy. Consider looking out a window during breaks.",
  "The 'flow state' is when you're fully immersed in a task. It typically occurs when the task is challenging but achievable.",
  "I'm here to support your productivity journey. Let me know if you need specific assistance!",
  "Setting boundaries with technology, like turning off notifications, can help maintain focus.",
  "Remember that productivity isn't about doing more, but about doing what matters most effectively."
];

// Add more specific responses for common questions
const specificResponses: Record<string, string> = {
  "hello": "Hello! I'm your productivity assistant. How can I help you today?",
  "hi": "Hi there! I'm here to help you stay focused and productive. What can I assist you with?",
  "how are you": "I'm functioning well and ready to help you with your productivity needs!",
  "thank you": "You're welcome! Feel free to ask if you need more assistance.",
  "thanks": "You're welcome! I'm here to help whenever you need it.",
  "what is pomodoro": "The Pomodoro Technique is a time management method that uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks. This structured approach helps improve focus and productivity.",
  "help": "I can help with productivity tips, focus techniques, or break activities. What specific aspect would you like assistance with?",
  "focus tips": "Some focus tips include: setting clear goals, eliminating distractions, using time-blocking, taking regular breaks, and ensuring you're well-rested and hydrated.",
  "break ideas": "During breaks, try: stretching, walking, deep breathing, drinking water, looking at something in the distance to rest your eyes, or doing a quick mindfulness exercise."
};

export const getApiKey = (): string | null => {
  return localStorage.getItem("openai_api_key");
};

export const setApiKey = (key: string): void => {
  // Basic validation for OpenAI API key format (starts with "sk-")
  if (!key.startsWith("sk-")) {
    toast.error("Invalid API key format. OpenAI API keys typically start with 'sk-'");
    throw new Error("Invalid API key format");
  }
  
  localStorage.setItem("openai_api_key", key);
  setApiKeyValidated(true);
};

export const clearApiKey = (): void => {
  localStorage.removeItem("openai_api_key");
  localStorage.removeItem("openai_api_key_validated");
};

export const setApiKeyValidated = (isValid: boolean): void => {
  localStorage.setItem("openai_api_key_validated", isValid ? "true" : "false");
};

export const isApiKeyValidated = (): boolean => {
  return localStorage.getItem("openai_api_key_validated") === "true";
};

export const validateApiKey = async (): Promise<boolean> => {
  const apiKey = getApiKey();
  if (!apiKey) return false;
  
  try {
    const response = await fetch("https://api.openai.com/v1/models", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`
      }
    });
    
    const isValid = response.ok;
    setApiKeyValidated(isValid);
    return isValid;
  } catch (error) {
    console.error("Error validating API key:", error);
    setApiKeyValidated(false);
    return false;
  }
};

// Find the most relevant response for a given user message
function findRelevantResponse(message: string): string {
  // Convert to lowercase for case-insensitive matching
  const lowerMessage = message.toLowerCase();
  
  // Check for exact matches in specific responses first
  for (const [key, response] of Object.entries(specificResponses)) {
    if (lowerMessage.includes(key)) {
      return response;
    }
  }
  
  // If no specific match, provide a random general response
  const randomIndex = Math.floor(Math.random() * aiResponses.length);
  return aiResponses[randomIndex];
}

export const getAIResponse = async (message: string): Promise<string> => {
  try {
    const apiKey = getApiKey();
    
    // Use local responses without requiring an API key
    if (!apiKey) {
      // Find the most relevant response
      return findRelevantResponse(message);
    }

    // If user has an API key, still allow using it for more personalized responses
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini", // Using OpenAI's latest model for best performance/cost ratio
          messages: [
            { role: "system", content: "You are a helpful assistant focused on productivity and well-being. Keep your responses concise and practical." },
            { role: "user", content: message }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        // If API response fails, fall back to local responses
        console.warn("OpenAI API error, falling back to local responses");
        return findRelevantResponse(message);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (apiError) {
      console.error("Error in OpenAI API call, using fallback response:", apiError);
      return findRelevantResponse(message);
    }
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return "Sorry, there was an error processing your request. Please try again later.";
  }
};
