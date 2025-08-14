/**
 * Figma API Client
 * 
 * Simple wrapper around Figma API for use in React Native
 */

const FIGMA_API_URL = 'https://api.figma.com/v1';

export interface FigmaApiConfig {
  personalAccessToken: string;
}

class FigmaApiClient {
  private accessToken: string;

  constructor(config: FigmaApiConfig) {
    this.accessToken = config.personalAccessToken;
  }

  /**
   * Get file information
   * @param fileKey The Figma file key (found in the URL)
   */
  async getFile(fileKey: string) {
    return this.request(`/files/${fileKey}`);
  }

  /**
   * Get file nodes
   * @param fileKey The Figma file key
   * @param ids Array of node IDs to retrieve
   */
  async getFileNodes(fileKey: string, ids: string[]) {
    const idsParam = ids.join(',');
    return this.request(`/files/${fileKey}/nodes?ids=${idsParam}`);
  }

  /**
   * Get image fills from a file
   * @param fileKey The Figma file key
   */
  async getImages(fileKey: string) {
    return this.request(`/files/${fileKey}/images`);
  }

  /**
   * Export file as images
   * @param fileKey The Figma file key
   * @param options Export options
   */
  async exportImages(fileKey: string, options: {
    ids: string[],
    scale?: number,
    format?: 'jpg' | 'png' | 'svg' | 'pdf'
  }) {
    const params = new URLSearchParams();
    params.append('ids', options.ids.join(','));
    if (options.scale) params.append('scale', options.scale.toString());
    if (options.format) params.append('format', options.format);

    return this.request(`/images/${fileKey}?${params.toString()}`);
  }

  /**
   * Make authenticated request to Figma API
   */
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${FIGMA_API_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'X-Figma-Token': this.accessToken,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Figma API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}

export default FigmaApiClient;
