import { useContext, useEffect, useRef, useState } from 'react';

import { FaPause, FaPlay, FaVolumeHigh, FaVolumeLow, FaVolumeXmark } from 'react-icons/fa6';
import { GrRevert } from 'react-icons/gr';

import { VideoPlayerContext } from '@/shared/components/player/VideoPlayerProvider';
import { TimeCode } from '@/shared/utils/timecode/TimeCode';

import cx from 'classnames';

const STANDARD_WIDTH_PADDING = 100;
const STANDARD_WIDTH = 1024;
const STANDARD_TEXT_WIDTH = 450;

interface VideoPlayerProps {
  src: string;
  autoPlay?: boolean;
  onUpdateTime?: () => void;
}

export default function VideoPlayer({ src, autoPlay = false, onUpdateTime }: Readonly<VideoPlayerProps>) {
  // ref
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // context
  const { onDurationUpdate, onTimeUpdate } = useContext(VideoPlayerContext);

  // state
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showControl, setShowControl] = useState<boolean>(false);

  const [isPlay, setIsPlay] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const [isMute, setIsMute] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(100);

  // useEffect
  useEffect(() => {
    videoRef.current?.load();

    resizeVideoWidth();
    function handleKeyDown(e: KeyboardEvent) {
      e.preventDefault();

      const video = videoRef.current;

      if (!video) {
        return;
      }

      switch (e.key) {
        case ' ': {
          video.paused ? handlePlay() : handlePause();
          break;
        }
        case 'ArrowRight': {
          handleForward(10);
          break;
        }
        case 'ArrowLeft': {
          handleForward(-10);
          break;
        }
        case 'm': {
          handleMute(!video.muted);
          break;
        }
        case 'ArrowUp': {
          const volumeSize = video.volume * 100 + 10;
          handleVolume(volumeSize);
          break;
        }
        case 'ArrowDown': {
          const volumeSize = video.volume * 100 - 10;
          handleVolume(volumeSize);
          break;
        }
        default: {
          break;
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    window.addEventListener('resize', resizeVideoWidth);

    return () => {
      window.removeEventListener('resize', resizeVideoWidth);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    onTimeUpdate(currentTime);
  }, [currentTime]);

  useEffect(() => {
    onDurationUpdate(duration);
  }, [duration]);

  useEffect(() => {
    if (!isPlay) {
      return;
    }

    const intervalId = setInterval(() => {
      const video = videoRef.current;

      if (!video) {
        return;
      }

      setCurrentTime(video.currentTime);
    }, 10);

    return () => {
      intervalId && clearInterval(intervalId);
    };
  }, [isPlay]);

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDragging, currentTime]);

  useEffect(() => {
    handleVolume(volume);
  }, [volume]);

  // handle
  const resizeVideoWidth = () => {
    if (!videoRef.current) {
      return;
    }

    const video = videoRef.current;

    const vw = window.innerWidth;

    let videoWidth = vw - STANDARD_WIDTH_PADDING;
    const videoHeight = '100%';

    if (vw > STANDARD_WIDTH) {
      videoWidth -= STANDARD_TEXT_WIDTH;
    }

    video.style.width = `${videoWidth}px`;
    video.style.height = videoHeight;
  };

  const calculateSeekTime = (clientX: number) => {
    const progressBar = progressBarRef.current;
    const video = videoRef.current;

    if (!progressBar || !video) {
      return 0;
    }

    const rect = progressBar.getBoundingClientRect();
    const clickX = clientX - rect.left;

    const current = (clickX / rect.width) * video.duration;

    if (current < 0) {
      return 0;
    }

    if (current > duration) {
      return duration;
    }

    return current;
  };

  const handleLoadedMetadata = () => {
    resizeVideoWidth();

    if (!videoRef.current) {
      return;
    }

    setDuration(videoRef.current.duration);
  };

  const handleMouseUp = (e: MouseEvent) => {
    const video = videoRef.current;

    if (!isDragging || !video) {
      return;
    }

    setIsDragging(false);

    video.currentTime = currentTime;

    handlePlay();
  };
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    handlePause();
    setIsDragging(true);

    setCurrentTime(calculateSeekTime(e.clientX));
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) {
      return;
    }

    setCurrentTime(calculateSeekTime(e.clientX));
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

  const handleForward = (time: number) => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    let nowTime = video.currentTime + time;

    if (nowTime >= duration) {
      nowTime = duration;
    }

    if (nowTime < 0) {
      nowTime = 0;
    }

    video.currentTime = nowTime;

    setCurrentTime(nowTime);
  };

  const handleVolume = (size: number) => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    let volumeSize = size;

    if (volumeSize > 100) {
      volumeSize = 100;
    }

    if (volumeSize < 0) {
      volumeSize = 0;
    }

    setVolume(volumeSize);

    video.volume = volumeSize / 100;
  };

  const handleMute = (mute: boolean) => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.muted = mute;

    setIsMute(mute);
  };

  return (
    <div
      className={cx(
        'relative flex flex-col items-center justify-center gap-3 rounded-2xl bg-black p-3 select-none',
        isDragging && 'cursor-pointer',
      )}
      onMouseEnter={() => setShowControl(true)}
      onMouseLeave={() => setShowControl(false)}
      onDoubleClick={() => (isPlay ? handlePause() : handlePlay())}
    >
      {/* video */}
      <video
        ref={videoRef}
        style={{ width: '100%', height: '484px' }}
        className="aspect-auto max-h-[800px] rounded-2xl"
        src={src}
        autoPlay={autoPlay}
        onLoadedMetadataCapture={handleLoadedMetadata}
        onPlay={() => setIsPlay(true)}
        onPause={() => setIsPlay(false)}
      />

      {/* control */}
      <div
        className={cx(
          'absolute top-0 left-0 size-full rounded-2xl bg-black/50 transition-all transition-discrete',
          showControl ? 'block' : 'opacity-0',
        )}
      >
        <div className="relative size-full">
          <div className="absolute bottom-0 left-0 flex w-full flex-col items-center justify-center gap-1 px-5 py-2">
            {/* progress */}
            <div
              ref={progressBarRef}
              className="relative flex h-1 w-full cursor-pointer flex-col items-center justify-center rounded-2xl bg-gray-400"
              onMouseDown={handleMouseDown}
            >
              {/* current time */}
              <div
                className="absolute left-0 h-1 cursor-pointer rounded-l-2xl bg-red-600"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />

              {/* current navigator */}
              <div
                className={cx(
                  'absolute top-auto size-5 rounded-full transition-opacity duration-150',
                  isDragging && 'bg-red-300/75',
                )}
                style={{ left: `${(currentTime / duration) * 100 - 0.7}%` }}
              >
                <div className="relative">
                  <div className={cx('absolute top-[2px] left-[2px] size-4 rounded-full bg-red-600')} />
                </div>
              </div>
            </div>

            {/* control */}
            <div className="my-2 flex w-full flex-row items-center gap-3">
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

              {/* volumes */}
              <div className="flex flex-row items-center justify-center gap-1">
                <button
                  className="btn btn-ghost text-gray-300 hover:text-black"
                  type="button"
                  onClick={() => handleMute(!isMute)}
                >
                  {(isMute || volume <= 0) && <FaVolumeXmark className="size-6" />}
                  {!isMute && volume > 0 && volume < 30 && <FaVolumeLow className="size-6" />}
                  {!isMute && volume >= 30 && <FaVolumeHigh className="size-6" />}
                </button>

                <div className="w-24">
                  <input
                    className="range range-xs text-white [--range-bg:gray] [--range-fill:1] [--range-thumb:black]"
                    type="range"
                    max={100}
                    min={0}
                    value={isMute ? 0 : volume}
                    onChange={(e) => handleVolume(parseInt(e.currentTarget.value, 0))}
                  />
                </div>
              </div>

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
