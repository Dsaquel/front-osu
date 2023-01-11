/* eslint-disable no-use-before-define */
interface Node {
  id: number;
  createAt: string;
  updateAt: string;
}

export function groupBy<T extends Record<K, PropertyKey>, K extends keyof T>(items: readonly T[], key: K) {
  return items.reduce((acc, item) => {
    (acc[item[key]] = acc[item[key]] || []).push(item);
    return acc;
  }, {} as Record<T[K], T[]>);
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
  lobbies: any;
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

export interface Match extends Node {
  identifier: number;
  round: number;
  player1Score: number;
  player2Score: number;
  startDate: string;
  player1PrevIdentifier: number;
  player2PrevIdentifier: number;
  state: string;
  firstTo: number;
  refereeId: number;
  ruleLobby: string;
  matchesHistoryOsu: string;
  tournamentId: number;
  winnerId: number;
  player1Id: number;
  player2Id: number;
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
