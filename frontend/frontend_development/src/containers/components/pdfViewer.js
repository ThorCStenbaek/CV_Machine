import React from 'react';

const PdfViewer = ({ file }) => {
    console.log("pdf file", file)
    return (
        <div style={{ width: '100%', height: '100vh' }}>
            <iframe
                src={file}
                type="application/pdf"
                width="100%"
                height="100%"
                title="PDF Viewer"
                frameBorder="0"
            ></iframe>
        </div>
    );
};

export default PdfViewer;
