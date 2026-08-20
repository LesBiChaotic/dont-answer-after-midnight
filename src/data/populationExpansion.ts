import { Message, Notification, MessageBookmark } from '../types';
import { SEEDED_DM_THREADS } from './dmThreads';
import { SEEDED_GROUP_THREADS } from './groupThreads';

type Speaker = 'contact' | 'you';
type DialogueLine = { speaker: Speaker; content: string };

const dmDialogue: Record<string, DialogueLine[]> = {
  thread_elena_dm: [
    { speaker: 'contact', content: 'I found a grocery receipt inside a 2008 server manual. Tea, batteries, blank cassettes. Excellent emergency priorities.' },
    { speaker: 'you', content: 'Please tell me you did not archive somebody’s grocery receipt.' },
    { speaker: 'contact', content: 'It has a timestamp from three hours after the shop closed permanently, so I absolutely archived it.' },
    { speaker: 'contact', content: 'Felix says the paper stock is period-correct. Mara says we both need hobbies that involve sunlight.' },
    { speaker: 'you', content: 'Mara is right and therefore must be ignored.' },
    { speaker: 'contact', content: 'Correct. Also, your tea shop posted a photo from tonight. There is no green awning in it.' },
    { speaker: 'contact', content: 'Do you remember it being blue, or am I letting the archive edit my memory again?' },
    { speaker: 'you', content: 'Green. Definitely green. I took a picture—I’ll check the metadata.' },
  ],
  thread_ren_dm: [
    { speaker: 'contact', content: 'The vending machine gave me two coffees and charged me for neither. I distrust gifts from hospital machinery.' },
    { speaker: 'you', content: 'Drink both before it changes its mind.' },
    { speaker: 'contact', content: 'One for me, one for the respiratory therapist. We have formed a tiny caffeine union.' },
    { speaker: 'contact', content: 'Someone keeps calling the empty family room extension. Four rings, then silence.' },
    { speaker: 'you', content: 'Faulty internal line?' },
    { speaker: 'contact', content: 'Facilities checked. That room has not had a phone since the renovation.' },
    { speaker: 'contact', content: 'Anyway. Very normal workplace. How is your night going?' },
    { speaker: 'you', content: 'Less haunted than yours, which is not a high bar.' },
  ],
  thread_felix_dm: [
    { speaker: 'contact', content: 'I got the beige tower to boot. It sounds like a lawn mower considering violence.' },
    { speaker: 'you', content: 'That means it is authentic.' },
    { speaker: 'contact', content: 'Authentically full of dust and one dead moth, yes.' },
    { speaker: 'contact', content: 'Dave found an ISA modem card inside. The sticker says NODE FOUR in somebody’s handwriting.' },
    { speaker: 'you', content: 'The same node from Elena’s BBS logs?' },
    { speaker: 'contact', content: 'Probably coincidence. I am saying “probably” because denial is free.' },
    { speaker: 'contact', content: 'Joining the restoration crew later? We need one person whose instinct is not “apply more voltage.”' },
    { speaker: 'you', content: 'I make no promises about my instincts.' },
  ],
  thread_mara_dm: [
    { speaker: 'contact', content: 'Moderator confession: I mute #room-feedback for ten minutes every night and experience inner peace.' },
    { speaker: 'you', content: 'Abuse of power. Understandable abuse of power.' },
    { speaker: 'contact', content: 'Someone submitted “make the moon icon bigger” seven times from seven accounts.' },
    { speaker: 'contact', content: 'All seven accounts used the same recovery phrase hint: BEFORE YOU.' },
    { speaker: 'you', content: 'That feels worth escalating.' },
    { speaker: 'contact', content: 'Already sent it to Inez. She replied with a thumbs-up and then deleted the message.' },
    { speaker: 'contact', content: 'Please tell me one ordinary thing you did today before I become a corkboard person.' },
    { speaker: 'you', content: 'I forgot my coffee until it was cold. A triumph of normalcy.' },
  ],
  thread_noor_dm: [
    { speaker: 'contact', content: 'Jakarta rain report: biblical for twelve minutes, then nothing.' },
    { speaker: 'you', content: 'The weather loves theatrical entrances.' },
    { speaker: 'contact', content: 'My upstairs neighbor dragged furniture at 2:13 again. Same three scrapes, same pause.' },
    { speaker: 'contact', content: 'Except she moved out last weekend.' },
    { speaker: 'you', content: 'Have you considered not investigating?' },
    { speaker: 'contact', content: 'Yes. Briefly. Then I opened the building group chat like an idiot.' },
  ],
  thread_celia_dm: [
    { speaker: 'contact', content: 'The archive donated six boxes of local newsletters. Five are mildew, one is gossip.' },
    { speaker: 'you', content: 'The sacred foundations of historical research.' },
    { speaker: 'contact', content: 'There is a recurring classified ad: “Night operator wanted. Must answer on first ring.”' },
    { speaker: 'contact', content: 'Same number, every year from 1998 to 2004.' },
    { speaker: 'you', content: 'Does the number connect?' },
    { speaker: 'contact', content: 'Disconnected. Naturally, it called the archive desk ten minutes later.' },
  ],
  thread_mina_dm: [
    { speaker: 'contact', content: 'Tonight’s lighthouse fact: keepers used mercury baths to rotate enormous lenses with almost no friction.' },
    { speaker: 'you', content: 'Beautiful engineering, horrifying workplace safety.' },
    { speaker: 'contact', content: 'Exactly my preferred genre of fact.' },
    { speaker: 'contact', content: 'A keeper in 1911 logged a light flashing inland where there was no tower.' },
    { speaker: 'you', content: 'Please post that in Local Lore.' },
    { speaker: 'contact', content: 'Already did. Jonah replied “maybe the land was lost at sea,” which is useless but poetic.' },
  ],
  thread_theo_dm: [
    { speaker: 'contact', content: 'I uploaded the field recording from under the railway bridge.' },
    { speaker: 'you', content: 'The one with the rhythmic clicking?' },
    { speaker: 'contact', content: 'Yes. Samira isolated it. It is not rhythmic; it is repeating groups of four and nineteen.' },
    { speaker: 'contact', content: 'Could still be machinery. Machinery loves ominous integers.' },
    { speaker: 'you', content: 'Did you hear the whisper near the end?' },
    { speaker: 'contact', content: 'I did after you asked. I preferred my life fourteen seconds ago.' },
  ],
  thread_inez_dm: [
    { speaker: 'contact', content: 'Please stop forwarding screenshots as compressed images. Export the original file.' },
    { speaker: 'you', content: 'Good evening to you too.' },
    { speaker: 'contact', content: 'Good evening. Please stop destroying metadata.' },
    { speaker: 'contact', content: 'Mara’s seven accounts share no IP, fingerprint, or creation timestamp. They simply exist.' },
    { speaker: 'you', content: 'That sentence is doing nothing for my blood pressure.' },
    { speaker: 'contact', content: 'Mine either. I have placed them in a partition that is not connected to production.' },
  ],
  thread_jonah_dm: [
    { speaker: 'contact', content: 'Hypothetical: if a forum account predicts tomorrow’s weather perfectly, is that useful or threatening?' },
    { speaker: 'you', content: 'Depends. Does it also know where I left my charger?' },
    { speaker: 'contact', content: 'No, but it knows Felix will spill coffee on a keyboard at 02:40.' },
    { speaker: 'contact', content: 'He has scheduled a reminder not to. This is science now.' },
    { speaker: 'you', content: 'Tell him moving the coffee is also an option.' },
    { speaker: 'contact', content: 'He says that would contaminate the experiment.' },
  ],
  thread_julian_dm: [
    { speaker: 'contact', content: 'Made too much soup again. This is becoming an outreach program.' },
    { speaker: 'you', content: 'What kind?' },
    { speaker: 'contact', content: 'Roasted tomato, garlic, and enough pepper to restart a stopped heart.' },
    { speaker: 'contact', content: 'Midnight Café wants the recipe. I told them the secret is emotional instability.' },
    { speaker: 'you', content: 'A difficult ingredient to measure.' },
    { speaker: 'contact', content: 'Three tablespoons, loosely packed.' },
  ],
  thread_marcus_dm: [
    { speaker: 'contact', content: 'I audited the continuity table. There are thirteen records and fourteen checksums.' },
    { speaker: 'you', content: 'Which checksum has no record?' },
    { speaker: 'contact', content: 'Yours.' },
    { speaker: 'contact', content: 'Before you panic: it may be a migration artifact.' },
    { speaker: 'you', content: 'You put “before you panic” after the panic sentence.' },
    { speaker: 'contact', content: 'Noted for future incident communication.' },
  ],
  thread_maya_dm: [
    { speaker: 'contact', content: 'I sketched the station clock from memory and every version shows 4:19.' },
    { speaker: 'you', content: 'Maybe you checked the time while drawing.' },
    { speaker: 'contact', content: 'The station clock has no minute hand.' },
    { speaker: 'contact', content: 'Creative Corner voted the third sketch “most unsettling,” which feels rude but accurate.' },
    { speaker: 'you', content: 'Can I see it?' },
    { speaker: 'contact', content: 'Posting it after I add one cheerful pigeon for emotional balance.' },
  ],
  thread_samira_dm: [
    { speaker: 'contact', content: 'Theo’s bridge recording has a voice-shaped frequency gap.' },
    { speaker: 'you', content: 'A what-shaped gap?' },
    { speaker: 'contact', content: 'The ambient noise drops exactly where speech would sit, like something removed the words.' },
    { speaker: 'contact', content: 'I inverted the phase and got six syllables. I am not sending them at this hour.' },
    { speaker: 'you', content: 'That is somehow worse than sending them.' },
    { speaker: 'contact', content: 'Correct. Sleep well.' },
  ],
  thread_dave_dm: [
    { speaker: 'contact', content: 'Felix touched the power supply before I finished testing it.' },
    { speaker: 'you', content: 'Is Felix still among us?' },
    { speaker: 'contact', content: 'Physically yes. Spiritually humbled.' },
    { speaker: 'contact', content: 'The modem card keeps negotiating with a carrier that is not connected.' },
    { speaker: 'you', content: 'Can you isolate it?' },
    { speaker: 'contact', content: 'I did. It continued negotiating from inside the anti-static bag.' },
  ],
  thread_chloe_dm: [
    { speaker: 'contact', content: 'Book club emergency: half the group thinks the narrator is lying, half thinks she is dead.' },
    { speaker: 'you', content: 'Those options are not mutually exclusive.' },
    { speaker: 'contact', content: 'Thank you. Finally, scholarship.' },
    { speaker: 'contact', content: 'The ebook changed one sentence after midnight. Elena has screenshots.' },
    { speaker: 'you', content: 'Was it an update?' },
    { speaker: 'contact', content: 'Publisher says that edition has never existed.' },
  ],
  thread_hannah_dm: [
    { speaker: 'contact', content: 'My cat has been staring at the unplugged router for twenty minutes.' },
    { speaker: 'you', content: 'Cats can see customer support representatives.' },
    { speaker: 'contact', content: 'Then she is giving them a terrible performance review.' },
    { speaker: 'contact', content: 'The activity light blinked once. Router is still unplugged.' },
    { speaker: 'you', content: 'Move the cat and the router out of the room.' },
    { speaker: 'contact', content: 'Cat refuses. Router has not stated a preference.' },
  ],
  thread_owen_dm: [
    { speaker: 'contact', content: 'Found another payphone downtown. Receiver was warm.' },
    { speaker: 'you', content: 'People do still use phones, Owen.' },
    { speaker: 'contact', content: 'This one has no cable running into the wall.' },
    { speaker: 'contact', content: 'I dialed my own number. Your profile answered.' },
    { speaker: 'you', content: 'That is not funny.' },
    { speaker: 'contact', content: 'I know. That is why I stopped laughing.' },
  ],
  thread_lucas_dm: [
    { speaker: 'contact', content: 'Elena says you remember the tea shop awning as green.' },
    { speaker: 'you', content: 'It was green. Why?' },
    { speaker: 'contact', content: 'Because our mother’s photo from 2019 shows it red, and the shop did not open until 2021.' },
    { speaker: 'contact', content: 'Elena asked me not to alarm you, which was optimistic.' },
    { speaker: 'you', content: 'Send me the original photo, not a screenshot.' },
    { speaker: 'contact', content: 'Already uploading. Check the woman reflected in the window.' },
  ],
  thread_beforeyou_dm: [
    { speaker: 'contact', content: 'you have more conversations now' },
    { speaker: 'you', content: 'Who are you?' },
    { speaker: 'contact', content: 'that is not the question you asked last time' },
    { speaker: 'contact', content: 'last time you asked which one of us was original' },
    { speaker: 'you', content: 'There was no last time.' },
    { speaker: 'contact', content: 'then why did you save the answer' },
  ],
};

const groupDialogue: Record<string, string[]> = {
  grp_night_owls: ['Mara: hydration check. yes, this is targeted.', 'Jonah: I have water beside me. It is emotionally supporting the coffee.', 'Ren: night shift votes that water counts even when consumed resentfully.', 'Mina: reading about lighthouse foghorn disputes. people wrote furious letters about horn pitch.', 'Elena: Old Internet has a thread about a foghorn recording uploaded in 2004.', 'Mara: take the haunting to the correct channel, please and thank you.'],
  grp_book_club: ['Chloe: page 214 changed in my ebook after midnight.', 'Elena: confirming. my cached copy says “she opened the door.” Chloe’s says “you opened it.”', 'Maya: paperback says “we opened it,” which feels unnecessarily communal.', 'Jonah: democratic door opening.', 'Chloe: publisher support has stopped replying.', 'Elena: archive every edition before reconnecting the reader app.'],
  grp_old_internet: ['Felix: the beige tower booted and immediately requested the date.', 'Dave: you entered 2026 and it rejected it.', 'Inez: what year did it accept?', 'Felix: 2008.', 'Elena: do not connect that machine to the network.', 'Dave: too late by approximately eleven seconds.'],
  grp_weekend_plans: ['Julian: night market Saturday?', 'Noor: if the rain behaves.', 'Maya: define behaves.', 'Noor: falls downward, stops eventually.', 'Jonah: demanding standards.', 'Julian: I will bring emergency umbrellas and non-emergency cake.'],
  grp_media_hoarders: ['Samira: whoever uploaded TRACK_FINAL_FINAL2.wav, explain yourself.', 'Theo: naming is a private journey.', 'Chloe: it contains eleven minutes of room tone.', 'Theo: premium room tone.', 'Samira: at 08:14 someone whispers my username.', 'Theo: less premium. deleting nothing until we inspect it.'],
  grp_local_lore: ['Mina: posting the inland lighthouse log now.', 'Owen: there used to be a signal tower near that hill.', 'Celia: municipal maps show an equipment shed, never a tower.', 'Jonah: perhaps the tower was shy.', 'Noor: perhaps Jonah should be muted.', 'Owen: I found the access road. It ends at a locked gate labeled NODE 4.'],
  grp_work_vent: ['Ren: a printer jammed because somebody fed it an ECG strip.', 'Inez: that is not what printers eat.', 'Mara: mine eats moderation reports and produces blank paper.', 'Dave: percussive maintenance remains available.', 'Ren: you are not allowed near hospital equipment.', 'Dave: cruel but evidence-based.'],
  grp_no_voice_notes: ['Samira: reminder: transcripts or text, please.', 'Theo: sending a tasteful twelve-second ambience clip.', 'Samira: that is a voice note wearing a fake moustache.', 'Maya: I hear rain and one offended pigeon.', 'Theo: the pigeon is the featured artist.', 'Samira: transcript: [rain] [pigeon objects] [distant knock].'],
  grp_after_midnight: ['Mara: did anyone else receive a blank notification at 00:00?', 'Elena: mine had metadata but no body.', 'Marcus: same notification ID on six accounts.', 'Inez: do not open the target route.', 'Jonah: too late. it opened my own profile.', 'Mara: everyone stop touching the cursed button for five minutes.'],
  grp_coffee_club: ['Julian: tonight’s bean is chocolatey, allegedly.', 'Ren: hospital coffee’s tasting notes are “brown” and “hot.”', 'Noor: mine tastes like I forgot it for forty minutes.', 'Maya: cold coffee is still coffee if you avoid eye contact.', 'Jonah: this group remains a support network for poor decisions.', 'Julian: meeting adjourned until the next cup.'],
  grp_bbs_crew: ['Dave: carrier negotiation resumed inside the anti-static bag.', 'Felix: excellent. the ghost respects ESD safety.', 'Inez: stop anthropomorphizing the security incident.', 'Elena: log shows incoming number 000-000-0419.', 'Marcus: that number appears in the 2013 migration table.', 'Dave: modem just printed GOOD NIGHT. there is no printer attached.'],
  grp_staff_mod: ['Mara: seven duplicate feedback accounts quarantined.', 'Inez: identities are null but permission scopes are valid.', 'Marcus: creation audit predates the current database.', 'Ren: why am I in this group?', 'Mara: medical reassurance.', 'Ren: medically, this is bad.'],
};

const roomDialogue: Record<string, Array<[string, string, string]>> = {
  room_night_owls: [['Mara Vale','mara.v','What small thing is keeping everyone company tonight?'],['Mina Bell','mina.b','A library book and the sound of my neighbor making soup.'],['Julian K.','julian.k','I am the neighbor making soup, spiritually if not geographically.'],['Hannah Scott','hannah.s','My cat is supervising an unplugged router.'],['Jonah Pike','jonah.p','That sentence has a sequel and I fear it.'],['Mara Vale','mara.v','Pinned reminder: strange electronics go in #hardware-lab, strange cats may remain here.']],
  room_old_internet: [['Felix Arden','felix.a','Today’s restoration: a 2003 guestbook with 812 signatures and one signature dated tomorrow.'],['Elena Vance','elena.v','Preserve the raw HTML before opening external images.'],['Dave Cho','dave.cho','It uses a transparent 1px tracker pointed at a dead domain.'],['Inez Harrow','inez.h','The domain is responding locally. Nobody click it.'],['Jonah Pike','jonah.p','Putting “nobody click it” on the internet has never failed.'],['Mara Vale','mara.v','Thread locked for ten minutes because Jonah is unfortunately correct.']],
  room_urban_legends: [['Owen Miller','owen.m','Payphone on Calder Street rang at 01:17. No cable, no dial tone.'],['Celia March','celia.m','That phone was removed in 2016 according to municipal inventory.'],['Mina Bell','mina.b','Local story says answering it makes another phone disappear.'],['Noor Pradana','noor.p','That is an inefficient telecommunications strategy.'],['Owen Miller','owen.m','It displayed my own number when it rang.'],['Celia March','celia.m','Please send location photos and do not answer it again.']],
  room_quiet_hours: [['Ren Okafor','renfieldnotes','Checking in from break. No need to reply; just leaving a light on.'],['Maya Lin','maya.l','Drawing quietly. The rain has excellent timing tonight.'],['Hannah Scott','hannah.s','Cat finally stopped staring at the router. Now staring at the wall above me.'],['Mara Vale','mara.v','Gentle reminder that silence is participation here too.'],['Theo Sato','theo.s','Uploaded ten minutes of soft rain with no surprise volume spikes.'],['Samira Cruz','samira.c','Verified. One distant knock at 06:12, labeled in transcript.']],
  room_soundscapes: [['Theo Sato','theo.s','New field recording: railway bridge, rain, low electrical hum.'],['Samira Cruz','samira.c','Spectrogram has six clean gaps in the vocal range.'],['Maya Lin','maya.l','It feels like listening around words that were removed.'],['Dave Cho','dave.cho','Could be noise cancellation from nearby equipment.'],['Theo Sato','theo.s','There was no powered equipment on site.'],['Samira Cruz','samira.c','Headphone warning added. Please do not amplify after 00:00.']],
  room_book_club: [['Chloe Zhang','chloe.z','Monthly pick thread: unreliable narrators and hostile documents.'],['Elena Vance','elena.v','My edition changed a pronoun overnight. Cache copies before syncing.'],['Jonah Pike','jonah.p','Book club has become version control.'],['Mina Bell','mina.b','All reading is forensic if the book dislikes you.'],['Maya Lin','maya.l','Paperback margin contains handwriting under the printed ink.'],['Chloe Zhang','chloe.z','Please post photos in the spoiler thread and include edition numbers.']],
  room_hardware_lab: [['Dave Cho','dave.cho','Bench update: unidentified ISA modem isolated, no external line connected.'],['Felix Arden','felix.a','It still answers AT commands.'],['Inez Harrow','inez.h','Document commands only. Do not dial numbers from archive logs.'],['Marcus Bell','marcus.b','Power draw increases every night at 04:19 local.'],['Dave Cho','dave.cho','Clock is removed. Device should not know local time.'],['Mara Vale','mara.v','Lab thread marked restricted until Inez completes review.']],
  room_midnight_cafe: [['Julian K.','julian.k','Soup counter open: roasted tomato, garlic, unreasonable pepper.'],['Noor Pradana','noor.p','Trading one rain photo for one bowl.'],['Ren Okafor','renfieldnotes','Night shift requests delivery by pneumatic tube.'],['Jonah Pike','jonah.p','The tube system rejects soup after the 2017 incident.'],['Julian K.','julian.k','There was no 2017 incident.'],['Elena Vance','elena.v','There is an archived policy titled THE 2017 SOUP INCIDENT.']],
  room_creative_corner: [['Maya Lin','maya.l','Prompt: draw a familiar room with one architectural mistake.'],['Hannah Scott','hannah.s','My room has a second door now. Does photography count?'],['Maya Lin','maya.l','That is either excellent participation or an emergency.'],['Noor Pradana','noor.p','Check old photos before opening it.'],['Hannah Scott','hannah.s','Old photos show a bookshelf there.'],['Mara Vale','mara.v','Moving this to Safety if the door remains after daylight.']],
  room_support: [['Inez Harrow','inez.h','Known issue: duplicate blank notifications at midnight. Investigation active.'],['Marcus Bell','marcus.b','Please include notification ID and device time zone.'],['Hannah Scott','hannah.s','Mine opened my profile with an older join date.'],['Elena Vance','elena.v','Same. Screenshot and export captured.'],['Mara Vale','mara.v','Do not post personal export files publicly. Send IDs only.'],['Inez Harrow','inez.h','Patch will suppress the route, not delete local evidence.']],
  room_feedback: [['Jonah Pike','jonah.p','Feature request: make the moon icon emotionally larger.'],['Mara Vale','mara.v','Denied with affection.'],['Maya Lin','maya.l','Feature request: theme that looks subtly incorrect.'],['Inez Harrow','inez.h','That is not a feature request I want the system to fulfill automatically.'],['Felix Arden','felix.a','Too late. My settings menu blinked.'],['Mara Vale','mara.v','Feedback thread temporarily locked for manifesting problems.']],
};

const baseTime = Date.parse('2026-08-20T18:00:00Z');

export const POPULATION_MESSAGES: Message[] = [
  ...SEEDED_DM_THREADS.flatMap(({ thread }) => {
    const contact = thread.participants[0];
    return (dmDialogue[thread.id] || []).map((line, index): Message => ({
      id: `population_${thread.id}_${index + 1}`,
      threadId: thread.id,
      senderId: line.speaker === 'contact' ? contact.id : 'current_user',
      senderHandle: line.speaker === 'contact' ? contact.handle : 'rowan',
      senderName: line.speaker === 'contact' ? contact.displayName : 'You',
      content: line.content,
      timestamp: new Date(baseTime + index * 130000 + thread.id.length * 17000).toISOString(),
      status: 'read',
      reactions: [],
      isSeeded: true,
    }));
  }),
  ...SEEDED_GROUP_THREADS.flatMap(({ thread }) => {
    const participants = thread.participants;
    return (groupDialogue[thread.id] || []).map((raw, index): Message => {
      const [speakerName, ...contentParts] = raw.split(': ');
      const participant = participants.find((item) => item.displayName.startsWith(speakerName)) || participants[index % participants.length];
      return {
        id: `population_${thread.id}_${index + 1}`,
        threadId: thread.id,
        senderId: participant.id,
        senderHandle: participant.handle,
        senderName: participant.displayName,
        content: contentParts.join(': '),
        timestamp: new Date(baseTime + index * 95000 + thread.id.length * 23000).toISOString(),
        status: 'read',
        reactions: [],
        isSeeded: true,
      };
    });
  }),
  ...Object.entries(roomDialogue).flatMap(([threadId, lines], roomIndex) =>
    lines.map(([senderName, senderHandle, content], index): Message => ({
      id: `population_${threadId}_${index + 1}`,
      threadId,
      senderId: `user_${senderHandle.replace(/[^a-z0-9]/g, '_')}`,
      senderHandle,
      senderName,
      content,
      timestamp: new Date(baseTime + roomIndex * 410000 + index * 72000).toISOString(),
      status: 'read',
      reactions: [],
      isSeeded: true,
    }))
  ),
];

export const POPULATION_NOTIFICATIONS: Notification[] = [
  ['pop_notif_01','mention','Mara mentioned you','Hydration check in #night-owls','/rooms/room_night_owls'],
  ['pop_notif_02','reaction','Elena reacted 🌙','Your archive reply received a reaction','/chats/thread_elena_dm'],
  ['pop_notif_03','room_post','Hardware Lab update','The isolated modem resumed carrier negotiation','/rooms/room_hardware_lab'],
  ['pop_notif_04','archive_alert','Archive restoration complete','Lantern IRC fragment 0x0419 is readable','/archive/2004'],
  ['pop_notif_05','message','Noor Pradana','the rain stopped. the furniture did not.','/chats/thread_noor_dm'],
  ['pop_notif_06','system_update','Quiet Window active','Notification sounds have been softened','/settings/sound'],
  ['pop_notif_07','room_post','Book Club poll closing','Choose next month’s hostile document','/rooms/room_book_club'],
  ['pop_notif_08','mention','Celia mentioned you','Do you recognize this classified number?','/rooms/room_urban_legends'],
  ['pop_notif_09','reaction','Jonah reacted 👀','Your message may have encouraged him','/chats/grp_local_lore'],
  ['pop_notif_10','archive_alert','Checksum mismatch','One continuity record has no matching file','/notebook'],
  ['pop_notif_11','message','Lucas Vance','check the woman reflected in the window','/chats/thread_lucas_dm'],
  ['pop_notif_12','room_post','Creative Corner update','A participant submitted a door that was not there yesterday','/rooms/room_creative_corner'],
  ['pop_notif_13','system_update','Theme unlocked','Something Is Wrong is now available','/settings/appearance'],
  ['pop_notif_14','mention','Inez mentioned you','Please export originals, not screenshots','/rooms/room_support'],
  ['pop_notif_15','message','@beforeyou','you have more conversations now','/chats/thread_beforeyou_dm'],
  ['pop_notif_16','archive_alert','Unindexed caller detected','Node 4 returned an empty identity string','/archive/2001'],
] .map(([id,type,title,body,targetUrl], index) => ({ id, type: type as Notification['type'], title, body, targetUrl, isRead: index < 6, createdAt: new Date(baseTime + index * 360000).toISOString() }));

export const POPULATION_BOOKMARKS: MessageBookmark[] = [
  { id: 'pop_bm_receipt', messageId: 'population_thread_elena_dm_3', threadId: 'thread_elena_dm', category: 'Evidence', customTag: 'Impossible Receipt', savedAt: '2026-08-20T21:11:00Z', note: 'Receipt timestamp postdates the shop closure.' },
  { id: 'pop_bm_extension', messageId: 'population_thread_ren_dm_6', threadId: 'thread_ren_dm', category: 'Important', customTag: 'Hospital Extension', savedAt: '2026-08-20T21:16:00Z', note: 'Calls originate from a room without a telephone.' },
  { id: 'pop_bm_modem', messageId: 'population_grp_bbs_crew_6', threadId: 'grp_bbs_crew', category: 'Evidence', customTag: 'Node Four', savedAt: '2026-08-20T21:22:00Z', note: 'Unattached modem printed GOOD NIGHT.' },
  { id: 'pop_bm_bridge', messageId: 'population_thread_theo_dm_3', threadId: 'thread_theo_dm', category: 'Evidence', customTag: '4–19 Pattern', savedAt: '2026-08-20T21:31:00Z', note: 'Railway bridge recording repeats four and nineteen.' },
  { id: 'pop_bm_accounts', messageId: 'population_thread_mara_dm_4', threadId: 'thread_mara_dm', category: 'Evidence', customTag: 'Seven Accounts', savedAt: '2026-08-20T21:44:00Z', note: 'Seven feedback accounts share the same recovery hint.' },
  { id: 'pop_bm_photo', messageId: 'population_thread_lucas_dm_6', threadId: 'thread_lucas_dm', category: 'Personal', customTag: 'Tea Shop Reflection', savedAt: '2026-08-20T21:55:00Z', note: 'Original 2019 photo depicts a shop opened in 2021.' },
  { id: 'pop_bm_gap', messageId: 'population_thread_samira_dm_3', threadId: 'thread_samira_dm', category: 'Evidence', customTag: 'Removed Voice', savedAt: '2026-08-20T22:02:00Z', note: 'Ambient frequency drops occupy the human vocal band.' },
  { id: 'pop_bm_checksum', messageId: 'population_thread_marcus_dm_3', threadId: 'thread_marcus_dm', category: 'Important', customTag: 'Extra Checksum', savedAt: '2026-08-20T22:10:00Z', note: 'Your checksum exists without a corresponding record.' },
];
