import axios from 'axios';
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const fetchGoogleAssignments = async (token, courseId) => {
  const res = await axios.get(`${API_URL}/google/assignments`, { params:{ token, course_id:courseId }});
  return res.data;
};

export const fetchCanvasAssignments = async (token, courseId) => {
  const res = await axios.get(`${API_URL}/canvas/assignments`, { params:{ api_token:token, course_id:courseId }});
  return res.data;
};