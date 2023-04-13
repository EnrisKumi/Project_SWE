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
import { Auth} from "aws-amplify";
import { useNavigate } from 'react-router-dom';

const theme = createTheme();

export default function ForgotPassword() {


    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)

    const [username, setUsername] = useState('')
    const [authCode, setAuthCode] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [forgotPass,setForgotPass]=useState(false)

    const navigate = useNavigate();

    async function forgotPassword() {
        setIsPending(true)
        try {
          await Auth.forgotPassword(username);
          setIsPending(false)
          setForgotPass(true)
        }  catch (err){
          setError(err.message)
          setIsPending(false)
        }
      }

      async function forgot_Password() {
        setIsPending(true)
        try {
          await  Auth.forgotPasswordSubmit(username, authCode, newPassword);
          setIsPending(false)
          navigate('/login');
        }  catch (err){
          setError(err.message)
          setIsPending(false)
        }
      }

  
    const handleSubmit = (event) => {
        event.preventDefault();
        forgotPassword();
    };

    const handle_Submit = (event) => {
        event.preventDefault();
        forgot_Password();
    };


    console.log(error)

        
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
    </Container>)}

    {forgotPass && (
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
            Reset Password
        </Typography>
        <Box component="form" noValidate onSubmit={handle_Submit} sx={{ mt: 3 }}>
                    <Grid item xs={12}>
                        <TextField
                            margin="normal"
                            fullWidth
                            required
                            label="Authentication Code"
                            name="authCode"
                            onChange={(e) =>setAuthCode(e.target.value)} 
                            value={authCode} 
                            autoFocus
                        />
                        </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            name="new_password"
                            label="New Password"
                            type="password"
                            id="password"
                            onChange={(e) =>setNewPassword(e.target.value)} 
                            value={newPassword}
                        />
                      </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Reset
          </Button>
          
        </Box>
      </Box>
    </Container>)}

  </ThemeProvider>
    
    );
}