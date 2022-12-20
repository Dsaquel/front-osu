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

export type DraftDto = {
  name: string;
  details?: string;
  rangePlayerMax?: number;
  rangePlayerMin?: number;
  numbersPlayers?: number;
  estimateStartDate?: string;
  type?: 'standard' | 'taiko';
};

export type Draft = {
  id: number;
  createAt: string;
  updateAt: string;
  name: string;
  details: string | null;
  rangePlayerMin: number | null;
  rangePlayerMax: number | null;
  estimateStartDate: string | null;
  numbersPlayers: number | null;
  type: 'standard' | 'taiko';
  tournamentId: number;
  owner: User;
  ownerId: number;
};

export type CreateTournamentDto = {
  name: string;
  startDate?: string;
  private?: boolean;
  description?: string;
  rangePlayerMax?: number;
  rangePlayerMin?: number;
  numbersPlayers?: number;
  commonSchedule?: string;
  hasQualifier: boolean | null;
  isPublic?: boolean;
  estimateStartDate?: string;
};
