import {
  UserProfile,
  UserAccount,
  ConversationThread,
  Message,
  Room,
  MessageBookmark,
  Notification,
  BlockedRelationship,
  MutedThread,
  SettingsState,
  ContinuityRecord,
  AvatarConfig,
  LegacyPlatform,
  LegacyAccount,
  LegacyMessage,
  ConversationParticipant,
} from '../types';
import { SEEDED_CHARACTERS } from './characters';
import { SEEDED_DM_THREADS } from './dmThreads';
import { SEEDED_GROUP_THREADS } from './groupThreads';
import { SEEDED_COMMUNITY_ROOMS } from './communityRoomsData';
import { LEGACY_ARCHIVE_LOGS } from './legacyArchiveData';
import { INTERNAL_DOCS } from './internalDocsData';
import { HELP_ARTICLES } from './helpCenterData';

export const DEFAULT_AVATAR: AvatarConfig = {
  skinTone: '#E0AC69',
  faceShape: 'oval',
  eyes: 'normal',
  eyeColor: '#1E293B',
  hair: 'short',
  hairColor: '#0F172A',
  facialHair: 'none',
  glasses: 'classic',
  hearingAids: 'none',
  headCovering: 'none',
  piercings: 'none',
  top: 'sweater',
  topColor: '#3B82F6',
  outerwear: 'none',
  outerwearColor: '#1E293B',
  background: 'midnight',
  mood: 'calm',
  frame: 'rounded',
  accent: 'signal_dot',
};

export const INITIAL_PROFILE: UserProfile = {
  id: 'current_user',
  displayName: 'Rowan',
  handle: 'rowan',
  ageConfirmedAdult: true,
  bio: 'Nocturnal archivist and late-night reader. Keeping quiet hours.',
  pronouns: 'they/them',
  genderIdentity: 'Non-binary',
  sexuality: 'Queer',
  statusMessage: 'awake for quiet hours',
  interests: ['Digital Archives', 'Quiet Hours', 'Synth & Ambient', 'Old Internet Relics'],
  quietHours: '00:00-08:00',
  avatarConfig: DEFAULT_AVATAR,
  createdAt: '2026-08-01T00:00:00Z',
  lastActive: '2026-08-20T22:30:00Z',
  visibility: 'public',
  storyFlags: ['onboarding_completed'],
};

export const INITIAL_ACCOUNT: UserAccount = {
  id: 'account_rowan_2026',
  username: 'rowan',
  profileId: 'current_user',
  createdPlatformEra: '2026_afterhours',
  accountStatus: 'active',
};

// 1. All Active Threads (20 DMs + 12 Group Threads)
export const INITIAL_THREADS: ConversationThread[] = [
  ...SEEDED_DM_THREADS.map((d) => d.thread),
  ...SEEDED_GROUP_THREADS.map((g) => g.thread),
];

// 2. All Seeded Messages (DMs, Groups, Rooms)
export const INITIAL_MESSAGES: Message[] = [
  ...SEEDED_DM_THREADS.flatMap((d) => d.messages),
  ...SEEDED_GROUP_THREADS.flatMap((g) => g.messages),
  ...SEEDED_COMMUNITY_ROOMS.flatMap((r) => r.messages),
];

// 3. All 11 Community Rooms
export const INITIAL_ROOMS: Room[] = SEEDED_COMMUNITY_ROOMS.map((r) => r.room);

// 4. Bookmarks (Normal Recipes & Tech Notes + Pre-dated "OUR LIST" Anomaly)
export const INITIAL_BOOKMARKS: MessageBookmark[] = [
  {
    id: 'bm_tea_recipe',
    messageId: 'elena_msg_03',
    threadId: 'thread_elena_dm',
    category: 'Personal',
    customTag: 'Tea Notes',
    savedAt: '2026-08-18T01:15:00Z',
    note: 'Elena\'s loose-leaf roasted oolong steeping method.',
  },
  {
    id: 'bm_synth_schematic',
    messageId: 'bbs_msg_1',
    threadId: 'grp_bbs_crew',
    category: 'Important',
    customTag: 'BBS Relics',
    savedAt: '2026-08-20T20:45:00Z',
    note: 'Dave\'s terminal color patch.',
  },
  {
    id: 'bm_grilled_cheese',
    messageId: 'jonah_msg_01',
    threadId: 'thread_jonah_dm',
    category: 'Personal',
    customTag: 'Recipes',
    savedAt: '2026-08-20T22:21:00Z',
    note: 'Jonah\'s 3am sandwich ratio.',
  },
  {
    id: 'bm_our_list',
    messageId: 'ren_msg_04',
    threadId: 'thread_ren_dm',
    category: 'Evidence',
    customTag: 'OUR LIST',
    savedAt: '2017-04-12T03:19:00Z', // Saved in 2017 despite 2026 account!
    note: 'OUR LIST:\n1. batteries\n2. send Felix archive\n3. finish room banner\n4. buy tea\n5. don\'t answer me after midnight',
  },
];

// 5. 100+ Notification Variants (Normal Dominates, Rare Late Continuity)
export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif_ren_first',
    type: 'message',
    title: 'Ren Okafor',
    body: 'did you ever finish that list?',
    targetUrl: '/chats/thread_ren_dm',
    createdAt: '2026-08-20T22:15:00Z',
    isRead: false,
    senderHandle: 'renfieldnotes',
  },
  {
    id: 'notif_no_room',
    type: 'mention',
    title: '#night-owls',
    body: 'Jonah Pike: who else is awake making irrational food choices at 3am?',
    targetUrl: '/rooms/room_night_owls',
    createdAt: '2026-08-20T21:50:00Z',
    isRead: true,
    senderHandle: 'jonah.p',
  },
  {
    id: 'notif_elena_dm',
    type: 'message',
    title: 'Elena Vance',
    body: 'Elena Vance edited a message in your direct conversation.',
    targetUrl: '/chats/thread_elena_dm',
    createdAt: '2026-08-20T21:42:00Z',
    isRead: true,
    senderHandle: 'elena.v',
  },
  {
    id: 'notif_quiet_hours_active',
    type: 'system_update',
    title: 'Quiet Hours Active',
    body: 'Nocturnal delivery window (00:00 – 08:00) is now in effect. Audio chimes softened.',
    targetUrl: '/settings/sound',
    createdAt: '2026-08-20T00:00:00Z',
    isRead: true,
  },
  {
    id: 'notif_arch_daemon',
    type: 'archive_alert',
    title: 'Archive Daemon',
    body: 'Partition 2008 (Hushrooms) CRC-16 checksum verified. Node 0x88F2 mounted.',
    targetUrl: '/archive/2008',
    createdAt: '2026-08-20T10:00:00Z',
    isRead: true,
  },
  {
    id: 'notif_safety_sync',
    type: 'safety_alert',
    title: 'Safety Hub',
    body: 'Historical block partition (2014) sealed in read-only isolation.',
    targetUrl: '/safety',
    createdAt: '2026-08-19T01:14:00Z',
    isRead: true,
  },
  {
    id: 'notif_pwa_cached',
    type: 'system_update',
    title: 'Offline Cache Updated',
    body: 'All 32 conversation threads cached for offline reading.',
    targetUrl: '/settings/data',
    createdAt: '2026-08-19T18:00:00Z',
    isRead: true,
  },
  {
    id: 'notif_book_club',
    type: 'message',
    title: 'Book Club',
    body: 'Chloe Zhang: what do we think of the epistolary format for modern mystery novels?',
    targetUrl: '/chats/grp_book_club',
    createdAt: '2026-08-20T21:00:00Z',
    isRead: true,
    senderHandle: 'chloe.z',
  },
];

// 6. Blocked & Muted Lists
export const INITIAL_BLOCKED: BlockedRelationship[] = [];
export const INITIAL_MUTED: MutedThread[] = [];

// 7. Legacy Platforms, Accounts, and Messages
export const INITIAL_LEGACY_PLATFORMS: LegacyPlatform[] = [
  {
    id: 'plat_2001',
    era: '2001',
    title: 'Midnight Board',
    codeName: 'MIDNIGHT_BBS',
    yearRange: '2001–2003',
    description: 'Dial-up ASCII message board running on telephone relay nodes.',
    themeStyle: 'midnight_board_2001',
    recordCount: 6,
  },
  {
    id: 'plat_2004',
    era: '2004',
    title: 'Lantern IRC',
    codeName: 'LANTERN_IRCD',
    yearRange: '2004–2007',
    description: 'Monospace IRC channel logs with channel modes and operator bans.',
    themeStyle: 'lantern_irc_2004',
    recordCount: 6,
  },
  {
    id: 'plat_2008',
    era: '2008',
    title: 'Hushrooms',
    codeName: 'HUSHROOMS_V1',
    yearRange: '2008–2012',
    description: 'Tabular browser rooms with unindexed historical nodes.',
    themeStyle: 'hushrooms_2008',
    recordCount: 6,
  },
  {
    id: 'plat_2013',
    era: '2013',
    title: 'Nitewire',
    codeName: 'NITEWIRE_MOBILE',
    yearRange: '2013–2017',
    description: 'Early mobile messaging network with localized partitions.',
    themeStyle: 'nitewire_2013',
    recordCount: 6,
  },
  {
    id: 'plat_2018',
    era: '2018',
    title: 'Afterhours Beta',
    codeName: 'AFTERHOURS_BETA',
    yearRange: '2018–2025',
    description: 'Local-first prototype client testing night mode and IndexedDB caches.',
    themeStyle: 'beta_2018',
    recordCount: 6,
  },
];

export const INITIAL_LEGACY_MESSAGES: LegacyMessage[] = LEGACY_ARCHIVE_LOGS.flatMap((log) =>
  log.lines.map((line: { id: string; author: string; timestamp: string; content: string }) => ({
    id: `leg_msg_${log.id}_${line.id}`,
    era: log.era,
    threadId: log.id,
    threadTitle: log.title,
    senderHandle: line.author,
    senderDisplayName: line.author,
    timestamp: log.date.replace(/T.*$/, `T${line.timestamp}Z`),
    content: line.content,
    formatting:
      log.era === '2001'
        ? 'darknet_node'
        : log.era === '2004'
        ? 'irc_log'
        : log.era === '2008'
        ? 'forum_post'
        : 'flat_bubble',
  }))
);

export const INITIAL_LEGACY_ACCOUNTS: LegacyAccount[] = [
  {
    id: 'leg_acc_sysop',
    handle: 'SYSOP_NITE',
    displayName: 'Sysop Nite',
    era: '2001',
    platformName: 'Midnight BBS',
    joinedDate: '2001-01-01T00:00:00Z',
    lastSeenDate: '2001-12-31T23:59:00Z',
    bioSnippet: 'System operator of Midnight Board Node 1.',
  },
  {
    id: 'leg_acc_beforeyou',
    handle: 'beforeyou',
    displayName: '@beforeyou',
    era: '2008',
    platformName: 'Hushrooms',
    joinedDate: '2008-04-19T03:00:00Z',
    lastSeenDate: '2026-08-20T22:30:00Z',
    bioSnippet: 'Unowned placeholder entity.',
  },
];

// 8. Seeded Participants Dictionary for LiveDirector
export const SEEDED_PARTICIPANTS: Record<string, ConversationParticipant> = {
  elena: SEEDED_CHARACTERS.find((c) => c.id === 'user_elena_v')!.participant,
  ren: SEEDED_CHARACTERS.find((c) => c.id === 'user_ren_o')!.participant,
  mara: SEEDED_CHARACTERS.find((c) => c.id === 'user_mara_v')!.participant,
  felix: SEEDED_CHARACTERS.find((c) => c.id === 'user_felix_a')!.participant,
  noor: SEEDED_CHARACTERS.find((c) => c.id === 'user_noor_p')!.participant,
  celia: SEEDED_CHARACTERS.find((c) => c.id === 'user_celia_m')!.participant,
  mina: SEEDED_CHARACTERS.find((c) => c.id === 'user_mina_b')!.participant,
  theo: SEEDED_CHARACTERS.find((c) => c.id === 'user_theo_s')!.participant,
  inez: SEEDED_CHARACTERS.find((c) => c.id === 'user_inez_h')!.participant,
  jonah: SEEDED_CHARACTERS.find((c) => c.id === 'user_jonah_p')!.participant,
  julian: SEEDED_CHARACTERS.find((c) => c.id === 'user_julian_k')!.participant,
  marcus: SEEDED_CHARACTERS.find((c) => c.id === 'user_marcus_b')!.participant,
  beforeyou: SEEDED_CHARACTERS.find((c) => c.id === 'user_beforeyou')!.participant,
  daemon: {
    id: 'system_daemon',
    displayName: 'Archive Daemon',
    handle: 'sys.daemon',
    status: 'afterhours',
    avatarConfig: DEFAULT_AVATAR,
  },
};

// 9. Settings State
export const INITIAL_SETTINGS: SettingsState = {
  theme: 'dark',
  font: 'afterhours',
  quietHours: '00:00-08:00',
  sound: {
    enabled: false,
    volume: 0.5,
    messageSent: true,
    messageReceived: true,
    notifications: true,
    reactions: true,
    taps: false,
  },
  accessibility: {
    reduceMotion: false,
    highContrast: false,
    fontSizeScale: 'medium',
    screenReaderHints: true,
  },
  dataSaver: false,
  desktopPreviewEnabled: false,
};

// 10. Initial Continuity Records
export const INITIAL_CONTINUITY_RECORDS: ContinuityRecord[] = [
  {
    id: 'cont_rec_1',
    entityId: 'era_2008',
    entityType: 'archive',
    recordType: 'timestamp_anomaly',
    description: 'Hushrooms message hash links to an index partition registered before the protocol creation timestamp.',
    discoveredAt: '2026-08-20T10:00:00Z',
    evidenceRef: 'elena_msg_06',
  },
  {
    id: 'cont_rec_2',
    entityId: 'thread_ren_dm',
    entityType: 'user',
    recordType: 'predated_account',
    description: 'Bookmark "OUR LIST" saved by player handle with timestamp April 12, 2017, predating account registration date.',
    discoveredAt: '2026-08-20T21:14:00Z',
    evidenceRef: 'bm_our_list',
  },
];

// Re-export Datasets
export {
  SEEDED_CHARACTERS,
  SEEDED_DM_THREADS,
  SEEDED_GROUP_THREADS,
  SEEDED_COMMUNITY_ROOMS,
  LEGACY_ARCHIVE_LOGS,
  INTERNAL_DOCS,
  HELP_ARTICLES,
};
