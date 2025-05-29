'use client';

import { useEffect, useRef, useState } from 'react';

import { FaPause, FaPlay } from 'react-icons/fa6';

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

  // state
  const [showControl, setShowControl] = useState<boolean>(true);
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

    if (vw > STANDARD_WIDTH) {
      videoWidth -= STANDARD_TEXT_WIDTH;
    }

    video.style.width = `${videoWidth}px`;
    video.style.height = '100%';
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

  return (
    <div
      className="relative flex flex-col items-center justify-center gap-3 rounded-2xl bg-black p-3 select-none"
      onMouseEnter={() => setShowControl(true)}
      onMouseLeave={() => setShowControl(false)}
    >
      <video
        ref={videoRef}
        style={{ width: '100%', height: '484px' }}
        className="aspect-auto rounded-2xl"
        src={`/api/v1/assets/1/stt/jobs/${jobId}/resource`}
        autoPlay
        onLoadedMetadataCapture={handleLoadedMetadata}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onPlay={() => setIsPlay(true)}
        onPause={() => setIsPlay(false)}
      />
      <div
        className={cx(
          'absolute top-0 left-0 size-full rounded-2xl bg-black/70 transition-all transition-discrete',
          showControl ? 'block' : 'opacity-0',
        )}
      >
        <div className="relative size-full">
          <div className="absolute bottom-0 left-0 flex w-full flex-col items-center justify-center gap-3 px-5 py-2">
            {/* progress */}
            <div className="relative h-1 w-full cursor-pointer rounded-2xl bg-gray-400" onMouseMove={handleMouseMove}>
              {/* current time */}
              <div
                className="absolute left-0 h-1 cursor-pointer bg-red-600"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              ></div>

              {/* current navigator */}
              <div
                className="absolute -top-[6px] size-4 rounded-full bg-red-600"
                style={{ left: `${(currentTime / duration) * 100}%` }}
              ></div>
            </div>

            {/* control */}
            <div className="flex w-full flex-row items-center gap-3">
              {/* play */}
              <button
                className="btn btn-ghost text-gray-300 hover:text-black"
                type="button"
                onClick={() => {
                  isPlay ? handlePause() : handlePlay();
                }}
              >
                {isPlay ? <FaPause className="size-6" /> : <FaPlay className="size-6" />}
              </button>

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
    </div>
  );
}
