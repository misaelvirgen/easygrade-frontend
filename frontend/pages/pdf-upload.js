import React from 'react';
import { uploadPdf } from '../services/apiService';

export default function PdfUpload() {
  async function pickFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    const res = await uploadPdf(file);
    alert('Text length: ' + res.text.length);
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>PDF Upload</h1>
      <input type="file" accept=".pdf" onChange={pickFile} />
    </div>
  );
}
