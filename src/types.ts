type TournamentDraft = {
  name?: string;
  numberOfParticipant?: number;
  description?: string;
};

export type User = {
  id: number;
  osuId: number;
  username: string;
  avatarUrl: string;
  rank: number;
  discord?: string;
  tournamentDraft: TournamentDraft | null;
};
