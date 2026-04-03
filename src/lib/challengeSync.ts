import { supabase } from '@/integrations/supabase/client';
import { Challenge } from '@/types/championship';

const DISCORD_WEBHOOK_URL =
  'https://discord.com/api/webhooks/1489679042193002537/TW2l4nKjhLcikV_9m480wC4phuPPVh5A2u0T3v8_vljV57NooMWQbepfMIwPNv7KBbbn';

/**
 * Send a Discord embed directly via webhook.
 */
async function sendDiscordNotification(payload: Record<string, unknown>) {
  try {
    const res = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const text = await res.text();
    if (res.ok) {
      console.log(`✅ Discord webhook enviado com sucesso: ${res.status} OK`);
    } else {
      console.error(`❌ Erro ao enviar webhook Discord: ${res.status} - ${text}`);
    }
  } catch (err) {
    console.error('❌ Falha na requisição ao Discord:', err);
  }
}

function getListLabel(listId: string): string {
  if (listId.toLowerCase().includes('01') || listId === 'list-1') return 'Lista 01';
  if (listId.toLowerCase().includes('02') || listId === 'list-2') return 'Lista 02';
  return listId;
}

function buildAcceptedEmbed(c: {
  challenger_name: string;
  challenged_name: string;
  challenger_pos: number;
  challenged_pos: number;
  list_id: string;
  tracks: string[] | null;
}) {
  const listLabel = getListLabel(c.list_id);
  const tracksText = c.tracks?.length
    ? c.tracks.map((t, i) => `🏁 Pista ${i + 1}: **${t}**`).join('\n')
    : 'Pistas não definidas';

  return {
    embeds: [
      {
        title: '⚔️ DESAFIO DE LISTA CONFIRMADO!',
        color: 0x00d4ff,
        fields: [
          { name: '🏎️ Desafiante', value: `**${c.challenger_name}** (#${c.challenger_pos + 1})`, inline: true },
          { name: '🛡️ Defensor', value: `**${c.challenged_name}** (#${c.challenged_pos + 1})`, inline: true },
          { name: '📋 Lista', value: listLabel, inline: true },
          { name: '🗺️ Pistas da MD3', value: tracksText, inline: false },
          { name: '🎯 Posição em Jogo', value: `Posição **#${c.challenged_pos + 1}** da ${listLabel}`, inline: false },
        ],
        footer: { text: 'Gran Turismo Racing League • Desafio de Lista' },
        timestamp: new Date().toISOString(),
      },
    ],
  };
}

function buildCompletedEmbed(c: {
  challenger_name: string;
  challenged_name: string;
  challenger_pos: number;
  challenged_pos: number;
  list_id: string;
  score: number[];
}) {
  const listLabel = getListLabel(c.list_id);
  const score = c.score ?? [0, 0];
  const challengerWon = score[0] > score[1];
  const winner = challengerWon ? c.challenger_name : c.challenged_name;
  const loser = challengerWon ? c.challenged_name : c.challenger_name;
  const finalScore = challengerWon ? `${score[0]}x${score[1]}` : `${score[1]}x${score[0]}`;

  const newConfig = challengerWon
    ? `**${winner}** sobe para a posição **#${c.challenged_pos + 1}** e **${loser}** desce para **#${c.challenger_pos + 1}**`
    : `**${winner}** mantém a posição **#${c.challenged_pos + 1}** na ${listLabel}`;

  return {
    embeds: [
      {
        title: '🏁 RESULTADO: DISPUTA DE POSIÇÃO',
        color: 0x9d00ff,
        fields: [
          { name: '🏆 Vencedor', value: `**${winner}**`, inline: true },
          { name: '❌ Perdedor', value: `**${loser}**`, inline: true },
          { name: '📊 Placar Final', value: `**${finalScore}**`, inline: true },
          { name: '🔄 Nova Configuração', value: newConfig, inline: false },
        ],
        footer: { text: `Gran Turismo Racing League • ${listLabel}` },
        timestamp: new Date().toISOString(),
      },
    ],
  };
}

/**
 * Insert a new challenge into Supabase and notify Discord (status=racing).
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
  if (error) {
    console.error('Failed to sync challenge insert:', error);
  }

  // Send Discord notification for accepted challenge
  if (challenge.status === 'racing' && challenge.type === 'ladder') {
    console.log('📤 Enviando notificação de desafio confirmado ao Discord...');
    const embed = buildAcceptedEmbed({
      challenger_name: challenge.challengerName,
      challenged_name: challenge.challengedName,
      challenger_pos: challenge.challengerPos,
      challenged_pos: challenge.challengedPos,
      list_id: challenge.listId,
      tracks: challenge.tracks ?? null,
    });
    await sendDiscordNotification(embed);
  }
}

/**
 * Update challenge status in Supabase.
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
 * Update challenge score in Supabase and notify Discord on completion.
 */
export async function syncChallengeScoreUpdate(
  challengeId: string,
  score: [number, number],
  status?: string,
  challengeData?: {
    challenger_name: string;
    challenged_name: string;
    challenger_pos: number;
    challenged_pos: number;
    list_id: string;
    type: string;
  }
) {
  const update: Record<string, unknown> = { score };
  if (status) update.status = status;
  const { error } = await supabase
    .from('challenges')
    .update(update)
    .eq('id', challengeId);
  if (error) console.error('Failed to sync challenge score update:', error);

  // Send Discord notification for completed challenge
  if (status === 'completed' && challengeData && challengeData.type === 'ladder') {
    console.log('📤 Enviando resultado do desafio ao Discord...');
    const embed = buildCompletedEmbed({
      challenger_name: challengeData.challenger_name,
      challenged_name: challengeData.challenged_name,
      challenger_pos: challengeData.challenger_pos,
      challenged_pos: challengeData.challenged_pos,
      list_id: challengeData.list_id,
      score,
    });
    await sendDiscordNotification(embed);
  }
}
