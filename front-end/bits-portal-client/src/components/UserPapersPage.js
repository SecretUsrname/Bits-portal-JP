import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { usePaper } from '../context/PaperContext';
import { FaBars } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const UserPapersPage = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const default_val = localStorage.getItem('style');
  const [citationStyle] = useState(default_val); // Citation style state
  const userId = localStorage.getItem('id');
  const navigator = useNavigate();
  const { pid } = usePaper();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState([]);
  const dp = localStorage.getItem('DP');
  console.log(dp);

  const navProfile = () => {
    navigate('/');
  };

  const navCreatePaper = () => {
    console.log('Create');
    navigate('/create/paper');
  };

  const navTags = () => {
    console.log('tags');
    navigate('/user/taggedpapers');
  };

  const handleLogout = () => {
    logout();
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleDelete = (paperId) => {
    axios
      .delete(`http://localhost:3000/paper/${paperId}`)
      .then((response) => {
        console.log(response);
        alert(response.data.message); // Show success message
        setPapers(papers.filter((item) => item._id !== paperId));
      })
      .catch((error) => {
        alert('Error deleting paper');
        console.log('Error deleting Paper:', error);
      });
  };

  const goBack = () => {
    navigator('/');
  };

  const tagUsers = (id) => {
    pid(id);
    navigator('/tag/users');
  };

  const renderCitation = (paper) => {
    if (!paper) return null;

    switch (citationStyle) {
      case 'Harvard':
        return (
          <>
            {paper.author}, {paper.year}. {paper.title}. <em>{paper.journal}</em>, {paper.volume}, pp. {paper.pages}. DOI: {paper.DOI}.
          </>
        );
      case 'IEEE':
        return (
          <>
            {paper.author}, "{paper.title}," <em>{paper.journal}</em>, vol. {paper.volume}, no. {paper.issue}, pp. {paper.pages}, {paper.year}. DOI: {paper.DOI}.
          </>
        );
      default:
        return (
          <>
            {paper.author} ({paper.year}). {paper.title}. <em>{paper.journal}</em>, {paper.volume}, {paper.pages}. DOI: {paper.DOI}.
          </>
        );
    }
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3000/user/byid/${userId}`)
      .then((response) => {
        setUser(response.data); // Set the fetched users to state
      })
      .catch((error) => {
        console.error('Error fetching user:', error);
      });
  }, []);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/user/${userId}/papers`);
        setPapers(response.data);
      } catch (err) {
        setError('No papers');
      } finally {
        setLoading(false);
      }
    };
    fetchPapers();
  }, [userId]);

  if (loading) return <p>Loading Journal Publications...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6 bg-grey min-h-screen flex flex-col items-center text-gray-100">
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: isSidebarOpen ? 0 : '-16rem',
          height: '100%',
          width: '16rem',
          backgroundColor: '#2d3748',
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
        <br />
        <h2 className="text-xl font-bold p-4">Menu</h2>
        <ul>
          <li className="p-4 hover:bg-gray-700 cursor-pointer" onClick={() => navProfile()}>
            Profile
          </li>
          <li className="p-4 hover:bg-gray-700 cursor-pointer" onClick={() => navCreatePaper()}>
            Create Journal Publications
          </li>
          <li className="p-4 hover:bg-gray-700 cursor-pointer" onClick={() => navTags()}>
            Tagged Journal Publications
          </li>
          <li className="p-4 hover:bg-gray-700 cursor-pointer" onClick={() => handleLogout()}>
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
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center text-black">Your Journal Publications</h1>

        {papers.length > 0 ? (
          <div className="space-y-6">
            {papers.map((paper) => (
              <div key={paper._id} className="p-6 bg-white text-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                <p className="text-md mb-1 text-gray-700">{renderCitation(paper)}</p>
                <div className="mt-4 flex justify-end">
                  <button
                    className="py-2 px-5 bg-blue-600 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 transition duration-200"
                    type="button"
                    onClick={() => tagUsers(paper._id)}
                  >
                    Tag
                  </button>
                  <button
                    onClick={() => handleDelete(paper._id)}
                    className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300 ease-in-out"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-xl font-medium mt-8 text-black">No Journal Publications Yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserPapersPage;
