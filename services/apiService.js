import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

export const gradeAssignment = async (prompt, text, rubric) => {
  const res = await axios.post(`${API_URL}/api/grade`, {
    student_name: "Demo",
    assignment_prompt: prompt,
    assignment_text: text,
    rubric_json: rubric || "{}",
  });
  return res.data;
};

export const uploadPdf = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await axios.post(`${API_URL}/api/upload/pdf`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const uploadRubric = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(`${API_URL}/api/upload/rubric`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

export const generateRubric = async (prompt, gradeLevel) => {
  const res = await axios.post(`${API_URL}/api/rubric/generate`, {
    assignment_prompt: prompt,
    grade_level: gradeLevel
  });
  return res.data;
};
