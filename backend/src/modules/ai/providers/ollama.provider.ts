import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class OllamaProvider {
  private readonly logger = new Logger(OllamaProvider.name);
  private readonly ollamaUrl: string;
  private readonly modelName: string;

  constructor() {
    this.ollamaUrl = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';
    this.modelName = process.env.OLLAMA_MODEL || 'qwen:4b';
  }

  async generate(prompt: string, format: string = 'json'): Promise<string> {
    const url = `${this.ollamaUrl}/api/generate`;
    this.logger.debug(`Sending prompt to Ollama model ${this.modelName}`);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.modelName,
          prompt,
          stream: false,
          format,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      this.logger.error(`Failed to communicate with Ollama: ${error.message}`);
      throw new Error(`AI Provider Error: Unable to generate response. ${error.message}`);
    }
  }
}
