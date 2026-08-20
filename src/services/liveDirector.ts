import {
  Message,
  ConversationThread,
  Notification,
  TypingEvent,
} from '../types';
import { SEEDED_PARTICIPANTS } from '../data/seed';
import { continuityService } from './continuityService';

type TypingListener = (event: TypingEvent | null) => void;
type MessageListener = (message: Message) => void;
type NotificationListener = (notification: Notification) => void;

class LiveDirectorService {
  private typingListeners: Set<TypingListener> = new Set();
  private messageListeners: Set<MessageListener> = new Set();
  private notificationListeners: Set<NotificationListener> = new Set();
  private activeTypingTimeouts: Map<string, number> = new Map();
  private isOnline: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
        console.log('[LiveDirector] Online - simulated activity active');
      });
      window.addEventListener('offline', () => {
        this.isOnline = false;
        console.log('[LiveDirector] Offline - simulated activity paused');
        this.clearAllTyping();
      });
    }
  }

  public subscribeTyping(listener: TypingListener): () => void {
    this.typingListeners.add(listener);
    return () => this.typingListeners.delete(listener);
  }

  public subscribeMessage(listener: MessageListener): () => void {
    this.messageListeners.add(listener);
    return () => this.messageListeners.delete(listener);
  }

  public subscribeNotification(listener: NotificationListener): () => void {
    this.notificationListeners.add(listener);
    return () => this.notificationListeners.delete(listener);
  }

  private clearAllTyping() {
    for (const timeoutId of this.activeTypingTimeouts.values()) {
      window.clearTimeout(timeoutId);
    }
    this.activeTypingTimeouts.clear();
    this.typingListeners.forEach((l) => l(null));
  }

  public handleUserMessageSent(
    userMessage: Message,
    thread: ConversationThread,
    isBlocked: boolean,
    isMuted: boolean
  ): void {
    // If user is offline or recipient is blocked, do not simulate reply
    if (!this.isOnline || isBlocked) return;

    const threadId = thread.id;
    const userText = userMessage.content.toLowerCase();
    const currentStage = continuityService.getState().currentStage;

    // Default to an actual member of the active conversation so every contact
    // has a voice, rather than making Elena mysteriously answer for everyone.
    const availableRespondents = thread.participants.filter((participant) => participant.id !== userMessage.senderId);
    let respondent = availableRespondents[Math.floor(Math.random() * availableRespondents.length)]
      || thread.participants[0]
      || SEEDED_PARTICIPANTS.elena;
    const conversationalReplies = userText.includes('?')
      ? [
          'I think so, but give me a minute to check what I saved from last night.',
          'Short answer: probably. Long answer: I have three tabs open and a theory.',
          'Maybe. What made you notice it now?',
        ]
      : userText.includes('archive') || userText.includes('log')
        ? [
            'I have a related fragment in my saves. Sending the useful part when I find it.',
            'That lines up with an old timestamp I bookmarked. Weirdly, down to the minute.',
            'Adding it to the pile of things the archive insists are coincidences.',
          ]
        : [
            'Okay, that got my attention. Keep going.',
            'Noted. I was about to log off, and now I absolutely am not.',
            'I saw something adjacent to that earlier. Let me pull it back up.',
            'You say that like it is normal midnight information.',
          ];
    let replyText = conversationalReplies[Math.floor(Math.random() * conversationalReplies.length)];
    let typingDuration = 2400; // 2.4s

    if (threadId === 'thread_ren_dm') {
      respondent = SEEDED_PARTICIPANTS.ren;
      replyText = 'you always forget the last one. check your saved bookmarks.';
      typingDuration = 2800;
      continuityService.checkActionTrigger('REPLY_TO_REN');
    } else if (threadId === 'thread_beforeyou_dm') {
      respondent = SEEDED_PARTICIPANTS.beforeyou;
      if (currentStage >= 8) {
        replyText = 'do you remember me now?';
        typingDuration = 3500;
      } else {
        replyText = 'still here';
        typingDuration = 2000;
      }
    } else if (threadId === 'thread_elena_dm') {
      respondent = SEEDED_PARTICIPANTS.elena;
      if (userText.includes('quote') || userText.includes('keep this') || userText.includes('hushrooms')) {
        replyText = 'Look at the 2008 Hushrooms partition in Search. The sender signature on that unindexed packet is identical to your current handle.';
        typingDuration = 3200;
      } else if (userText.includes('archive') || userText.includes('2008')) {
        replyText = 'Exactly. The Hushrooms records are fascinating. Look at the timestamp headers in the Archive tab under 2008.';
        typingDuration = 3000;
      } else if (userText.includes('hello') || userText.includes('hi') || userText.includes('hey')) {
        replyText = 'Hey! Still up? I am scanning through some 2004 Lantern IRC chat logs right now.';
        typingDuration = 2200;
      } else if (userText.includes('list') || userText.includes('ren')) {
        replyText = 'Ren mentioned a list too. Did you check your Bookmarks tab? There is an entry dated 2017.';
        typingDuration = 2600;
      } else {
        replyText = 'Interesting observation. I took a note in our log. Keep me posted if you spot anything else unusual in the threads.';
        typingDuration = 2400;
      }
    } else if (threadId === 'thread_julian_dm') {
      respondent = SEEDED_PARTICIPANTS.julian;
      if (userText.includes('audio') || userText.includes('sound') || userText.includes('voice') || userText.includes('sample') || userText.includes('hum')) {
        replyText = 'Right? In the voice transcript I noticed it tagged [take 4]. Almost like we have repeated this exact pass three times before.';
        typingDuration = 3400;
      } else {
        replyText = 'Plugged my headphones back in. Let me know if you want me to record another relay pass tonight.';
        typingDuration = 2400;
      }
    } else if (threadId === 'thread_coffee_group') {
      respondent = Math.random() > 0.5 ? SEEDED_PARTICIPANTS.marcus : SEEDED_PARTICIPANTS.elena;
      replyText = respondent.displayName === 'Marcus Bell'
        ? 'Agreed. Just refilled my mug. What section of the records are you inspecting now?'
        : 'I see that too. Marcus, did you check the 2001 Midnight Board thread guidelines?';
      typingDuration = 3000;
    } else if (threadId === 'thread_daemon_dm') {
      respondent = SEEDED_PARTICIPANTS.daemon;
      replyText = `[SYS ACK ${Date.now().toString(16).toUpperCase()}] Node ID: C-0419-RECUR. Query matched 0 fatal errors. Continuity Depth: Level ${continuityService.getState().continuityDepth}.`;
      typingDuration = 1400;
    }

    // Schedule Typing Start
    const typingEvent: TypingEvent = {
      threadId,
      senderId: respondent.id,
      senderName: respondent.displayName,
      durationMs: typingDuration,
      startedAt: Date.now(),
    };

    const startTypingTimer = window.setTimeout(() => {
      if (!this.isOnline) return;
      this.typingListeners.forEach((l) => l(typingEvent));

      const deliverTimer = window.setTimeout(() => {
        if (!this.isOnline) return;

        this.typingListeners.forEach((l) => l(null));
        this.activeTypingTimeouts.delete(threadId);

        const newReply: Message = {
          id: `msg_sim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          threadId,
          senderId: respondent.id,
          senderHandle: respondent.handle,
          senderName: respondent.displayName,
          content: replyText,
          timestamp: new Date().toISOString(),
          status: 'delivered',
          reactions: [],
        };

        this.messageListeners.forEach((l) => l(newReply));

        if (!isMuted) {
          const notif: Notification = {
            id: `notif_${Date.now()}`,
            type: 'message',
            title: respondent.displayName,
            body: replyText,
            targetUrl: `/chats/${threadId}`,
            isRead: false,
            createdAt: new Date().toISOString(),
            senderHandle: respondent.handle,
          };
          this.notificationListeners.forEach((l) => l(notif));
        }
      }, typingDuration);

      this.activeTypingTimeouts.set(threadId, deliverTimer);
    }, 700);

    this.activeTypingTimeouts.set(`${threadId}_start`, startTypingTimer);
  }
}

export const liveDirector = new LiveDirectorService();
