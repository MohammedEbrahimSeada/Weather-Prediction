import {
  Location,
  QueryParameters,
  WeatherAnalysis,
  SavedQuery,
  UserPreferences
} from '../types';
import { generateMockWeatherData } from '../data/mockDataGenerator';
import { createWeatherAnalysis } from '../utils/probabilityCalculator';
import { supabase } from './supabase';

export async function fetchWeatherAnalysis(
  params: QueryParameters
): Promise<WeatherAnalysis> {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const historicalData = generateMockWeatherData(
    params.location,
    params.dateRange,
    20
  );

  const analysis = createWeatherAnalysis(
    params.location,
    params.dateRange,
    historicalData,
    params.thresholds
  );

  return analysis;
}

export async function saveLocation(location: Location): Promise<Location> {
  const { data, error } = await supabase
    .from('locations')
    .insert({
      name: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
      country: location.country,
      region: location.region
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getLocationByCoordinates(
  latitude: number,
  longitude: number
): Promise<Location | null> {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('latitude', latitude)
    .eq('longitude', longitude)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function searchLocations(query: string): Promise<Location[]> {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .ilike('name', `%${query}%`)
    .limit(10);

  if (error) throw error;
  return data || [];
}

export async function saveQuery(query: SavedQuery): Promise<SavedQuery> {
  let locationId = query.parameters.location.id;

  if (!locationId) {
    const existingLocation = await getLocationByCoordinates(
      query.parameters.location.latitude,
      query.parameters.location.longitude
    );

    if (existingLocation) {
      locationId = existingLocation.id;
    } else {
      const newLocation = await saveLocation(query.parameters.location);
      locationId = newLocation.id;
    }
  }

  const { data, error } = await supabase
    .from('saved_queries')
    .insert({
      user_id: query.userId || null,
      name: query.name,
      location_id: locationId,
      parameters: query.parameters as any
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getSavedQueries(userId?: string): Promise<SavedQuery[]> {
  let dbQuery = supabase
    .from('saved_queries')
    .select('*, locations(*)')
    .order('created_at', { ascending: false });

  if (userId) {
    dbQuery = dbQuery.eq('user_id', userId);
  } else {
    dbQuery = dbQuery.is('user_id', null);
  }

  const { data, error } = await dbQuery;

  if (error) throw error;
  return data || [];
}

export async function deleteQuery(queryId: string): Promise<void> {
  const { error } = await supabase
    .from('saved_queries')
    .delete()
    .eq('id', queryId);

  if (error) throw error;
}

export async function getUserPreferences(
  userId?: string
): Promise<UserPreferences | null> {
  let dbQuery = supabase
    .from('user_preferences')
    .select('*')
    .maybeSingle();

  if (userId) {
    dbQuery = dbQuery.eq('user_id', userId);
  } else {
    dbQuery = dbQuery.is('user_id', null);
  }

  const { data, error } = await dbQuery;

  if (error) throw error;
  return data;
}

export async function saveUserPreferences(
  preferences: UserPreferences
): Promise<UserPreferences> {
  const existing = await getUserPreferences(preferences.userId);

  if (existing) {
    const { data, error } = await supabase
      .from('user_preferences')
      .update({
        default_thresholds: preferences.defaultThresholds as any,
        favorite_locations: preferences.favoriteLocations as any,
        default_variables: preferences.defaultVariables as any,
        temperature_unit: preferences.temperatureUnit,
        distance_unit: preferences.distanceUnit,
        updated_at: new Date().toISOString()
      })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('user_preferences')
      .insert({
        user_id: preferences.userId || null,
        default_thresholds: preferences.defaultThresholds as any,
        favorite_locations: preferences.favoriteLocations as any,
        default_variables: preferences.defaultVariables as any,
        temperature_unit: preferences.temperatureUnit,
        distance_unit: preferences.distanceUnit
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
