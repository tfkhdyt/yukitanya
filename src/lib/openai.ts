import { environment } from '@/environment.mjs';
import OpenAI from 'openai';

export const openai = new OpenAI({
	apiKey: environment.OPENAI_API_KEY,
});
