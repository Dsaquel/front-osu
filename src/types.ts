type TournamentDraft = {
  name: string;
  numbersPlayers: number;
  description: string;
  estimateStartDate: string;
};

export type User = {
  id: number;
  osuId: number;
  username: string;
  avatarUrl: string;
  rank: number;
  discord: string | null;
  tournamentDraft: TournamentDraft;
};
