'use client';

import { createContext, useMemo, useState } from 'react';

interface VideoPlayerContextState {
  duration: number;
  currentTime: number;
  onDurationUpdate: (duration: number) => void;
  onTimeUpdate: (currentTime: number) => void;
}

export const VideoPlayerContext = createContext<VideoPlayerContextState>({
  duration: 0,
  currentTime: 0,
  onDurationUpdate: (duration: number) => {},
  onTimeUpdate: (currentTime: number) => {},
});

export default function VideoPlayerProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  // state
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);

  // memorize
  const memoContextValue = useMemo<VideoPlayerContextState>(
    () => ({
      duration,
      currentTime,
      onDurationUpdate: (duration: number) => setDuration(duration),
      onTimeUpdate: (time: number) => setCurrentTime(time),
    }),
    [duration, currentTime],
  );

  return <VideoPlayerContext.Provider value={memoContextValue}>{children}</VideoPlayerContext.Provider>;
}
