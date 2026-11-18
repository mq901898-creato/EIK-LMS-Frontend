import React from "react";
import Layout from "../../../components/layout/Layout";

// Standardized StudentLayout wrapper delegating directly to the unified Layout shell
export default function StudentLayout({ children }) {
  return <Layout>{children}</Layout>;
}
