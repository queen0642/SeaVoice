import type { Message, Filters, Persona } from '../types';
import { streamGeminiResponse } from '../api/gemini';

/**
 * This service acts as a mediator between the UI components and the backend API layer.
 * It constructs the full prompt and handles the streaming response, but delegates
 * the actual API call to the dedicated API module.
 */
export async function* sendMessageStream(
  message: string,
  history: Message[], // The history parameter is kept for potential future use (e.g., sending it to the backend)
  language: string,
  filters: Filters,
  persona: Persona
): AsyncGenerator<string> {
    
    let fullMessage = `User query: "${message}"`;
    const activeFilters: string[] = [];

    if (filters.dateRange.start && filters.dateRange.end) {
        activeFilters.push(`- Date range: ${filters.dateRange.start} to ${filters.dateRange.end}`);
    }
    if (filters.sensorType && filters.sensorType !== 'all') {
        activeFilters.push(`- Sensor type: ${filters.sensorType}`);
    }
    if (filters.region && filters.region !== 'all') {
        activeFilters.push(`- Region: ${filters.region}`);
    }
    if (filters.depthRange.min && filters.depthRange.max) {
        activeFilters.push(`- Depth range: ${filters.depthRange.min}m to ${filters.depthRange.max}m`);
    }
    if (filters.floatId) {
        activeFilters.push(`- Float ID: ${filters.floatId}`);
    }


    if (activeFilters.length > 0) {
        fullMessage += "\n\nApplied filters:\n" + activeFilters.join('\n');
    }

    try {
        const stream = await streamGeminiResponse(fullMessage, language, persona);
        
        for await (const chunk of stream) {
            yield chunk.text;
        }
    } catch (error) {
        console.error("Gemini Service Error:", error);
        throw new Error("Failed to get response from AI. Please check your API key and network connection.");
    }
}