import { environment } from '@/environment.mjs';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(environment.GEMINI_API_KEY);

// ...

// The Gemini 1.5 models are versatile and work with most use cases
export const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// ...
