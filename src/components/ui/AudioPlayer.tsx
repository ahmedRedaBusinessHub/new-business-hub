'use client';

import React, { useRef, useState } from 'react';

interface AudioPlayerProps {
  src: string;
  title?: string;
  artist?: string;
  className?: string;
  controls?: boolean;
  autoplay?: boolean;
  loop?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  src,
  title = 'Audio',
  artist = 'Unknown',
  className = '',
  controls = true,
  autoplay = false,
  loop = false,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg overflow-hidden ${className}`}
    >
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        loop={loop}
        autoPlay={autoplay}
      />

      <div className="p-6 text-white">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-sm text-white/80">{artist}</p>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleProgressChange}
            className="w-full h-1 bg-white/30 rounded-lg cursor-pointer appearance-none mb-2"
          />
          <div className="flex justify-between text-xs">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        {controls && (
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={handlePlayPause}
              className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-xl transition-colors"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>

            <div className="flex items-center gap-3">
              <span className="text-lg">🔊</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24 h-1 bg-white/30 rounded-lg cursor-pointer appearance-none"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
