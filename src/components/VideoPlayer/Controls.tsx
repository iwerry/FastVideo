import React from 'react';
import { Play, Pause, Volume2, Volume1, VolumeX, SkipBack, SkipForward } from 'lucide-react';

interface ControlsProps {
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  playbackRate: number;
  onPlayPause: () => void;
  onVolumeChange: (volume: number) => void;
  onPlaybackRateChange: (rate: number) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  volume,
  currentTime,
  duration,
  playbackRate,
  onPlayPause,
  onVolumeChange,
  onPlaybackRateChange,
}) => {
  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={onPlayPause}
        className="p-2 rounded-full hover:bg-gray-700/50 transition-colors"
      >
        {isPlaying ? (
          <Pause className="w-6 h-6 text-white" />
        ) : (
          <Play className="w-6 h-6 text-white" />
        )}
      </button>
      
      <button
        onClick={() => onPlaybackRateChange(Math.max(playbackRate - 0.25, 0.25))}
        className="p-2 rounded-full hover:bg-gray-700/50 transition-colors"
      >
        <SkipBack className="w-5 h-5 text-white" />
      </button>
      
      <span className="text-white text-sm font-mono">
        {playbackRate}x
      </span>
      
      <button
        onClick={() => onPlaybackRateChange(Math.min(playbackRate + 0.25, 2))}
        className="p-2 rounded-full hover:bg-gray-700/50 transition-colors"
      >
        <SkipForward className="w-5 h-5 text-white" />
      </button>
      
      <div className="flex items-center space-x-2">
        <VolumeIcon className="w-5 h-5 text-white" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          className="w-20 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer"
        />
      </div>

      <span className="text-white font-mono">
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>
    </div>
  );
};