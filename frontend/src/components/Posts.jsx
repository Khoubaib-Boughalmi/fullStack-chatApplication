import React from 'react'
import { Outlet } from "react-router-dom"

export const Posts = () => {
    return (
      <div style={{ padding: 20 }}>
        <h2>Posts</h2>
        <Outlet />
      </div>
    );
}