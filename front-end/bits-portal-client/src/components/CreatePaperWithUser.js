import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { usePaper } from '../context/PaperContext';


const CreatePaperWithUser = () => {
  const navigator = useNavigate();
  const {pid} = usePaper();
  const [paperDetails, setPaperDetails] = useState({
    title: '',
    author: '',
    DOI: '',
    publisher: '',
    year: '',
    journal: ''
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const id = localStorage.getItem('id');
  const goback = () => {
    navigator('/');
  } 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaperDetails({
      ...paperDetails,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const tagUsers = (id) => {
    pid(id);
    navigator('/tag/users');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:3000/${id}/paper`, paperDetails);
      setMessage('Paper created successfully!');
      setPaperDetails({
        title: '',
        author: '',
        DOI: '',
        publisher: '',
        year: '',
        journal: ''
      });
      tagUsers(response.data._id);
    } catch (error) {
      setMessage('Error creating paper: ' + error.response?.data?.message);
    }
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState([]);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navPapers = () => {
    console.log("papers")
    navigate('/user/papers');
  };

  const navProfile = () => {
    console.log("Create")
    navigate('/');
  };

  const navTags = () => {
    console.log("tags")
    navigate('/user/taggedpapers');
  };
  
  const handlelogout = () => {
    logout();
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  const handleFileSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    console.log(file)
    try {
      const response = await axios.post('http://localhost:3000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log(response)
      const uploadedPaper = response.data;

      setPaperDetails({
        title: uploadedPaper.title || '',
        author: uploadedPaper.author || '',
        DOI: uploadedPaper.DOI || '',
        publisher: uploadedPaper.publisher || '',
        year: uploadedPaper.year || '',
        journal: uploadedPaper.journal || ''
      });
      setMessage('File processed successfully! Review and submit paper.');

    } catch (error) {
      setMessage('Error processing file: ' + error.message);
    }
  };

  return (
    
    <div className="flex flex-col items-center p-8 bg-gray-100 min-h-screen">
      <div
      style={{
        position: 'fixed',
        top: 0,
        left: isSidebarOpen ? 0 : '-16rem', // Adjust width accordingly
        height: '100%',
        width: '16rem',
        backgroundColor: '#2d3748', // Tailwind's gray-800
        color: 'white',
        transition: 'left 0.3s ease',
        zIndex: 1000,
      }}
      >
        <button
          className="text-2xl absolute top-4 left-4 text-gray-700 hover:text-gray-900 focus:outline-none"
          onClick={toggleSidebar}
        >
          <FaBars />
        </button>
        <br></br>
      <h2 className="text-xl font-bold p-4">Menu</h2>
      <ul>
      <li
          className="p-4 hover:bg-gray-700 cursor-pointer"
          onClick={() => navProfile()}
        >
          Profile
      </li>
      <li
          className="p-4 hover:bg-gray-700 cursor-pointer"
          onClick={() => navPapers()}
        >
          Journal Publications
        </li>
        <li
          className="p-4 hover:bg-gray-700 cursor-pointer"
          onClick={() => navTags()}
        >
          Tagged Journal Publications
        </li>
        <li
          className="p-4 hover:bg-gray-700 cursor-pointer"
          onClick={() => handlelogout()}
        >
          Logout
        </li>
      </ul>
      </div>

      <button
          className="text-2xl absolute top-4 left-4 text-gray-700 hover:text-gray-900 focus:outline-none"
          onClick={toggleSidebar}
        >
          <FaBars />
      </button>
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <br></br>
        <br></br>
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">Create Journal Publications</h2>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4 mt-4">
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={paperDetails.title}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="author"
                placeholder="Author"
                value={paperDetails.author}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="DOI"
                placeholder="DOI"
                value={paperDetails.DOI}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="publisher"
                placeholder="Publisher"
                value={paperDetails.publisher}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                name="year"
                placeholder="Year"
                value={paperDetails.year}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="journal"
                placeholder="Journal"
                value={paperDetails.journal}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
                Create Journal Publications
              </button>
            </form>

            <hr className="my-6" />

            <h3 className="text-lg font-semibold text-gray-700">Or Upload a File to Create Journal Publications</h3>
            <form onSubmit={handleFileSubmit} className="flex flex-col items-center mt-4">
              <input
                type="file"
                onChange={handleFileChange}
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              />
              <button type="submit" className="w-full bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600">
                Upload File
              </button>
            </form>

        {message && <p className="text-center mt-4 text-red-600">{message}</p>}
      </div>
    </div>
  );
};

export default CreatePaperWithUser;
