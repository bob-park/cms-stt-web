'use client';

import { createContext, useMemo, useState } from 'react';

interface VideoPlayerContextState {
  duration: number;
  currentTime: number;
  manualCurrentTime: number;
  onDurationUpdate: (duration: number) => void;
  onTimeUpdate: (currentTime: number) => void;
  onUpdateCurrentTime: (currentTime: number) => void;
}

export const VideoPlayerContext = createContext<VideoPlayerContextState>({
  duration: 0,
  currentTime: 0,
  manualCurrentTime: 0,
  onDurationUpdate: (duration: number) => {},
  onTimeUpdate: (currentTime: number) => {},
  onUpdateCurrentTime: (currentTime: number) => {},
});

export default function VideoPlayerProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  // state
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [manualCurrentTime, setManualCurrentTime] = useState<number>(0);

  // memorize
  const memoContextValue = useMemo<VideoPlayerContextState>(
    () => ({
      duration,
      currentTime,
      manualCurrentTime: manualCurrentTime,
      onDurationUpdate: (duration: number) => setDuration(duration),
      onTimeUpdate: (time: number) => setCurrentTime(time),
      onUpdateCurrentTime: (currentTime: number) => setManualCurrentTime(currentTime),
    }),
    [duration, currentTime],
  );

  return <VideoPlayerContext.Provider value={memoContextValue}>{children}</VideoPlayerContext.Provider>;
}
