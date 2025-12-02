import React, { useState } from 'react';

export default function RubricEditor() {
  const [rubric, setRubric] = useState('');

  return (
    <div style={{ padding: 30, maxWidth: 800, margin: '0 auto' }}>
      <h1>Rubric Editor</h1>
      <textarea
        rows={10}
        style={{ width: '100%', marginTop: 10 }}
        value={rubric}
        onChange={(e) => setRubric(e.target.value)}
        placeholder="Define your rubric here..."
      />
    </div>
  );
}
