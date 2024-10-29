import React, { useRef, useState, useEffect } from 'react';
import { Upload, Settings } from 'lucide-react';
import { Timeline } from './Timeline';
import { Controls } from './Controls';
import { VideoInfo } from './VideoInfo';
import { VideoSettings } from './VideoSettings';

interface VideoContainerProps {
  onTimeUpdate: (time: number) => void;
  currentTime: number;
  startMarker: number | null;
  endMarker: number | null;
}

export const VideoContainer: React.FC<VideoContainerProps> = ({
  onTimeUpdate,
  currentTime,
  startMarker,
  endMarker,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [videoInfo, setVideoInfo] = useState({
    resolution: '',
    codec: '',
    frameRate: 0,
  });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      
      // Simulate codec detection (in a real app, this would use native APIs)
      setVideoInfo({
        resolution: '1920x1080',
        codec: 'H.264',
        frameRate: 60,
      });
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

  const handlePlaybackRateChange = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (containerRef.current) {
      containerRef.current.style.cursor = 'default';
    }
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (isPlaying) {
      timeout = setTimeout(() => {
        setShowControls(false);
        if (containerRef.current) {
          containerRef.current.style.cursor = 'none';
        }
      }, 2000);
    }

    return () => clearTimeout(timeout);
  }, [isPlaying, showControls]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') togglePlayPause();
      if (e.key === 'ArrowLeft') handleSeek(currentTime - 5);
      if (e.key === 'ArrowRight') handleSeek(currentTime + 5);
      if (e.key === 'ArrowUp') handleVolumeChange(Math.min(volume + 0.1, 1));
      if (e.key === 'ArrowDown') handleVolumeChange(Math.max(volume - 0.1, 0));
      if (e.key === '[') handlePlaybackRateChange(Math.max(playbackRate - 0.25, 0.25));
      if (e.key === ']') handlePlaybackRateChange(Math.min(playbackRate + 0.25, 2));
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTime, volume, playbackRate]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-4xl mx-auto bg-gray-900 rounded-lg overflow-hidden shadow-xl"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      <div className="relative aspect-video bg-black">
        {!videoUrl ? (
          <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-800/50 transition-colors">
            <Upload className="w-12 h-12 text-gray-400 mb-2" />
            <span className="text-gray-400">Drop video here or click to upload</span>
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        ) : (
          <>
            <video
              ref={videoRef}
              className="w-full h-full"
              src={videoUrl}
              onClick={togglePlayPause}
              onDoubleClick={() => videoRef.current?.requestFullscreen()}
              onTimeUpdate={() => onTimeUpdate(videoRef.current?.currentTime || 0)}
              onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
            />
            <VideoInfo
              show={showControls}
              info={videoInfo}
              playbackRate={playbackRate}
            />
          </>
        )}
      </div>

      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <Timeline
          currentTime={currentTime}
          duration={duration}
          startMarker={startMarker}
          endMarker={endMarker}
          onSeek={handleSeek}
        />

        <div className="flex items-center justify-between">
          <Controls
            isPlaying={isPlaying}
            volume={volume}
            currentTime={currentTime}
            duration={duration}
            playbackRate={playbackRate}
            onPlayPause={togglePlayPause}
            onVolumeChange={handleVolumeChange}
            onPlaybackRateChange={handlePlaybackRateChange}
          />
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-full hover:bg-gray-700/50 transition-colors"
          >
            <Settings className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {showSettings && (
        <VideoSettings
          onClose={() => setShowSettings(false)}
          playbackRate={playbackRate}
          onPlaybackRateChange={handlePlaybackRateChange}
        />
      )}
    </div>
  );
};