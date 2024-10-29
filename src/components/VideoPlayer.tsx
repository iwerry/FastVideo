import React, { useRef, useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { Timeline } from './Timeline';
import { Controls } from './Controls';

interface VideoPlayerProps {
  onTimeUpdate: (time: number) => void;
  currentTime: number;
  startMarker: number | null;
  endMarker: number | null;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  onTimeUpdate,
  currentTime,
  startMarker,
  endMarker,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [videoUrl, setVideoUrl] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      onTimeUpdate(time);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') togglePlayPause();
      if (e.key === 'Backspace') video.pause();
      if (e.key === 'ArrowLeft') handleSeek(currentTime - 5);
      if (e.key === 'ArrowRight') handleSeek(currentTime + 5);
      if (e.key === 'ArrowUp') handleVolumeChange(Math.min(volume + 0.1, 1));
      if (e.key === 'ArrowDown') handleVolumeChange(Math.max(volume - 0.1, 0));
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY < 0) {
        handleVolumeChange(Math.min(volume + 0.1, 1));
      } else {
        handleVolumeChange(Math.max(volume - 0.1, 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    video.addEventListener('wheel', handleWheel);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      video.removeEventListener('wheel', handleWheel);
    };
  }, [currentTime, volume]);

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-900 rounded-lg overflow-hidden shadow-xl">
      <div className="relative aspect-video bg-black">
        {!videoUrl ? (
          <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-800/50 transition-colors">
            <Upload className="w-12 h-12 text-gray-400 mb-2" />
            <span className="text-gray-400">Click to upload video</span>
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        ) : (
          <video
            ref={videoRef}
            className="w-full h-full"
            src={videoUrl}
            onClick={togglePlayPause}
            onDoubleClick={() => videoRef.current?.requestFullscreen()}
            onTimeUpdate={() => onTimeUpdate(videoRef.current?.currentTime || 0)}
            onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
          />
        )}
      </div>

      <div className="p-4 bg-gray-900">
        <Timeline
          currentTime={currentTime}
          duration={duration}
          startMarker={startMarker}
          endMarker={endMarker}
          onSeek={handleSeek}
        />

        <Controls
          isPlaying={isPlaying}
          volume={volume}
          currentTime={formatTime(currentTime)}
          duration={formatTime(duration)}
          onPlayPause={togglePlayPause}
          onVolumeChange={handleVolumeChange}
        />
      </div>
    </div>
  );
};