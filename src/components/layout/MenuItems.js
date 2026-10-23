import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SettingsIcon from "@mui/icons-material/Settings";
import AddIcon from "@mui/icons-material/AddBox";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import HowToRegIcon from "@mui/icons-material/HowToReg";

const adminMenuItems = [
  {
    title: "Dashboard",
    path: "/admin/dashboard",
    icon: DashboardIcon,
  },
  {
    title: "Courses",
    path: "/admin/courses",
    icon: MenuBookIcon,
  },
  {
    title: "Students",
    path: "/admin/students",
    icon: PeopleIcon,
  },
  {
    title: "Teachers",
    path: "/admin/teachers",
    icon: SchoolIcon,
  },
  {
    title: "Assignments",
    path: "/admin/assignments",
    icon: AssignmentIcon,
  },
  {
    title: "Add Teacher",
    path: "/admin/addTeacher",
    icon: AddIcon,
  },
  {
    title: "Settings",
    path: "/admin/settings",
    icon: SettingsIcon,
  },
];

const teacherMenuItems = [
  {
    title: "Dashboard",
    path: "/teacher/dashboard",
    icon: DashboardIcon,
  },
  {
    title: "Courses",
    path: "/teacher/courses",
    icon: MenuBookIcon,
  },
  {
    title: "Assignments",
    path: "/teacher/assignments",
    icon: AssignmentIcon,
  },
  {
    title: "Submissions",
    path: "/teacher/submissions",
    icon: AssignmentTurnedInIcon,
  },
  {
    title: "Enrollments",
    path: "/teacher/enrollments",
    icon: HowToRegIcon,
  }
];

const studentMenuItems = [
  {
    title: "Dashboard",
    path: "/student/dashboard",
    icon: DashboardIcon,
  },
  {
    title: "Courses",
    path: "/student/courses",
    icon: MenuBookIcon,
  },
  {
    title: "Assignments",
    path: "/student/assignments",
    icon: AssignmentIcon,
  },
  {
    title: "Submissions",
    path: "/student/submissions",
    icon: AssignmentTurnedInIcon,
  },
];

const getMenuItems = (role) => {
  switch (role) {
    case "admin":
      return adminMenuItems;

    case "teacher":
      return teacherMenuItems;

    case "student":
      return studentMenuItems;

    default:
      return [];
  }
};

export default getMenuItems;