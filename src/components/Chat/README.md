
# AI Chat Integration

This component implements a ChatGPT-like interface for your application. Currently, it's using a simulated response, but here's how to connect it to the OpenAI API:

## Connecting to OpenAI API

1. Sign up for an API key at [OpenAI's platform](https://platform.openai.com/)
2. Create a new file `src/utils/openaiUtils.ts` with your API implementation:

```typescript
// Example implementation
export async function getAIResponse(message: string) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY || 'your-api-key-here'}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini', // or any other model you want to use
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: message }
      ],
      max_tokens: 500,
      temperature: 0.7
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
}
```

3. Update the `handleSubmit` function in `ChatInterface.tsx` to use this function:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!input.trim()) return;

  const userMessage = {
    role: "user",
    content: input.trim(),
    timestamp: new Date(),
  };

  setMessages((prev) => [...prev, userMessage]);
  setInput("");
  setIsLoading(true);

  try {
    const aiContent = await getAIResponse(userMessage.content);
    
    setMessages((prev) => [
      ...prev, 
      {
        role: "assistant",
        content: aiContent,
        timestamp: new Date(),
      }
    ]);
  } catch (error) {
    console.error("Error fetching AI response:", error);
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again later.",
        timestamp: new Date(),
      },
    ]);
  } finally {
    setIsLoading(false);
  }
};
```

## Security Considerations

For security reasons, you should never expose your API key directly in client-side code. In a production environment:

1. Use environment variables to store your API key
2. Create a backend API endpoint that proxies requests to OpenAI
3. Use Supabase Edge Functions or similar to securely handle API requests

## Customization

You can customize the system prompt to give the AI assistant different personalities or capabilities by modifying the system message in the API request.
