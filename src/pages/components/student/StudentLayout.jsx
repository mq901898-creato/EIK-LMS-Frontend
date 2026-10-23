import { Box } from "@mui/material";
import { useState } from "react";

import StudentSlidebar from "./StudentSlidebar";
import StudentNavbar from "./StudentNavbar";

function StudentLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      
      {/* Sidebar Component */}
      <StudentSlidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Right Side Container (Navbar + Page Content) */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minWidth: 0, // Prevents flex child from overflowing out of screen
          width: {
            xs: "100%",
            md: "calc(100% - 260px)",
          },
        }}
      >
        {/* Sticky or static Top Navbar */}
        <Box
          sx={{
            p: { xs: 1.5, sm: 2, md: 2.5 },
            bgcolor: "#f5f5f5",
          }}
        >
          <StudentNavbar setMobileOpen={setMobileOpen} />
        </Box>

        {/* Dynamic Main Content Area */}
        <Box
          component="main"
          sx={{
            flex: 1,
            p: { xs: 1.5, sm: 2, md: 3 },
            pt: { xs: 0.5, sm: 1 },
            boxSizing: "border-box",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default StudentLayout;