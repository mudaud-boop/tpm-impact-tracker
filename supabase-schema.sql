-- Supabase Schema for Impact Tracker
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)

-- Create the impacts table
CREATE TABLE IF NOT EXISTS impacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  job_family TEXT NOT NULL DEFAULT 'TPM',
  impact_category TEXT NOT NULL,
  pillars TEXT[] DEFAULT '{}',
  quantified_value NUMERIC,
  quantified_unit TEXT,
  date DATE NOT NULL,
  program_tags TEXT[] DEFAULT '{}',
  stakeholders TEXT[] DEFAULT '{}',
  evidence_links TEXT[] DEFAULT '{}',
  source TEXT DEFAULT 'web',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index on user_id for faster queries
CREATE INDEX IF NOT EXISTS impacts_user_id_idx ON impacts(user_id);

-- Create an index on date for date range queries
CREATE INDEX IF NOT EXISTS impacts_date_idx ON impacts(date);

-- Enable Row Level Security
ALTER TABLE impacts ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own impacts
CREATE POLICY "Users can view own impacts"
  ON impacts
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own impacts
CREATE POLICY "Users can insert own impacts"
  ON impacts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own impacts
CREATE POLICY "Users can update own impacts"
  ON impacts
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own impacts
CREATE POLICY "Users can delete own impacts"
  ON impacts
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on row update
DROP TRIGGER IF EXISTS update_impacts_updated_at ON impacts;
CREATE TRIGGER update_impacts_updated_at
  BEFORE UPDATE ON impacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- STORAGE: Avatar Bucket
-- =============================================
-- Note: Create the 'avatars' bucket manually in Supabase Dashboard:
-- 1. Go to Storage in your Supabase dashboard
-- 2. Click "New bucket"
-- 3. Name it "avatars"
-- 4. Check "Public bucket" to allow public access to avatars
-- 5. Click "Create bucket"

-- Storage policies for avatars bucket (run after creating bucket)
-- Allow users to upload their own avatar
CREATE POLICY "Users can upload own avatar"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to update their own avatar
CREATE POLICY "Users can update own avatar"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to delete their own avatar
CREATE POLICY "Users can delete own avatar"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow public read access to avatars
CREATE POLICY "Public avatar access"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'avatars');

-- =============================================
-- BETTERWORKS FEEDBACK TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS betterworks_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  from_name TEXT NOT NULL,
  from_role TEXT NOT NULL,
  from_org TEXT NOT NULL,
  feedback TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index on user_id for faster queries
CREATE INDEX IF NOT EXISTS betterworks_feedback_user_id_idx ON betterworks_feedback(user_id);

-- Enable Row Level Security
ALTER TABLE betterworks_feedback ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own feedback
CREATE POLICY "Users can view own feedback"
  ON betterworks_feedback
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own feedback
CREATE POLICY "Users can insert own feedback"
  ON betterworks_feedback
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own feedback
CREATE POLICY "Users can update own feedback"
  ON betterworks_feedback
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own feedback
CREATE POLICY "Users can delete own feedback"
  ON betterworks_feedback
  FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- SPOTLIGHTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS spotlights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  from_name TEXT NOT NULL,
  from_role TEXT NOT NULL,
  from_org TEXT NOT NULL,
  feedback TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index on user_id for faster queries
CREATE INDEX IF NOT EXISTS spotlights_user_id_idx ON spotlights(user_id);

-- Enable Row Level Security
ALTER TABLE spotlights ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own spotlights
CREATE POLICY "Users can view own spotlights"
  ON spotlights
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own spotlights
CREATE POLICY "Users can insert own spotlights"
  ON spotlights
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own spotlights
CREATE POLICY "Users can update own spotlights"
  ON spotlights
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own spotlights
CREATE POLICY "Users can delete own spotlights"
  ON spotlights
  FOR DELETE
  USING (auth.uid() = user_id);
