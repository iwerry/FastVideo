import React, { useRef, useState } from 'react';

interface TimelineProps {
  currentTime: number;
  duration: number;
  startMarker: number | null;
  endMarker: number | null;
  onSeek: (time: number) => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  currentTime,
  duration,
  startMarker,
  endMarker,
  onSeek,
}) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [previewTime, setPreviewTime] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const getTimeFromPosition = (clientX: number): number => {
    if (!timelineRef.current) return 0;
    const rect = timelineRef.current.getBoundingClientRect();
    const position = (clientX - rect.left) / rect.width;
    return Math.max(0, Math.min(position * duration, duration));
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const time = getTimeFromPosition(e.clientX);
    onSeek(time);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const time = getTimeFromPosition(e.clientX);
    setPreviewTime(time);
    
    if (isDragging) {
      onSeek(time);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative mb-4">
      <div
        ref={timelineRef}
        className="relative h-2 bg-gray-700/50 rounded-full cursor-pointer group"
        onClick={handleTimelineClick}
        onMouseMove={handleMouseMove}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => {
          setPreviewTime(null);
          setIsDragging(false);
        }}
      >
        {/* Playback progress */}
        <div
          className="absolute h-full bg-blue-500/50 rounded-full"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />
        
        {/* Preview time tooltip */}
        {previewTime !== null && (
          <div
            className="absolute bottom-full mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded transform -translate-x-1/2"
            style={{ left: `${(previewTime / duration) * 100}%` }}
          >
            {formatTime(previewTime)}
          </div>
        )}
        
        {/* Current position marker */}
        <div
          className="absolute h-full w-1 bg-blue-500 rounded-full transform -translate-x-1/2 group-hover:h-3 -top-0.5 transition-all"
          style={{ left: `${(currentTime / duration) * 100}%` }}
        />

        {/* Cut markers */}
        {startMarker !== null && (
          <div
            className="absolute h-4 w-1 bg-green-500 rounded-full -top-1 cursor-col-resize"
            style={{ left: `${(startMarker / duration) * 100}%` }}
          />
        )}
        {endMarker !== null && (
          <div
            className="absolute h-4 w-1 bg-red-500 rounded-full -top-1 cursor-col-resize"
            style={{ left: `${(endMarker / duration) * 100}%` }}
          />
        )}
      </div>
    </div>
  );
};