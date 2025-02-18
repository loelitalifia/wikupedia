import { useState } from "react";

export default function Popup({ type, message, onConfirm, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const getStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-500 text-white";
      case "error":
        return "bg-red-500 text-white";
      case "confirm":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`p-6 rounded-lg shadow-lg ${getStyles()} w-80 text-center`}>
        <p className="text-lg">{message}</p>
        <div className="mt-4 flex justify-center gap-4">
          {type === "confirm" && (
            <button
              onClick={() => {
                setIsVisible(false);
                onConfirm && onConfirm();
              }}
              className="px-4 py-2 bg-white text-black rounded-md"
            >
              Yes
            </button>
          )}
          <button
            onClick={() => {
              setIsVisible(false);
              onClose && onClose();
            }}
            className="px-4 py-2 bg-gray-700 text-white rounded-md"
          >
            {type === "confirm" ? "No" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
