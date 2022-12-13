export type User = {
  id: number;
  osuId: number;
  username: string;
  avatarUrl: string;
  rank: number;
  discord?: string;
};

export interface UserToken extends User {
  accessToken: string;
}
