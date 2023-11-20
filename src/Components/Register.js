import React, { useState, useContext } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import UserContext from "../UserContext";
import './style.css';

const Register = ({ onClose, setShowLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser, setUserid, setIsAdmin } = useContext(UserContext);

  const validateInput = () => {
    const usernameRegex = /^[A-Za-z0-9]+$/;
    const emailRegex = /^\S+@\S+\.\S+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    console.log(username,usernameRegex.test(username));
    console.log(email, emailRegex.test(email));
    console.log(password, passwordRegex.test(password));
    console.log(confirmPassword, password === confirmPassword)

    return (

      username.length >= 3 &&
      username.length <= 20 &&
      usernameRegex.test(username) &&
      emailRegex.test(email) &&
      passwordRegex.test(password) &&
      password === confirmPassword
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateInput()) {
      setError("Invalid input");
      return;
    }

    axios.post('/users/register', {
      username: username,
      email: email,
      password: password
    }).then(response => {
      setUser(username);
      setUserid(response.data._id);
      setIsAdmin(false);
      console.log(response);
      onClose();
    }).catch(error => {
      if (error.response && error.response.data) {
        setError(error.response.data);
      } else {
        console.log(error);
      }
    });
  };

  return (
    <Dialog open onClose={onClose} maxWidth="xs" style={{ height: 999, top: '-20vh' }}>
      <Typography component="h5" style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton aria-label="close" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Typography>
      <DialogContent style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
            autoFocus
            margin="dense"
            fullWidth
            error={!!error}
            helperText={error}
          />
          <TextField
        label="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
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
          <TextField
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        required
        margin="dense"
        fullWidth
        error={!!error}
        helperText={error}
         />
          <DialogActions>
            <Button type="submit" variant="contained" style={{ width: '100%' }} className='button'>
              Register
            </Button>
          </DialogActions>
        </form>
        <Typography align="center">
          Already a user?{' '}
          <Button color="primary" onClick={() => { onClose(); setShowLogin(true); }}>
            Login
          </Button>
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default Register;
