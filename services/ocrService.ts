/**
 * OCR Service for extracting text from images
 * Expo Go compatible implementation with enhanced mock OCR for development
 */

export interface OCRResult {
  text: string;
  confidence?: number;
  blocks?: TextBlock[];
}

export interface TextBlock {
  text: string;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  confidence?: number;
}

class OCRService {
  /**
   * Extract text from an image using simulated OCR (for Expo Go compatibility)
   * @param imageUri - URI of the image to process
   * @returns Promise<string> - Extracted text
   */
  async extractTextFromImage(imageUri: string): Promise<string> {
    try {
      console.log('Processing image:', imageUri);
      
      // Simulate processing time for realistic user experience
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
      
      // For Expo Go, we'll use enhanced mock OCR that simulates real extraction
      // In a production app, you would integrate with:
      // - Google Cloud Vision API
      // - AWS Textract
      // - Azure Computer Vision
      // - Or use a development build with native ML Kit
      
      const mockOCRResult = this.getMockOCRResult();
      
      // Process and clean the extracted text
      const processedText = this.processOCRResult(mockOCRResult);
      
      console.log('Successfully processed image with simulated OCR');
      return processedText;

    } catch (error) {
      console.error('OCR Error:', error);
      throw new Error('Failed to extract text from image');
    }
  }

  /**
   * Mock OCR result for development/testing
   * Replace this with actual OCR integration
   */
  private getMockOCRResult(): string {
    // Simulate different types of receipts
    const mockReceipts = [
      `Reliance Fresh
Date: 07/08/2025
Item 1: Milk - ₹45.00
Item 2: Bread - ₹25.00
Item 3: Eggs - ₹165.00
Total: ₹235.00
Thank you for shopping!`,

      `McDonald's India
Date: 07/08/2025
Big Mac Meal - ₹350.00
Coca Cola - ₹80.00
French Fries - ₹120.00
Subtotal: ₹550.00
Tax: ₹99.00
Total: ₹649.00
Thank you!`,

      `Domino's Pizza
Order Date: 07/08/2025
Margherita Pizza (Large) - ₹399.00
Garlic Bread - ₹149.00
Coke (2L) - ₹95.00
Delivery Charges - ₹40.00
Total Amount: ₹683.00
Thanks for ordering!`,

      `Big Bazaar
Date: 07/08/2025
Rice (5kg) - ₹275.00
Dal (1kg) - ₹120.00
Oil (1L) - ₹185.00
Onions (2kg) - ₹60.00
Total: ₹640.00
Save more with Big Bazaar!`,

      `Café Coffee Day
Date: 07/08/2025
Cappuccino - ₹150.00
Sandwich - ₹180.00
Brownie - ₹120.00
Total: ₹450.00
A lot can happen over coffee!`
    ];

    // Return a random mock receipt
    const randomIndex = Math.floor(Math.random() * mockReceipts.length);
    return mockReceipts[randomIndex];
  }

  /**
   * Process OCR result and clean up text
   * @param rawText - Raw OCR output
   * @returns Cleaned and formatted text
   */
  processOCRResult(rawText: string): string {
    if (!rawText) return '';

    return rawText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n');
  }

  /**
   * Validate OCR result quality
   * @param text - Extracted text
   * @returns boolean indicating if text quality is acceptable
   */
  validateOCRQuality(text: string): boolean {
    if (!text || text.trim().length < 10) {
      return false;
    }

    // Check for common receipt indicators
    const receiptIndicators = [
      'total',
      'amount',
      'date',
      'receipt',
      'bill',
      '₹',
      'rs',
      'rupees',
      'thank you'
    ];

    const lowerText = text.toLowerCase();
    const hasIndicators = receiptIndicators.some(indicator => 
      lowerText.includes(indicator)
    );

    return hasIndicators;
  }
}

// Export singleton instance
export const ocrService = new OCRService();
