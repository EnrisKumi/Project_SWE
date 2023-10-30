import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {ThemeProvider } from '@mui/material/styles';
import { useConfirmSignUp } from '../../hooks/auth/useConfirmSignUp';
import { Divider } from "@mui/material";

import { myTheme } from "../../theme/theme";

import Football from "../../icons/Football.png";

import './authenticationStyle.css'


export default function ConfirmSignUp() {
    const [authCode, setAuthCode] = useState('')
    const {confirmSignup,isPending,error}= useConfirmSignUp();
  
    const handleSubmit = (event) => {
        event.preventDefault();
        confirmSignup(authCode);
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
            Confirm SignUp
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>

          <Grid item xs={12}>
                    <TextField
                      margin="normal"
                      fullWidth
                      required
                      label="Authentication Code"
                      name="authCode"
                      autoFocus
                      placeholder="Confirmation Code"
                      onChange={(e) => setAuthCode(e.target.value)} 
                      value={authCode}
                    />
            </Grid>
          
          </Grid>

          {error && <div className='error'>{error}</div>} 
          <Divider sx={{ width: 1, marginTop: 3, fontWeight: 200 }}></Divider>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Confirm SignUp
          </Button>
          
        </Box>
      </Box>
    </Container>
  </ThemeProvider>

  </div>
    
    );
}