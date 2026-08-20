import {
  ContinuityState,
  StoryStage,
  StoryAccessMode,
  EndingType,
  EndingResult,
  PuzzleDefinition,
} from '../types';
import { PUZZLE_DEFINITIONS } from '../data/lore';

const INITIAL_CONTINUITY_STATE: ContinuityState = {
  currentStage: 1, // Start on Stage 1 (First Contact available)
  continuityDepth: 0,
  continuityTokens: 0,
  solvedPuzzleIds: [],
  revealedHintKeys: [],
  accessMode: 'spoiler_free',
  unlockedLoreDocs: ['guide_first_contact'],
  activeAnomalies: ['renfieldnotes_inbox_pending'],
};

export const ENDING_NARRATIVES: Record<EndingType, { title: string; text: string }> = {
  do_not_reply: {
    title: 'Ending A: The Quarantine (Do Not Reply)',
    text: 'You set the device down on your nightstand and choose silence. You do not send the reply. The backfill process stalls in the 2008 partition. The typing indicator in @beforeyou appears for three seconds, pauses, and fades into the dark. Existing archives remain, but no further years are rewritten tonight.',
  },
  delete_local: {
    title: 'Ending B: The Local Purge (Delete Thread)',
    text: 'You tap delete. The conversation disappears from your inbox. But thirty seconds later, the archive sync routine mounts the 2009 partition. The thread returns to your inbox with every message intact. The system cannot delete a relationship whose historical depth outlives the local storage.',
  },
  quarantine: {
    title: 'Ending C: Isolation Seal (Quarantine)',
    text: 'You engage the Trust & Safety isolation seal. The direct thread is frozen in read-only amber status. Continuity depth locks at Level 3. The historical records stop propagating backwards, preserved as an unalterable digital artifact from an era that never took place.',
  },
  scatter: {
    title: 'Ending D: The Broken Linkage (Scatter)',
    text: 'You sever the cross-platform bridge keys. The thread ID C-0419-RECUR fragments across five legacy partitions. In 2001, an anonymous handle waits on IRC; in 2008, a node hash routes to cold storage; in 2026, @beforeyou dissolves into four unowned placeholders.',
  },
  answer: {
    title: 'Ending E: The Full Acknowledgment (Answer)',
    text: 'You type your reply: "I remember."\n\nThe continuity resolver hits 100% confidence. The thread timestamp resets to November 15, 2001. All five historical partitions merge into a continuous 25-year backscroll. A new message appears immediately:\n\n"good. i hated starting over."',
  },
};

type StateListener = (state: ContinuityState) => void;

class ContinuityService {
  private state: ContinuityState = INITIAL_CONTINUITY_STATE;
  private listeners: Set<StateListener> = new Set();

  constructor() {
    this.loadState();
  }

  private async loadState() {
    try {
      const local = localStorage.getItem('afterhours_continuity_state');
      if (local) {
        this.state = JSON.parse(local);
      }
      this.notify();
    } catch {
      this.state = INITIAL_CONTINUITY_STATE;
    }
  }

  private saveState() {
    try {
      localStorage.setItem('afterhours_continuity_state', JSON.stringify(this.state));
    } catch (err) {
      console.warn('[ContinuityService] Error saving state:', err);
    }
    this.notify();
  }

  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l(this.state));
  }

  public getState(): ContinuityState {
    return this.state;
  }

  public getPuzzles(): PuzzleDefinition[] {
    return PUZZLE_DEFINITIONS.map((p) => {
      const isSolved = this.state.solvedPuzzleIds.includes(p.id);
      const hints = p.hints.map((h) => ({
        ...h,
        isRevealed:
          this.state.accessMode === 'full_access' ||
          this.state.revealedHintKeys.includes(`${p.id}_${h.level}`),
      }));

      return {
        ...p,
        isSolved,
        hints,
      };
    });
  }

  public revealHint(puzzleId: string, level: number) {
    const key = `${puzzleId}_${level}`;
    if (!this.state.revealedHintKeys.includes(key)) {
      this.state = {
        ...this.state,
        revealedHintKeys: [...this.state.revealedHintKeys, key],
      };
      this.saveState();
    }
  }

  public setAccessMode(mode: StoryAccessMode) {
    this.state = { ...this.state, accessMode: mode };
    this.saveState();
  }

  public advanceStage(stage: StoryStage) {
    if (stage > this.state.currentStage) {
      const newDepth = Math.min(5, Math.floor(stage / 2));
      this.state = {
        ...this.state,
        currentStage: stage,
        continuityDepth: newDepth,
      };
      this.saveState();
    }
  }

  public solvePuzzle(puzzleId: string) {
    if (!this.state.solvedPuzzleIds.includes(puzzleId)) {
      const updatedSolved = [...this.state.solvedPuzzleIds, puzzleId];
      const newTokens = this.state.continuityTokens + 1;
      const calculatedStage = Math.min(9, Math.floor(updatedSolved.length / 1.6) + 1) as StoryStage;
      const newDepth = Math.min(5, Math.floor(calculatedStage / 1.8));

      this.state = {
        ...this.state,
        solvedPuzzleIds: updatedSolved,
        continuityTokens: newTokens,
        currentStage: Math.max(this.state.currentStage, calculatedStage) as StoryStage,
        continuityDepth: Math.max(this.state.continuityDepth, newDepth),
      };
      this.saveState();
    }
  }

  public chooseEnding(type: EndingType): EndingResult {
    const narrative = ENDING_NARRATIVES[type];
    const result: EndingResult = {
      type,
      title: narrative.title,
      narrativeText: narrative.text,
      finalTimestamp: new Date().toISOString(),
      continuityDepth: type === 'answer' ? 5 : this.state.continuityDepth,
      unlockedAt: new Date().toISOString(),
    };

    this.state = {
      ...this.state,
      endingChosen: type,
      currentStage: 9,
      solvedPuzzleIds: Array.from(new Set([...this.state.solvedPuzzleIds, 'puz_15_final_encounter', 'puz_16_endings_resolution'])),
    };
    this.saveState();
    return result;
  }

  // Trigger evaluation from player actions
  public checkActionTrigger(actionType: string, _payload: Record<string, unknown> = {}) {
    if (actionType === 'REPLY_TO_REN') {
      this.solvePuzzle('puz_01_wrong_person');
      this.advanceStage(2);
    } else if (actionType === 'INSPECT_OUR_LIST_BOOKMARK') {
      this.solvePuzzle('puz_02_our_list');
      this.advanceStage(3);
    } else if (actionType === 'SEARCH_HUSHROOMS_QUOTE') {
      this.solvePuzzle('puz_03_quoted_message');
      this.advanceStage(4);
    } else if (actionType === 'VIEW_EDIT_HISTORY') {
      this.solvePuzzle('puz_06_edit_history');
      this.advanceStage(5);
    } else if (actionType === 'VIEW_OLD_INTERNET_ROOM') {
      this.solvePuzzle('puz_09_memory_alignment');
      this.advanceStage(6);
    } else if (actionType === 'PLAY_VOICE_NOTE_TRANSCRIPT') {
      this.solvePuzzle('puz_10_voice_note');
      this.advanceStage(7);
    } else if (actionType === 'GENERATE_DATA_EXPORT') {
      this.solvePuzzle('puz_04_thread_start');
      this.solvePuzzle('puz_11_data_export_discrepancy');
      this.advanceStage(8);
    } else if (actionType === 'INSPECT_BEFOREYOU_PROFILE') {
      this.solvePuzzle('puz_12_beforeyou_owner');
      this.solvePuzzle('puz_05_recovered_block');
      this.advanceStage(8);
    } else if (actionType === 'SEARCH_THREAD_PERSISTENCE') {
      this.solvePuzzle('puz_08_handle_collision');
      this.solvePuzzle('puz_13_reciprocity_proof');
      this.advanceStage(9);
    }
  }
}

export const continuityService = new ContinuityService();
