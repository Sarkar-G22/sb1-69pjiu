import React from 'react';

interface SummaryProps {
  summary: string;
}

const Summary: React.FC<SummaryProps> = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-2">Summary</h2>
      <p className="text-gray-700">{summary}</p>
    </div>
  );
};

export default Summary;