export interface HelpArticle {
  id: string;
  slug: string;
  category: 'Safety & Privacy' | 'Messaging & Controls' | 'Archives & History' | 'App & Offline' | 'Appearance & Access';
  title: string;
  summary: string;
  body: string;
  keywords: string[];
  lastUpdated: string;
}

export const HELP_ARTICLES: HelpArticle[] = [
  {
    id: 'art_blocking',
    slug: 'how-blocking-works',
    category: 'Safety & Privacy',
    title: 'How Blocking and Safety Partitions Work',
    summary: 'Learn what happens when you block a handle and how historical block partitions are preserved.',
    body: `When you block a user on AFTERHOURS, the following protections activate immediately:

1. **Immediate Message Cessation**: The blocked participant cannot send you direct messages, tag you in rooms, or view your live presence status.
2. **Historical Thread Isolation**: Existing direct threads with the blocked user are sealed in read-only status and hidden from your active inbox.
3. **Safety Partitions**: If you previously blocked a contact during a prior platform era (e.g. 2014 Nitewire or 2008 Hushrooms), AFTERHOURS mounts that block record in a historical read-only partition. This ensures your safety boundaries persist even across archive synchronization cycles.
4. **Unblocking**: You can unblock active users at any time via Settings → Safety & Block Management. Historical partition records remain archived for your reference.`,
    keywords: ['block', 'safety', 'partition', 'ignore', 'privacy', 'harassment'],
    lastUpdated: '2026-08-01',
  },
  {
    id: 'art_muting',
    slug: 'how-muting-works',
    category: 'Messaging & Controls',
    title: 'Muting Conversations and Rooms',
    summary: 'Silence notifications from active rooms and high-volume direct threads without leaving.',
    body: `Muting allows you to stay in high-traffic rooms while keeping your late-night environment quiet:

- **Thread Muting**: Tap the header menu in any conversation or room and select "Mute Thread".
- **Notification Suppression**: Muted conversations will not trigger in-app banners, sound chimes, or unread badge counts.
- **Background Delivery**: Messages are still delivered and cached locally in IndexedDB so you can read them at your own pace whenever you choose.`,
    keywords: ['mute', 'silence', 'notifications', 'quiet', 'threads'],
    lastUpdated: '2026-07-28',
  },
  {
    id: 'art_legacy_archives',
    slug: 'navigating-legacy-archives',
    category: 'Archives & History',
    title: 'Navigating Legacy Archive Eras (2001–2026)',
    summary: 'How to explore preserved logs across five distinct internet communication eras.',
    body: `AFTERHOURS includes a comprehensive archive of early nocturnal messaging networks spanning five historical eras:

1. **2001 (Midnight Board)**: Dial-up BBS ASCII message boards with terminal headers.
2. **2004 (Lantern IRC)**: Monospace mIRC channel logs with join/part events and operator modes.
3. **2008 (Hushrooms)**: Early browser-based community rooms with tabular styling and unindexed nodes.
4. **2013 (Nitewire)**: Early mobile chat networks with bubble interfaces and location pins.
5. **2018 (Beta Archive)**: Prototype client logs and database migration records.

**Safety Note**: Archive logs are strictly read-only historical relics. You cannot send new messages into past eras.`,
    keywords: ['archive', 'history', '2001', '2004', '2008', '2013', '2018', 'irc', 'bbs'],
    lastUpdated: '2026-08-10',
  },
  {
    id: 'art_search_operators',
    slug: 'global-search-operators',
    category: 'Messaging & Controls',
    title: 'Global Search Filters and Operators',
    summary: 'Search through active chats, room archives, and legacy logs with precise keywords.',
    body: `The AFTERHOURS search engine indexes all locally cached messages, bookmarks, and unlocked archive logs:

- **Text Queries**: Enter any keyword (e.g. *tea*, *synth*, *camera*, *list*) to locate matching messages across all threads.
- **Prefix Filters**:
  - \`from:handle\` — Search messages sent by a specific user.
  - \`room:slug\` — Limit results to a specific community room.
  - \`has:quote\` — Filter for messages containing quoted replies.
  - \`id:C-0419-RECUR\` — Search for specific legacy thread identifiers.
- **Jump to Context**: Tapping any search result navigates directly to that message's location in its thread with a temporary highlight glow.`,
    keywords: ['search', 'filters', 'operators', 'find', 'query', 'indexing'],
    lastUpdated: '2026-08-12',
  },
  {
    id: 'art_quiet_hours',
    slug: 'configuring-quiet-hours',
    category: 'App & Offline',
    title: 'Configuring Quiet Hours Preferences',
    summary: 'Set automated nocturnal delivery windows to soften audio chimes and delivery urgency.',
    body: `Quiet Hours is designed to honor late-night peace without penalizing nocturnal users:

- **Available Schedules**:
  - *Off (Standard 24/7)*: Normal notification chimes at all hours.
  - *23:00 – 07:00*: Mutes audio chimes during late evenings and early mornings.
  - *00:00 – 08:00 (Recommended)*: Full nocturnal stillness during peak quiet hours.
  - *Custom Schedule*: Define your own personalized delivery window.
- **Zero Penalty**: Unlike traditional productivity apps, AFTERHOURS never locks your account or penalizes you for staying up late. Quiet Hours simply softens audio synthesized tones and reduces fictional delivery urgency.`,
    keywords: ['quiet hours', 'schedule', 'midnight', 'notifications', 'silence', 'sleep'],
    lastUpdated: '2026-08-15',
  },
  {
    id: 'art_data_export',
    slug: 'exporting-your-data',
    category: 'Safety & Privacy',
    title: 'Client-Side JSON Data Export',
    summary: 'Generate and download a complete cryptographic export of all your locally stored data.',
    body: `AFTERHOURS is built on a local-first philosophy. You own your data completely:

- **Full JSON Dump**: Navigate to Settings → Data & Storage → Export All Data to generate a single JSON file containing:
  - Account and profile settings
  - All active and archived threads
  - Sent and received messages
  - Saved bookmarks and tags
  - Blocked lists and security partitions
  - Continuity logs and evidence records
- **Inspection**: You can view the formatted JSON directly in the browser or copy it to your clipboard.`,
    keywords: ['export', 'json', 'data', 'backup', 'download', 'indexeddb'],
    lastUpdated: '2026-08-18',
  },
  {
    id: 'art_offline_mode',
    slug: 'offline-mode-and-sync',
    category: 'App & Offline',
    title: 'Offline Reading and Background Draft Sync',
    summary: 'How AFTERHOURS continues working seamlessly when your network is disconnected.',
    body: `AFTERHOURS operates with full offline support via Service Workers and IndexedDB:

1. **Cached Reading**: All previously loaded threads, rooms, bookmarks, and archive logs remain 100% readable even in Airplane Mode.
2. **Offline Drafting**: You can compose message drafts while offline. When you reconnect to the network, your composer state is preserved without scroll jumps or lost input.
3. **Gentle Reconnection**: When connectivity is restored, the client performs background reconciliation without intrusive modal popups.`,
    keywords: ['offline', 'sync', 'service worker', 'cache', 'drafts', 'network'],
    lastUpdated: '2026-08-14',
  },
  {
    id: 'art_pwa_install',
    slug: 'installing-pwa-standalone',
    category: 'App & Offline',
    title: 'Installing AFTERHOURS as a Standalone PWA',
    summary: 'Install the web app to your mobile home screen for a distraction-free fullscreen sanctuary.',
    body: `Installing AFTERHOURS provides instant loading, fullscreen immersion, and offline resilience:

- **iOS Safari**:
  1. Open AFTERHOURS in Safari.
  2. Tap the **Share** button in the bottom toolbar.
  3. Scroll down and tap **Add to Home Screen**.
  4. Tap **Add** to confirm.
- **Android Chrome**:
  1. Open AFTERHOURS in Chrome.
  2. Tap the top install banner or the browser menu (three dots).
  3. Select **Install App** or **Add to Home screen**.
- **Standalone Experience**: When launched from your home screen, browser toolbars disappear, allowing safe area padding and native app feel.`,
    keywords: ['pwa', 'install', 'ios', 'safari', 'android', 'standalone', 'home screen'],
    lastUpdated: '2026-08-16',
  },
  {
    id: 'art_typography',
    slug: 'device-font-vs-afterhours',
    category: 'Appearance & Access',
    title: 'Typography: AFTERHOURS vs Device System Font',
    summary: 'Choose between the custom atmospheric font stack and your native operating system font.',
    body: `You can customize how text renders across all chat threads and menus:

- **AFTERHOURS (Editorial Serif & Sans)**: The default custom aesthetic, featuring warm serif headers and clean sans body text tailored for late-night readability.
- **Device Font (System Native)**: Uses your device's native font stack (San Francisco on iOS, Roboto on Android, Segoe UI on Windows). Highly recommended if you use custom system accessibility fonts or dyslexic text aids.`,
    keywords: ['font', 'typography', 'device font', 'appearance', 'serif', 'sans'],
    lastUpdated: '2026-08-05',
  },
  {
    id: 'art_themes',
    slug: 'theme-customization',
    category: 'Appearance & Access',
    title: 'Theme Customization: Midnight Dark and Paper Light',
    summary: 'Switch between Midnight Noir, Twilight Slate, and Paper Light themes.',
    body: `AFTERHOURS is optimized for low-light nocturnal environments:

- **Midnight Dark (Default)**: Deep slate-noir palette (\`#08080C\`) with high-contrast muted text to minimize blue light and eye strain.
- **Paper Light**: Soft warm paper tone for daytime reading.
- **Sync with Device**: Automatically switches based on your operating system light/dark mode settings.`,
    keywords: ['theme', 'dark mode', 'light mode', 'appearance', 'contrast'],
    lastUpdated: '2026-08-04',
  },
  {
    id: 'art_edit_history',
    slug: 'message-edit-history',
    category: 'Messaging & Controls',
    title: 'Viewing Message Edit Revision History',
    summary: 'Inspect previous revisions and timestamp logs for edited messages.',
    body: `When a message is edited in AFTERHOURS, an **(edited)** tag appears alongside its timestamp:

- **Inspecting Edits**: Tap any edited message and select **"View Edit History"** from the action tray.
- **Revision Log**: Displays the chronological progression of revisions, including the original draft, edited versions, and relative server timestamps.
- **Transparency**: Edit histories cannot be purged by individual users, ensuring accountability in community discussions.`,
    keywords: ['edit', 'revisions', 'history', 'messages', 'transparency'],
    lastUpdated: '2026-08-17',
  },
  {
    id: 'art_deleting_messages',
    slug: 'deleting-local-messages',
    category: 'Messaging & Controls',
    title: 'Deleting Local Messages vs Server Archives',
    summary: 'Understand the difference between clearing a local thread and remote archive sync.',
    body: `When you delete a message or conversation:

1. **Local Purge**: The record is removed from your device's IndexedDB database immediately.
2. **Archive Synchronization**: If a thread contains historical archive partitions (such as 2008 Hushrooms links), reconnecting to the archive daemon will re-mount the read-only partition for reference.
3. **Complete Database Reset**: To purge all local records and restart clean, use Settings → Data → Reset All Data.`,
    keywords: ['delete', 'purge', 'archive', 'messages', 'reset'],
    lastUpdated: '2026-08-09',
  },
  {
    id: 'art_privacy_guarantee',
    slug: 'data-retention-guarantee',
    category: 'Safety & Privacy',
    title: 'Data Retention and Identity Safety Guarantees',
    summary: 'Our cryptographic commitment to zero third-party telemetry and strict identity safety.',
    body: `AFTERHOURS maintains a strict privacy and identity architecture:

- **Zero Advertising Trackers**: No third-party analytics, tracking pixels, or telemetry SDKs are embedded in the client.
- **Strict Identity Safety**: Narrative events and archive logs will never overwrite or mutate your user-configured name, gender, pronouns, sexuality, avatar, or bio.
- **Local Key Storage**: Security tokens and bookmarks remain on your hardware.`,
    keywords: ['privacy', 'identity safety', 'telemetry', 'retention', 'security'],
    lastUpdated: '2026-08-19',
  },
  {
    id: 'art_account_recovery',
    slug: 'account-recovery',
    category: 'Safety & Privacy',
    title: 'Account Recovery and Device Migration',
    summary: 'How to backup and restore your persona across multiple devices.',
    body: `Because AFTERHOURS does not require phone numbers or third-party OAuth logins:

- **Backup Export**: Always generate a Data Export JSON from Settings before switching devices.
- **Restoration**: On your new device, navigate to Settings → Data → Import Backup and select your JSON file to restore all conversations, bookmarks, and avatar settings.`,
    keywords: ['recovery', 'backup', 'migration', 'tokens', 'import'],
    lastUpdated: '2026-07-20',
  },
  {
    id: 'art_safety_hub',
    slug: 'safety-hub-overview',
    category: 'Safety & Privacy',
    title: 'Safety Hub and Incident Reporting',
    summary: 'Tools for managing unwanted contact, reporting violations, and setting personal boundaries.',
    body: `The Safety Hub (/safety) provides comprehensive boundary controls:

- **Active Blocks**: View and manage currently blocked handles.
- **Historical Partitions**: Inspect recovered historical blocks from previous platform migrations.
- **Report Violations**: Report spam, harassment, or non-consensual behavior to community moderators.`,
    keywords: ['safety hub', 'reporting', 'moderation', 'boundaries'],
    lastUpdated: '2026-08-03',
  },
  {
    id: 'art_voice_notes',
    slug: 'voice-notes-transcripts',
    category: 'Messaging & Controls',
    title: 'Voice Notes and Automatic Transcripts',
    summary: 'Audio playback controls, transcript expansion, and volume warnings.',
    body: `Voice notes in AFTERHOURS are designed for accessibility and nocturnal listening:

- **Volume Warnings**: All voice notes default to muted playback to avoid startling users in quiet rooms.
- **Synchronized Transcripts**: Every voice note includes an expandable text transcript so you can read along without turning on audio.
- **Waveform Seekbar**: Scrub through recordings with precision visual timestamps.`,
    keywords: ['voice notes', 'audio', 'transcripts', 'sound', 'accessibility'],
    lastUpdated: '2026-08-11',
  },
  {
    id: 'art_avatar_builder',
    slug: 'customizing-vector-avatar',
    category: 'Appearance & Access',
    title: 'Customizing Your Vector Avatar',
    summary: 'Build an expressive nocturnal avatar with editorial shapes, glasses, and color accents.',
    body: `The Vector Avatar Builder lets you craft a unique persona without uploading photos:

- **Categories**: Customize skin tone, face shape, hair styles, eye moods, glasses, head coverings, piercings, and apparel.
- **Moods & Accents**: Select ambient moods (calm, pensive, smirk, exhausted) and subtle frame motifs (halo, signal dot, analog grain).
- **Live Preview**: Inspect your avatar in real time and save changes instantly.`,
    keywords: ['avatar', 'vector', 'builder', 'customization', 'persona'],
    lastUpdated: '2026-08-07',
  },
  {
    id: 'art_room_guidelines',
    slug: 'room-guidelines-and-moderation',
    category: 'Messaging & Controls',
    title: 'Room Guidelines and Moderation Etiquette',
    summary: 'Understanding community norms, pinned guidelines, and respectful nocturnal posting.',
    body: `Every community room in AFTERHOURS follows three universal principles:

1. **Quiet Atmosphere**: Keep discussions civil and avoid aggressive debates or text spam.
2. **Timezone Awareness**: Remember that night in your region is morning somewhere else.
3. **Volume Warnings**: Always tag audio or video links with explicit sound notices.`,
    keywords: ['guidelines', 'rooms', 'moderation', 'rules', 'etiquette'],
    lastUpdated: '2026-08-02',
  },
  {
    id: 'art_presence_states',
    slug: 'status-messages-and-presence',
    category: 'Messaging & Controls',
    title: 'Presence States: Online, Idle, Offline, and Afterhours',
    summary: 'How user presence indicators update in real time.',
    body: `Presence indicators show active participation without invasive tracking:

- **Online (Emerald)**: User is actively browsing or typing in a thread.
- **Idle (Amber)**: User has had the app open without interaction for over 5 minutes.
- **Afterhours (Indigo Pulse)**: User is browsing during quiet hours (00:00–08:00).
- **Offline (Slate)**: Device is disconnected or app is closed.`,
    keywords: ['presence', 'status', 'online', 'afterhours', 'idle'],
    lastUpdated: '2026-08-06',
  },
  {
    id: 'art_bookmarks_quotes',
    slug: 'bookmarks-and-saved-quotes',
    category: 'Messaging & Controls',
    title: 'Bookmarks and Quoted Evidence',
    summary: 'Save important messages, assign custom tags, and jump directly to quoted text.',
    body: `Organize key messages and discoveries:

- **Saving Bookmarks**: Tap any message and select **"Bookmark"** to pin it to your Saved list (/bookmarks).
- **Custom Tags & Notes**: Add research tags (e.g. *OUR LIST*, *Synth Notes*, *Archive Relic*) and personal annotations.
- **Quoted Links**: Tapping a quoted snippet in chat instantly jumps to the original message.`,
    keywords: ['bookmarks', 'quotes', 'saved', 'tags', 'evidence'],
    lastUpdated: '2026-08-13',
  },
  {
    id: 'art_stickers_reactions',
    slug: 'reaction-trays-and-stickers',
    category: 'Messaging & Controls',
    title: 'Reaction Trays and Nocturnal Mood Stickers',
    summary: 'Express late-night thoughts with mood reactions and custom badge stickers.',
    body: `Reactions in AFTERHOURS are subtle and tactile:

- **Emoji Reactions**: Long-press or tap any message to react with 🌙, 🍵, 🦉, ✨, 📻, or 👁️.
- **Mood Stickers**: Access the Sticker Creator (/activities) to design custom monochrome stickers with nocturnal motifs.`,
    keywords: ['reactions', 'stickers', 'emojis', 'mood'],
    lastUpdated: '2026-08-08',
  },
  {
    id: 'art_crc_packets',
    slug: 'importing-legacy-chat-logs',
    category: 'Archives & History',
    title: 'Importing Legacy Chat Logs and CRC Packets',
    summary: 'How corrupted archive partitions are verified and reconstructed.',
    body: `When exploring damaged archive nodes:

- **CRC Checksums**: Each historical partition is secured with a 16-bit CRC checksum.
- **Packet Restorer**: Use the Archive Restorer tool in Activities to repair mismatched byte offsets and unlock lost conversation logs from 2001, 2004, and 2008.`,
    keywords: ['crc', 'packets', 'import', 'restore', 'checksum'],
    lastUpdated: '2026-08-15',
  },
  {
    id: 'art_read_receipts',
    slug: 'read-receipts-and-delivery',
    category: 'Messaging & Controls',
    title: 'Message Delivery and Read Receipt Statuses',
    summary: 'Learn what the checkmark indicators beside your messages signify.',
    body: `Checkmarks display real-time message transmission:

- **One Check (Grey)**: Message saved locally and queued.
- **Two Checks (Grey)**: Message successfully delivered to recipient device.
- **Two Checks (Brand Glow)**: Message opened and read by recipient.
- **"Delivered Previously"**: Historical archive message preserved from an earlier era.`,
    keywords: ['read receipts', 'delivery', 'checkmarks', 'status'],
    lastUpdated: '2026-08-01',
  },
  {
    id: 'art_accessibility_keyboard',
    slug: 'keyboard-accessibility',
    category: 'Appearance & Access',
    title: 'Accessibility, Keyboard Navigation, and Tap Targets',
    summary: 'Full WCAG 2.1 AA compliance for screen readers and touch interactions.',
    body: `AFTERHOURS is engineered for all nocturnal users:

- **Touch Targets**: All interactive buttons, chips, and toggles meet or exceed the **44×44px** minimum touch target standard.
- **Screen Reader Support**: Semantic HTML headers, ARIA labels on icon buttons, and live region announcements for incoming messages.
- **Focus Rings**: High-contrast focus indicators for external keyboard navigation.`,
    keywords: ['accessibility', 'a11y', 'touch targets', 'screen reader', 'keyboard'],
    lastUpdated: '2026-08-16',
  },
  {
    id: 'art_reduced_motion',
    slug: 'reduced-motion-mode',
    category: 'Appearance & Access',
    title: 'Reduced Motion and Animation Controls',
    summary: 'Disable pulsing typing dots, page slides, and modal transitions.',
    body: `For users sensitive to screen motion:

- Enable **Reduced Motion** in Settings → Accessibility to replace slide transitions with instant cuts and disable ambient pulsing animations.
- Automatically respects your device's \`prefers-reduced-motion\` system setting.`,
    keywords: ['reduced motion', 'animations', 'accessibility', 'transitions'],
    lastUpdated: '2026-08-04',
  },
  {
    id: 'art_font_scaling',
    slug: 'font-scaling-options',
    category: 'Appearance & Access',
    title: 'Font Scaling Options (Small, Medium, Large)',
    summary: 'Adjust text size across the entire application for comfortable late-night reading.',
    body: `Navigate to Settings → Accessibility to scale typography:

- **Small**: Compact view displaying more messages per screen.
- **Medium (Default)**: Balanced readability for standard mobile viewports.
- **Large**: High-legibility text with expanded bubble padding.`,
    keywords: ['font scale', 'text size', 'large text', 'accessibility'],
    lastUpdated: '2026-08-05',
  },
  {
    id: 'art_threads_rooms',
    slug: 'understanding-message-threads',
    category: 'Messaging & Controls',
    title: 'Understanding DMs, Group Chats, and Community Rooms',
    summary: 'The three conversation formats supported in AFTERHOURS.',
    body: `AFTERHOURS organizes correspondence into three distinct tiers:

1. **Direct Messages (1:1)**: Private, end-to-end local chats with friends and contacts.
2. **Group Chats**: Multi-participant discussions with shared bookmarks and participant lists.
3. **Community Rooms**: Public nocturnal lounges organized around specific themes (Old Internet, Soundscapes, Urban Legends).`,
    keywords: ['dms', 'group chats', 'rooms', 'conversations'],
    lastUpdated: '2026-08-02',
  },
  {
    id: 'art_unowned_placeholders',
    slug: 'unowned-account-placeholders',
    category: 'Archives & History',
    title: 'Unowned Account Placeholders and Legacy Migration',
    summary: 'Why some historical records display placeholder participant metadata.',
    body: `During migrations of legacy archives from 2001, 2004, and 2008:

- Accounts created on obsolete platforms (such as the 2001 Midnight Board or 2008 Hushrooms) lack modern registration credentials.
- The system renders these entities as **Unowned Placeholders** (\`ownerId: null\`) to preserve historical conversation integrity without assigning false identities.`,
    keywords: ['unowned', 'placeholder', 'beforeyou', 'migration', 'legacy'],
    lastUpdated: '2026-08-17',
  },
  {
    id: 'art_clock_drift',
    slug: 'troubleshooting-connection-drift',
    category: 'App & Offline',
    title: 'Troubleshooting Clock Drift and Reconnection',
    summary: 'How server clock skew and network latency are handled during late hours.',
    body: `If message timestamps appear out of order:

1. **Check System Time**: Ensure your device clock is set to automatic network time.
2. **Cache Refresh**: Pull down to refresh in your inbox to trigger a background clock alignment.
3. **Report Skew**: If timestamp anomalies persist, check with systems engineers in #room-support.`,
    keywords: ['clock drift', 'ntp', 'timestamps', 'troubleshooting', 'reconnect'],
    lastUpdated: '2026-08-14',
  },
  {
    id: 'art_code_of_conduct',
    slug: 'community-code-of-conduct',
    category: 'Safety & Privacy',
    title: 'Community Code of Conduct & Sanctuary Rules',
    summary: 'Our shared commitment to keeping AFTERHOURS a peaceful, respectful nocturnal home.',
    body: `All members agree to uphold the sanctuary rules:

- **Respect Quiet Hours**: Avoid loud spamming or disruptive behavior between 00:00 and 08:00.
- **Zero Harassment**: Abusive speech, stalking, or boundary violations result in immediate suspension.
- **Protect Legacy Relics**: Do not post real-world personal contact information extracted from historical archive logs.
- **The Midnight Rule**: Do not answer unknown handles after midnight.`,
    keywords: ['code of conduct', 'rules', 'sanctuary', 'etiquette', 'safety'],
    lastUpdated: '2026-08-01',
  },
];
