import { supabase } from '@/integrations/supabase/client';
import { Challenge } from '@/types/championship';

/**
 * Insert a new challenge into the Supabase challenges table.
 * The DB trigger will handle Discord notifications on status changes.
 */
export async function syncChallengeInsert(challenge: Challenge) {
  const { error } = await supabase.from('challenges').insert({
    id: challenge.id,
    list_id: challenge.listId,
    challenger_id: challenge.challengerId,
    challenged_id: challenge.challengedId,
    challenger_name: challenge.challengerName,
    challenged_name: challenge.challengedName,
    challenger_pos: challenge.challengerPos,
    challenged_pos: challenge.challengedPos,
    status: challenge.status,
    type: challenge.type,
    tracks: challenge.tracks ?? null,
    score: challenge.score ?? [0, 0],
  });
  if (error) console.error('Failed to sync challenge insert:', error);
}

/**
 * Update challenge status in Supabase (triggers Discord notification).
 */
export async function syncChallengeStatusUpdate(
  challengeId: string,
  status: string,
  score?: [number, number] | number[] | null
) {
  const update: Record<string, unknown> = { status };
  if (score !== undefined && score !== null) {
    update.score = score;
  }
  const { error } = await supabase
    .from('challenges')
    .update(update)
    .eq('id', challengeId);
  if (error) console.error('Failed to sync challenge status update:', error);
}

/**
 * Update challenge score in Supabase.
 */
export async function syncChallengeScoreUpdate(
  challengeId: string,
  score: [number, number],
  status?: string
) {
  const update: Record<string, unknown> = { score };
  if (status) update.status = status;
  const { error } = await supabase
    .from('challenges')
    .update(update)
    .eq('id', challengeId);
  if (error) console.error('Failed to sync challenge score update:', error);
}
