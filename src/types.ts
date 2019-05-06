// client is same as server
export interface Artist {
  id: number;
  name: string;
  alias: string[];
  picUrl?: string;
}

export interface User {
  userId: number;
  nickname: string;
  avatarUrl: string;
}

// client is same as server
export interface Album {
  id: number,
  name: string,
  picUrl: string,
}

// client is same as server
export interface TrackQuality {
  br: number,
  fid: number,
  size: number,
  vd: number,
}
export interface Track {
  id: number;
  name: string;
  artists: Artist[];
  album: Album;
  duration: number;
  high?: TrackQuality;
  middle?: TrackQuality;
  low?: TrackQuality;
  mvId?: number,
  status: number,
}
export function convertTrack(trackServer: TrackServer): Track {
  const { id, name, ar, al, dt, h, l, m, mv, st, } = trackServer;
  return {
    id: id,
    name: name,
    artists: ar,
    album: al,
    duration: dt,
    high: h,
    middle: m,
    low: l,
    mvId: mv,
    status: st
  };
}
export interface TrackServer {
  id: number
  name: string
  ar: Artist[],
  al: Album,
  dt: number,
  h: TrackQuality
  l: TrackQuality
  m: TrackQuality
  mv: number,
  st: number,
}
export interface PlaylistCreator {
  userId: number;
  nickname: string;
}

export type PlaylistType = 'playlist' | 'album';
export interface Playlist {
  id: number;
  picUrl: string;
  name: string;
  playCount: number;
  creator: PlaylistCreator;
}

// export interface PlaylistDetail

export interface Comment {
  user: User;
  time: number;
  content: string;
  likedCount: number;
  beReplied: Comment[];
}
// 0 : mv comment 1: song comment
export enum CommentType {MvComment, SongComment};

export interface ControlBtn {
  onClick: () => void;
}
export interface Rank {
  id: number;
  cover: string;
  name: string;
  artistName: string;
  birefDesc: string;
  rank: number;
  lastRank: number;
}

export interface MvCard {
  id: number;
  cover: string;
  name: string;
  artists: {id: number, name: string}[];
}
export interface Record {
  playCount: number;
  score: number;
  song: Track;
}
export interface TabMenuItem {
  key: number,
  isActive: boolean
  onClick: () => any,
  title: string,
}

export enum PlayMode { Loop, OneLoop, Shuffle }