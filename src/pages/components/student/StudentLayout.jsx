import { Box } from "@mui/material";
import { useState } from "react";

import StudentSlidebar from "./StudentSlidebar";
import StudentNavbar from "./StudentNavbar";
import { useAppTheme } from "../../../context/useAppTheme";

function StudentLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { mode } = useAppTheme();

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: mode === "dark" ? "#101827" : "#f6f8fc",
        color: mode === "dark" ? "#e7edf7" : "#172033",
        "@supports (min-height: 100dvh)": {
          minHeight: "100dvh",
        },
      }}
    >
      <StudentSlidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minWidth: 0,
          width: { xs: "100%", md: "calc(100% - 264px)" },
        }}
      >
        <Box
          component="header"
          sx={{
            px: { xs: 1.5, sm: 2.5, lg: 3.5 },
            pt: { xs: 1.5, sm: 2, lg: 2.5 },
          }}
        >
          <StudentNavbar setMobileOpen={setMobileOpen} />
        </Box>

        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            px: { xs: 1.5, sm: 2.5, lg: 3.5 },
            py: { xs: 2, sm: 2.5, lg: 3 },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default StudentLayout;
