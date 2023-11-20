import React, { useState, useContext, useEffect } from 'react';
import './style.css';
import Register from './Register';
import Login from './Login';
import Share from './Share';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Grid, AppBar, Toolbar, IconButton } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import ReplyIcon from '@mui/icons-material/Reply';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import Cookies from 'js-cookie';
import axios from 'axios';

const userpic = require('./user_default.png').default;
import UserContext from "../UserContext";

const Mainpage = ({ currentPage, setCurrentPage }) => {
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  //const [currentPage, setCurrentPage] = useState('home');
  const { user, setUser, userid, setUserid, isAdmin, setIsAdmin} = useContext(UserContext);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('/users/me', { withCredentials: true });
        setUser(response.data.username);
        setUserid(response.data._id);
        setIsAdmin(response.data.isAdmin);
      } catch (error) {
        console.error('Error fetching user info:', error);
        Cookies.remove('token');
      }
    };
    checkLoginStatus();
  }, [setUser, setUserid, setIsAdmin]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };


  let navigate = useNavigate();

    const navigateToHome = () => {
      console.log("Navigating to home page");
      navigate('/products');
    };

    const navigateToAdmin = () => {
      console.log("Navigating to admin page");
      navigate('/admin');
    };

    const handleLogout = () => {
      axios.post('/users/logout')
        .then(response => {
          setUser('');
          setUserid('');
          setIsAdmin(false);
          navigate('/');
        })
        .catch(error => {
          console.error('Logout error:', error.response?.data || error.message);
        });
    };


  const styles = {
    position: 'relative',
    minHeight: '100vh',
  };

  return (
    <Box sx={styles}>
      <Box sx={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, zIndex: -1,
 }}>
</Box>
      <Box sx={{ bgcolor: 'transparent', py: 8, minHeight:'inherit' }}>
      {user && (
    <Box
      sx={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        display: 'flex',
        alignItems: 'center',
        bgcolor: 'rgba(0, 0, 0, 0.04)',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
        borderRadius: '10px',
        padding: '10px',
        zIndex: 1000,
      }}
    >
      <Box sx={{ marginRight: '10px' }}>
        <img src={userpic} alt={user} height="40" width="50" />
      </Box>
      <Typography variant="body1" style={{ fontWeight: 'bold', background: 'linear-gradient(45deg, #b3d9ff 30%, #e8d2ff 60%, #b2c7ff 90%)',  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent', fontFamily: 'Helvetica'  }}>
        {user}, welcome!
      </Typography>
    </Box>
  )}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        </Box>
        <Typography variant="h2" align="center" style={{ background: 'linear-gradient(45deg, #b3d9ff 30%, #e8d2ff 60%, #b2c7ff 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontFamily: 'Futura' }}>
          Ecommerce Website
        </Typography>
      </Box>
      <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, bgcolor: '#2b86c5', py: 4}}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4, marginBottom: '3%' }}>

        {!user ? (<>  <Button
    variant="contained"
    startIcon={<PersonIcon />}
    onClick={() => setShowLogin(true)}
    className = 'button'
  >
    Login
  </Button>  <Box sx={{ mx: 2 }} />
  <Button
    variant="contained"
    startIcon={<LockIcon />}
    onClick={() => setShowRegister(true)}
    className = 'button'
  >
    Register
  </Button></>): (
            <Button variant="contained" startIcon={<LogoutIcon />} onClick={handleLogout} className='button'>Logout</Button>
          )}


  <Box sx={{ mx: 2 }} />
  <Button
  variant="contained"
  endIcon={<ReplyIcon />}
  onClick={() => setShowShare(true)}
  className = 'button'
>
  Share
</Button>

<Box sx={{ mx: 2 }} />
<Button variant="contained"
endIcon={<HomeIcon />}
onClick={navigateToHome}
    className = 'button'>
      Home
              </Button>

              <Box sx={{ mx: 2 }} />

              {user && isAdmin && (

            <Button
              variant="contained"
              endIcon={<SettingsIcon />}
              onClick={navigateToAdmin}
              className='button'>
              Admin
            </Button>
          )}

</Box>
      </Box>
      {showLogin && <Login onClose={() => setShowLogin(false)}/>}
      {showRegister && <Register onClose={() => setShowRegister(false)} setShowLogin={setShowLogin}/>}
      {showShare && <Share onClose={() => setShowShare(false)} />}
    </Box>
  );
};

export default Mainpage;
