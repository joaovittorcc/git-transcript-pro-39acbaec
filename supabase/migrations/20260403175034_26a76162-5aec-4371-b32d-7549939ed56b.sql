
-- Create challenges table
CREATE TABLE public.challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  list_id TEXT NOT NULL,
  challenger_id TEXT NOT NULL,
  challenged_id TEXT NOT NULL,
  challenger_name TEXT NOT NULL,
  challenged_name TEXT NOT NULL,
  challenger_pos INTEGER NOT NULL DEFAULT 0,
  challenged_pos INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  type TEXT NOT NULL DEFAULT 'ladder',
  tracks TEXT[] DEFAULT NULL,
  score INTEGER[] DEFAULT ARRAY[0, 0],
  discord_notified_status TEXT DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to challenges" ON public.challenges FOR ALL USING (true) WITH CHECK (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.challenges;

-- Create trigger function to notify Discord on status change
CREATE OR REPLACE FUNCTION public.notify_discord_challenge()
RETURNS TRIGGER AS $$
DECLARE
  payload JSONB;
BEGIN
  -- Only fire when status changes to 'racing' or 'completed'
  -- and hasn't been notified for this status yet
  IF (NEW.status IN ('racing', 'completed'))
     AND (OLD.discord_notified_status IS DISTINCT FROM NEW.status)
     AND (NEW.discord_notified_status IS DISTINCT FROM NEW.status)
     AND (NEW.type IN ('ladder'))
  THEN
    -- Mark as notified to prevent duplicate sends
    NEW.discord_notified_status := NEW.status;

    payload := jsonb_build_object(
      'id', NEW.id,
      'list_id', NEW.list_id,
      'challenger_name', NEW.challenger_name,
      'challenged_name', NEW.challenged_name,
      'challenger_pos', NEW.challenger_pos,
      'challenged_pos', NEW.challenged_pos,
      'status', NEW.status,
      'type', NEW.type,
      'tracks', to_jsonb(NEW.tracks),
      'score', to_jsonb(NEW.score)
    );

    PERFORM net.http_post(
      url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'SUPABASE_URL') || '/functions/v1/discord-challenge-notify',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'SUPABASE_SERVICE_ROLE_KEY')
      ),
      body := payload
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create the trigger
CREATE TRIGGER on_challenge_status_change
  BEFORE UPDATE ON public.challenges
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION public.notify_discord_challenge();

-- Enable pg_net extension for HTTP calls from triggers
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;
