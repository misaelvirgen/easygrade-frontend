import React from 'react';
import { uploadPdf } from '../services/apiService';

export default function AssignmentUpload() {
  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    const res = await uploadPdf(file);
    alert('Extracted text length: ' + res.text.length);
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>Upload Assignment (PDF)</h1>
      <input type="file" accept=".pdf" onChange={handleFile} />
    </div>
  );
}
