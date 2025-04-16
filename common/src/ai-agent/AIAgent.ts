import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Define interfaces for article generation
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
export class AIAgent {
  private apiKey: string;
  private apiEndpoint: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || 'mock-api-key';
    this.apiEndpoint = process.env.OPENAI_API_ENDPOINT || 'https://api.openai.com/v1/chat/completions';
  }

  /**
   * Generate an article based on financial news
   */
  async generateArticle(input: ArticleGenerationInput): Promise<ArticleGenerationOutput> {
    try {
      // In a real implementation, this would call the OpenAI API
      // For this example, we'll use a mock implementation
      
      if (process.env.USE_MOCK_AI === 'true' || !this.apiKey.startsWith('sk-')) {
        return this.mockGenerateArticle(input);
      }
      
      // Prepare the prompt for the AI
      const prompt = this.createArticlePrompt(input);
      
      // Call the OpenAI API
      const response = await axios.post(
        this.apiEndpoint,
        {
          model: 'gpt-4',
          messages: [
            { role: 'system', content: 'You are a financial analyst and journalist specializing in creating high-quality financial news articles.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 1500
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Parse the response
      const content = response.data.choices[0].message.content;
      
      // Extract title, content, and summary from the AI response
      const parts = this.parseAIResponse(content);
      
      return {
        title: parts.title || input.title,
        content: parts.content,
        summary: parts.summary
      };
    } catch (error) {
      console.error('Error generating article:', error);
      
      // Fallback to mock implementation if API call fails
      return this.mockGenerateArticle(input);
    }
  }
  
  /**
   * Generate tags for an article
   */
  async generateTags(input: TagGenerationInput): Promise<string[]> {
    try {
      // In a real implementation, this would call the OpenAI API
      // For this example, we'll use a mock implementation
      
      if (process.env.USE_MOCK_AI === 'true' || !this.apiKey.startsWith('sk-')) {
        return this.mockGenerateTags(input);
      }
      
      // Prepare the prompt for the AI
      const prompt = `
        Generate 5-7 relevant tags for a financial article with the following details:
        
        Title: ${input.title}
        Summary: ${input.summary}
        Stock Symbols: ${input.stockSymbols.join(', ')}
        
        Return only the tags as a comma-separated list.
      `;
      
      // Call the OpenAI API
      const response = await axios.post(
        this.apiEndpoint,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a financial content tagger specializing in creating relevant tags for financial articles.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 100
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Parse the response
      const content = response.data.choices[0].message.content;
      
      // Split the comma-separated list into an array
      const tags = content.split(',').map((tag: string) => tag.trim());
      
      return tags;
    } catch (error) {
      console.error('Error generating tags:', error);
      
      // Fallback to mock implementation if API call fails
      return this.mockGenerateTags(input);
    }
  }
  
  /**
   * Create a prompt for article generation
   */
  private createArticlePrompt(input: ArticleGenerationInput): string {
    const languageInstructions = input.language === 'en'
      ? 'Write the article in English.'
      : 'Write the article in Hebrew.';
    
    return `
      Create a financial news article based on the following information:
      
      Title: ${input.title}
      Summary: ${input.summary}
      Source: ${input.source}
      URL: ${input.url}
      Stock Symbols: ${input.stockSymbols.join(', ')}
      
      ${languageInstructions}
      
      The article should have the following structure:
      
      1. TITLE: An engaging title for the article (you can improve the original title)
      2. SUMMARY: A concise summary of the article (2-3 sentences)
      3. CONTENT: The main content of the article (at least 500 words)
      
      The content should include:
      - An introduction explaining the news
      - Analysis of the potential impact on the mentioned stocks
      - Market context and expert opinions
      - A conclusion with future outlook
      
      Format your response as:
      
      TITLE: Your title here
      SUMMARY: Your summary here
      CONTENT: Your content here
    `;
  }
  
  /**
   * Parse the AI response into title, content, and summary
   */
  private parseAIResponse(response: string): { title: string; content: string; summary: string } {
    const titleMatch = response.match(/TITLE:\s*(.*?)(?=\nSUMMARY:|$)/s);
    const summaryMatch = response.match(/SUMMARY:\s*(.*?)(?=\nCONTENT:|$)/s);
    const contentMatch = response.match(/CONTENT:\s*(.*?)$/s);
    
    return {
      title: titleMatch ? titleMatch[1].trim() : '',
      summary: summaryMatch ? summaryMatch[1].trim() : '',
      content: contentMatch ? contentMatch[1].trim() : ''
    };
  }
  
  /**
   * Mock implementation of article generation for development/testing
   */
  private mockGenerateArticle(input: ArticleGenerationInput): ArticleGenerationOutput {
    const isEnglish = input.language === 'en';
    
    // Generate mock content based on the input
    const stockMentions = input.stockSymbols.length > 0
      ? input.stockSymbols.join(', ')
      : 'various financial markets';
    
    if (isEnglish) {
      return {
        title: `Analysis: ${input.title}`,
        summary: `A detailed analysis of ${input.summary} and its impact on ${stockMentions}.`,
        content: `
          <h2>Introduction</h2>
          <p>Recent developments in the financial markets have brought attention to ${input.title}. This article analyzes the implications of these events and their potential impact on investors.</p>
          
          <h2>Market Analysis</h2>
          <p>The news from ${input.source} highlights significant movements in ${stockMentions}. Experts suggest that these developments could lead to both short-term volatility and long-term structural changes in the affected sectors.</p>
          
          <p>According to financial analysts, the immediate market reaction has been mixed, with some investors taking a cautious approach while others see opportunities in the changing landscape.</p>
          
          <h2>Impact on Stocks</h2>
          <p>The stocks most directly affected by these developments include ${stockMentions}. Historical patterns suggest that similar events have led to an average market adjustment period of 2-3 weeks, followed by a stabilization phase.</p>
          
          <p>Institutional investors are closely monitoring these developments, with several major funds adjusting their positions in anticipation of further news.</p>
          
          <h2>Expert Opinions</h2>
          <p>Market strategists from leading financial institutions have offered varied perspectives on these developments. Some emphasize the importance of maintaining diversified portfolios during this period, while others point to specific sectors that may outperform in the current environment.</p>
          
          <p>"The key to navigating these market conditions is to maintain a long-term perspective while being attentive to short-term signals," notes one senior market analyst.</p>
          
          <h2>Future Outlook</h2>
          <p>Looking ahead, several factors will likely influence how these market dynamics evolve. Regulatory responses, competitive adjustments, and broader economic indicators will all play crucial roles in determining the longer-term impact of these developments.</p>
          
          <p>Investors are advised to stay informed about ongoing developments while maintaining alignment with their overall investment strategies and risk tolerances.</p>
          
          <h2>Conclusion</h2>
          <p>While the full implications of ${input.title} are still unfolding, the financial markets have demonstrated resilience in the face of similar challenges in the past. By staying informed and maintaining a disciplined approach, investors can navigate this period of adjustment and potentially identify valuable opportunities.</p>
        `
      };
    } else {
      // Hebrew version
      return {
        title: `ניתוח: ${input.title}`,
        summary: `ניתוח מפורט של ${input.summary} וההשפעה שלו על ${stockMentions}.`,
        content: `
          <h2>הקדמה</h2>
          <p>התפתחויות אחרונות בשווקים הפיננסיים הביאו תשומת לב ל${input.title}. מאמר זה מנתח את ההשלכות של אירועים אלה ואת ההשפעה הפוטנציאלית שלהם על משקיעים.</p>
          
          <h2>ניתוח שוק</h2>
          <p>החדשות מ${input.source} מדגישות תנועות משמעותיות ב${stockMentions}. מומחים מציעים כי התפתחויות אלה עשויות להוביל לתנודתיות בטווח הקצר ולשינויים מבניים ארוכי טווח במגזרים המושפעים.</p>
          
          <p>לפי אנליסטים פיננסיים, תגובת השוק המיידית הייתה מעורבת, כאשר חלק מהמשקיעים נוקטים בגישה זהירה בעוד אחרים רואים הזדמנויות בנוף המשתנה.</p>
          
          <h2>השפעה על מניות</h2>
          <p>המניות המושפעות ביותר מהתפתחויות אלה כוללות את ${stockMentions}. דפוסים היסטוריים מרמזים כי אירועים דומים הובילו לתקופת התאמת שוק ממוצעת של 2-3 שבועות, ולאחריה שלב ייצוב.</p>
          
          <p>משקיעים מוסדיים עוקבים מקרוב אחר התפתחויות אלה, כאשר מספר קרנות גדולות מתאימות את עמדותיהן בציפייה לחדשות נוספות.</p>
          
          <h2>דעות מומחים</h2>
          <p>אסטרטגים בשוק ממוסדות פיננסיים מובילים הציעו נקודות מבט מגוונות על התפתחויות אלה. חלקם מדגישים את חשיבות שמירת תיקים מגוונים בתקופה זו, בעוד אחרים מצביעים על מגזרים ספציפיים שעשויים להתעלות בסביבה הנוכחית.</p>
          
          <p>"המפתח לניווט בתנאי שוק אלה הוא לשמור על פרספקטיבה ארוכת טווח תוך תשומת לב לאותות קצרי טווח," מציין אנליסט שוק בכיר אחד.</p>
          
          <h2>תחזית עתידית</h2>
          <p>במבט קדימה, מספר גורמים ישפיעו כנראה על אופן התפתחות דינמיקת השוק הזו. תגובות רגולטוריות, התאמות תחרותיות ואינדיקטורים כלכליים רחבים יותר ימלאו תפקידים מכריעים בקביעת ההשפעה ארוכת הטווח של התפתחויות אלה.</p>
          
          <p>מומלץ למשקיעים להישאר מעודכנים לגבי התפתחויות מתמשכות תוך שמירה על התאמה לאסטרטגיות ההשקעה הכוללות שלהם וסובלנות לסיכונים.</p>
          
          <h2>סיכום</h2>
          <p>בעוד שההשלכות המלאות של ${input.title} עדיין מתגלות, השווקים הפיננסיים הפגינו חוסן בפני אתגרים דומים בעבר. על ידי הישארות מעודכנים ושמירה על גישה ממושמעת, משקיעים יכולים לנווט בתקופת התאמה זו ולזהות הזדמנויות בעלות ערך פוטנציאלי.</p>
        `
      };
    }
  }
  
  /**
   * Mock implementation of tag generation for development/testing
   */
  private mockGenerateTags(input: TagGenerationInput): string[] {
    // Generate mock tags based on the input
    const baseTags = ['finance', 'investment', 'market analysis'];
    
    // Add stock-specific tags
    const stockTags = input.stockSymbols.map(symbol => `${symbol} stock`);
    
    // Add some generic financial tags
    const financialTags = ['financial markets', 'trading', 'investment strategy'];
    
    // Combine and return a subset of tags
    const allTags = [...baseTags, ...stockTags, ...financialTags];
    const shuffled = allTags.sort(() => 0.5 - Math.random());
    
    return shuffled.slice(0, 5);
  }
}
