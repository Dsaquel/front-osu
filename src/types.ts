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
}

export type MapType = 'noMod' | 'hidden' | 'hardRock' | 'doubleTime' | 'freeMod' | 'tieBreaker';

interface TournamentDraft {
  name: string;
  numbersPlayers: number;
  description: string;
  estimateStartDate: string;
}

export interface Map extends Node {
  type: MapType;
  beatmapsetId: number;
  beatmapId: number;
  mappoolId: number;
  beatmap: Beatmap;
}

export interface QualifierMap extends Map {
  qualifierId: number;
}

export interface TournamentMap extends Map {
  tournamentId: number;
}

export interface CreateMappoolDto {
  rounds: number[];
  isVisible?: boolean;
  displayMappoolsSchedule?: string | null;
}

export type UpdateMappoolDto = Omit<CreateMappoolDto, 'rounds'>;

export interface QualifierMappool extends Mappool {
  qualifierId: number;
  maps: QualifierMap[];
}

export interface TournamentMappool extends Mappool {
  round: number;
  tournamentId: number;
  maps: TournamentMap[];
}
export interface CreateMapDto {
  type: string;
  beatmapsetId: number;
  beatmapId: number;
  tournamentId?: number;
  qualifierId?: number;
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
  state: 'pending' | 'playing' | 'complete';
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

export interface Beatmap {
  id: number;
  accuracy: number;
  ar: number;
  beatmapset_id: number;
  bpm: number;
  convert: boolean;
  total_length: number; // sec
  cs: number;
  hit_length: number;
  is_scoreable: boolean;
  url: string;
  difficulty_rating: number;
  version: string;
  mode: 'osu' | 'mania' | 'fruits' | 'taiko';
  status: 'graveyard' | 'wip' | 'pending' | 'ranked' | 'approved' | 'qualified' | 'loved';
  beatmapset: {
    preview_url: string;
    title: string;
    creator: string;
    artist: string;
    covers: {
      card: string;
      'card@2x': string;
      'cover@2x': string;
      list: string;
      'list@2x': string;
      slimcover: string;
      'slimcover@2x': string;
    };
  };
}
