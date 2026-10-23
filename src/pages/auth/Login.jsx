import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, Typography, TextField, Button, Paper } from "@mui/material";
import api from "../../servises/api";

const theme = createTheme({
  palette: {
    primary: {
      main: '#1565c0',      
      light: '#42a5f5',
      dark: '#0d47a1',
      contrastText: '#fff', 
    },
    secondary: {
      main: '#000000',      
    },
  },
});

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate  = useNavigate();
  const handleSubmit = async (event)=>{
    event.preventDefault();
    try{
      const response =await api.post("/auth/login",{
        email,
        password
      })
      console.log(response.data);
      localStorage.setItem("token" , response.data.token)
      localStorage.setItem("user",JSON.stringify(response.data.user));
      const role = response.data.user.role;
      if(role==="admin"){
        navigate("/admin/dashboard")
      }else if(role === "teacher"){
        navigate("/teacher/dashboard")
      }else if(role === "student"){
        navigate("/student/courses")
      }
    }
    catch(error){
      console.log(error);
      
    }
  }
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", justifyContent: 'center', alignItems: "center", minHeight: "100vh", bgcolor: "#f5f5f5" }}>
        <Paper 
          elevation={12}
          sx={{
            p: 5, // Reduced to balance with inner Box padding
            width: '100%',
            maxWidth: 400, // Makes it perfectly responsive on small screens
            borderRadius: 3
          }}
        >
          <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            
            {/* 1. Main Heading */}
            <Typography variant="h3" color="primary"sx={{fontWeight:"bold" ,textAlign:"center", mb:"0.5"}}>
              Login
            </Typography>

            <TextField
              label="Email"
              color="gray"
              focused
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              label="Password"
              type="password"
              color="gray"
              focused
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <Typography variant="body2" textAlign="center">
                    don't have an account?{" "}
                    <Link to="/register">Register</Link>
            </Typography>

            <Button type="submit"variant="contained" color="primary" disableElevation sx={{ py: 1.2, mt: 1 }}>
              Login
            </Button>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default Login;
