
-- Create championship_seasons table
CREATE TABLE public.championship_seasons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  phase TEXT NOT NULL DEFAULT 'inscricoes',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.championship_seasons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to championship_seasons" ON public.championship_seasons FOR ALL USING (true) WITH CHECK (true);

-- Create championship_registrations table
CREATE TABLE public.championship_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  season_id UUID NOT NULL REFERENCES public.championship_seasons(id) ON DELETE CASCADE,
  pilot_name TEXT NOT NULL,
  car TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(season_id, pilot_name)
);

ALTER TABLE public.championship_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to championship_registrations" ON public.championship_registrations FOR ALL USING (true) WITH CHECK (true);

-- Create championship_race_results table
CREATE TABLE public.championship_race_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  season_id UUID NOT NULL REFERENCES public.championship_seasons(id) ON DELETE CASCADE,
  registration_id UUID NOT NULL REFERENCES public.championship_registrations(id) ON DELETE CASCADE,
  race_number INTEGER NOT NULL,
  finish_position INTEGER NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  UNIQUE(season_id, registration_id, race_number)
);

ALTER TABLE public.championship_race_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to championship_race_results" ON public.championship_race_results FOR ALL USING (true) WITH CHECK (true);

-- Create championship_race_tracks table
CREATE TABLE public.championship_race_tracks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  season_id UUID NOT NULL REFERENCES public.championship_seasons(id) ON DELETE CASCADE,
  race_number INTEGER NOT NULL,
  track_name TEXT NOT NULL,
  UNIQUE(season_id, race_number)
);

ALTER TABLE public.championship_race_tracks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to championship_race_tracks" ON public.championship_race_tracks FOR ALL USING (true) WITH CHECK (true);

-- Create global_logs table
CREATE TABLE public.global_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  player_one TEXT,
  player_two TEXT,
  winner TEXT,
  category TEXT NOT NULL DEFAULT 'general'
);

ALTER TABLE public.global_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to global_logs" ON public.global_logs FOR ALL USING (true) WITH CHECK (true);

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.championship_seasons;
ALTER PUBLICATION supabase_realtime ADD TABLE public.championship_registrations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.championship_race_results;
ALTER PUBLICATION supabase_realtime ADD TABLE public.championship_race_tracks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.global_logs;
