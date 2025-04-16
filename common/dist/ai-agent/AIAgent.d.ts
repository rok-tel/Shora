export interface ArticleGenerationInput {
    title: string;
    summary: string;
    source: string;
    url: string;
    stockSymbols: string[];
    language: 'en' | 'he';
}
export interface ArticleGenerationOutput {
    title: string;
    content: string;
    summary: string;
}
export interface TagGenerationInput {
    title: string;
    summary: string;
    stockSymbols: string[];
}
/**
 * AI Agent for generating financial blog content
 */
export declare class AIAgent {
    private apiKey;
    private apiEndpoint;
    constructor();
    /**
     * Generate an article based on financial news
     */
    generateArticle(input: ArticleGenerationInput): Promise<ArticleGenerationOutput>;
    /**
     * Generate tags for an article
     */
    generateTags(input: TagGenerationInput): Promise<string[]>;
    /**
     * Create a prompt for article generation
     */
    private createArticlePrompt;
    /**
     * Parse the AI response into title, content, and summary
     */
    private parseAIResponse;
    /**
     * Mock implementation of article generation for development/testing
     */
    private mockGenerateArticle;
    /**
     * Mock implementation of tag generation for development/testing
     */
    private mockGenerateTags;
}
