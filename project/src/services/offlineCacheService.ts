import localforage from 'localforage';
import { WeatherAnalysis, QueryParameters, UserPreferences } from '../types';

const CACHE_KEYS = {
  QUERIES: 'cached_queries',
  RESULTS: 'cached_results',
  PREFERENCES: 'user_preferences',
  LAST_SYNC: 'last_sync_timestamp',
};

const CACHE_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

localforage.config({
  name: 'WeatherProb',
  storeName: 'weather_cache',
  description: 'Offline cache for weather analysis data',
});

export interface CachedQuery {
  id: string;
  parameters: QueryParameters;
  result: WeatherAnalysis;
  cachedAt: Date;
}

export async function cacheQueryResult(
  parameters: QueryParameters,
  result: WeatherAnalysis
): Promise<void> {
  try {
    const queries = await getCachedQueries();
    const newQuery: CachedQuery = {
      id: generateQueryId(parameters),
      parameters,
      result,
      cachedAt: new Date(),
    };

    const updatedQueries = [
      newQuery,
      ...queries.filter(q => q.id !== newQuery.id),
    ].slice(0, 50);

    await localforage.setItem(CACHE_KEYS.QUERIES, updatedQueries);
  } catch (error) {
    console.error('Failed to cache query result:', error);
  }
}

export async function getCachedQueryResult(
  parameters: QueryParameters
): Promise<WeatherAnalysis | null> {
  try {
    const queries = await getCachedQueries();
    const queryId = generateQueryId(parameters);
    const cached = queries.find(q => q.id === queryId);

    if (!cached) return null;

    const age = Date.now() - new Date(cached.cachedAt).getTime();
    if (age > CACHE_EXPIRY_MS) {
      return null;
    }

    return cached.result;
  } catch (error) {
    console.error('Failed to retrieve cached query:', error);
    return null;
  }
}

export async function getCachedQueries(): Promise<CachedQuery[]> {
  try {
    const queries = await localforage.getItem<CachedQuery[]>(CACHE_KEYS.QUERIES);
    return queries || [];
  } catch (error) {
    console.error('Failed to get cached queries:', error);
    return [];
  }
}

export async function clearExpiredCache(): Promise<void> {
  try {
    const queries = await getCachedQueries();
    const now = Date.now();
    const validQueries = queries.filter(q => {
      const age = now - new Date(q.cachedAt).getTime();
      return age < CACHE_EXPIRY_MS;
    });

    await localforage.setItem(CACHE_KEYS.QUERIES, validQueries);
  } catch (error) {
    console.error('Failed to clear expired cache:', error);
  }
}

export async function cacheUserPreferences(preferences: UserPreferences): Promise<void> {
  try {
    await localforage.setItem(CACHE_KEYS.PREFERENCES, preferences);
  } catch (error) {
    console.error('Failed to cache user preferences:', error);
  }
}

export async function getCachedUserPreferences(): Promise<UserPreferences | null> {
  try {
    return await localforage.getItem<UserPreferences>(CACHE_KEYS.PREFERENCES);
  } catch (error) {
    console.error('Failed to get cached user preferences:', error);
    return null;
  }
}

export async function updateLastSyncTime(): Promise<void> {
  try {
    await localforage.setItem(CACHE_KEYS.LAST_SYNC, new Date().toISOString());
  } catch (error) {
    console.error('Failed to update last sync time:', error);
  }
}

export async function getLastSyncTime(): Promise<Date | null> {
  try {
    const timestamp = await localforage.getItem<string>(CACHE_KEYS.LAST_SYNC);
    return timestamp ? new Date(timestamp) : null;
  } catch (error) {
    console.error('Failed to get last sync time:', error);
    return null;
  }
}

export async function clearAllCache(): Promise<void> {
  try {
    await localforage.clear();
  } catch (error) {
    console.error('Failed to clear all cache:', error);
  }
}

export async function getCacheSize(): Promise<number> {
  try {
    const queries = await getCachedQueries();
    return queries.length;
  } catch (error) {
    console.error('Failed to get cache size:', error);
    return 0;
  }
}

function generateQueryId(parameters: QueryParameters): string {
  const { location, dateRange, selectedVariables, thresholds } = parameters;
  const idParts = [
    `${location.latitude.toFixed(2)}_${location.longitude.toFixed(2)}`,
    dateRange.startDate.toISOString().split('T')[0],
    dateRange.endDate.toISOString().split('T')[0],
    selectedVariables.sort().join('_'),
    thresholds.map(t => `${t.variableId}_${t.value}`).sort().join('_'),
  ];
  return idParts.join('__');
}

export function useOfflineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

import { useEffect, useState } from 'react';
