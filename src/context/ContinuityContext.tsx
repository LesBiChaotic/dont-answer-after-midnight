import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  ContinuityState,
  PuzzleDefinition,
  StoryStage,
  StoryAccessMode,
  EndingType,
  EndingResult,
} from '../types';
import { continuityService } from '../services/continuityService';

interface ContinuityContextType {
  state: ContinuityState;
  puzzles: PuzzleDefinition[];
  storyStage: StoryStage;
  continuityDepth: number;
  accessMode: StoryAccessMode;
  solvedCount: number;
  revealHint: (puzzleId: string, level: number) => void;
  setAccessMode: (mode: StoryAccessMode) => void;
  advanceStage: (stage: StoryStage) => void;
  solvePuzzle: (puzzleId: string) => void;
  chooseEnding: (type: EndingType) => EndingResult;
  checkActionTrigger: (actionType: string, payload?: Record<string, unknown>) => void;
}

const ContinuityContext = createContext<ContinuityContextType | undefined>(undefined);

export const ContinuityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ContinuityState>(continuityService.getState());
  const [puzzles, setPuzzles] = useState<PuzzleDefinition[]>(continuityService.getPuzzles());

  useEffect(() => {
    const unsubscribe = continuityService.subscribe((updatedState) => {
      setState(updatedState);
      setPuzzles(continuityService.getPuzzles());
    });
    return unsubscribe;
  }, []);

  const revealHint = useCallback((puzzleId: string, level: number) => {
    continuityService.revealHint(puzzleId, level);
  }, []);

  const setAccessMode = useCallback((mode: StoryAccessMode) => {
    continuityService.setAccessMode(mode);
  }, []);

  const advanceStage = useCallback((stage: StoryStage) => {
    continuityService.advanceStage(stage);
  }, []);

  const solvePuzzle = useCallback((puzzleId: string) => {
    continuityService.solvePuzzle(puzzleId);
  }, []);

  const chooseEnding = useCallback((type: EndingType): EndingResult => {
    return continuityService.chooseEnding(type);
  }, []);

  const checkActionTrigger = useCallback((actionType: string, payload?: Record<string, unknown>) => {
    continuityService.checkActionTrigger(actionType, payload);
  }, []);

  return (
    <ContinuityContext.Provider
      value={{
        state,
        puzzles,
        storyStage: state.currentStage,
        continuityDepth: state.continuityDepth,
        accessMode: state.accessMode,
        solvedCount: state.solvedPuzzleIds.length,
        revealHint,
        setAccessMode,
        advanceStage,
        solvePuzzle,
        chooseEnding,
        checkActionTrigger,
      }}
    >
      {children}
    </ContinuityContext.Provider>
  );
};

export function useContinuity(): ContinuityContextType {
  const context = useContext(ContinuityContext);
  if (!context) {
    throw new Error('useContinuity must be used within a ContinuityProvider');
  }
  return context;
}
