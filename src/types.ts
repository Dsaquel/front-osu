/* eslint-disable no-use-before-define */
interface Node {
  id: number;
  createAt: string;
  updateAt: string;
}

interface Mappool extends Node {
  displayMappoolsSchedule: string | null;
  isVisible: boolean;
  noMod: number;
  hidden: number;
  hardRock: number;
  doubleTime: number;
  freeMod: number;
  tieBreaker: number;
}

interface TournamentDraft {
  name: string;
  numbersPlayers: number;
  description: string;
  estimateStartDate: string;
}

export interface User extends Node {
  osuId: number;
  username: string;
  avatarUrl: string;
  rank: number;
  discord: string | null;
  tournamentDraft: TournamentDraft;
}

export interface DraftDto {
  name: string;
  details?: string | null;
  rangePlayerMax?: number | null;
  rangePlayerMin?: number | null;
  numbersPlayers?: number | null;
  estimateStartDate?: string | null;
  type?: 'standard' | 'taiko';
}

export interface Draft extends Node {
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
}

export interface CreateTournamentDto {
  name: string;
  startDate?: string;
  description?: string;
  rangePlayerMax?: number;
  rangePlayerMin?: number;
  numbersPlayers?: number;
  commonSchedule?: string;
  hasQualifier?: boolean;
  isPublic?: boolean;
  estimateStartDate?: string;
}

export interface Qualifier extends Node {
  tournamentId: number;
  mappool: MappoolQualifier;
}

export interface MappoolQualifier extends Mappool {
  qualifier: Qualifier;
  qualifierId: number;
}

export interface Tournament extends Node {
  isPublicable: boolean;
  isPublic: boolean;
  name: string;
  startDate: string | null;
  type: 'standard' | 'taiko';
  description: string | null;
  rangePlayerMax: number | null;
  rangePlayerMin: number;
  numbersPlayers: number | null;
  endRegistration: string | null;
  commonSchedule: string | null;
  hasQualifier: boolean;
  qualifier: Qualifier | null;
}

export interface UpdateTournamentDto {
  isPublicable?: boolean;
  name?: string;
  startDate?: string | null;
  type?: 'standard' | 'taiko';
  description?: string | null;
  rangePlayerMax?: number | null;
  rangePlayerMin?: number;
  numbersPlayers?: number;
  endRegistration?: string | null;
  commonSchedule?: string | null;
  hasQualifier?: boolean;
}
