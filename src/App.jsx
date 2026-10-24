import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// =========================
// AUTH
// =========================
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));

// =========================
// ROUTE PROTECTION
// =========================
import ProtectedRoute from "./routes/ProtectedRoute";

// =========================
// ADMIN PAGES
// =========================
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const Students = lazy(() => import("./pages/admin/Students"));
const UpdateStudent = lazy(() => import("./pages/admin/UpdateStudent"));
const Teacher = lazy(() => import("./pages/admin/Teacher"));
const UpdateTeacher = lazy(() => import("./pages/admin/UpdateTeacher"));
const AddTeacher = lazy(() => import("./pages/admin/AddTeacher"));
const AdminCourses = lazy(() => import("./pages/admin/AdminCourses"));
const UpdateCourse = lazy(() => import("./pages/admin/UpdateCourse"));
const AddCourse = lazy(() => import("./pages/admin/AddCourse"));
const AdminAssignments = lazy(() => import("./pages/admin/Assignmnets"));
const UpdateAssignment = lazy(() => import("./pages/admin/UpdateAssighment"));
const Settings = lazy(() => import("./pages/admin/Setting"));

// =========================
// TEACHER PAGES
// =========================
const TeacherDashboard = lazy(() => import("./pages/teacher/Dashboard"));
const Courses = lazy(() => import("./pages/teacher/Courses"));
const Assignment = lazy(() => import("./pages/teacher/Assignments"));
const Submissions = lazy(() => import("./pages/teacher/Submissions"));
const Enrollments = lazy(() => import("./pages/teacher/Enrollments"));

// =========================
// STUDENT PAGES
// =========================
const StudentDashboard = lazy(() => import("./pages/student/Dashboard"));
const StudentCourses = lazy(() => import("./pages/student/Courses"));
const MyCourses = lazy(() => import("./pages/student/MyCourses"));
const StudentAssignments = lazy(() => import("./pages/student/Assignments"));
const StudentSubmissions = lazy(() => import("./pages/student/Submissions"));
const Profile = lazy(() => import("./pages/student/Profile"));


function App() {
  return (
    <Suspense fallback={<div role="status">Loading page...</div>}>
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
    </Suspense>
  );
}

export default App;