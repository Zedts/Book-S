"use client";

import AdminLayout from "@/src/components/layout/AdminLayout";
import SettingsView from "@/src/components/user/SettingsView";

export default function AdminSettings() {
  return <SettingsView requiredRole="admin" Layout={AdminLayout} />;
}
