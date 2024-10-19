// src/components/ImageUpload.js
import React, { useState } from 'react';
import { getPresignedUrl, uploadImage } from '../api';

function ImageUpload() {
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !email) return;

    try {
      const { signedUrl } = await getPresignedUrl(email, file.name);
      await uploadImage(signedUrl, file);
      console.log('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div>
      <h2>Upload Profile Image</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Select Image:</label>
          <input type="file" onChange={handleFileChange} accept="image/*" required />
        </div>
        <button type="submit">Upload Image</button>
      </form>
    </div>
  );
}

export default ImageUpload;
