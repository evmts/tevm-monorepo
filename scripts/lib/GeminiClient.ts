import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv";

export interface GeminiPart {
  text: string;
}

export interface GeminiContent {
  parts: GeminiPart[];
}

export interface TokenCountResult {
  totalTokens: number;
}

export interface GenerateContentResult {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

/**
 * Retry wrapper with exponential backoff
 */
async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      console.warn(
        `    ⚠️  Attempt ${attempt}/${maxRetries} failed: ${error.message}`,
      );

      if (attempt === maxRetries) {
        throw error;
      }

      // Exponential backoff: 1s, 2s, 4s
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.log(`    ⏱️  Retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error("Max retries exceeded");
}

/**
 * Gemini API client with retry logic and utility methods
 */
export class GeminiClient {
  private genAI: GoogleGenerativeAI;
  private model: any;
  public readonly modelName: string;
  public readonly tokenLimit: number;

  constructor(apiKey?: string, modelName: string = "gemini-2.5-pro-preview-06-05") {
    const key = apiKey || process.env.GEMINI_API_KEY;
    
    if (!key) {
      throw new Error(
        "GEMINI_API_KEY is required. Set it as an environment variable or pass it to the constructor."
      );
    }

    this.modelName = modelName;
    this.tokenLimit = 1000000; // 1M tokens for gemini-2.5-pro
    this.genAI = new GoogleGenerativeAI(key);
    this.model = this.genAI.getGenerativeModel({ model: modelName });
  }

  /**
   * Count tokens with retry logic
   */
  async countTokens(contents: GeminiContent[]): Promise<number> {
    return retryWithBackoff(async () => {
      const result = await this.model.countTokens({ contents });
      return result.totalTokens;
    });
  }

  /**
   * Generate content with retry logic using fetch API
   */
  async generateContent(contents: GeminiContent[]): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    
    return retryWithBackoff(async () => {
      const requestBody = {
        contents,
      };

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error Details: ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data: GenerateContentResult = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response received";
    });
  }

  /**
   * Generate content with automatic chunking for large requests
   */
  async generateContentWithChunking(
    parts: GeminiPart[],
    fixedParts: GeminiPart[] = [],
    chunkingOptions: {
      onChunkStart?: (chunkNumber: number, totalParts: number) => void;
      onChunkComplete?: (chunkNumber: number, response: string) => void;
      delayBetweenChunks?: number;
    } = {}
  ): Promise<string[]> {
    const { onChunkStart, onChunkComplete, delayBetweenChunks = 10000 } = chunkingOptions;
    
    // First check if we need chunking
    const allParts = [...fixedParts, ...parts];
    const totalTokens = await this.countTokens([{ parts: allParts }]);

    if (totalTokens <= this.tokenLimit) {
      // No chunking needed
      const response = await this.generateContent([{ parts: allParts }]);
      return [response];
    }

    console.warn(
      `  ⚠️  Content exceeds token limit (${totalTokens.toLocaleString()} > ${this.tokenLimit.toLocaleString()}). Splitting into chunks.`
    );

    // Calculate fixed token usage
    const fixedTokens = fixedParts.length > 0 
      ? await this.countTokens([{ parts: fixedParts }])
      : 0;

    let currentChunk: GeminiPart[] = [];
    let currentChunkTokens = fixedTokens;
    let chunkNumber = 1;
    const responses: string[] = [];

    for (const part of parts) {
      const partTokens = await this.countTokens([{ parts: [part] }]);
      
      if (currentChunkTokens + partTokens > this.tokenLimit && currentChunk.length > 0) {
        // Process current chunk
        const chunkParts = [...fixedParts, ...currentChunk];
        onChunkStart?.(chunkNumber, chunkParts.length);
        
        const response = await this.generateContent([{ parts: chunkParts }]);
        responses.push(response);
        
        onChunkComplete?.(chunkNumber, response);
        
        // Start new chunk
        currentChunk = [part];
        currentChunkTokens = fixedTokens + partTokens;
        chunkNumber++;
        
        // Add delay between chunks
        if (delayBetweenChunks > 0) {
          await new Promise((resolve) => setTimeout(resolve, delayBetweenChunks));
        }
      } else {
        currentChunk.push(part);
        currentChunkTokens += partTokens;
      }
    }

    // Process final chunk if it has content
    if (currentChunk.length > 0) {
      const chunkParts = [...fixedParts, ...currentChunk];
      onChunkStart?.(chunkNumber, chunkParts.length);
      
      const response = await this.generateContent([{ parts: chunkParts }]);
      responses.push(response);
      
      onChunkComplete?.(chunkNumber, response);
    }

    return responses;
  }

  /**
   * Check if content would exceed token limit
   */
  async wouldExceedLimit(parts: GeminiPart[]): Promise<{ exceeds: boolean; tokens: number; utilization: number }> {
    const tokens = await this.countTokens([{ parts }]);
    const utilization = (tokens / this.tokenLimit) * 100;
    
    return {
      exceeds: tokens > this.tokenLimit,
      tokens,
      utilization
    };
  }
}