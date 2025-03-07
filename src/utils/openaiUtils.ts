
import { toast } from "sonner";

// Add a flag to localStorage to track if API key has been validated
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
};

export const clearApiKey = (): void => {
  localStorage.removeItem("openai_api_key");
  localStorage.removeItem("openai_api_key_validated");
};

// Set a flag when API key is validated
export const setApiKeyValidated = (isValid: boolean): void => {
  localStorage.setItem("openai_api_key_validated", isValid ? "true" : "false");
};

// Check if API key has been validated before
export const isApiKeyValidated = (): boolean => {
  return localStorage.getItem("openai_api_key_validated") === "true";
};

export const validateApiKey = async (): Promise<boolean> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    return false;
  }

  try {
    // Make a lightweight request to validate the API key
    const response = await fetch("https://api.openai.com/v1/models", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`
      }
    });

    const isValid = response.ok;
    
    // Store validation result
    setApiKeyValidated(isValid);
    
    return isValid;
  } catch (error) {
    console.error("Error validating API key:", error);
    setApiKeyValidated(false);
    return false;
  }
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
