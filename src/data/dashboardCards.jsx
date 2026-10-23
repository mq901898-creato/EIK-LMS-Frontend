import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Enrollment from "@mui/icons-material/HowToReg";
import submisson from"@mui/icons-material/Send";

const dashboardCards = [
  {
    title: "Students",
    key: "students",
    icon:  PeopleIcon,
    color: "#1565c0",
  },
  {
    title: "Teachers",
    key: "teachers",
    icon:  PeopleIcon,
    color: "#2e7d32",
  },
  {
    title: "Courses",
    key: "courses",
    icon: MenuBookIcon,
    color: "#ed6c02",
  },
  {
    title: "Assignments",
    key: "assignments",
    icon: AssignmentIcon,
    color: "#9c27b0",
  },
  {
    title: "Enrollments",
    key: "enrollments",
    icon: Enrollment,
    color: "#0288d1",
  },
  {
    title: "Submissions",
    key: "submissions",
    icon: submisson,
    color: "#d32f2f",
  },
];

export default dashboardCards;