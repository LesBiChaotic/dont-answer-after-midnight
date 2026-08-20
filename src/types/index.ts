// AFTERHOURS DOMAIN TYPES & ENTITIES

export type PresenceStatus = 'online' | 'idle' | 'offline' | 'afterhours';

export interface PresenceState {
  userId: string;
  status: PresenceStatus;
  customStatus?: string;
  lastActive: string; // ISO string
  isTypingInThreadId?: string | null;
}

export interface AvatarConfig {
  skinTone: string; // hex or token
  faceShape: 'oval' | 'round' | 'square' | 'sharp';
  eyes: 'normal' | 'tired' | 'wide' | 'narrow' | 'sleepy' | 'intense' | 'pensive' | 'curious';
  eyeColor: string;
  hair: 'short' | 'buzz' | 'messy' | 'curls' | 'long' | 'wavy' | 'dreads' | 'bald' | 'fade' | 'bob';
  hairColor: string;
  facialHair: 'none' | 'stubble' | 'beard' | 'goatee' | 'mustache';
  glasses: 'none' | 'classic' | 'round' | 'thin' | 'dark' | 'reading';
  hearingAids: 'none' | 'left' | 'right' | 'both';
  headCovering: 'none' | 'beanie' | 'hood' | 'cap' | 'hijab' | 'headband';
  piercings: 'none' | 'ear_single' | 'ear_double' | 'nose' | 'eyebrow' | 'lip';
  top: 'tshirt' | 'hoodie' | 'sweater' | 'collared' | 'jacket' | 'tank';
  topColor: string;
  outerwear: 'none' | 'denim_jacket' | 'trench' | 'cardigan' | 'puffer';
  outerwearColor: string;
  background: 'slate' | 'midnight' | 'noir' | 'indigo' | 'amber' | 'emerald' | 'crimson';
  mood: 'neutral' | 'calm' | 'exhausted' | 'pensive' | 'smirk' | 'curious';
  frame: 'minimal' | 'rounded' | 'circle' | 'square' | 'vintage';
  accent: 'none' | 'halo' | 'signal_dot' | 'grain' | 'analog';
}

export type QuietHoursSetting = 'off' | '23:00-07:00' | '00:00-08:00' | 'custom';

export interface ProfileEcho {
  visitorAccountId: string;
  apparentDate: string;
  legacyHandle: string;
  avatarSilhouette: string;
  threadIds: string[];
  provenance: string;
  confidence: number;
}

export interface UserProfile {
  id: string;
  displayName: string;
  handle: string;
  ageConfirmedAdult: boolean;
  genderIdentity?: string;
  pronouns?: string;
  sexuality?: string;
  bio: string;
  statusMessage: string;
  interests: string[];
  avatarConfig: AvatarConfig;
  quietHours: QuietHoursSetting;
  customQuietHours?: { start: string; end: string };
  createdAt: string;
  lastActive: string;
  visibility: 'public' | 'friends_only' | 'afterhours_only';
  storyFlags: string[];
}

export interface UserAccount {
  id: string;
  username: string;
  email?: string;
  profileId: string;
  createdPlatformEra: string;
  accountStatus: 'active' | 'suspended' | 'dormant' | 'echo';
}

export interface ConversationParticipant {
  id: string;
  displayName: string;
  handle: string;
  avatarConfig: AvatarConfig;
  status: PresenceStatus;
  statusMessage?: string;
  customStatus?: string;
  role?: 'member' | 'moderator' | 'admin' | 'archivist' | string;
  isBot?: boolean;
  isModerator?: boolean;
  bio?: string;
}

export type MessageStatus = 
  | 'sending' 
  | 'sent' 
  | 'delivered' 
  | 'read' 
  | 'delivered_previously' 
  | 'read_before_sent' 
  | 'continuity_unresolved';

export interface MessageReaction {
  id: string;
  emoji: string;
  userId: string;
  userHandle: string;
  timestamp: string;
}

export type BookmarkCategory = 'Important' | 'Funny' | 'Strange' | 'Evidence' | 'Personal';

export interface MessageBookmark {
  id: string;
  messageId: string;
  threadId: string;
  category: BookmarkCategory;
  customTag?: string;
  savedAt: string;
  note?: string;
}

export interface VoiceNoteTranscript {
  durationSeconds: number;
  waveform: number[];
  transcriptText: string;
  audioUrl?: string; // Seeded / synthesized
  speakerName: string;
}

export interface MessageAttachment {
  id: string;
  type: 'image' | 'file' | 'audio' | 'link' | 'code' | 'archive_snippet';
  url: string;
  title: string;
  sizeBytes?: number;
  mimeType?: string;
  thumbnailUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface MessageVersion {
  id: string;
  content: string;
  editedAt: string;
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  senderHandle: string;
  senderName: string;
  recipientId?: string;
  content: string;
  timestamp: string; // ISO
  status: MessageStatus;
  replyToMessageId?: string;
  replySnippet?: {
    senderName: string;
    text: string;
  };
  reactions: MessageReaction[];
  attachment?: MessageAttachment;
  voiceNote?: VoiceNoteTranscript;
  isEdited?: boolean;
  versions?: MessageVersion[];
  isDeleted?: boolean;
  isSeeded?: boolean;
  continuityFlag?: string;
}

export interface ConversationThread {
  id: string;
  type: 'dm' | 'group';
  title?: string; // Group title or contact name
  participants: ConversationParticipant[];
  lastMessage?: Message;
  unreadCount: number;
  isMuted: boolean;
  isArchived: boolean;
  isPinned: boolean;
  draftText?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoomRule {
  id: string;
  number: number;
  text: string;
}

export interface Room {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  memberCount: number;
  onlineCount: number;
  moderators: string[];
  pinnedPost?: {
    id: string;
    authorName: string;
    authorHandle: string;
    content: string;
    timestamp: string;
  };
  rules: RoomRule[];
  isJoined: boolean;
  isMuted: boolean;
  createdAt: string;
}

export interface RoomMembership {
  roomId: string;
  userId: string;
  joinedAt: string;
  role: 'member' | 'moderator' | 'admin';
}

export interface StatusMessage {
  id: string;
  userId: string;
  message: string;
  emoji?: string;
  expiresAt?: string;
  createdAt: string;
}

export type NotificationType = 
  | 'message' 
  | 'mention' 
  | 'reaction' 
  | 'room_post' 
  | 'archive_alert' 
  | 'system_update' 
  | 'safety_alert';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  targetUrl: string; // internal route e.g. /chats/thread-1
  isRead: boolean;
  createdAt: string;
  senderHandle?: string;
  metadata?: Record<string, unknown>;
}

export interface BlockedRelationship {
  id: string;
  targetUserId: string;
  targetHandle: string;
  targetDisplayName: string;
  blockedAt: string;
  reason?: string;
}

export interface MutedThread {
  threadId: string;
  mutedAt: string;
  until?: string; // permanent if null
}

export interface ArchivedThread {
  threadId: string;
  archivedAt: string;
}

export type LegacyEra = '2001' | '2004' | '2008' | '2013' | '2018' | '2026';

export interface LegacyPlatform {
  id: string;
  era: LegacyEra;
  title: string;
  codeName: string;
  yearRange: string;
  description: string;
  themeStyle: 'midnight_board_2001' | 'lantern_irc_2004' | 'hushrooms_2008' | 'nitewire_2013' | 'beta_2018';
  recordCount: number;
}

export interface LegacyAccount {
  id: string;
  handle: string;
  displayName: string;
  era: LegacyEra;
  platformName: string;
  joinedDate: string;
  lastSeenDate: string;
  bioSnippet: string;
  avatarSeed?: string;
  continuityNotes?: string;
}

export interface LegacyMessage {
  id: string;
  era: LegacyEra;
  threadId: string;
  threadTitle: string;
  senderHandle: string;
  senderDisplayName: string;
  timestamp: string;
  content: string;
  formatting: 'forum_post' | 'irc_log' | 'darknet_node' | 'flat_bubble' | 'modern';
  corruptedFields?: string[];
}

export interface LegacyArchiveLogLine {
  id: string;
  author: string;
  timestamp: string;
  content: string;
}

export interface LegacyArchiveLog {
  id: string;
  era: LegacyEra;
  title: string;
  date: string;
  channelOrRoom: string;
  sourceSystem: string;
  checksum: string;
  isRestored: boolean;
  lines: LegacyArchiveLogLine[];
}

export interface ModerationCase {
  id: string;
  reportType: string;
  reportedUserId: string;
  reportedHandle: string;
  evidenceSnippet: string;
  status: 'open' | 'investigating' | 'closed' | 'archived';
  filedAt: string;
  moderatorNotes: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  category: string;
  subject: string;
  body: string;
  status: 'pending' | 'answered' | 'escalated';
  createdAt: string;
}

export interface ContinuityRecord {
  id: string;
  entityId: string;
  entityType: 'user' | 'thread' | 'message' | 'room' | 'archive';
  recordType: 'timestamp_anomaly' | 'predated_account' | 'echo_signature' | 'ghost_read';
  description: string;
  discoveredAt: string;
  evidenceRef: string;
}

export interface RelationshipContinuity {
  id: string;
  subjectUserId: string;
  relatedUserId: string;
  relationshipKind: 'prior_correspondence' | 'archived_mirror' | 'lost_connection';
  firstRecordedDate: string;
  status: 'verified' | 'unresolved' | 'suppressed';
}

export interface ConversationEcho {
  id: string;
  sourceThreadId: string;
  originalEra: LegacyEra;
  echoContent: string;
  detectedAt: string;
}

export interface ProfileEcho {
  id: string;
  handle: string;
  sourceEra: LegacyEra;
  archivedBio: string;
  associatedFlags: string[];
}

export interface LiveEvent {
  id: string;
  triggerType: 'timer' | 'route_visit' | 'message_sent' | 'thread_opened' | 'room_joined';
  scheduledTime: number; // timestamp
  action: 'send_message' | 'start_typing' | 'add_notification' | 'room_post' | 'status_update';
  payload: Record<string, unknown>;
  consumed: boolean;
}

export interface TypingEvent {
  threadId: string;
  senderId: string;
  senderName: string;
  durationMs: number;
  startedAt: number;
}

export type StoryStage = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type StoryAccessMode = 'spoiler_free' | 'lore_preview' | 'full_access';

export type EndingType = 'do_not_reply' | 'delete_local' | 'quarantine' | 'scatter' | 'answer';

export interface EndingResult {
  type: EndingType;
  title: string;
  narrativeText: string;
  finalTimestamp: string;
  continuityDepth: number;
  unlockedAt: string;
}

export interface PuzzleHint {
  level: 1 | 2 | 3 | 4;
  type: 'category' | 'route' | 'operation' | 'exact_logic';
  text: string;
  isRevealed: boolean;
}

export interface PuzzleDefinition {
  id: string;
  number: number;
  title: string;
  shortSummary: string;
  stageRequirement: StoryStage;
  category: 'dm' | 'bookmark' | 'archive' | 'export' | 'block' | 'edit_history' | 'quiet_hours' | 'handle_collision' | 'memory' | 'voice_note' | 'reciprocity' | 'continuity_depth' | 'final';
  isSolved: boolean;
  solvedAt?: string;
  clueSnippet: string;
  hints: PuzzleHint[];
  unlockedArtifactTitle?: string;
}

export interface HistoricalBlockRecord {
  id: string;
  handle: string;
  displayName: string;
  blockedDate: string; // e.g. 2014-04-12
  platformEra: LegacyEra;
  reason: string;
  recoveredFromPartition: string;
}

export interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  era: string;
}

export interface ArchiveRestorePacket {
  id: string;
  era: LegacyEra;
  title: string;
  corruptedSnippet: string;
  reconstructedSnippet: string;
  checksum: string;
  isRestored: boolean;
}

export interface LegacyClientMatchItem {
  id: string;
  era: LegacyEra;
  featureName: string;
  description: string;
  clientName: string;
}

export interface RoomPoll {
  id: string;
  roomId: string;
  question: string;
  options: { id: string; text: string; votes: number }[];
  userVotedOptionId?: string;
  createdAt: string;
}

export interface ContinuityState {
  currentStage: StoryStage;
  continuityDepth: number; // 0 to 5
  continuityTokens: number;
  solvedPuzzleIds: string[];
  revealedHintKeys: string[];
  accessMode: StoryAccessMode;
  endingChosen?: EndingType;
  unlockedLoreDocs: string[];
  activeAnomalies: string[];
}

export type ThemeMode = 'light' | 'dark' | 'device';
export type FontChoice = 'afterhours' | 'device';

export interface SoundSettings {
  enabled: boolean; // Default FALSE per engineering master
  volume: number; // 0.0 to 1.0
  messageSent: boolean;
  messageReceived: boolean;
  notifications: boolean;
  reactions: boolean;
  taps: boolean;
}

export interface AccessibilitySettings {
  reduceMotion: boolean;
  highContrast: boolean;
  fontSizeScale: 'small' | 'medium' | 'large';
  screenReaderHints: boolean;
}

export interface SettingsState {
  theme: ThemeMode;
  font: FontChoice;
  sound: SoundSettings;
  accessibility: AccessibilitySettings;
  quietHours: QuietHoursSetting;
  customQuietHours?: { start: string; end: string };
  dataSaver: boolean;
  desktopPreviewEnabled: boolean;
}

export interface DraftState {
  threadId: string;
  text: string;
  updatedAt: string;
}

export interface SearchHistory {
  id: string;
  query: string;
  timestamp: string;
}

export interface DataExportRecord {
  exportedAt: string;
  appVersion: string;
  account: UserAccount;
  profile: UserProfile;
  threads: ConversationThread[];
  messages: Message[];
  bookmarks: MessageBookmark[];
  notifications: Notification[];
  blocked: BlockedRelationship[];
  muted: MutedThread[];
  settings: SettingsState;
  continuityRecords: ContinuityRecord[];
}
