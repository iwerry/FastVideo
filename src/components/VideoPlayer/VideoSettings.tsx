import React from 'react';
import { X } from 'lucide-react';

interface VideoSettingsProps {
  onClose: () => void;
  playbackRate: number;
  onPlaybackRateChange: (rate: number) => void;
}

export const VideoSettings: React.FC<VideoSettingsProps> = ({
  onClose,
  playbackRate,
  onPlaybackRateChange,
}) => {
  const playbackRates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  return (
    <div className="absolute right-4 bottom-20 bg-gray-900 rounded-lg shadow-lg p-4 w-64">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Settings</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-gray-400 text-sm block mb-2">
            Playback Speed
          </label>
          <div className="grid grid-cols-4 gap-2">
            {playbackRates.map((rate) => (
              <button
                key={rate}
                onClick={() => onPlaybackRateChange(rate)}
                className={`px-2 py-1 rounded text-sm ${
                  rate === playbackRate
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};