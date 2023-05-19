import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Divider } from "@mui/material";
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {ThemeProvider } from '@mui/material/styles';
import { Auth} from "aws-amplify";
import { useNavigate } from 'react-router-dom';
import Link from "@mui/material/Link";
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { myTheme } from "../../theme/theme";

import Football from "../../icons/Football.png";

import './authenticationStyle.css'


export default function ForgotPassword() {


    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)

    const [username, setUsername] = useState('')
    const [authCode, setAuthCode] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [forgotPass,setForgotPass]=useState(false)
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    async function forgotPassword() {
        setIsPending(true)
        try {
          await Auth.forgotPassword(username);
          setIsPending(false)
          setError(null);
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
          setError(null);
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

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };


        
  return (
    <div className="backgroundasd">
    <ThemeProvider theme={myTheme}>
        {!forgotPass && (
          <Container
          component="main"
          maxWidth="xs"
          className="main-container"
        >
          <CssBaseline />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box marginBottom={4}>
              <img className="top" src={Football} height={75} width={75} />
            </Box>

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


          {error && <div className='error'>{error}</div>} 
          <Divider sx={{ width: 1, marginTop: 3, fontWeight: 200 }}></Divider>
            <Grid item xs={12}></Grid>
            <Grid item xs={12}></Grid>
            <Grid item xs={12}></Grid>
        
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Get authentication code
          </Button>

          <Grid item xs>
                <Link href="/login" variant="body2">
                  {"I have an account! Login"}
                </Link>
              </Grid>
          
        </Box>
      </Box>
    </Container>)}

    {forgotPass && (
        <Container
        component="main"
        maxWidth="xs"
        className="main-container"
      >
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box marginBottom={4}>
            <img className="top" src={Football} height={75} width={75} />
          </Box>
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
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            InputProps={{
                              endAdornment:(
                                <InputAdornment position="end">
                                  <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                  >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                                </InputAdornment>),
                              }}
                            onChange={(e) =>setNewPassword(e.target.value)} 
                            value={newPassword}
                        />
                      </Grid>

          {error && <div className='error'>{error}</div>} 
          <Divider sx={{ width: 1, marginTop: 3, fontWeight: 200 }}></Divider>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Reset Password
          </Button>
          
          
        </Box>
      </Box>
    </Container>)}

  </ThemeProvider>
  </div>
    
    );
}