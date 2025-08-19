import React from 'react';

const MyModal = ({ isOpen, onClose, title, children, item = {} }) => {
  if (!isOpen) return null;
  console.log("editable item : ", item)
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header section (fixed) */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          {title && <h2 className="text-xl font-semibold">{title}</h2>}
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Scrollable content area */}
        <div className="overflow-y-auto p-4 flex-1">
          {children}
        </div>

        {/* Optional footer (fixed) */}
        <div className="p-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyModal;