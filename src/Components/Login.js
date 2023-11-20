import React, { useState, useContext } from 'react';
import { Button, Dialog, DialogContent, DialogActions, TextField, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import UserContext from "../UserContext";
import './style.css';

const Login = ({ onClose }) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser, setUserid, setIsAdmin } = useContext(UserContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const auth = window.btoa(usernameOrEmail + ':' + password); // 对用户名和密码进行base64编码

    try {
      const response = await axios.get('/users/login', {
        headers: {
          'Authorization': `Basic ${auth}`
        }
      });
      setUser(response.data.username);
      setUserid(response.data._id);
      setIsAdmin(response.data.isAdmin)
      console.log('Successfully logged in');
      onClose();
    } catch (error) {
      setError('Username or password is incorrect');
      console.error('Login error:', error.response?.data || error.message);
    }
  };


  return (
    <Dialog open onClose={onClose} maxWidth="xs" style={{ height: 'auto', top: '-20vh' }}>
      <DialogContent>
        <Typography component="h5" style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton aria-label="close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
          Login
        </Typography>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Username or Email"
            value={usernameOrEmail}
            onChange={(event) => setUsernameOrEmail(event.target.value)}
            required
            autoFocus
            margin="dense"
            fullWidth
            error={!!error}
            helperText={error}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            margin="dense"
            fullWidth
            error={!!error}
            helperText={error}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Login;
