"use client";

import UserLayout from "@/src/components/layout/UserLayout";
import SettingsView from "@/src/components/user/SettingsView";

export default function UserSettings() {
  return <SettingsView requiredRole="users" Layout={UserLayout} />;
}
