// src/api.js
import axios from 'axios';

// Set the base URL for the API Gateway endpoint
export const API_BASE_URL = 'https://ddw3ej9lh8.execute-api.us-east-1.amazonaws.com/prod';

export const signUp = async (email, password, name, profileImage) => {
  const response = await axios.post(`${API_BASE_URL}/signup`, {
    email, password, name, profileImage,
  });
  return response.data;
};

export const login = async (email, password) => {
  const response = await axios.post(`${API_BASE_URL}/login`, {
    email, password,
  });
  return response.data;
};

export const getPresignedUrl = async (email, imageFileName) => {
  const response = await axios.post(`${API_BASE_URL}/uploadImage`, {
    email, imageFileName,
  });
  return response.data.signedUrl;
};

export const uploadImage = async (signedUrl, imageFile) => {
  await axios.put(signedUrl, imageFile, {
    headers: {
      'Content-Type': imageFile.type,
    },
  });
};
