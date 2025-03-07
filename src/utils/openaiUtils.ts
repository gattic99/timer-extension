
import { toast } from "sonner";

// Store API key in localStorage for demo purposes
// In production, you should use a backend to handle API calls
export const getApiKey = (): string | null => {
  return localStorage.getItem("openai_api_key");
};

export const setApiKey = (key: string): void => {
  localStorage.setItem("openai_api_key", key);
};

export const clearApiKey = (): void => {
  localStorage.removeItem("openai_api_key");
};

export const getAIResponse = async (message: string): Promise<string> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error("API key not found");
  }

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
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to get response from OpenAI");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching AI response:", error);
    toast.error("Failed to get AI response. Please check your API key and try again.");
    throw error;
  }
};
