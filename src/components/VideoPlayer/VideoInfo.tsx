import React from 'react';

interface VideoInfoProps {
  show: boolean;
  info: {
    resolution: string;
    codec: string;
    frameRate: number;
  };
  playbackRate: number;
}

export const VideoInfo: React.FC<VideoInfoProps> = ({ show, info, playbackRate }) => {
  if (!show) return null;

  return (
    <div className="absolute top-4 right-4 bg-black/80 text-white text-xs rounded px-2 py-1 space-y-1">
      <div>{info.resolution}</div>
      <div>{info.codec}</div>
      <div>{info.frameRate}fps</div>
      <div>{playbackRate}x</div>
    </div>
  );
};