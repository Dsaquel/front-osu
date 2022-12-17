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

export type Tournament = {
  isPublicable: boolean;
  isPublic: boolean;
  name: string;
  startDate: string | null;
  type: 'standard ' | 'taiko';
  description: string | null;
  rangePlayerMax: number | null;
  rangePlayerMin: number | null;
  numbersPlayers: number;
  bestOf: number | null;
  endRegistration: string | null;
  draft: boolean;
  commonSchedule: string | null;
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
