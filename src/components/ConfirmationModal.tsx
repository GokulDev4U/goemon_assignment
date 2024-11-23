import React from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionDetails: Record<string, string>;
  onSubmit: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  transactionDetails,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-md max-w-sm w-full">
        <h2 className="text-lg font-bold mb-4">Confirm Transaction</h2>
        <div className="space-y-2">
          {Object.entries(transactionDetails).map(([key, value]) => (
            <div key={key} className="flex justify-between text-sm">
              <span className="font-medium">{key}:</span>
              <span>{value}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSubmit();
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
