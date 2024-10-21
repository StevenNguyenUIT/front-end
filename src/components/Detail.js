import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../api';



function Details() {
  const [user, setUser] = useState({
    email: '',
    password: '',
    name: '',
    profileImage: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadURL, setUploadURL] = useState('');
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  // Fetch user details using GET method with email as query param
  const fetchUserDetails = async () => {
    const email = localStorage.getItem('email'); // Assuming email is stored in localStorage after login
    // if (!email) {
    //   navigate('/login'); // Redirect to login if no email is stored
    //   return;
    // }

    try {
      // const response = await fetch(`https://77u93zbgqi.execute-api.us-east-1.amazonaws.com/getUser?email=${email}`, {
      const response = await fetch(`${API_BASE_URL}/getuser?email=${email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
      } else {
        console.error(data.error);
        // Handle the error, e.g., by redirecting to login
        navigate('/login');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      navigate('/login');
    } finally {
      setLoading(false); // Set loading to false once data is fetched
      selectedFile && setSelectedFile(null); // Reset selectedFile state
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Handle file upload and profile update
  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    try {
      // Get pre-signed URL from backend for the upload
      // const response = await fetch('https://u2zyfyte3c.execute-api.us-east-1.amazonaws.com/upload', {
      const response = await fetch(`${API_BASE_URL}/uploadimage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: selectedFile.name,
          contentType: selectedFile.type,
          email: user.email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setUploadURL(data.uploadURL);

        // Upload file to S3 using the pre-signed URL
        const uploadResponse = await fetch(data.uploadURL, {
          method: 'PUT',
          headers: {
            'Content-Type': selectedFile.type,
          },
          body: selectedFile,
        });

        if (uploadResponse.ok) {
            alert('Profile image uploaded successfully!');
            setLoading(true); // Set loading to true to show loading state
            fetchUserDetails(); // Fetch user details again to update profileImage
        } else {
          alert('Failed to upload image.');
        }
      } else {
        alert('Failed to get upload URL.');
      }
    } catch (error) {
      console.error('Error during upload:', error);
      alert('Error during upload. Please try again.');
    }
  };

  if (loading) {
    return <div className='center'>Loading user details...</div>; // Show loading state
  }

  return (
    <div className="container">
      <h2>User Details</h2>
      <div className="profile-container">
        <img
          className="profile-image"
          src={user.profileImage || 'https://via.placeholder.com/150'}
          alt="Profile"
        />
        <h3>Name: {user.name}</h3>
        <p>Email: {user.email}</p>
        <p>Password: {user.password}</p>
      </div>

      <div className="upload-container">
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload New Profile Image</button>
      </div>

      <button className="logout-button" onClick={() => navigate('/login')}>
        Logout
      </button>
    </div>
  );
}

export default Details;
