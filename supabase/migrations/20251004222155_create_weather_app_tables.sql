/*
  # Weather Probability App Database Schema

  1. New Tables
    - `locations`
      - `id` (uuid, primary key)
      - `name` (text, location name)
      - `latitude` (numeric, location latitude)
      - `longitude` (numeric, location longitude)
      - `country` (text, country name)
      - `region` (text, geographic region)
      - `created_at` (timestamptz, creation timestamp)
      
    - `saved_queries`
      - `id` (uuid, primary key)
      - `user_id` (uuid, nullable for non-authenticated users)
      - `name` (text, query name)
      - `location_id` (uuid, foreign key to locations)
      - `parameters` (jsonb, query parameters including date ranges and thresholds)
      - `created_at` (timestamptz, creation timestamp)
      
    - `user_preferences`
      - `id` (uuid, primary key)
      - `user_id` (uuid, unique, nullable)
      - `default_thresholds` (jsonb, user's default threshold settings)
      - `favorite_locations` (jsonb, array of favorite location IDs)
      - `default_variables` (jsonb, array of default selected variables)
      - `temperature_unit` (text, celsius or fahrenheit)
      - `distance_unit` (text, km or miles)
      - `updated_at` (timestamptz, last update timestamp)
      
  2. Security
    - Enable RLS on all tables
    - Add policies for public read access to locations (non-sensitive reference data)
    - Add policies for users to manage their own queries and preferences
    - Anonymous users can still use the app without authentication
*/

CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  country text,
  region text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS saved_queries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  name text NOT NULL,
  location_id uuid REFERENCES locations(id),
  parameters jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE,
  default_thresholds jsonb DEFAULT '[]'::jsonb,
  favorite_locations jsonb DEFAULT '[]'::jsonb,
  default_variables jsonb DEFAULT '[]'::jsonb,
  temperature_unit text DEFAULT 'celsius',
  distance_unit text DEFAULT 'km',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Locations are viewable by everyone"
  ON locations FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert locations"
  ON locations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own saved queries"
  ON saved_queries FOR SELECT
  USING (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved queries"
  ON saved_queries FOR INSERT
  WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Users can update their own saved queries"
  ON saved_queries FOR UPDATE
  USING (user_id IS NULL OR auth.uid() = user_id)
  WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved queries"
  ON saved_queries FOR DELETE
  USING (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Users can view their own preferences"
  ON user_preferences FOR SELECT
  USING (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON user_preferences FOR UPDATE
  USING (user_id IS NULL OR auth.uid() = user_id)
  WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_locations_coordinates ON locations(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_saved_queries_user_id ON saved_queries(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_queries_created_at ON saved_queries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
