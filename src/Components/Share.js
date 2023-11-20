import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';


const Share = ({ onClose }) => {
  const [link, setLink] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="h5" align="center" gutterBottom>
          Share this page
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <IconButton>
            <FacebookIcon style={{fontSize: 36}}  component="svg" />
          </IconButton>
          <IconButton>
            <TwitterIcon style={{fontSize: 36}} component="svg" />
          </IconButton>
          <IconButton>
            <LinkedInIcon style={{fontSize: 36}} component="svg" />
          </IconButton>
          <IconButton>
            <GitHubIcon style={{fontSize: 36}} component="svg" />
          </IconButton>
          {/* Add more social media icons here */}
        </div>
        <TextField
          label="Link"
          fullWidth
          value={link}
          onChange={(event) => setLink(event.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton onClick={handleCopy}>
                <Typography variant="subtitle1">Copy</Typography>
              </IconButton>
            ),
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Share;
