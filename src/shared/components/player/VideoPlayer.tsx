import { useContext, useEffect, useRef, useState } from 'react';

import { FaBackward, FaForward, FaPause, FaPlay, FaVolumeHigh, FaVolumeLow, FaVolumeXmark } from 'react-icons/fa6';
import { GrRevert } from 'react-icons/gr';

import { VideoPlayerContext } from '@/shared/components/player/VideoPlayerProvider';
import { TimeCode } from '@/shared/utils/timecode/TimeCode';

import cx from 'classnames';
import { v4 as uuid } from 'uuid';

const STANDARD_WIDTH_PADDING = 60;
const STANDARD_WIDTH = 1024;
const STANDARD_TEXT_WIDTH = 450;
const MIN_WIDTH = 560;

interface VideoPlayerProps {
  src: string;
  autoPlay?: boolean;
  onUpdateTime?: () => void;
}

type VideoAction = 'played' | 'paused' | 'forward' | 'backward';

interface ActionStatus {
  id: string;
  action: VideoAction;
}

export default function VideoPlayer({ src, autoPlay = false, onUpdateTime }: Readonly<VideoPlayerProps>) {
  // ref
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // context
  const { manualCurrentTime, onDurationUpdate, onTimeUpdate } = useContext(VideoPlayerContext);

  // state
  const [actionHistories, setActionHistories] = useState<ActionStatus[]>([]);

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showControl, setShowControl] = useState<boolean>(false);
  const [isHoverControl, setIsHoverControl] = useState<boolean>(false);

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

          handleAddActionHistory(!video.paused ? 'played' : 'paused');
          break;
        }
        case 'ArrowRight': {
          handleForward(10);
          handleAddActionHistory('forward');
          break;
        }
        case 'ArrowLeft': {
          handleForward(-10);
          handleAddActionHistory('backward');
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

      setShowControl(true);
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

  useEffect(() => {
    if (!showControl || isHoverControl) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setShowControl(false);
    }, 1_000);

    return () => {
      timeoutId && clearTimeout(timeoutId);
    };
  }, [showControl, isHoverControl]);

  useEffect(() => {
    if (actionHistories.length === 0) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setActionHistories((prev) => prev.filter((_, index) => index !== 0));
    }, 1_000);

    return () => {
      timeoutId && clearTimeout(timeoutId);
    };
  }, [actionHistories]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.currentTime = manualCurrentTime;
  }, [manualCurrentTime]);

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

    if (vw < MIN_WIDTH) {
      videoWidth = MIN_WIDTH - STANDARD_WIDTH_PADDING;
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

    if (current > video.duration) {
      return video.duration;
    }

    return current;
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) {
      return;
    }

    setDuration(videoRef.current.duration);
    resizeVideoWidth();
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

    setCurrentTime(videoRef.current.currentTime);
  };

  const handlePause = () => {
    if (!videoRef.current) {
      return;
    }

    videoRef.current.pause();

    setCurrentTime(videoRef.current.currentTime);
  };

  const handleForward = (time: number) => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    let nowTime = video.currentTime + time;

    if (nowTime >= video.duration) {
      nowTime = video.duration;
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

  const handleAddActionHistory = (action: VideoAction) => {
    setActionHistories((prev) => {
      const newActionHistories = prev.slice();

      if (newActionHistories.length > 0) {
        newActionHistories.splice(0, 1);
      }

      newActionHistories.push({
        id: uuid(),
        action: action,
      });

      return newActionHistories;
    });
  };

  return (
    <div
      className={cx(
        'relative flex size-fit flex-col items-center justify-center rounded-2xl bg-black select-none',
        isDragging && 'cursor-pointer',
      )}
      onMouseEnter={() => {
        setShowControl(true);
        setIsHoverControl(true);
      }}
      onMouseLeave={() => {
        setShowControl(false);
        setIsHoverControl(false);
      }}
      onDoubleClick={() => (isPlay ? handlePause() : handlePlay())}
    >
      {/* video */}
      <video
        ref={videoRef}
        className="max-h-[800px] rounded-2xl"
        src={src}
        autoPlay={autoPlay}
        onLoadedMetadataCapture={handleLoadedMetadata}
        onLoadedData={handleLoadedMetadata}
        onPlay={() => setIsPlay(true)}
        onPause={() => setIsPlay(false)}
      />

      {/* control */}
      <div
        className={cx(
          'absolute top-0 left-0 z-50 size-full rounded-2xl bg-black/50 transition-all transition-discrete',
          showControl ? 'block' : 'opacity-0',
        )}
      >
        <div className="relative size-full">
          {/* action */}
          {actionHistories.length > 0 && (
            <div
              className={cx('absolute top-1/3 flex w-full flex-row items-center px-10', {
                'scale-110 justify-center': ['played', 'paused'].includes(actionHistories[0].action),
                'justify-end': ['forward'].includes(actionHistories[0].action),
                'justify-start': ['backward'].includes(actionHistories[0].action),
              })}
            >
              <div className="rounded-full bg-gray-400/50 p-8">
                {'played' === actionHistories[0].action && (
                  <div className="text-white">
                    <FaPlay className="size-24" />
                  </div>
                )}
                {'paused' === actionHistories[0].action && (
                  <div className="text-white">
                    <FaPause className="size-24" />
                  </div>
                )}
                {'forward' === actionHistories[0].action && (
                  <div className="text-white">
                    <FaForward className="size-24" />
                  </div>
                )}
                {'backward' === actionHistories[0].action && (
                  <div className="text-white">
                    <FaBackward className="size-24" />
                  </div>
                )}
              </div>
            </div>
          )}

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
                style={{ width: `${(currentTime / (videoRef.current?.duration ?? 0)) * 100}%` }}
              />

              {/* current navigator */}
              <div
                className={cx(
                  'absolute top-auto size-5 rounded-full transition-opacity duration-150',
                  isDragging && 'bg-red-300/75',
                )}
                style={{ left: `${(currentTime / (videoRef.current?.duration ?? 0)) * 100 - 0.7}%` }}
              >
                <div className="relative">
                  <div className={cx('absolute top-[2px] left-[2px] size-4 rounded-full bg-red-600')} />
                </div>
              </div>
            </div>

            {/* control */}
            <div className="my-2 flex w-full flex-row items-center gap-3">
              {/* play */}
              {currentTime >= (videoRef.current?.duration ?? 0) ? (
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
                  <span>{new TimeCode(videoRef.current?.duration ?? 0).toString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
