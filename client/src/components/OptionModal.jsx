import React from "react";

const OptionModal = ({ 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  isOpen 
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onCancel} // close when clicking backdrop
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 mx-2"
        onClick={(e) => e.stopPropagation()} // ⛔ prevent click-through
      >
        <h2 className="text-lg font-semibold mb-3">{title}</h2>

        <p className="text-gray-500 mb-5">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
          >
            No
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-primary text-white hover:bg-primary/90"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default OptionModal;
