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
import { useConfirmSignUp } from '../../hooks/auth/useConfirmSignUp';



const theme = createTheme();

export default function ConfirmSignUp() {
    const [authCode, setAuthCode] = useState('')
    const {confirmSignup,isPending,error}= useConfirmSignUp();
  
    const handleSubmit = (event) => {
        event.preventDefault();
        confirmSignup(authCode);
    };

        
  return (
    <ThemeProvider theme={theme}>
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
    
    );
}