import { LogLevels, SessionTypes, CommunicationStates } from './enums';
import WildEmitter from 'wildemitter';
import WebrtcStatsGatherer from 'webrtc-stats-gatherer';

export interface ISdkConstructOptions {
  environment: string;
  accessToken?: string;
  organizationId?: string;
  wsHost?: string;
  autoConnectSessions?: boolean;
  iceServers?: RTCConfiguration;
  iceTransportPolicy?: RTCIceTransportPolicy;
  logLevel?: LogLevels;
  logger?: ILogger;
  optOutOfTelemetry?: boolean;
  disableAutoAnswer?: boolean;
  defaultAudioElement?: HTMLAudioElement;
  defaultAudioStream?: MediaStream;
  defaultVideoElement?: HTMLVideoElement;
}

/**
 * if defaultAudioElement is provided, it will be used to play incoming call audio *unless* it already has a source in which case the sdk will create a temporary audio element for the call.
 * defaultAudioStream is the outgoing mediaStream for softphone calls. If not provided, one will be created during `acceptSession`. the sdk will not clean up provided streams
 */
export interface ISdkConfig {
  environment?: string;
  accessToken?: string;
  wsHost: string;
  disableAutoAnswer?: boolean;
  autoConnectSessions?: boolean;
  defaultAudioElement?: HTMLAudioElement;
  defaultAudioStream?: MediaStream;
  defaultVideoElement?: HTMLVideoElement;
  iceTransportPolicy?: RTCIceTransportPolicy;
  logLevel?: LogLevels;
  optOutOfTelemetry?: boolean;
  customIceServersConfig?: RTCConfiguration;
}

/**
 * Basics, not an exhaustive list
 */
export interface IPersonDetails {
  id: string;
  name: string;
  chat: {
    jabberId: string;
  };
}

export interface ILogger {
  log (...args: any[]): void;
  debug (...args: any[]): void;
  info (...args: any[]): void;
  warn (...args: any[]): void;
  error (...args: any[]): void;
}

export interface ICustomerData {
  conversation: { id: string };
  sourceCommunicationId: string;
  jwt: string;
}

export interface IPendingSession {
  id: string;
  autoAnswer: boolean;
  address: string;
  conversationId: string;
  sessionType: SessionTypes;
}

export interface ISessionInfo {
  sessionId: string;
  autoAnswer: boolean;
  fromJid: string;
  conversationId: string;
}

export interface IAcceptSessionRequest {
  id: string;
  mediaStream?: MediaStream;
  audioElement?: HTMLAudioElement;
  videoElement?: HTMLVideoElement;
}

export interface IEndSessionRequest {
  id?: string;
  conversationId?: string;
}

export interface IStartSessionParams {
  sessionType: SessionTypes;
  jid?: string;
}

/**
 * id: sessionId
 * mute: update the conversation's mute status to match this value
 */
export interface ISessionMuteRequest {
  id: string;
  mute: boolean;
}

/**
 * Most basic params for a call participant that come from the api: /api/v2/conversations/calls/{conversationId}
 * this is not an exhaustive list, just the ones we currently care about.
 * NOTE: the `participants` in the /api/v2/conversations/{conversationId} api are slightly different, e.g. no `user` object
 */
export interface IConversationParticipant {
  id: string;
  address: string;
  purpose: string;
  state: string;
  direction: string;
  userId?: string;
  muted: boolean;
  videoMuted?: boolean;
  confined: boolean;
}

export interface IJingleSession extends WildEmitter {
  id: string;
  sid: string;
  peerID: string;
  conversationId: string;
  sessionType: SessionTypes;
  streams: MediaStream[];
  tracks: MediaStreamTrack[];
  accept: () => void;
  end: () => void;
  addTrack: (track: MediaStreamTrack) => Promise<void>;
  addStream: (stream: MediaStream) => Promise<void>;
  removeTrack: (track: MediaStreamTrack) => Promise<void>;
  mute: (userId: string, mediaType: 'video' | 'audio') => void;
  unmute: (userId: string, mediaType: 'video' | 'audio') => void;
  pc: {
    getSenders: () => RTCRtpSender[],
    getReceivers: () => RTCRtpReceiver[],
    pc: RTCPeerConnection
  };
  pcParticipant?: IConversationParticipant;
  videoMuted?: boolean;
  audioMuted?: boolean;
  startScreenShare?: () => Promise<void>;
  stopScreenShare?: () => Promise<void>;
  _resurrectVideoOnScreenShareEnd?: boolean;
  _outboundStream?: MediaStream;
  _screenShareStream?: MediaStream;
  _statsGatherer?: WebrtcStatsGatherer;
  _lastParticipantsUpdate?: IParticipantsUpdate;
  _lastOnScreenUpdate?: IOnScreenParticipantsUpdate;
}

export interface IConversationUpdateEvent {
  metadata: {
    correlationId: string;
  };
  topicName: string;
  eventBody: IConversationUpdate;
}

export interface IConversationUpdate {
  id: string;
  participants: [
    {
      id: string;
      purpose: string;
      userId: string;
      videos: [
        {
          context: string,
          audioMuted: boolean,
          videoMuted: boolean,
          id: string,
          state: CommunicationStates,
          peerCount: number,
          sharingScreen: boolean
        }
      ]
    }
  ];
}

export interface IParticipantsUpdate {
  conversationId: string;
  addedParticipants: IParticipantUpdate[];
  removedParticipants: IParticipantUpdate[];
  activeParticipants: IParticipantUpdate[];
}

export interface IParticipantUpdate {
  participantId: string;
  userId: string;
  sharingScreen: boolean;
  videoMuted: boolean;
  audioMuted: boolean;
}

export interface IOnScreenParticipantsUpdate {
  participants: Array<
    {
      userId: string;
    }
  >;
}

export interface ISpeakersUpdate {
  speakers: Array<
    {
      userId: string;
    }
  >;
}
