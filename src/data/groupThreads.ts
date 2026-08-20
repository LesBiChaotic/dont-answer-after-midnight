import { ConversationThread, Message, ConversationParticipant } from '../types';
import { SEEDED_CHARACTERS } from './characters';

const DEFAULT_PARTICIPANT_AVATAR = SEEDED_CHARACTERS[0].avatarConfig;

const getParticipant = (id: string): ConversationParticipant => {
  const found = SEEDED_CHARACTERS.find((c) => c.id === id);
  if (found) return found.participant;
  return {
    id,
    displayName: id.replace('user_', ''),
    handle: id.replace('user_', ''),
    status: 'online',
    avatarConfig: DEFAULT_PARTICIPANT_AVATAR,
  };
};

export const SEEDED_GROUP_THREADS: { thread: ConversationThread; messages: Message[] }[] = [
  // 1. Night Owls
  {
    thread: {
      id: 'grp_night_owls',
      type: 'group',
      title: 'Night Owls',
      participants: [
        getParticipant('user_mara_v'),
        getParticipant('user_ren_o'),
        getParticipant('user_mina_b'),
        getParticipant('user_jonah_p'),
        getParticipant('user_elena_v'),
      ],
      unreadCount: 0,
      isPinned: true,
      isMuted: false,
      isArchived: false,
      createdAt: '2026-08-01T00:00:00Z',
      updatedAt: '2026-08-20T22:20:00Z',
    },
    messages: [
      {
        id: 'no_msg_1',
        threadId: 'grp_night_owls',
        senderId: 'user_jonah_p',
        senderHandle: 'jonah.p',
        senderName: 'Jonah Pike',
        content: 'who is currently awake and why is it because you drank coffee at 9pm?',
        timestamp: '2026-08-20T22:05:00Z',
        status: 'read',
        reactions: [],
      },
      {
        id: 'no_msg_2',
        threadId: 'grp_night_owls',
        senderId: 'user_mina_b',
        senderHandle: 'mina.b',
        senderName: 'Mina Bell',
        content: 'i drank black tea at 11pm and now i am reading about 19th-century lighthouse keeping.',
        timestamp: '2026-08-20T22:08:00Z',
        status: 'read',
        reactions: [],
      },
      {
        id: 'no_msg_3',
        threadId: 'grp_night_owls',
        senderId: 'user_ren_o',
        senderHandle: 'renfieldnotes',
        senderName: 'Ren Okafor',
        content: 'night shift lunch break here. ICU is quiet tonight thankfully.',
        timestamp: '2026-08-20T22:12:00Z',
        status: 'read',
        reactions: [],
      },
      {
        id: 'no_msg_4',
        threadId: 'grp_night_owls',
        senderId: 'user_mara_v',
        senderHandle: 'mara.v',
        senderName: 'Mara Vale',
        content: 'remember to stay hydrated everyone. the night goes faster when you drink water.',
        timestamp: '2026-08-20T22:20:00Z',
        status: 'read',
        reactions: [],
      },
    ],
  },

  // 2. Book Club
  {
    thread: {
      id: 'grp_book_club',
      type: 'group',
      title: 'Book Club',
      participants: [
        getParticipant('user_chloe_z'),
        getParticipant('user_elena_v'),
        getParticipant('user_maya_l'),
        getParticipant('user_jonah_p'),
      ],
      unreadCount: 0,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      createdAt: '2026-08-04T10:00:00Z',
      updatedAt: '2026-08-20T21:15:00Z',
    },
    messages: [
      {
        id: 'bc_msg_1',
        threadId: 'grp_book_club',
        senderId: 'user_chloe_z',
        senderHandle: 'chloe.z',
        senderName: 'Chloe Zhang',
        content: 'what do we think of the epistolary format for modern mystery novels?',
        timestamp: '2026-08-20T21:00:00Z',
        status: 'read',
        reactions: [],
      },
      {
        id: 'bc_msg_2',
        threadId: 'grp_book_club',
        senderId: 'user_elena_v',
        senderHandle: 'elena.v',
        senderName: 'Elena Vance',
        content: 'i love how it builds narrative distance. you only see what the sender chose to write down.',
        timestamp: '2026-08-20T21:15:00Z',
        status: 'read',
        reactions: [],
      },
    ],
  },

  // 3. Old Internet Relics
  {
    thread: {
      id: 'grp_old_internet_crew',
      type: 'group',
      title: 'Old Internet Relics',
      participants: [
        getParticipant('user_felix_a'),
        getParticipant('user_inez_h'),
        getParticipant('user_theo_s'),
        getParticipant('user_dave_c'),
      ],
      unreadCount: 0,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      createdAt: '2026-08-05T02:00:00Z',
      updatedAt: '2026-08-20T21:40:00Z',
    },
    messages: [
      {
        id: 'oi_msg_1',
        threadId: 'grp_old_internet_crew',
        senderId: 'user_felix_a',
        senderHandle: 'felix.a',
        senderName: 'Felix Arden',
        content: 'decompiled a 2001 Hayes modem dialing sound. the frequencies are 1200Hz / 2400Hz FSK modulation.',
        timestamp: '2026-08-20T21:30:00Z',
        status: 'read',
        reactions: [],
      },
      {
        id: 'oi_msg_2',
        threadId: 'grp_old_internet_crew',
        senderId: 'user_inez_h',
        senderHandle: 'inez.h',
        senderName: 'Inez Harrow',
        content: 'i can still hear that handshake sound in my sleep from the 90s.',
        timestamp: '2026-08-20T21:40:00Z',
        status: 'read',
        reactions: [],
      },
    ],
  },

  // 4. Weekend Plans
  {
    thread: {
      id: 'grp_weekend_plans',
      type: 'group',
      title: 'Weekend Plans',
      participants: [
        getParticipant('user_jonah_p'),
        getParticipant('user_mina_b'),
        getParticipant('user_marcus_b'),
      ],
      unreadCount: 0,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      createdAt: '2026-08-16T14:00:00Z',
      updatedAt: '2026-08-20T19:00:00Z',
    },
    messages: [
      {
        id: 'wp_msg_1',
        threadId: 'grp_weekend_plans',
        senderId: 'user_jonah_p',
        senderHandle: 'jonah.p',
        senderName: 'Jonah Pike',
        content: 'anyone down for 24-hour diner breakfast on saturday morning?',
        timestamp: '2026-08-20T19:00:00Z',
        status: 'read',
        reactions: [],
      },
    ],
  },

  // 5. Media Hoarders
  {
    thread: {
      id: 'grp_media_hoarders',
      type: 'group',
      title: 'Media Hoarders',
      participants: [
        getParticipant('user_felix_a'),
        getParticipant('user_theo_s'),
        getParticipant('user_julian_k'),
      ],
      unreadCount: 0,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      createdAt: '2026-08-10T18:00:00Z',
      updatedAt: '2026-08-20T18:30:00Z',
    },
    messages: [
      {
        id: 'mh_msg_1',
        threadId: 'grp_media_hoarders',
        senderId: 'user_felix_a',
        senderHandle: 'felix.a',
        senderName: 'Felix Arden',
        content: 'backed up 400 hours of 1998 radio broadcasts to FLAC. 320GB total.',
        timestamp: '2026-08-20T18:30:00Z',
        status: 'read',
        reactions: [],
      },
    ],
  },

  // 6. Local Lore
  {
    thread: {
      id: 'grp_local_lore',
      type: 'group',
      title: 'Local Lore',
      participants: [
        getParticipant('user_elena_v'),
        getParticipant('user_marcus_b'),
        getParticipant('user_mina_b'),
      ],
      unreadCount: 0,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      createdAt: '2026-08-08T03:00:00Z',
      updatedAt: '2026-08-20T20:00:00Z',
    },
    messages: [
      {
        id: 'll_msg_1',
        threadId: 'grp_local_lore',
        senderId: 'user_marcus_b',
        senderHandle: 'marcus.b',
        senderName: 'Marcus Bell',
        content: 'the radio antenna on Miller hill still broadcasts dead air on 91.3 FM every night at 3am.',
        timestamp: '2026-08-20T20:00:00Z',
        status: 'read',
        reactions: [],
      },
    ],
  },

  // 7. Work Vent
  {
    thread: {
      id: 'grp_work_vent',
      type: 'group',
      title: 'Work Vent',
      participants: [
        getParticipant('user_maya_l'),
        getParticipant('user_noor_p'),
        getParticipant('user_jonah_p'),
      ],
      unreadCount: 0,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      createdAt: '2026-08-11T16:00:00Z',
      updatedAt: '2026-08-20T17:45:00Z',
    },
    messages: [
      {
        id: 'wv_msg_1',
        threadId: 'grp_work_vent',
        senderId: 'user_maya_l',
        senderHandle: 'maya_l',
        senderName: 'Maya Lin',
        content: '4 hour zoom meeting that could have been a 2 sentence direct message.',
        timestamp: '2026-08-20T17:45:00Z',
        status: 'read',
        reactions: [],
      },
    ],
  },

  // 8. No Voice Notes Please
  {
    thread: {
      id: 'grp_no_voice_notes',
      type: 'group',
      title: 'No Voice Notes Please',
      participants: [
        getParticipant('user_mina_b'),
        getParticipant('user_theo_s'),
        getParticipant('user_mara_v'),
      ],
      unreadCount: 0,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      createdAt: '2026-08-12T01:00:00Z',
      updatedAt: '2026-08-20T19:30:00Z',
    },
    messages: [
      {
        id: 'nv_msg_1',
        threadId: 'grp_no_voice_notes',
        senderId: 'user_mina_b',
        senderHandle: 'mina.b',
        senderName: 'Mina Bell',
        content: 'if it takes 3 minutes to say in audio, you can type it in 20 seconds.',
        timestamp: '2026-08-20T19:30:00Z',
        status: 'read',
        reactions: [],
      },
    ],
  },

  // 9. After Midnight
  {
    thread: {
      id: 'grp_after_midnight',
      type: 'group',
      title: 'After Midnight',
      participants: [
        getParticipant('user_samira_c'),
        getParticipant('user_ren_o'),
        getParticipant('user_elena_v'),
      ],
      unreadCount: 0,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      createdAt: '2026-08-14T02:00:00Z',
      updatedAt: '2026-08-20T22:10:00Z',
    },
    messages: [
      {
        id: 'am_msg_1',
        threadId: 'grp_after_midnight',
        senderId: 'user_samira_c',
        senderHandle: 'samira.c',
        senderName: 'Samira Cruz',
        content: 'the silence of the city between 2am and 4am has a specific texture. everything slows down.',
        timestamp: '2026-08-20T22:10:00Z',
        status: 'read',
        reactions: [],
      },
    ],
  },

  // 10. 3:00 AM Coffee Club
  {
    thread: {
      id: 'grp_coffee_club',
      type: 'group',
      title: '3:00 AM Coffee Club',
      participants: [
        getParticipant('user_ren_o'),
        getParticipant('user_jonah_p'),
        getParticipant('user_maya_l'),
      ],
      unreadCount: 0,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      createdAt: '2026-08-15T03:00:00Z',
      updatedAt: '2026-08-20T21:55:00Z',
    },
    messages: [
      {
        id: 'cc_msg_1',
        threadId: 'grp_coffee_club',
        senderId: 'user_ren_o',
        senderHandle: 'renfieldnotes',
        senderName: 'Ren Okafor',
        content: 'aeropress inverted method with a metal disk filter makes the smoothest late night cup.',
        timestamp: '2026-08-20T21:55:00Z',
        status: 'read',
        reactions: [],
      },
    ],
  },

  // 11. BBS Restoration Crew
  {
    thread: {
      id: 'grp_bbs_crew',
      type: 'group',
      title: 'BBS Restoration Crew',
      participants: [
        getParticipant('user_felix_a'),
        getParticipant('user_dave_c'),
        getParticipant('user_theo_s'),
      ],
      unreadCount: 0,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      createdAt: '2026-08-07T00:00:00Z',
      updatedAt: '2026-08-20T20:40:00Z',
    },
    messages: [
      {
        id: 'bbs_msg_1',
        threadId: 'grp_bbs_crew',
        senderId: 'user_dave_c',
        senderHandle: 'dave_c',
        senderName: 'Dave Cho',
        content: 'fixed the ANSI color escape sequences on the terminal door game emulator.',
        timestamp: '2026-08-20T20:40:00Z',
        status: 'read',
        reactions: [],
      },
    ],
  },

  // 12. Staff & Moderation Queue
  {
    thread: {
      id: 'grp_staff_queue',
      type: 'group',
      title: 'Staff Moderation Queue',
      participants: [
        getParticipant('user_mara_v'),
        getParticipant('user_celia_m'),
        getParticipant('user_noor_p'),
        getParticipant('user_theo_s'),
      ],
      unreadCount: 0,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      createdAt: '2026-08-01T00:00:00Z',
      updatedAt: '2026-08-20T21:20:00Z',
    },
    messages: [
      {
        id: 'staff_msg_1',
        threadId: 'grp_staff_queue',
        senderId: 'user_mara_v',
        senderHandle: 'mara.v',
        senderName: 'Mara Vale',
        content: 'all rooms are within normal traffic limits. zero reports in the queue tonight.',
        timestamp: '2026-08-20T21:10:00Z',
        status: 'read',
        reactions: [],
      },
      {
        id: 'staff_msg_2',
        threadId: 'grp_staff_queue',
        senderId: 'user_celia_m',
        senderHandle: 'celia.m',
        senderName: 'Celia March',
        content: 'excellent. safety partitions are verified intact.',
        timestamp: '2026-08-20T21:20:00Z',
        status: 'read',
        reactions: [],
      },
    ],
  },
];
