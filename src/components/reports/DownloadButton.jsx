import React from 'react';

const DownloadButton = ({ onDownload }) => (
    <button
        onClick={onDownload}
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
    >
        Download Report (PDF)
    </button>
);

export default DownloadButton;
