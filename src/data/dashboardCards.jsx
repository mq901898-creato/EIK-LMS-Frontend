import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AssignmentIcon from "@mui/icons-material/Assignment";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import SendIcon from "@mui/icons-material/Send";

const dashboardCards = [
  {
    title: "Total Students",
    key: "students",
    icon: PeopleIcon,
    color: "#6366f1",
    path: "/admin/students",
  },
  {
    title: "Faculty Members",
    key: "teachers",
    icon: SchoolIcon,
    color: "#10b981",
    path: "/admin/teachers",
  },
  {
    title: "Active Courses",
    key: "courses",
    icon: MenuBookIcon,
    color: "#06b6d4",
    path: "/admin/courses",
  },
  {
    title: "Assignments",
    key: "assignments",
    icon: AssignmentIcon,
    color: "#f59e0b",
    path: "/admin/assignments",
  },
  {
    title: "Enrollment Requests",
    key: "enrollments",
    icon: HowToRegIcon,
    color: "#a855f7",
    path: "/admin/courses",
  },
  {
    title: "Submissions",
    key: "submissions",
    icon: SendIcon,
    color: "#ec4899",
    path: "/admin/assignments",
  },
];

export default dashboardCards;
