import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { ThemeProvider } from '@mui/material/styles';
import { useSignup } from '../../hooks/auth/useSignUp';
import { Divider } from "@mui/material";




import './authenticationStyle.css'
import Football from "../../icons/Football.png";

import { myTheme } from "../../theme/theme";


export default function SignUp() {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [confirmPasswordError,setConfirmPasswordError]=useState('')
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    

  const {signup,isPending,error}= useSignup();


    const handleSubmit = (event) => {
        event.preventDefault();

        if(password===confirmPassword){
          signup(username,email,password);
        }else{
          setConfirmPasswordError('Passwords do not match!')
        }
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowPassword2 = () => setShowPassword2((show) => !show);

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
          <img className="top" src={Football} height={75} width={75} />
        </Box>

        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  onChange={(e) =>setUsername(e.target.value)} 
                  value={username} 
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)} 
                  value={email} 
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="new-password"
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
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="ConfirmPassword"
                  label="Confirm Password"
                  type={showPassword2 ? 'text' : 'password'}
                  id="ConfirmPassword"
                  autoComplete="ConfirmPassword"
                  InputProps={{
                    endAdornment:(
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword2}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword2 ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>),
                    }}
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  value={confirmPassword} 
                />
              </Grid>
            </Grid>

            {!confirmPassword &&(error && <div className='error'>{error}</div>)}
            {confirmPasswordError && <div className='error'>{confirmPasswordError}</div>} 

            <Divider sx={{ width: 1,marginTop: (error||confirmPasswordError) ? 1 : 3 , fontWeight: 200 }}></Divider>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>


            <Grid container justifyContent="flex-end">
              <Grid item xs>
                <Link href="/login" variant="body2">
                  Already have an account? Login
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