import { Box } from "@mui/material";
import Sidebar from "./Slidebar";
import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Right Side */}
      <Box sx={{ flex: 1 }}>
        {/* Top Navbar */}
        <Navbar />

        {/* Main Content */}
        <Box
          sx={{
            p: 3,
            bgcolor: "#f5f5f5",
            minHeight: "calc(100vh - 80px)",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default Layout;