import React from 'react';
import { Play, Pause, Volume2, Volume1, VolumeX } from 'lucide-react';

interface ControlsProps {
  isPlaying: boolean;
  volume: number;
  currentTime: string;
  duration: string;
  onPlayPause: () => void;
  onVolumeChange: (volume: number) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  volume,
  currentTime,
  duration,
  onPlayPause,
  onVolumeChange,
}) => {
  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={onPlayPause}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 text-white" />
          ) : (
            <Play className="w-6 h-6 text-white" />
          )}
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
          {currentTime} / {duration}
        </span>
      </div>
    </div>
  );
};