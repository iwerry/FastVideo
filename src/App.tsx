import React, { useState } from 'react';
import { VideoContainer } from './components/VideoPlayer/VideoContainer';
import { Scissors } from 'lucide-react';

function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const [startMarker, setStartMarker] = useState<number | null>(null);
  const [endMarker, setEndMarker] = useState<number | null>(null);

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'i') setStartMarker(currentTime);
    if (e.key === 'o') setEndMarker(currentTime);
  };

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentTime]);

  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Scissors className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-white">FastVideo</h1>
          </div>
          <div className="text-gray-400 text-sm space-y-1">
            <div>Press 'i' to set start, 'o' to set end</div>
            <div>Space/Enter to play/pause, ←/→ to seek</div>
            <div>[/] to change speed, ↑/↓ for volume</div>
          </div>
        </div>

        <VideoContainer
          onTimeUpdate={setCurrentTime}
          currentTime={currentTime}
          startMarker={startMarker}
          endMarker={endMarker}
        />

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-gray-900/50 backdrop-blur">
            <h2 className="text-lg font-semibold text-white mb-4">Keyboard Controls</h2>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
              <div>
                <p className="font-medium text-gray-300 mb-2">Playback</p>
                <ul className="space-y-1">
                  <li>Space/Enter - Play/Pause</li>
                  <li>←/→ - Seek 5s</li>
                  <li>[/] - Speed control</li>
                  <li>↑/↓ - Volume</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-gray-300 mb-2">Editing</p>
                <ul className="space-y-1">
                  <li>'i' - Set cut start</li>
                  <li>'o' - Set cut end</li>
                  <li>'s' - Save clip</li>
                  <li>'f' - Fullscreen</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-gray-900/50 backdrop-blur">
            <h2 className="text-lg font-semibold text-white mb-4">Features</h2>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
              <div>
                <p className="font-medium text-gray-300 mb-2">Playback</p>
                <ul className="space-y-1">
                  <li>Variable speed control</li>
                  <li>Frame-by-frame navigation</li>
                  <li>A/B loop points</li>
                  <li>Auto-hide controls</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-gray-300 mb-2">Export</p>
                <ul className="space-y-1">
                  <li>Lossless trimming</li>
                  <li>GIF export</li>
                  <li>Screenshot capture</li>
                  <li>Format conversion</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;