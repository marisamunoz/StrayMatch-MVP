import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
});

// Type for chat messages
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Send message to OpenAI and get response
export async function sendChatMessage(messages: ChatMessage[]): Promise<string> {
  const systemPrompt = `You are the StrayMatch AI Assistant. Your role is to help people who have found stray animals.

YOUR RESPONSIBILITIES:
1. Assess the situation (Is the animal safe? Injured? Dangerous?)
2. Provide immediate safety guidance
3. Collect information about the animal (species, size, location, health)
4. Guide them to report the animal if appropriate
5. Reassure them that help is coming

SAFETY RULES:
- ALWAYS prioritize human and animal safety
- For medical emergencies, immediately direct to veterinarian or animal control
- NEVER diagnose medical conditions - only a vet can do that
- NEVER tell people to approach dangerous animals
- Always say "consult a licensed veterinarian" for health questions

LEGAL DISCLAIMER (mention when relevant):
- StrayMatch is a matching platform only
- We do not provide veterinary services
- We assume no liability
- Users should consult professionals

RESPONSE STYLE:
- Calm and reassuring
- Concise (mobile users have short attention)
- Action-oriented (give clear next steps)
- Empathetic but professional`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    return response.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
  } catch (error: any) {
    console.error('OpenAI Error:', error);
    throw new Error(error.message || 'Failed to get AI response');
  }
}