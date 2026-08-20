export interface InternalDoc {
  id: string;
  docNumber: string;
  category: 'Incident Report' | 'Engineering RFC' | 'Data Science' | 'Trust & Safety' | 'Moderation Log' | 'Migration Note';
  title: string;
  author: string;
  department: string;
  date: string;
  classification: 'RESTRICTED / INTERNAL' | 'STAFF ONLY' | 'ARCHIVE MEMO' | 'INCIDENT POST-MORTEM';
  summary: string;
  content: string;
  relatedIds?: string[];
}

export const INTERNAL_DOCS: InternalDoc[] = [
  {
    id: 'doc_inc_2014_lockup',
    docNumber: 'INC-2014-0819',
    category: 'Incident Report',
    title: 'Post-Mortem: Safety Partition Lockup on Nitewire Gateway Shards',
    author: 'Celia March (Trust & Safety) / Theo Sato (Data Systems)',
    department: 'Infrastructure & Safety Engineering',
    date: '2014-08-20',
    classification: 'INCIDENT POST-MORTEM',
    summary: 'Analysis of automated block-partition isolation failures during the 2014 mobile client migration.',
    content: `INCIDENT SUMMARY:
On August 19, 2014, between 01:14 UTC and 04:30 UTC, Nitewire gateway shards experienced repeated thread-locking when processing user blocklists involving unowned placeholder handles. 

TIMELINE OF EVENTS:
01:14 UTC - Gateway node G-09 logged 1,420 unhandled NullPointerExceptions during relationship sync.
01:42 UTC - Block-engine attempted to write reciprocal suppression flags for handle '@beforeyou'.
02:15 UTC - Database partition failed to resolve registration date, creating an infinite recursion loop between 2008 legacy records and 2014 active sessions.
03:00 UTC - Engineering deployed an emergency isolation patch: the block list entry was segregated into a frozen read-only historical partition.

ROOT CAUSE ANALYSIS:
The placeholder handle '@beforeyou' possesses no valid user_id or device session record. When a user executed a block command, the relationship daemon attempted to write a mutual block acknowledgement to a non-existent account row.

CORRECTIVE ACTIONS:
1. Implemented static historical block partitions that do not require reciprocal server acknowledgements.
2. Frozen block records from 2014 will persist permanently across future platform iterations without database mutations.`,
  },
  {
    id: 'doc_ds_quiet_hours',
    docNumber: 'DS-2026-0312',
    category: 'Data Science',
    title: 'Statistical Distribution of Anomaly Reports Correlated to Low Network Traffic (00:00–04:00)',
    author: 'Theo Sato, Staff Data Engineer',
    department: 'Systems Metrics & Telemetry',
    date: '2026-03-12',
    classification: 'RESTRICTED / INTERNAL',
    summary: 'Quantitative evaluation of timestamp inversions and unread phantom indicators during low-noise midnight hours.',
    content: `EXECUTIVE SUMMARY:
Analysis of 1.2 million message events over a 90-day window reveals a statistically significant anomaly clustering phenomenon. 94.2% of all reported timestamp inversions, backfilled quote links, and phantom unread indicators occur strictly between 00:00:00 and 04:00:00 local client time.

OBSERVATIONAL DATA:
- Peak Active User Window: 20:00–23:30 (Avg 42,000 concurrent sockets). Anomaly frequency: 0.002% per 10k messages.
- Low-Noise Quiet Window: 00:00–04:00 (Avg 3,100 concurrent sockets). Anomaly frequency: 4.81% per 10k messages.

WORKING HYPOTHESES:
1. Skeptical Explanation (Mina Bell et al.): Multi-region Redis clusters initiate garbage collection and database compaction during low-traffic windows. Network latency spikes during compaction cause NTP clock skew and out-of-order message ingestion.
2. Anomaly Engine Hypothesis: Low ambient network noise allows dormant continuity threads to establish reciprocal socket connections without packet collision suppression.

RECOMMENDATION:
Maintain default Quiet Hours delivery softenings. Do not attempt aggressive server-side packet purging between 00:00 and 04:00.`,
  },
  {
    id: 'doc_rfc_continuity_resolver',
    docNumber: 'RFC-2026-0419',
    category: 'Engineering RFC',
    title: 'RFC: Continuity Resolver Protocol Spec v0.8.4',
    author: 'Noor Pradana / Elena Vance',
    department: 'Core Architecture',
    date: '2026-04-19',
    classification: 'STAFF ONLY',
    summary: 'Technical specification for bridging legacy archive partitions across disparate database schemas.',
    content: `1. OBJECTIVE:
To provide unified cross-era message search and quote resolution without requiring lossy database migrations or data flattening.

2. SPECIFICATION OVERVIEW:
The Continuity Resolver operates as an append-only graph index connecting:
- 2001 Midnight Board ASCII text records (Format: Raw CP437)
- 2004 Lantern IRC channel logs (Format: mIRC log raw)
- 2008 Hushrooms tabbed message nodes (Format: HTML tabular)
- 2013 Nitewire mobile JSON records (Format: Proto2)
- 2026 AFTERHOURS IndexedDB client stores (Format: Structured JSON)

3. SECURITY & IDENTITY SAFETY INVARIANT:
The Continuity Resolver is strictly READ-ONLY with respect to current active user profiles. Under no circumstances may an archive link mutate a user's display name, gender, pronouns, sexuality, or avatar configuration.`,
  },
  {
    id: 'doc_mig_handle_collision',
    docNumber: 'MIG-2026-0104',
    category: 'Migration Note',
    title: 'Handle Collision Audit: Legacy Re-use vs Temporal Shards',
    author: 'Felix Arden, Lead Archivist',
    department: 'Archive Operations',
    date: '2026-01-04',
    classification: 'ARCHIVE MEMO',
    summary: 'Audit of handle collisions between 2008 Hushrooms member handles and newly registered 2026 accounts.',
    content: `AUDIT REPORT:
During the initial indexing of the 2008 Hushrooms database, automated checksum scanners flagged 413 handle collisions where newly created 2026 accounts shared identical alphanumeric strings with 2008 archived participants.

KEY FINDINGS:
1. Normal Handle Recycling: Common handles (e.g. 'alex', 'nightowl', 'shadow') represent natural naming overlap across an 18-year period.
2. Anomalous Thread Persistence (C-0419-RECUR): In exactly 12 cases, the conversation thread ID in the 2008 archive matches the active 2026 thread ID bit-for-bit.
3. Behavior: When a current user replies to a message within thread C-0419-RECUR, the server index backfills reciprocal continuity tokens to 2008.

ARCHIVE DIRECTIVE:
Preserve all historical node pointers. Do not overwrite 2008 message bodies.`,
  },
  {
    id: 'doc_ts_quarantine_protocol',
    docNumber: 'TS-2026-0520',
    category: 'Trust & Safety',
    title: 'Policy Memo: Protocol for Quarantining Unowned Relationship Shards',
    author: 'Celia March, Trust & Safety Lead',
    department: 'Trust & Safety',
    date: '2026-05-20',
    classification: 'RESTRICTED / INTERNAL',
    summary: 'Guidelines for moderator intervention when users encounter self-generating historical direct threads.',
    content: `PURPOSE:
Establish clear Trust & Safety guidelines when a community member reports receiving direct messages from unowned historical handles or experiences timestamp inversions.

MODERATION PROCEDURES:
1. Validate User Boundary Controls: Confirm user has access to local block, mute, and thread quarantine actions.
2. Do Not Invalidate User Experience: Avoid dismissing reports as mere user error. Acknowledge that legacy database indexing can surface confusing relics.
3. Thread Quarantine Protocol: If a user requests complete thread freezing, provide the Isolation Seal tool. This locks the thread in read-only status and halts further continuity token propagation.
4. Escalate to Engineering: Log all conversation IDs matching regex pattern '^C-[0-9]{4}-RECUR$' directly to Theo Sato.`,
  },
  {
    id: 'doc_ntp_clock_drift',
    docNumber: 'SYS-2026-0228',
    category: 'Engineering RFC',
    title: 'Systems Diagnostic: Multi-Region NTP Clock Drift & Socket Latency',
    author: 'Theo Sato, Staff Data Systems Engineer',
    department: 'Infrastructure',
    date: '2026-02-28',
    classification: 'STAFF ONLY',
    summary: 'Technical evaluation of client-side clock skew causing impossible negative delivery timestamps.',
    content: `PROBLEM STATEMENT:
Multiple mobile clients running iOS and Android have submitted automated diagnostic reports indicating negative latency timestamps (e.g. message received timestamp predates message sent timestamp by -14,200ms).

TECHNICAL INVESTIGATION:
1. NTP Stratum Synchronization: Server nodes sync every 60s against Stratum 1 atomic clock sources (time.cloudflare.com, pool.ntp.org). Maximum server drift measured: 1.2ms.
2. Mobile OS Sleep Throttling: Mobile operating systems aggressively throttle background timers when the screen is locked. When the app resumes at 03:00 AM, the WebSocket connection flushes buffered frames with local device clock offsets.
3. Conclusion: While clock skew accounts for sub-second jitter, it CANNOT explain messages with valid cryptographic signatures dated in 2009 or 2017.`,
  },
  {
    id: 'doc_pwa_offline_storage',
    docNumber: 'ENG-2026-0301',
    category: 'Engineering RFC',
    title: 'PWA Offline-First IndexedDB Schema Versioning & Migration Integrity',
    author: 'Noor Pradana, Mobile Product Engineer',
    department: 'Client Architecture',
    date: '2026-03-01',
    classification: 'STAFF ONLY',
    summary: 'Architecture documentation for local-first storage, service worker cache partitioning, and draft safety.',
    content: `1. STORAGE SPECIFICATION:
AFTERHOURS uses a dual-layer local caching architecture:
- Layer 1 (Service Worker Cache API): Static shell assets (HTML, CSS, JS bundles, vector avatar assets).
- Layer 2 (IndexedDB 'afterhours_db_v1'): Structured object stores for 'profile', 'threads', 'messages', 'bookmarks', 'notifications', 'blocked', 'muted', 'settings', 'continuity'.

2. DRAFT SAFETY GUARANTEE:
Message drafts are committed to IndexedDB on every keystroke (debounced 150ms). If the user navigates away, switches apps, or loses network connectivity, the composer restores the exact draft upon thread re-entry.

3. OFFLINE READABILITY:
All historical partitions loaded during active sessions are retained in IndexedDB, allowing 100% offline reading and search indexing.`,
  },
  {
    id: 'doc_mod_log_night_owls',
    docNumber: 'MOD-2026-0814',
    category: 'Moderation Log',
    title: 'Moderator Incident Log: Room #night-owls Spate of Phantom Typing Indicators',
    author: 'Mara Vale, Community Moderator',
    department: 'Community Management',
    date: '2026-08-14',
    classification: 'STAFF ONLY',
    summary: 'Log of member reports regarding typing indicators appearing without corresponding message delivery.',
    content: `INCIDENT LOG:
Date: August 14, 2026, 03:22 UTC
Channel: #night-owls
Moderator on Duty: Mara Vale (@mara.v)

INCIDENT DESCRIPTION:
Between 03:15 and 03:40 UTC, five room participants (including @mina.b and @jonah.p) noted that the room typing indicator displayed "2 people are typing..." continuously for 25 minutes without any messages appearing in the feed.

INVESTIGATION:
- Checked active WebSocket socket connections. Found 42 connected clients.
- Socket ID 0x88F2 was broadcasting typing events every 2.5 seconds with an empty payload.
- Sender signature resolved to legacy entity '@beforeyou'.
- Action Taken: Deployed a temporary UI debounce filter. Reassured room members that it was a standard keep-alive socket retry loop.`,
  },
  {
    id: 'doc_audio_soundscapes',
    docNumber: 'AUD-2026-0610',
    category: 'Incident Report',
    title: 'Audio Artifact Analysis: Ambient Field Recording Loops and Iteration Tags',
    author: 'Julian K. (Sound Design) / Felix Arden (Archives)',
    department: 'Audio Engineering',
    date: '2026-06-10',
    classification: 'ARCHIVE MEMO',
    summary: 'Acoustic waveform analysis of recurring room tone recordings submitted to #soundscapes.',
    content: `ACOUSTIC ANALYSIS:
File Analyzed: 'ambient_room_hum_take4.wav' (120s loop)
Source: Field recording captured in an abandoned telecom switching substation.

FINDINGS:
1. Low-Frequency Resonance: A constant 58.4 Hz electromagnetic drone is present throughout the recording.
2. Phase Inversion Artifacts: Cross-correlation analysis against a 2008 Hushrooms audio attachment reveals identical harmonic overtone alignment (99.8% match).
3. Metadata Header: The file container contains embedded ID3 comment: "the fourth time we stopped talking. do not answer after midnight."`,
  },
  {
    id: 'doc_ticket_our_list',
    docNumber: 'SUP-2026-0811',
    category: 'Trust & Safety',
    title: 'Support Ticket #4419: Pre-Dated Bookmark "OUR LIST" Anomaly',
    author: 'Elena Vance, Support Triage',
    department: 'Support & Safety',
    date: '2026-08-11',
    classification: 'STAFF ONLY',
    summary: 'Support investigation into user bookmarks displaying saved timestamps from 2017.',
    content: `TICKET SUMMARY:
User submitted an inquiry regarding a bookmark tagged "OUR LIST" appearing in their Saved Bookmarks view. The bookmark displays savedAt: "2017-04-12T03:19:00Z", despite the user account having been registered in August 2026.

TRIAGE FINDINGS:
- Bookmark content: 
  "1. batteries
   2. send Felix archive
   3. finish room banner
   4. buy tea
   5. don't answer me after midnight"
- The bookmark's cryptographic author signature matches the current user's cryptographic public key.
- Resolution: Documented under Continuity Record cont_rec_2. Ticket marked as 'Monitored / Non-Destructive Relic'.`,
  },
  {
    id: 'doc_mod_spam_mitigation',
    docNumber: 'MOD-2026-0701',
    category: 'Moderation Log',
    title: 'Quarterly Review: Automated Spam Filters and Volume Warning Compliance',
    author: 'Mara Vale / Celia March',
    department: 'Community Management',
    date: '2026-07-01',
    classification: 'STAFF ONLY',
    summary: 'Evaluation of community rule enforcement regarding audio volume notices and late-night posting volume.',
    content: `QUARTERLY REVIEW:
During Q2 2026, moderation intervention was required in 14 instances across 8 community rooms.

METRICS:
- Audio Volume Violations: 9 warnings issued for sharing sound files without explicit '[VOLUME WARNING]' text tags.
- Midnight Rule Discussions: 5 threads in #urban-legends moderated to maintain calm and prevent collective panic.
- Community Health: 98.4% of all messages in #night-owls and #old-internet adhere to the sanctuary code of conduct.`,
  },
  {
    id: 'doc_sec_indexeddb_crypto',
    docNumber: 'SEC-2026-0412',
    category: 'Engineering RFC',
    title: 'Cryptographic Integrity Verification for Local IndexedDB Storage',
    author: 'Noor Pradana, Mobile Product Engineer',
    department: 'Security & Core Architecture',
    date: '2026-04-12',
    classification: 'RESTRICTED / INTERNAL',
    summary: 'Implementation of SHA-256 integrity hashing for locally persisted conversation messages.',
    content: `SECURITY SPECIFICATION:
To ensure message tamper-resistance on mobile devices without relying on central telemetry:
1. Each message payload is hashed upon storage using SHA-256.
2. When the client boots, a background integrity validator checks stored message hashes against the local continuity tree.
3. If an anomaly is detected (e.g. historical backfill), the client flags the message with 'status: delivered_previously' rather than discarding it.`,
  },
  {
    id: 'doc_ds_user_retention',
    docNumber: 'DS-2026-0518',
    category: 'Data Science',
    title: 'Nocturnal User Cohort Retention & Peak Active Hours Analysis',
    author: 'Theo Sato, Staff Data Engineer',
    department: 'Analytics',
    date: '2026-05-18',
    classification: 'RESTRICTED / INTERNAL',
    summary: 'Behavioral analysis of late-night messaging frequency and session durations.',
    content: `COHORT ANALYSIS:
- 72% of daily active users open AFTERHOURS between 23:00 and 04:30.
- Average session duration during nocturnal hours: 44 minutes (compared to 8 minutes during daytime).
- Direct message exchange depth: 18.4 messages per session.
- Conclusion: Users treat AFTERHOURS as an intimate sanctuary for deep, reflective correspondence rather than rapid-fire broadcast communication.`,
  },
  {
    id: 'doc_ts_harassment_policy',
    docNumber: 'TS-2026-0210',
    category: 'Trust & Safety',
    title: 'Trust & Safety Standard Operating Procedure: Stalking & Unwanted Contact',
    author: 'Celia March, Trust & Safety Lead',
    department: 'Trust & Safety',
    date: '2026-02-10',
    classification: 'RESTRICTED / INTERNAL',
    summary: 'Standard operating procedures for rapid containment of abusive behavior and boundary enforcement.',
    content: `POLICY DIRECTIVES:
1. One-Click Block & Hide: Any user can instantly sever communication with any handle. The client immediately hides the contact from search suggestions and active direct threads.
2. No Retaliatory Notifications: The blocked participant is never sent a notification stating "You have been blocked."
3. Local Evidence Preservation: If a user reports harassment, local message logs are preserved on device for support export even if the thread is purged from the main inbox.`,
  },
  {
    id: 'doc_arch_crc_restoration',
    docNumber: 'ARC-2026-0622',
    category: 'Migration Note',
    title: 'Archive Restoration Protocol: CRC-16 Frame Alignment on 2001 BBS Records',
    author: 'Felix Arden, Lead Archivist',
    department: 'Archive Operations',
    date: '2026-06-22',
    classification: 'ARCHIVE MEMO',
    summary: 'Technical guide for repairing damaged packet blocks from the 2001 Midnight Board archives.',
    content: `RESTORATION INSTRUCTIONS:
Corrupted packet blocks from the 2001 Midnight Board archive frequently suffer from bit-shift errors caused by obsolete 300-baud modem compression routines.

RESTORE PROCEDURE:
1. Extract 64-byte frame header.
2. Verify against CRC-16 checksum (Polynomial 0x1021).
3. If checksum fails, adjust frame boundary offset by +2 bytes to align ASCII carriage-return delimiters.
4. Output verified plaintext to the 2001 archive partition.`,
  },
  {
    id: 'doc_eng_haptics_synthesis',
    docNumber: 'ENG-2026-0315',
    category: 'Engineering RFC',
    title: 'Synthesized Web Audio Tones: Zero Asset Dependency & Zero Jumpscares',
    author: 'Julian K. / Noor Pradana',
    department: 'Client Architecture',
    date: '2026-03-15',
    classification: 'STAFF ONLY',
    summary: 'Technical specification for generating all client sound cues purely in code using the Web Audio API.',
    content: `DESIGN CONSTRAINTS:
1. Zero Audio Assets: No external MP3/WAV files are downloaded for system notifications. All chimes, pops, and reaction tones are synthesized in real time via OscillatorNode and GainNode.
2. Strict Horror Rule: Under no circumstances may synthesized audio generate high-frequency shrieks, sudden volume spikes (>0.5 peak amplitude), or audio jumpscares.
3. Master Off by Default: Sound is strictly disabled by default until explicitly enabled by the user in Settings.`,
  },
  {
    id: 'doc_mod_room_creation',
    docNumber: 'MOD-2026-0401',
    category: 'Moderation Log',
    title: 'Community Room Governance: Minimum Member Thresholds and Pinned Rules',
    author: 'Mara Vale, Community Moderator',
    department: 'Community Management',
    date: '2026-04-01',
    classification: 'STAFF ONLY',
    summary: 'Policy for creating and maintaining thematic community rooms in AFTERHOURS.',
    content: `GOVERNANCE RULES:
1. Every room must have at least two appointed moderators.
2. Pinned guidelines must clearly state the room's thematic focus, etiquette, and sound warning rules.
3. Inactive rooms (< 5 posts in 30 days) are gently archived into read-only legacy status to keep the room directory curated and high-signal.`,
  },
  {
    id: 'doc_ds_timestamp_inversion',
    docNumber: 'DS-2026-0719',
    category: 'Data Science',
    title: 'Mathematical Modeling of Temporal Inversions in Distributed Messaging Graph',
    author: 'Theo Sato, Staff Data Engineer',
    department: 'Systems Research',
    date: '2026-07-19',
    classification: 'RESTRICTED / INTERNAL',
    summary: 'Graph theory analysis of non-linear message sequences across legacy archive bridges.',
    content: `ABSTRACT:
In a standard acyclic directed graph (DAG) of message events, every edge e(u, v) satisfies timestamp(u) < timestamp(v). In thread C-0419-RECUR, we observe cycles where timestamp(v) backfills to 2009 upon the generation of message u in 2026.

MATHEMATICAL PROOF:
The probability of this occurrence arising from random memory corruption is P < 10^-14. This confirms the operation of an intentional reciprocal continuity backfill function.`,
  },
  {
    id: 'doc_ts_historical_blocks',
    docNumber: 'TS-2026-0125',
    category: 'Trust & Safety',
    title: 'Safety Partition Audit: Preserving 2014 Block Records Without Data Loss',
    author: 'Celia March, Trust & Safety Lead',
    department: 'Trust & Safety',
    date: '2026-01-25',
    classification: 'RESTRICTED / INTERNAL',
    summary: 'Audit of legacy block lists to ensure users are never re-exposed to previously blocked contacts.',
    content: `AUDIT VERIFICATION:
All block lists extracted from the 2013–2014 Nitewire platform have been converted to immutable historical safety partitions. Even if an unowned placeholder handle is referenced in archive search, the client suppresses direct message delivery and displays the historical block record badge.`,
  },
  {
    id: 'doc_arch_protocol_evolution',
    docNumber: 'ARC-2026-0801',
    category: 'Migration Note',
    title: 'Chronological Survey: 25 Years of Nocturnal Messaging Protocols (2001–2026)',
    author: 'Felix Arden, Lead Archivist',
    department: 'Archive Operations',
    date: '2026-08-01',
    classification: 'ARCHIVE MEMO',
    summary: 'Comprehensive historical survey of the five messaging protocols preserved in the AFTERHOURS archive.',
    content: `CHRONOLOGICAL OVERVIEW:
- 2001 (Midnight Board): Dial-up ANSI/ASCII terminal board operating on node relays.
- 2004 (Lantern IRC): Distributed IRC daemon network with channel modes and operator keys.
- 2008 (Hushrooms): Web 2.0 social rooms with unindexed message clusters.
- 2013 (Nitewire): Early mobile smartphone messenger with SQLite local caches.
- 2018 (Beta Prototype): React/Node experimental sanctuary prototype.
- 2026 (AFTERHOURS): Local-first PWA messaging sanctuary with complete archive reconciliation.`,
  },
];
