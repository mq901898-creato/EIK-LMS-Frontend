import { Routes, Route, Navigate } from "react-router-dom";

// =========================
// AUTH
// =========================
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// =========================
// ROUTE PROTECTION
// =========================
import ProtectedRoute from "./routes/ProtectedRoute";

// =========================
// ADMIN PAGES
// =========================
import AdminDashboard from "./pages/admin/Dashboard";
import Students from "./pages/admin/Students";
import UpdateStudent from "./pages/admin/UpdateStudent";
import Teacher from "./pages/admin/Teacher";
import UpdateTeacher from "./pages/admin/UpdateTeacher";
import AddTeacher from "./pages/admin/addTeacher";
import AdminCourses from "./pages/admin/AdminCourses";
import UpdateCourse from "./pages/admin/UpdateCourse";
import AddCourse from "./pages/admin/AddCourse";
import AdminAssignments from "./pages/admin/Assignmnets";
import UpdateAssignment from "./pages/admin/UpdateAssighment";
import Settings from "./pages/admin/Setting";

// =========================
// TEACHER PAGES
// =========================
import TeacherDashboard from "./pages/teacher/Dashboard";
import Courses from "./pages/teacher/Courses";
import Assignment from "./pages/teacher/Assignments";
import Submissions from "./pages/teacher/Submissions";
import Enrollments from "./pages/teacher/Enrollments";

// =========================
// STUDENT PAGES
// =========================
import StudentDashboard from "./pages/student/Dashboard";
import StudentCourses from "./pages/student/Courses";
import MyCourses from "./pages/student/MyCourses";
import StudentAssignments from "./pages/student/Assignments";
import StudentSubmissions from "./pages/student/Submissions";
import Profile from "./pages/student/Profile";


function App() {
  return (
    <Routes>

      {/* ================================================= */}
      {/* AUTHENTICATION */}
      {/* ================================================= */}

      <Route
        path="/"
        element={<Navigate to="/register" replace />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/login"
        element={<Login />}
      />


      {/* ================================================= */}
      {/* ADMIN PANEL */}
      {/* ================================================= */}

      {/* Admin Dashboard */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin Students */}
      <Route
        path="/admin/students"
        element={
          <ProtectedRoute allowedRole="admin">
            <Students />
          </ProtectedRoute>
        }
      />

      {/* Update Student */}
      <Route
        path="/admin/update/:id"
        element={
          <ProtectedRoute allowedRole="admin">
            <UpdateStudent />
          </ProtectedRoute>
        }
      />

      {/* Admin Teachers */}
      <Route
        path="/admin/teachers"
        element={
          <ProtectedRoute allowedRole="admin">
            <Teacher />
          </ProtectedRoute>
        }
      />

      {/* Update Teacher */}
      <Route
        path="/admin/updateTeacher/:id"
        element={
          <ProtectedRoute allowedRole="admin">
            <UpdateTeacher />
          </ProtectedRoute>
        }
      />

      {/* Add Teacher */}
      <Route
        path="/admin/addTeacher"
        element={
          <ProtectedRoute allowedRole="admin">
            <AddTeacher />
          </ProtectedRoute>
        }
      />

      {/* Admin Courses */}
      <Route
        path="/admin/courses"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminCourses />
          </ProtectedRoute>
        }
      />

      {/* Add Admin Course */}
      <Route
        path="/admin/courses/add"
        element={
          <ProtectedRoute allowedRole="admin">
            <AddCourse />
          </ProtectedRoute>
        }
      />

      {/* Edit Admin Course */}
      <Route
        path="/admin/courses/edit/:id"
        element={
          <ProtectedRoute allowedRole="admin">
            <UpdateCourse />
          </ProtectedRoute>
        }
      />

      {/* Admin Assignments */}
      <Route
        path="/admin/assignments"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminAssignments />
          </ProtectedRoute>
        }
      />

      {/* Edit Admin Assignment */}
      <Route
        path="/admin/assignments/edit/:id"
        element={
          <ProtectedRoute allowedRole="admin">
            <UpdateAssignment />
          </ProtectedRoute>
        }
      />

      {/* Admin Settings */}
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute allowedRole="admin">
            <Settings />
          </ProtectedRoute>
        }
      />


      {/* ================================================= */}
      {/* TEACHER PANEL */}
      {/* ================================================= */}

      {/* Teacher Dashboard */}
      <Route
        path="/teacher/dashboard"
        element={
          <ProtectedRoute allowedRole="teacher">
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />

      {/* Teacher Courses */}
      <Route
        path="/teacher/courses"
        element={
          <ProtectedRoute allowedRole="teacher">
            <Courses />
          </ProtectedRoute>
        }
      />

      {/* Teacher Assignments */}
    
      <Route
        path="/teacher/assignments"
        element={
          <ProtectedRoute allowedRole="teacher">
            <Assignment />
          </ProtectedRoute>
        }
      />
    

      {/* Teacher Submissions */}
      {/* Uncomment when Submissions.jsx is created */}

      <Route
        path="/teacher/submissions"
        element={
          <ProtectedRoute allowedRole="teacher">
            <Submissions />
          </ProtectedRoute>
        }
        />
      {/* Teacher Enrollments */}
      <Route
        path="/teacher/enrollments"
        element={
          <ProtectedRoute allowedRole="teacher">
            <Enrollments />
          </ProtectedRoute>
        }
      />
     

      {/* ================================================= */}
      {/* STUDENT PANEL */}
      {/* ================================================= */}

      {/* Student Dashboard */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      {/* Student Courses */}
      <Route
        path="/student/courses"
        element={
          <ProtectedRoute allowedRole="student">
            <StudentCourses />
          </ProtectedRoute>
        }
      />
      {/* My Courses */}
      <Route
        path="/student/my-courses"
        element={
          <ProtectedRoute allowedRole="student">
            <MyCourses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/assignments"
        element={
          <ProtectedRoute allowedRole="student">
            <StudentAssignments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/submissions"
        element={
          <ProtectedRoute allowedRole="student">
            <StudentSubmissions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/profile"
        element={
          <ProtectedRoute allowedRole="student">
            <Profile />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;