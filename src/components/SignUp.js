import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
//   const [profileImage, setProfileImage] = useState(null); // Image File
//   const [contentType, setContentType] = useState(''); // File Type
  const [file, setFile] = useState(null);
  const navigate = useNavigate(); // Use the hook to navigate

  const handleImageChange = (event) => {
    // const file = event.target.files[0];
    // setProfileImage(file);
    // setContentType(file.type);
    setFile(event.target.files[0]);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!email || !password || !name || !file) {
      alert('Please fill in all fields and upload a profile image.');
      return;
    }

    try {
        const filename = encodeURIComponent(file.name);
        const contentType = file.type;
        // Step 1: Send user data to the backend to create the account and get the presigned URL
      const response = await axios.post('https://77u93zbgqi.execute-api.us-east-1.amazonaws.com/signup', {
        email,
        password,
        name,
        filename,
        contentType,
      });

      const { uploadURL } = response.data;

      // 2. Upload the image to the presigned URL
      await axios.put(uploadURL, file, {
        headers: {
          'Content-Type': file.type,
        },
    
      });
        // Step 3: After successful sign-up and image upload, navigate to the login page
      alert('User signed up successfully!');
      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error('Error during sign-up:', error);
      alert('Sign-up failed. Please try again.');
    }
  };

  return (
    <div className="container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      <a className='center' onClick={() => navigate('/login')}><u>Login</u></a>
      {/* <div className='center'>
            <a href="/login">Login</a>
        </div> */}
    </div>
  );
};

export default SignUp;
