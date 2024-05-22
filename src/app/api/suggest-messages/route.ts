import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
 try {
    const prompt="Create a list of three open-ended and engaging feedback formatted as a single string. Each feedback should be separated by '||'. These feedback are for an anonymous social feedback platform, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'Excellent work! || Clear explanation, thanks! || Very helpful, much appreciated'. Ensure the feedbacks are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";
   

     // Ask OpenAI for a streaming chat completion given the prompt
     const response = await openai.completions.create({
        model: 'gpt-3.5-turbo-instruct',
        max_tokens: 400,
        stream: true,
        prompt,
      });
    
   
     // Convert the response into a friendly text-stream
     const stream = OpenAIStream(response);
     // Respond with the stream
     return new StreamingTextResponse(stream);
 } catch (error) {
    if (error instanceof OpenAI.APIError) {
        const { name, status, headers, message } = error;
        return Response.json({ name, status, headers, message }, { status });
      } else {
        console.error("ERROR WHILE GENERATING SUGGESTION MESSAGES: ",error)
        throw error;
      }
 }
}