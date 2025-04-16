import { useState, useEffect, useRef } from "react";
import { Clock, Play, Square } from "lucide-react";

export default function Stopwatch({ onTimeUpdate, targetTime, onStopwatch }) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [targetReached, setTargetReached] = useState(false);
  const stopwatchRef = useRef(null);

  // Load saved time on component mount
  useEffect(() => {
    const savedTime = localStorage.getItem("stopwatchTime");
    const savedIsRunning = localStorage.getItem("stopwatchRunning") === "true";
    const savedTargetReached = localStorage.getItem("targetReached") === "true";

    if (savedTime) {
      const time = parseInt(savedTime, 10);
      setElapsedTime(time);

      // Check if target is already reached
      if (time >= targetTime && !savedTargetReached) {
        setTargetReached(true);
        localStorage.setItem("targetReached", "true");
      }
    }

    if (savedIsRunning) {
      setIsRunning(true);
    }

    if (savedTargetReached) {
      setTargetReached(true);
    }
  }, [targetTime]);

  // Handle stopwatch running state
  useEffect(() => {
    if (isRunning) {
      stopwatchRef.current = setInterval(() => {
        setElapsedTime((prevTime) => {
          const newTime = prevTime + 1;
          // Save to localStorage
          localStorage.setItem("stopwatchTime", newTime.toString());

          // Check if target time is reached
          if (newTime >= targetTime && !targetReached) {
            setTargetReached(true);
            localStorage.setItem("targetReached", "true");
          }

          // Notify parent component about time update
          onTimeUpdate(newTime);
          return newTime;
        });
      }, 1000);
    } else if (stopwatchRef.current) {
      clearInterval(stopwatchRef.current);
    }

    // Save running state
    localStorage.setItem("stopwatchRunning", isRunning.toString());

    // Cleanup on unmount
    return () => {
      if (stopwatchRef.current) {
        clearInterval(stopwatchRef.current);
      }
    };
  }, [isRunning, onTimeUpdate, targetTime, targetReached]);

  const startStopwatch = () => {
    setIsRunning(true);
  };

  const stopStopwatch = () => {
    setIsRunning(false);
    // Notify parent about stopwatch being stopped with the final time
    onStopwatch(elapsedTime);
  };

  // Format time as HH:MM:SS
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return [hours, minutes, remainingSeconds]
      .map((unit) => unit.toString().padStart(2, "0"))
      .join(":");
  };

  return (
    <div className="flex items-center gap-2">
      {!isRunning && elapsedTime === 0 ? (
        <button
          onClick={startStopwatch}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors"
        >
          <Play size={18} />
          <span>Start</span>
        </button>
      ) : (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
            <Clock className="text-blue-500" size={20} />
            <span className="font-mono font-medium text-lg">
              {formatTime(elapsedTime)}
            </span>
            {!targetReached && (
              <span className="text-xs text-gray-500">
                ({formatTime(targetTime - elapsedTime)} remaining)
              </span>
            )}
          </div>

          {/* Show stop button when target time is reached */}
          {targetReached && isRunning && (
            <button
              onClick={stopStopwatch}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
            >
              <Square size={16} />
              <span>Stop</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
