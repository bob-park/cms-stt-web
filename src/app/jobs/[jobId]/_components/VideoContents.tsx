'use client';

import { useContext, useEffect, useRef, useState } from 'react';

import { FaPause, FaPlay } from 'react-icons/fa6';
import { GrRevert } from 'react-icons/gr';

import { SttContentsContext } from '@/app/jobs/[jobId]/_components/SttContentsProvider';

import { TimeCode } from '@/domain/timecode/model/timecode';

import cx from 'classnames';

const STANDARD_WIDTH = 1024;
const STANDARD_TEXT_WIDTH = 450;

interface JobContentsProps {
  jobId: string;
}

export function VideoContents({ jobId }: JobContentsProps) {
  // useRef
  const videoRef = useRef<HTMLVideoElement>(null);

  // context
  const { contents, current, onUpdateCurrent } = useContext(SttContentsContext);

  // state
  const [showControl, setShowControl] = useState<boolean>(false);
  const [isPlay, setIsPlay] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);

  // useEffect
  useEffect(() => {
    videoRef.current?.load();

    handleResizeVideoWidth();
    window.addEventListener('resize', handleResizeVideoWidth);
  }, []);

  // handle
  const handleResizeVideoWidth = () => {
    if (!videoRef.current) {
      return;
    }

    const video = videoRef.current;

    const vw = window.innerWidth;

    let videoWidth = vw - 60;
    const videoHeight = '100%';

    if (vw > STANDARD_WIDTH) {
      videoWidth -= STANDARD_TEXT_WIDTH;
    }

    video.style.width = `${videoWidth}px`;
    video.style.height = videoHeight;
  };

  const handleLoadedMetadata = () => {
    handleResizeVideoWidth();

    if (!videoRef.current) {
      return;
    }

    setDuration(videoRef.current.duration);
  };

  const handlePlay = () => {
    if (!videoRef.current) {
      return;
    }

    videoRef.current.play();
  };

  const handlePause = () => {
    if (!videoRef.current) {
      return;
    }

    videoRef.current.pause();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const totalWidth = rect.width;
    const currentWidth = e.clientX - rect.left;

    if (!videoRef.current) {
      return;
    }

    if (e.buttons === 1) {
      videoRef.current.currentTime = duration * (currentWidth / totalWidth);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) {
      return;
    }

    const currentTime = videoRef.current.currentTime;

    setCurrentTime(currentTime);

    const content = contents.find((item) => item.startTime <= currentTime && item.endTime >= currentTime);

    onUpdateCurrent && onUpdateCurrent(content?.id);
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center gap-3 rounded-2xl bg-black p-3 select-none"
      onMouseEnter={() => setShowControl(true)}
      onMouseLeave={() => setShowControl(false)}
    >
      {/* video */}
      <video
        ref={videoRef}
        style={{ width: '100%', height: '484px' }}
        className="aspect-auto max-h-[800px] rounded-2xl"
        src={`/api/v1/assets/1/stt/jobs/${jobId}/resource`}
        // autoPlay
        onLoadedMetadataCapture={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlay(true)}
        onPause={() => setIsPlay(false)}
      />

      {/* control */}
      <div
        className={cx(
          'absolute top-0 left-0 size-full rounded-2xl bg-black/70 transition-all transition-discrete',
          showControl ? 'block' : 'opacity-0',
        )}
      >
        <div className="relative size-full">
          <div className="absolute bottom-0 left-0 flex w-full flex-col items-center justify-center gap-1 px-5 py-2">
            {/* progress */}
            <div
              className="relative flex h-10 w-full cursor-pointer flex-col items-center justify-center rounded-2xl"
              onMouseMove={handleMouseMove}
            >
              {/* duration */}
              <div className="absolute left-0 h-1 w-full cursor-pointer rounded-2xl bg-gray-400"></div>

              {/* current time */}
              <div
                className="absolute left-0 h-1 cursor-pointer rounded-l-2xl bg-red-600"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              ></div>

              {/* current navigator */}
              <div
                className="absolute top-auto size-4 rounded-full bg-red-600"
                style={{ left: `${(currentTime / duration) * 100}%` }}
              ></div>
            </div>

            {/* control */}
            <div className="-mt-2 mb-4 flex w-full flex-row items-center gap-3">
              {/* play */}
              {currentTime >= duration ? (
                <button
                  className="btn btn-ghost text-gray-300 hover:text-black"
                  type="button"
                  onClick={() => {
                    if (!videoRef.current) {
                      return;
                    }

                    videoRef.current.currentTime = 0;
                    handlePlay();
                  }}
                >
                  <GrRevert className="size-6" />
                </button>
              ) : (
                <button
                  className="btn btn-ghost text-gray-300 hover:text-black"
                  type="button"
                  onClick={() => {
                    isPlay ? handlePause() : handlePlay();
                  }}
                >
                  {isPlay ? <FaPause className="size-6" /> : <FaPlay className="size-6" />}
                </button>
              )}

              {/* time */}
              <div className="flex flex-row items-center justify-center gap-3 text-gray-300">
                {/* current time */}
                <div className="">
                  <span>{new TimeCode(currentTime).toString()}</span>
                </div>

                <div className="">
                  <span>/</span>
                </div>

                {/* duration */}
                <div>
                  <span>{new TimeCode(duration).toString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 자막 */}

      <div
        className={cx(
          'absolute left-auto flex items-center justify-center gap-3',
          showControl ? 'bottom-24' : 'bottom-20',
        )}
      >
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
