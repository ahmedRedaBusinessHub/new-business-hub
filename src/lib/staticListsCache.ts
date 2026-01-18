/**
 * Static Lists Cache Service
 * Provides caching for static lists to avoid excessive API calls
 */

interface StaticListConfig {
  id: number;
  name_en: string;
  name_ar: string;
}

interface CacheEntry {
  data: StaticListConfig[];
  timestamp: number;
}

class StaticListsCache {
  private cache: Map<string, CacheEntry> = new Map();
  private cacheDuration = 5 * 60 * 1000; // 5 minutes default

  /**
   * Fetch static list by namespace with caching
   */
  async getByNamespace(namespace: string, forceRefresh = false): Promise<StaticListConfig[]> {
    // Check cache first
    if (!forceRefresh && this.cache.has(namespace)) {
      const entry = this.cache.get(namespace)!;
      const isExpired = Date.now() - entry.timestamp > this.cacheDuration;
      
      if (!isExpired) {
        console.log(`[StaticListsCache] Using cached data for: ${namespace}`);
        return entry.data;
      }
    }

    // Fetch from API
    console.log(`[StaticListsCache] Fetching from API: ${namespace}`);
    try {
      const response = await fetch(`/api/static-lists?namespace=${namespace}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch static list: ${namespace}`);
      }

      const result = await response.json();
      const dataList = Array.isArray(result.data) ? result.data : [];
      
      let config: StaticListConfig[] = [];
      if (dataList.length > 0 && dataList[0].config) {
        config = Array.isArray(dataList[0].config) ? dataList[0].config : [];
      }

      // Store in cache
      this.cache.set(namespace, {
        data: config,
        timestamp: Date.now(),
      });

      return config;
    } catch (error) {
      console.error(`[StaticListsCache] Error fetching ${namespace}:`, error);
      
      // Return cached data if available, even if expired
      if (this.cache.has(namespace)) {
        console.log(`[StaticListsCache] Using stale cache for: ${namespace}`);
        return this.cache.get(namespace)!.data;
      }
      
      return [];
    }
  }

  /**
   * Get item by ID from a namespace
   */
  async getItemById(namespace: string, id: number): Promise<StaticListConfig | null> {
    const list = await this.getByNamespace(namespace);
    return list.find(item => item.id === id) || null;
  }

  /**
   * Get multiple items by IDs from a namespace
   */
  async getItemsByIds(namespace: string, ids: number[]): Promise<StaticListConfig[]> {
    const list = await this.getByNamespace(namespace);
    return list.filter(item => ids.includes(item.id));
  }

  /**
   * Clear cache for a specific namespace
   */
  clearNamespace(namespace: string): void {
    this.cache.delete(namespace);
    console.log(`[StaticListsCache] Cleared cache for: ${namespace}`);
  }

  /**
   * Clear all cache
   */
  clearAll(): void {
    this.cache.clear();
    console.log('[StaticListsCache] Cleared all cache');
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      namespaces: Array.from(this.cache.keys()),
      entries: Array.from(this.cache.entries()).map(([namespace, entry]) => ({
        namespace,
        itemCount: entry.data.length,
        age: Date.now() - entry.timestamp,
        isExpired: Date.now() - entry.timestamp > this.cacheDuration,
      })),
    };
  }

  /**
   * Set cache duration
   */
  setCacheDuration(ms: number): void {
    this.cacheDuration = ms;
  }
}

// Export singleton instance
export const staticListsCache = new StaticListsCache();

// Export for React components
export function useStaticListsCache() {
  return staticListsCache;
}
