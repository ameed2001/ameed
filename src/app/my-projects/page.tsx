// src/app/my-projects/page.tsx
import React from 'react';
import { getProjects } from '@/lib/db'; // Assuming getProjects is the correct function

export default async function MyProjectsPage() {
  // Fetch the user's projects. Assume getUserProjects returns an array of objects with a 'name' property.
  const projects = await getProjects(); // Call the correct function

  return (
    <div>
      {/* This is the my projects page. */}
      <h1>My Projects Page</h1>
      <p>This page will list the user's projects.</p>
      {projects && projects.length > 0 ? (
        <ul>
          {projects.map((project: any) => (
            <li key={project.id}>{project.name}</li> // Assume project has an 'id' and 'name'
          ))}
        </ul>
      ) : (
        <p>No projects found.</p>
      )}
    </div>
  );
}