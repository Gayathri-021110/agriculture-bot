
export interface GroundingSource {
  title: string;
  uri: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: GroundingSource[];
  timestamp: Date;
}

export enum AppMode {
  CHAT = 'CHAT',
  VOICE = 'VOICE',
  MARKET = 'MARKET'
}

export interface LocationData {
  latitude: number;
  longitude: number;
}
