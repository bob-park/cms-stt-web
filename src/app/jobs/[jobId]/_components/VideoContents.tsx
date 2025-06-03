'use client';

import { useContext, useEffect } from 'react';

import VideoPlayer from '@/shared/components/player/VideoPlayer';
import { VideoPlayerContext } from '@/shared/components/player/VideoPlayerProvider';

import cx from 'classnames';

import { SttContentsContext } from './SttContentsProvider';

interface JobContentsProps {
  jobId: string;
}

export function VideoContents({ jobId }: JobContentsProps) {
  // context
  const { currentTime } = useContext(VideoPlayerContext);
  const { contents, current, onUpdateCurrent } = useContext(SttContentsContext);

  // useEffect
  useEffect(() => {
    const content = contents.find((item) => item.startTime <= currentTime && item.endTime >= currentTime);

    onUpdateCurrent && onUpdateCurrent(content?.id);
  }, [contents, currentTime]);

  return (
    <div className="relative flex size-full flex-col gap-1">
      {/* video */}
      <div className="">
        <VideoPlayer src={`/api/v1/assets/1/stt/jobs/${jobId}/resource`} />
      </div>

      {/* stt text */}
      <div className={cx('absolute bottom-20 left-auto z-0 flex w-full items-center justify-center gap-3')}>
        {current && (
          <div className="flex w-fit flex-col items-center justify-center gap-1 rounded-2xl bg-black/50 px-2 py-2 text-lg text-white">
            <div className="">
              <span>[</span>
              <span>{current.speaker?.speakerName || current.speaker?.speaker || 'Unknown'}</span>
              <span>]</span>
            </div>
            <div className="max-w-[300px] text-center text-pretty break-keep">
              <span>{current.text}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
