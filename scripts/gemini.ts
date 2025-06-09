#!/usr/bin/env tsx

import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import { stdin } from 'process';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('Error: GEMINI_API_KEY environment variable is required');
  console.error('Please add GEMINI_API_KEY=your_api_key to your .env file');
  process.exit(1);
}

async function main() {
  // Initialize the Gemini API
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  let prompt: string;

  // Get prompt from command line argument or stdin
  if (process.argv[2]) {
    prompt = process.argv.slice(2).join(' ');
  } else {
    console.log('Enter your prompt (press Ctrl+D when finished):');

    // Read from stdin
    let input = '';
    for await (const chunk of stdin) {
      input += chunk;
    }
    prompt = input.trim();
  }

  if (!prompt) {
    console.error('Error: No prompt provided');
    console.error('Usage: tsx scripts/gemini.ts "your prompt here"');
    console.error('   or: echo "your prompt" | tsx scripts/gemini.ts');
    process.exit(1);
  }

  try {
    console.log('🤖 Sending request to Gemini...\n');

    // Generate content using Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('📝 Response:');
    console.log('='.repeat(50));
    console.log(text);
    console.log('='.repeat(50));

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    process.exit(1);
  }
}

main().catch(console.error);