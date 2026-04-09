"use client";
import { getMe, logout, logoutAll } from "@/auth/auth.service";
import { useAuth } from "@/auth/AuthContext";
import { useEffect, useState } from "react";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div>
      <h2>Profile</h2>

      {user && (
        <pre>{JSON.stringify(user, null, 2)}</pre>
      )}

      <button onClick={logout}>Logout</button>
      <br />
      <button onClick={logoutAll}>Logout All</button>
    </div>
  );
}