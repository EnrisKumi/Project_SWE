import * as React from 'react';
import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useAuthContext } from '../hooks/useAuthContext'




const theme = createTheme();

export default function ForgotPassword() {

    const [username, setUsername] = useState('')
    const [authCode, setAuthCode] = useState('')
    const [newPassword, setNewPassword] = useState('')

    const {forgotPass}=useAuthContext();
  
    const handleSubmit = (event) => {
        event.preventDefault();
        
    };

        
  return (
    <ThemeProvider theme={theme}>
        {!forgotPass && (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
            Enter Username
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
          <TextField
              margin="normal"
              required
              fullWidth
              label="Username"
              name="username"
              placeholder="username"
              autoFocus
              onChange={(e) =>setUsername(e.target.value)} 
              value={username} 
            />
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Get authentication code
          </Button>
          
        </Box>
      </Box>
    </Container>)
    
    
    }

  </ThemeProvider>
    
    );
}