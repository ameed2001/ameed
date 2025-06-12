'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import AppLayout from '@/components/AppLayout'; // Adjust path as necessary
import OwnerSidebar from '@/components/owner/OwnerSidebar'; // Adjust path as necessary
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Adjust path as necessary
import { Progress } from '@/components/ui/progress'; // Adjust path as necessary

interface MediaItem {
  id: string;
  type: 'photo' | 'video';
  url: string;
  uploadedAt: string; // Assuming a timestamp
}

interface ProjectDetails {
  id: string;
  name: string;
  media: MediaItem[];
}

const ProjectMediaPage = () => {
  const params = useParams();
  const projectId = params.projectId as string;
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (projectId) {
      // In a real application, you would fetch project data from an API
      // For demonstration, we'll use mock data
      const fetchProjectMedia = async () => {
        setLoading(true);
        setError(null);
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));

          // Mock data
          const mockProjectData: ProjectDetails = {
            id: projectId,
            name: `Project ${projectId}`,
            media: [
              { id: 'photo1', type: 'photo', url: 'https://via.placeholder.com/400x300?text=Project+Photo+1', uploadedAt: '2023-10-26T10:00:00Z' },
              { id: 'video1', type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4', uploadedAt: '2023-10-26T11:00:00Z' },
              { id: 'photo2', type: 'photo', url: 'https://via.placeholder.com/400x300?text=Project+Photo+2', uploadedAt: '2023-10-27T09:30:00Z' },
            ],
          };
          setProject(mockProjectData);
        } catch (err) {
          setError('Failed to load project media.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchProjectMedia();
    }
  }, [projectId]);

  if (loading) {
    return (
      <AppLayout sidebar={<OwnerSidebar />}>
        <div className="p-6">
          <Card>
            <CardHeader>
              <CardTitle>Loading Project Media...</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={null} className="w-[60%]" /> {/* Indeterminate progress */}
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout sidebar={<OwnerSidebar />}>
        <div className="p-6">
          <Card>
            <CardHeader>
              <CardTitle>Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-500">{error}</p>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  if (!project) {
    return (
      <AppLayout sidebar={<OwnerSidebar />}>
        <div className="p-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Not Found</CardTitle>
            </CardHeader>
            <CardContent>
              <p>The requested project could not be found.</p>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout sidebar={<OwnerSidebar />}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Media for {project.name}</h1>

        {project.media.length === 0 ? (
          <p>No media uploaded for this project yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {project.media.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  {item.type === 'photo' ? (
                    <img src={item.url} alt={`Project media ${item.id}`} className="w-full h-auto object-cover rounded-md" />
                  ) : (
                    <video controls className="w-full h-auto rounded-md">
                      <source src={item.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                  <p className="text-sm text-gray-500 mt-2">Uploaded: {new Date(item.uploadedAt).toLocaleString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ProjectMediaPage;