/* eslint-disable no-shadow */
/* eslint-disable no-use-before-define */

export enum ParticipantType {
  Individual = 'individual',
  Team = 'team',
}

export enum TournamentType {
  Solo = 'solo',
  Team = 'team',
}

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

export type ControlAccess = {
  isOwner: boolean;
  isAdmin: boolean;
  isMappooler: boolean;
  isReferee: boolean;
};

export interface TemplateNotification {
  subject?: string;
  message: string;
}
export type ParticipationUser = {
  participationAsMappooler: boolean;
  participationAsReferee: boolean;
  participationAsAdmin: boolean;
};

export type Role = 'referee' | 'mappooler' | 'admin';

export type MapType = 'noMod' | 'hidden' | 'hardRock' | 'doubleTime' | 'freeMod' | 'tieBreaker';

export type Staff = Admin | Mappooler | Referee;

export type Staffs = {
  admins: Admin[];
  mappoolers: Mappooler[];
  referees: Referee[];
};

export interface Mappooler extends Node {
  validate: boolean;
  userId: number;
  tournamentId: number;
  user: User;
}

export interface StaffSource extends Mappooler {
  source: string;
}

export interface Referee extends Node {
  validate: boolean;
  userId: number;
  tournamentId: number;
  user: User;
}

export interface Admin extends Node {
  validate: boolean;
  userId: number;
  tournamentId: number;
  user: User;
}

export interface Map extends Node {
  type: MapType;
  beatmapsetId: number;
  beatmapId: number;
  mappoolId: number;
  osuBeatmap: Beatmap;
  numberOfType: number;
}

export interface MapParams {
  qualifierId?: number;
  tournamentId?: number;
}

export interface QualifierMap extends Map {
  qualifierId: number;
  participantsMapPlayed: ParticipantMapScore[];
}

export interface ParticipantMapScore extends Node {
  rank: number;
  score: number;
  qualifierMapPlayed: QualifierMap;
  participant: QualifierParticipant;
  participantId: number;
  qualifierMapPlayedId: number;
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

export interface UpdateMatchDto {
  firstTo?: number;
  state?: 'playing' | 'pending' | 'complete';
  startDate?: string;
  rulesLobby?: string;
  matchesHistoryOsu?: string;
  player1Score?: number;
  player2Score?: number;
}

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
  numberOfType?: number;
}
export interface User extends Node {
  osuId: number;
  username: string;
  avatarUrl: string;
  rank: number;
  discord: string | null;
}

export interface Participant extends Node {
  tournamentId: number;
  type: ParticipantType;
}

export interface ParticipantIndividual extends Participant {
  validate: boolean;
  user: User;
  userId: number;
}

export interface ParticipantTeam extends Participant {
  validate: boolean;
  users: User[];
  numberPlayerMin: number;
  numberPlayerMax: number;
  captainId: number;
  invitations: ParticipantInvitation[];
}

export interface InvitationTeam extends Node {
  participantTeam: ParticipantTeam;
  participantTeamId: number;
  tournamentId: number;
  status: 'pending' | 'accepted' | 'declined';
}

export interface ParticipantRequest extends InvitationTeam {
  userRequests: User;
}

export interface ParticipantInvitation extends InvitationTeam {
  userInvited: User[];
}

export interface DraftDto {
  name: string;
  details?: string | null;
  rangePlayerMax?: number | null;
  rangePlayerMin?: number | null;
  numbersPlayers?: number | null;
  estimateStartDate?: string | null;
  mode?: 'standard';
  type?: TournamentType;
}

export interface CreateRescheduleDto {
  schedule?: string;
  status?: 'request' | 'accepted' | 'refused';
  shortMessage: string;
}

export interface Draft extends Node {
  isPublic: boolean;
  isPublicable: boolean;
  name: string;
  details: string | null;
  rangePlayerMin: number | null;
  rangePlayerMax: number | null;
  estimateStartDate: string | null;
  numbersPlayers: number | null;
  type: 'standard';
  owner: User;
  ownerId: number;
  tournament: Tournament;
}

export interface Qualifier extends Node {
  tournamentId: number;
  mappool: MappoolQualifier;
}

export interface Lobby extends Node {
  status: 'pending' | 'started' | 'finished';
  schedule: string;
  superReferee: SuperReferee;
  superRefereeId: number;
  qualifierId: number;
  participantsLobby: QualifierParticipant[];
}

export interface QualifierParticipant extends Participant {
  seed: number | null;
  totalRank: number | null;
  totalScore: number | null;
  lobbyId: number | null;
  qualifierId: number;
}

export interface SuperReferee extends Node {
  type: 'admin' | 'referee' | 'owner';
  admin: Admin | null;
  referee: Referee | null;
  adminId: number | null;
  refereeId: number | null;
  ownerId: number | null;
  lobbies: Lobby[];
}

export interface MappoolQualifier extends Mappool {
  qualifier: Qualifier;
  qualifierId: number;
}

export interface Tournament extends Node {
  isPublicable: boolean;
  isFinished: boolean;
  isInBracketPhase: boolean;
  isPublic: boolean;
  name: string;
  startDate: string | null;
  mode: 'standard';
  type: TournamentType;
  description: string | null;
  rangePlayerMax: number | null;
  rangePlayerMin: number;
  numbersPlayers: number | null;
  registrationEndDate: string | null;
  registrationEnd: boolean;
  commonSchedule: string | null;
  hasQualifier: boolean;
  qualifier: Qualifier | null;
  ownerId: number;
  owner: User;
  winnerId: number | null;
  draftId: number;
  draft: Draft;
  participants: Participant[];
}

export interface Match extends Node {
  identifier: number;
  round: number;
  player1Score: number;
  player1: Player | null;
  player2: Player | null;
  player2Score: number;
  startDate: string | null;
  player1PrevIdentifier: number;
  player2PrevIdentifier: number;
  state: 'pending' | 'playing' | 'complete';
  firstTo: number;
  superRefereeId: number | null;
  superReferee: SuperReferee;
  rulesLobby: string | null;
  matchesHistoryOsu: string | null;
  tournamentId: number;
  winnerId: number | null;
  player1Id: number | null;
  player2Id: number | null;
  reschedules: Reschedule[];
}

export interface Reschedule extends Node {
  schedule: string | null;
  status: 'request' | 'accepted' | 'refused';
  shortMessage: string | null;
  matchId: number;
  superRefereeId: number | null;
  superReferee: SuperReferee | null;
  playerId: number | null;
}

export interface Player extends Node {
  validate: boolean;
  user: User;
  tournamentId: number;
  userId: number;
  seed: number;
}

export interface UpdateLobbyDto {
  schedule?: string;
  status?: 'pending' | 'started' | 'finished';
}

export interface UpdateTournamentDto {
  isPublicable?: boolean;
  name?: string;
  startDate?: string | null;
  mode?: 'standard';
  type?: TournamentType;
  description?: string | null;
  rangePlayerMax?: number | null;
  rangePlayerMin?: number;
  numbersPlayers?: number;
  registrationEndDate?: string | null;
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
