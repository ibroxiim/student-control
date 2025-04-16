import { Check, AlertTriangle, Clock } from "lucide-react";
import { useState, useEffect } from "react";

export default function Notification({ notification }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (notification.show) {
      setVisible(true);
    } else {
      // Add a small delay before hiding to allow for animation
      const timeout = setTimeout(() => {
        setVisible(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [notification.show]);

  if (!visible) return null;

  return (
    <div
      className={`fixed top-6 right-6 p-4 rounded-lg shadow-lg max-w-md
      transition-opacity duration-300 ${
        notification.show ? "opacity-100" : "opacity-0"
      }
      ${
        notification.type === "success"
          ? "bg-green-50 border-l-4 border-green-500"
          : notification.type === "error"
          ? "bg-red-50 border-l-4 border-red-500"
          : "bg-blue-50 border-l-4 border-blue-500"
      }`}
    >
      <div className="flex items-start">
        {notification.type === "success" ? (
          <Check className="mt-0.5 text-green-500" size={18} />
        ) : notification.type === "error" ? (
          <AlertTriangle className="mt-0.5 text-red-500" size={18} />
        ) : (
          <Clock className="mt-0.5 text-blue-500" size={18} />
        )}
        <p className="ml-3 text-sm text-gray-800">{notification.message}</p>
      </div>
    </div>
  );
}
