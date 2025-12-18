import axios from "axios";
import { supabase } from "@/lib/supabase";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export const gradeAssignment = async (prompt, text, rubric) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const res = await axios.post(
    `${API_URL}/api/grade`,
    {
      student_name: "Demo",
      assignment_prompt: prompt,
      assignment_text: text,
      rubric_json: rubric || "{}",
    },
    {
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    }
  );

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

export const generateRubric = async (payload) => {
  const res = await axios.post(`${API_URL}/api/rubric/generate`, {
    title: payload.title,
    grade_level: payload.gradeLevel,
    subject: payload.subject,
    task_type: payload.taskType,
    criteria: payload.criteria,
    rating_scale: payload.scale,
  });

  return res.data;
};