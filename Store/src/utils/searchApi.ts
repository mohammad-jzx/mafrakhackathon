import { Product, products, suggestions } from '../data/products';

export interface SearchFilters {
  query?: string;
  category?: string;
  location?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'name';
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export interface SearchResult {
  products: Product[];
  totalCount: number;
  suggestions: string[];
}

export class SearchAPI {
  static async searchProducts(filters: SearchFilters): Promise<SearchResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    let filteredProducts = [...products];

    // Apply search query filter
    if (filters.query && filters.query.trim()) {
      const query = filters.query.toLowerCase().trim();
      filteredProducts = filteredProducts.filter(product =>
        product.productName.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.storeName.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (filters.category && filters.category !== 'الكل') {
      filteredProducts = filteredProducts.filter(product =>
        product.category === filters.category
      );
    }

    // Apply location filter
    if (filters.location && filters.location !== 'الكل') {
      filteredProducts = filteredProducts.filter(product =>
        product.location === filters.location
      );
    }

    // Apply price filters
    if (filters.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(product =>
        product.price >= filters.minPrice!
      );
    }

    if (filters.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(product =>
        product.price <= filters.maxPrice!
      );
    }

    // Apply stock filter
    if (filters.inStock !== undefined) {
      filteredProducts = filteredProducts.filter(product =>
        product.inStock === filters.inStock
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      filteredProducts.sort((a, b) => {
        switch (filters.sortBy) {
          case 'price_asc':
            return a.price - b.price;
          case 'price_desc':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          case 'name':
            return a.productName.localeCompare(b.productName);
          default:
            return 0;
        }
      });
    }

    // Generate suggestions
    const searchSuggestions = this.generateSuggestions(filters.query || '');

    return {
      products: filteredProducts,
      totalCount: filteredProducts.length,
      suggestions: searchSuggestions
    };
  }

  static generateSuggestions(query: string): string[] {
    if (!query || query.length < 2) return [];

    const queryLower = query.toLowerCase();
    const matchingSuggestions: string[] = [];

    // Check for exact matches in suggestions map
    for (const [key, values] of Object.entries(suggestions)) {
      if (key.includes(queryLower)) {
        matchingSuggestions.push(...values);
      }
    }

    // Check for partial matches in product names
    products.forEach(product => {
      if (product.productName.toLowerCase().includes(queryLower)) {
        matchingSuggestions.push(product.productName);
      }
    });

    // Remove duplicates and limit to 5 suggestions
    return Array.from(new Set(matchingSuggestions)).slice(0, 5);
  }

  static async getProductById(id: number): Promise<Product | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return products.find(product => product.id === id) || null;
  }

  static async getPopularProducts(limit: number = 8): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return products
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }
}