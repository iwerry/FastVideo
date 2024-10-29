import React, { useRef } from 'react';

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

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const position = (e.clientX - rect.left) / rect.width;
    onSeek(position * duration);
  };

  const handleTimelineDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.buttons !== 1) return; // Left click only
    handleTimelineClick(e);
  };

  return (
    <div
      ref={timelineRef}
      className="relative h-2 bg-gray-700 rounded-full mb-4 cursor-pointer"
      onClick={handleTimelineClick}
      onMouseMove={handleTimelineDrag}
    >
      {/* Playback progress */}
      <div
        className="absolute h-full bg-gray-600 rounded-full"
        style={{ width: `${(currentTime / duration) * 100}%` }}
      />
      
      {/* Current position marker */}
      <div
        className="absolute h-full bg-blue-500 rounded-full"
        style={{
          left: `${(currentTime / duration) * 100}%`,
          width: '2px',
          transform: 'translateX(-50%)',
        }}
      />

      {/* Cut markers */}
      {startMarker !== null && (
        <div
          className="absolute h-full w-2 bg-green-500 cursor-col-resize"
          style={{ left: `${(startMarker / duration) * 100}%` }}
        />
      )}
      {endMarker !== null && (
        <div
          className="absolute h-full w-2 bg-red-500 cursor-col-resize"
          style={{ left: `${(endMarker / duration) * 100}%` }}
        />
      )}
    </div>
  );
};