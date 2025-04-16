import { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import Stopwatch from "../components/Stopwatch";
import Notification from "../components/Notification";
import WorkForm from "../components/WorkForm";

export default function UserPage() {
  const [currentTime, setCurrentTime] = useState(0);
  const [isFormActive, setIsFormActive] = useState(false);
  const [recordedTime, setRecordedTime] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const userFullName = "Abdulaziz Karimov"; // Replace with actual user name
  const targetTime = 90 * 60; // 1.5 hours in seconds

  // Check if form should be active based on saved time
  useEffect(() => {
    const savedTime = localStorage.getItem("stopwatchTime");
    const isStopped = localStorage.getItem("stopwatchStopped") === "true";

    if (savedTime && parseInt(savedTime, 10) >= targetTime) {
      setIsFormActive(true);
    }

    if (isStopped && savedTime) {
      setRecordedTime(parseInt(savedTime, 10));
    }
  }, [targetTime]);

  // Handle time updates from stopwatch
  const handleTimeUpdate = (time) => {
    setCurrentTime(time);

    // Activate form when target time is reached
    if (time >= targetTime && !isFormActive) {
      setIsFormActive(true);
      showNotification(
        "Form is now active! You can stop the stopwatch and submit your work.",
        "success"
      );
    }
  };

  // Handle stopwatch being stopped
  const handleStopwatch = (finalTime) => {
    setRecordedTime(finalTime);
    localStorage.setItem("stopwatchStopped", "true");
    showNotification(
      `Stopwatch stopped at ${formatTime(
        finalTime
      )}. Your time has been recorded.`,
      "info"
    );
  };

  // Format time as HH:MM:SS for display
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return [hours, minutes, remainingSeconds]
      .map((unit) => unit.toString().padStart(2, "0"))
      .join(":");
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 5000);
  };

  const handleFormSubmitSuccess = () => {
    showNotification("Your work has been submitted successfully!", "success");
  };

  const handleFormError = (message) => {
    showNotification(message, "error");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with name and stopwatch */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">{userFullName}</h1>
          <Stopwatch
            onTimeUpdate={handleTimeUpdate}
            targetTime={targetTime}
            onStopwatch={handleStopwatch}
          />
        </div>
      </header>

      {/* Notification component */}
      <Notification notification={notification} />

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <WorkForm
          isActive={isFormActive}
          recordedTime={recordedTime}
          onSubmitSuccess={handleFormSubmitSuccess}
          onError={handleFormError}
        />

        {!isFormActive && (
          <div className="max-w-3xl mx-auto mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="text-yellow-400" size={24} />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  The form will become active after 1.5 hours (
                  {formatTime(targetTime)}). Current time:{" "}
                  {formatTime(currentTime)}
                </p>
              </div>
            </div>
          </div>
        )}

        {isFormActive && currentTime >= targetTime && recordedTime === 0 && (
          <div className="max-w-3xl mx-auto mt-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="text-blue-400" size={24} />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  You can now stop the stopwatch and submit your work. The
                  recorded time will be included with your submission.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
