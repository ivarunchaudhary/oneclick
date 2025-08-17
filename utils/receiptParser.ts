/**
 * Receipt Parser Utility
 * Uses regex patterns to extract vendor, date, and total from OCR text
 */

export interface ReceiptData {
  vendor: string | null;
  date: string | null;
  total: string | null;
  rawText: string;
}

/**
 * Extract structured data from receipt text using regex patterns
 * @param text - Raw OCR text from receipt
 * @returns ReceiptData object with extracted information
 */
export function extractReceiptData(text: string): ReceiptData {
  if (!text) {
    return {
      vendor: null,
      date: null,
      total: null,
      rawText: text,
    };
  }

  const cleanText = text.trim();
  
  return {
    vendor: extractVendor(cleanText),
    date: extractDate(cleanText),
    total: extractTotal(cleanText),
    rawText: cleanText,
  };
}

/**
 * Extract vendor/store name from receipt text
 * Enhanced patterns for better ML Kit OCR extraction
 */
function extractVendor(text: string): string | null {
  const lines = text.split('\n').map(line => line.trim());
  
  // First, look for business name patterns in the first few lines
  // Many receipts have the business name prominently at the top
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    
    // Look for lines that look like business names
    if (isLikelyBusinessName(line)) {
      return formatVendorName(line);
    }
  }
  
  // Common retail chains and business patterns (enhanced)
  const knownVendors = [
    // International/Australian chains
    'bistro box', 'bistro box departures',
    'metro cash', 'walmart', 'best price',
    
    // Retail chains
    'reliance fresh', 'reliance mart', 'reliance digital', 'reliance trends',
    'big bazaar', 'food bazaar', 'fashion at big bazaar',
    'more', 'more megastore', 'more supermarket',
    'spencer\'s', 'spencer\'s retail', 'spencer\'s hyper',
    'dmart', 'avenue supermarts', 'd-mart',
    'easyday', 'easyday club',
    'star bazaar', 'trent hypermarket',
    'hypercity', 'shopper\'s stop',
    'nature\'s basket', 'godrej nature\'s basket',
    'twenty four seven', '24seven', '24x7',
    
    // Food chains
    'mcdonald\'s', 'mcdonalds', 'mcd',
    'domino\'s', 'dominos pizza', 'dominos',
    'pizza hut', 'pizzahut',
    'kfc', 'kentucky fried chicken',
    'subway', 'subway sandwich',
    'burger king', 'bk',
    'taco bell',
    'baskin robbins', 'dunkin donuts',
    
    // Cafes
    'café coffee day', 'ccd', 'coffee day',
    'starbucks', 'starbucks coffee',
    'barista', 'barista coffee',
    'costa coffee', 'costa',
    'tim hortons', 'blue tokai',
    
    // Indian restaurants/brands
    'haldiram\'s', 'haldirams',
    'bikanervala', 'bikaner vala',
    'sagar ratna', 'saravana bhavan',
    'udupi', 'udupi restaurant',
    'punjabi by nature', 'pind balluchi',
    'oh! calcutta', 'mainland china',
    'barbeque nation', 'bbq nation',
    'absolute barbecues', 'ab\'s',
    'social', 'hard rock cafe',
    'tgi friday\'s', 'chili\'s',
    
    // Generic business types
    'hotel', 'restaurant', 'cafe', 'bakery', 'sweet shop',
    'medical', 'pharmacy', 'clinic', 'hospital',
    'apollo', 'fortis', 'max healthcare', 'manipal',
    'petrol pump', 'gas station', 'hp', 'bharat petroleum',
    'indian oil', 'reliance petroleum', 'shell',
    
    // Grocery/local
    'kirana', 'general store', 'supermarket', 'mart',
    'provision store', 'departmental store'
  ];

  // Enhanced vendor detection with fuzzy matching
  for (const vendor of knownVendors) {
    const regex = new RegExp(vendor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    if (regex.test(text)) {
      return vendor.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');
    }
    
    // Also check for partial matches (useful for OCR errors)
    const words = vendor.split(' ');
    if (words.length > 1) {
      for (const word of words) {
        if (word.length > 3) { // Only check substantial words
          const wordRegex = new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
          if (wordRegex.test(text)) {
            return vendor.split(' ').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            ).join(' ');
          }
        }
      }
    }
  }

  // If no known vendor found, try to extract from first few lines
  // Usually vendor name is in the first 1-3 lines
  for (let i = 0; i < Math.min(4, lines.length); i++) {
    const line = lines[i];
    
    // Skip lines that look like addresses, phone numbers, or other metadata
    if (isLikelyVendorName(line)) {
      return formatVendorName(line);
    }
  }

  return null;
}

/**
 * Check if a line is likely to be a business name (first check)
 */
function isLikelyBusinessName(line: string): boolean {
  if (!line || line.length < 3) return false;
  
  // Skip obvious non-business patterns
  const skipPatterns = [
    /^\d+[\s-]*\d+[\s-]*\d+/, // Phone numbers
    /tax\s*invoice|receipt|bill/i, // Document types
    /take\s*away|quick\s*sale/i, // Service types
    /till|cashier|invoice\s*#|salesperson/i, // Receipt metadata
    /^\d+:\d+/i, // Time stamps
    /\d{6,}/, // Long numbers
    /gst|abn|phone|ph:/i, // Business details
  ];

  for (const pattern of skipPatterns) {
    if (pattern.test(line)) return false;
  }

  // Must contain letters and be reasonable length
  if (!/[a-zA-Z]/.test(line) || line.length > 40) return false;
  
  // Boost score for business-like words
  const businessWords = /(?:bistro|box|departures|restaurant|cafe|market|store|shop|hotel|bar|grill)/i;
  if (businessWords.test(line)) return true;
  
  // General business name pattern (2+ words, title case likely)
  const words = line.split(/\s+/).filter(w => w.length > 0);
  return words.length >= 2 && words.length <= 5;
}

/**
 * Check if a line is likely to be a vendor name
 */
function isLikelyVendorName(line: string): boolean {
  if (!line || line.length < 2) return false;
  
  // Skip lines that contain these patterns
  const skipPatterns = [
    /^\d+[\s-]*\d+[\s-]*\d+/, // Phone numbers
    /\d{6,}/, // Long numbers (likely phone/ID)
    /@/, // Email
    /www\.|\.com|\.in/, // Websites
    /address|add:|addr:/i, // Address indicators
    /phone|ph:|tel:|mobile|mob:/i, // Phone indicators
    /gstin|gst|tin|pan/i, // Tax numbers
    /bill|receipt|invoice/i, // Document types
    /date|time/i, // Date/time
    /total|amount|₹|rs/i, // Money amounts
  ];

  for (const pattern of skipPatterns) {
    if (pattern.test(line)) return false;
  }

  // Must contain letters
  if (!/[a-zA-Z]/.test(line)) return false;

  // Should not be too long (likely not a vendor name if > 50 chars)
  if (line.length > 50) return false;

  return true;
}

/**
 * Format vendor name properly
 */
function formatVendorName(name: string): string {
  return name
    .trim()
    .replace(/[^\w\s&'-]/g, '') // Remove special chars except &, ', -
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Extract date from receipt text
 * Enhanced patterns for ML Kit OCR with multiple formats including international
 */
function extractDate(text: string): string | null {
  // Enhanced date patterns to match various formats and OCR variations
  const datePatterns = [
    // Time followed by date (like "12:26 PM 3 Jul 24")
    /\d{1,2}:\d{2}(?:\s*[AaPp][Mm])?\s+(\d{1,2}\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+\d{2,4})/gi,
    // DD Month YY/YYYY (full and abbreviated)
    /(\d{1,2}\s+(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{2,4})/gi,
    /(\d{1,2}\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+\d{2,4})/gi,
    // DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY with optional labels
    /(?:date[:\s]*|bill\s*date[:\s]*|transaction[:\s]*date[:\s]*)?(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4})/gi,
    // MM/DD/YYYY variants
    /(?:date[:\s]*)?(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4})/gi,
    // YYYY-MM-DD, YYYY/MM/DD, YYYY.MM.DD
    /(?:date[:\s]*)?(\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2})/gi,
    // Month DD, YYYY
    /(?:date[:\s]*)?((january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2},?\s+\d{4})/gi,
    // DD-Month-YYYY
    /(?:date[:\s]*)?(\d{1,2}[\-\/]\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[\-\/]\s*\d{4})/gi,
    // Time with date patterns (common in receipts)
    /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4})\s+\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AaPp][Mm])?/gi,
  ];

  let bestMatch = null;
  let bestScore = 0;

  for (const pattern of datePatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      let dateStr = match[1] || match[0];
      dateStr = dateStr.replace(/(?:date|bill\s*date|transaction\s*date)[:\s]*/gi, '').trim();
      
      // Score based on pattern confidence
      let score = 1;
      if (dateStr.includes('/') || dateStr.includes('-') || dateStr.includes('.')) score += 2;
      if (dateStr.match(/\d{4}/)) score += 2; // Has 4-digit year
      if (dateStr.match(/\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4}/)) score += 3; // Full date format
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = dateStr;
      }
    }
  }

  // If no explicit date found, check for today's indicators
  if (!bestMatch) {
    const todayIndicators = /(?:today|now|current)\s*(?:date)?/gi;
    if (todayIndicators.test(text)) {
      const today = new Date();
      return `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
    }
  }

  return bestMatch ? formatDate(bestMatch) : null;
}

/**
 * Format date to consistent DD/MM/YYYY format
 */
function formatDate(dateStr: string): string {
  try {
    // Handle different separators
    let normalized = dateStr.replace(/[\-\.]/g, '/');
    
    // Handle month names
    const monthMap: { [key: string]: string } = {
      'jan': '01', 'january': '01',
      'feb': '02', 'february': '02', 
      'mar': '03', 'march': '03',
      'apr': '04', 'april': '04',
      'may': '05',
      'jun': '06', 'june': '06',
      'jul': '07', 'july': '07',
      'aug': '08', 'august': '08',
      'sep': '09', 'september': '09',
      'oct': '10', 'october': '10',
      'nov': '11', 'november': '11',
      'dec': '12', 'december': '12'
    };

    for (const [month, num] of Object.entries(monthMap)) {
      const regex = new RegExp(month, 'gi');
      normalized = normalized.replace(regex, num);
    }

    // Parse and reformat
    const parts = normalized.split(/[\/\s]+/);
    if (parts.length >= 3) {
      let day = parts[0].padStart(2, '0');
      let month = parts[1].padStart(2, '0');
      let year = parts[2];

      // Handle 2-digit years
      if (year.length === 2) {
        const currentYear = new Date().getFullYear();
        const century = Math.floor(currentYear / 100) * 100;
        year = (century + parseInt(year)).toString();
      }

      return `${day}/${month}/${year}`;
    }

    return dateStr;
  } catch (error) {
    return dateStr;
  }
}

/**
 * Extract total amount from receipt text
 * Enhanced patterns for international currencies and formats
 */
function extractTotal(text: string): string | null {
  // Enhanced total amount patterns with priority scoring for multiple currencies
  const totalPatterns = [
    // Highest priority: Balance due, Total, Amount payable with $ or AUD
    { 
      pattern: /(?:balance\s*due|(?:grand\s*)?total|net\s*(?:amount|total)|final\s*(?:amount|total)|amount\s*payable|tendered)[:\s]*\$?\s*(\d+(?:[,\s]\d+)*(?:\.\d{2})?)/gi,
      priority: 10
    },
    // High priority: Dollar sign patterns (US/AUD/CAD)
    {
      pattern: /\$\s*(\d+(?:[,\s]\d+)*(?:\.\d{2})?)/gi,
      priority: 9
    },
    // High priority: Total with currency symbol
    {
      pattern: /(?:total)[:\s]*[$₹]\s*(\d+(?:[,\s]\d+)*(?:\.\d{2})?)/gi,
      priority: 8
    },
    // Medium-high priority: Amount due/payable with rupees
    {
      pattern: /(?:amount\s*(?:due|payable)|balance\s*due)[:\s]*₹?\s*(\d+(?:[,\s]\d+)*(?:\.\d{2})?)/gi,
      priority: 7
    },
    // Medium priority: Currency first, then total indicators
    {
      pattern: /[$₹]\s*(\d+(?:[,\s]\d+)*(?:\.\d{2})?)\s*(?:total|amount|due)?/gi,
      priority: 6
    },
    // Medium priority: Rs/Rupees variations
    {
      pattern: /(?:rs\.?|rupees|inr)[:\s]*(\d+(?:[,\s]\d+)*(?:\.\d{2})?)\s*(?:total|amount)?/gi,
      priority: 5
    },
    // Lower priority: Numbers followed by currency
    {
      pattern: /(\d+(?:[,\s]\d+)*(?:\.\d{2})?)\s*(?:[$₹]|rs\.?|rupees|inr|aud|usd)/gi,
      priority: 4
    },
    // Lowest priority: Large numbers (likely totals)
    {
      pattern: /(\d{2,}(?:[,\s]\d+)*(?:\.\d{2})?)/gi,
      priority: 1
    }
  ];

  const candidates: Array<{ amount: number; priority: number; raw: string }> = [];

  for (const { pattern, priority } of totalPatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const rawAmount = match[1];
      const cleanAmount = rawAmount.replace(/[,\s]/g, ''); // Remove commas and spaces
      const amount = parseFloat(cleanAmount);
      
      if (!isNaN(amount) && amount > 0) {
        // Additional scoring based on amount characteristics
        let score = priority;
        
        // Prefer amounts with decimal places (more precise)
        if (rawAmount.includes('.')) score += 2;
        
        // Prefer reasonable receipt amounts (₹10 to ₹100,000)
        if (amount >= 10 && amount <= 100000) score += 3;
        
        // Slightly prefer round numbers or common pricing patterns
        if (amount % 5 === 0) score += 1;
        
        // Bonus for amounts at end of receipt text
        const matchIndex = text.indexOf(match[0]);
        const textLength = text.length;
        if (matchIndex > textLength * 0.7) score += 2; // In last 30% of text
        
        candidates.push({ amount, priority: score, raw: rawAmount });
      }
    }
  }

  if (candidates.length === 0) return null;

  // Sort by priority (highest first), then by amount (highest first) as tiebreaker
  candidates.sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    return b.amount - a.amount;
  });

  const bestCandidate = candidates[0];
  
  // Detect currency type from the original text context
  let currencySymbol = '₹'; // Default to rupees
  
  // Check for dollar signs in the text around the amount
  if (text.includes('$') || /(?:aud|usd|cad|balance\s*due|tendered)/i.test(text)) {
    currencySymbol = '$';
  }
  
  // Format with proper currency symbol and appropriate decimal places
  const formattedAmount = bestCandidate.amount % 1 === 0 
    ? `${currencySymbol}${bestCandidate.amount.toFixed(0)}` 
    : `${currencySymbol}${bestCandidate.amount.toFixed(2)}`;
    
  return formattedAmount;
}

/**
 * Validate extracted receipt data
 */
export function validateReceiptData(data: ReceiptData): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data.vendor) {
    errors.push('Vendor name not found');
  }

  if (!data.date) {
    errors.push('Date not found');
  }

  if (!data.total) {
    errors.push('Total amount not found');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Format receipt data for sharing
 */
export function formatReceiptForSharing(data: ReceiptData): string {
  const vendor = data.vendor || 'Unknown Store';
  const date = data.date || 'Unknown Date';
  const total = data.total || 'Unknown Amount';

  return `🧾 Receipt Summary

📍 Vendor: ${vendor}
📅 Date: ${date}
💰 Total: ${total}

Generated by One-Click Receipt`;
}
