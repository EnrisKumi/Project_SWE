import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {ThemeProvider } from '@mui/material/styles';
import { useLogin } from '../../hooks/auth/useLogin';

import { myTheme } from "../../theme/theme";

import Football from "../../icons/Football.png";

import './authenticationStyle.css'

import { Divider } from "@mui/material";


export default function Login() {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false);

    const {login,isPending,error}=useLogin();

    const handleSubmit = (event) => {
        event.preventDefault();
        login(username, password);
      };

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };

      

  return (
<div className="backgroundasd">
  <ThemeProvider theme={myTheme}>
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
        <img className="topi" src={Football} height={75} width={75} />
      </Box>
      {/* <Box marginBottom={2}>
        <img src={logosign} height={25} width={75} />
      </Box> */}

      <Typography component="h1" variant="h5">
        Login
      </Typography>
            
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="password"
              autoComplete="current-password"
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
              onChange={(e) => setPassword(e.target.value)} 
              value={password} 
            />
            {error && <div className='error'>{error}</div>} 

            <Divider sx={{ width: 1, marginTop: 3, fontWeight: 200 }}></Divider>
          
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>

            <Grid container>

              <Grid item xs>
                <Link href="/forgotPassword" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>

            </Grid>

          </Box>
        </Box>
      </Container>
    </ThemeProvider>
    </div>

  );
}
