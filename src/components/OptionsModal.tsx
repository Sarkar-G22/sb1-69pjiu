import React, { useState } from 'react';

interface OptionsModalProps {
  options: {
    maxLength: number;
    style: string;
  };
  setOptions: React.Dispatch<React.SetStateAction<{
    maxLength: number;
    style: string;
  }>>;
  onClose: () => void;
}

const OptionsModal: React.FC<OptionsModalProps> = ({ options, setOptions, onClose }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSave = () => {
    chrome.storage.sync.set({
      maxLength: options.maxLength,
      style: options.style,
      apiKey: apiKey
    }, () => {
      onClose();
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-80">
        <h2 className="text-xl font-bold mb-4">Options</h2>
        <div className="mb-4">
          <label className="block mb-2">Max Length (words)</label>
          <input
            type="number"
            value={options.maxLength}
            onChange={(e) => setOptions({ ...options, maxLength: parseInt(e.target.value) })}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Summary Style</label>
          <select
            value={options.style}
            onChange={(e) => setOptions({ ...options, style: e.target.value })}
            className="w-full border rounded px-2 py-1"
          >
            <option value="concise">Concise</option>
            <option value="detailed">Detailed</option>
            <option value="bullet-points">Bullet Points</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Gemini API Key</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full border rounded px-2 py-1"
            placeholder="Enter your Gemini API key"
          />
        </div>
        <div className="flex justify-end">
          <button onClick={onClose} className="mr-2 px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
        </div>
      </div>
    </div>
  );
};

export default OptionsModal;