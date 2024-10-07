import React, { useState, useEffect } from 'react';
import { Settings, RefreshCw } from 'lucide-react';
import Summary from './components/Summary';
import OptionsModal from './components/OptionsModal';

function App() {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [options, setOptions] = useState({
    maxLength: 200,
    style: 'concise'
  });

  useEffect(() => {
    chrome.storage.sync.get(['maxLength', 'style'], (result) => {
      setOptions({
        maxLength: result.maxLength || 200,
        style: result.style || 'concise'
      });
    });
  }, []);

  const generateSummary = async () => {
    setLoading(true);
    setError('');
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'getPageContent' });
      const apiKey = await chrome.storage.sync.get('apiKey');
      
      if (!apiKey.apiKey) {
        throw new Error('API key not set. Please set your Gemini API key in the options.');
      }

      const summaryResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.apiKey}`
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Summarize the following text in ${options.style} style with a maximum of ${options.maxLength} words:\n\n${response.content}`
            }]
          }]
        })
      });

      if (!summaryResponse.ok) {
        throw new Error('Failed to generate summary');
      }

      const summaryData = await summaryResponse.json();
      setSummary(summaryData.candidates[0].content.parts[0].text);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-96 p-4 bg-gray-100 min-h-[400px]">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gemini Web Summarizer</h1>
        <button onClick={() => setShowOptions(true)} className="p-2 rounded-full hover:bg-gray-200">
          <Settings size={20} />
        </button>
      </div>
      <button
        onClick={generateSummary}
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300 flex items-center justify-center"
      >
        {loading ? <RefreshCw className="animate-spin mr-2" size={20} /> : 'Generate Summary'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <Summary summary={summary} />
      {showOptions && (
        <OptionsModal
          options={options}
          setOptions={setOptions}
          onClose={() => setShowOptions(false)}
        />
      )}
    </div>
  );
}

export default App;