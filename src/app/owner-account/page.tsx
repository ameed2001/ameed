"use client";
typescriptreact
import React, { useState, useEffect } from 'react';

const OwnerAccountPage: React.FC = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'progress', 'reports', 'media', 'comments', 'timeline'
  const [newComment, setNewComment] = useState('');

  // 1. عرض مشاريعي - Fetch owner's projects on component mount
  useEffect(() => {
    // TODO: Implement logic to fetch owner's projects from the backend
    // setProjects(fetchedProjects);
  }, []);

  const handleProjectSelect = (projectId: string) => {
    // TODO: Implement logic to fetch details for the selected project
    // setSelectedProject(fetchedProjectDetails);
    setActiveTab('overview'); // Default to overview when a project is selected
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // 5. إضافة تعليقات/استفسارات - Handle comment submission
  const handleAddComment = () => {
    if (selectedProject && newComment.trim()) {
      // TODO: Implement logic to submit the new comment/inquiry
      console.log(`Adding comment for project ${selectedProject.id}: ${newComment}`);
      setNewComment('');
      // TODO: Optionally refresh comments after submission
    }
  };

  return (
    <div className="owner-account-container">
      <h1>حساب المالك</h1>

      {/* 1. عرض مشاريعي - Project List */}
      <div className="project-list-section">
        <h2>مشاريعي</h2>
        {projects.length === 0 ? (
          <p>لا يوجد مشاريع لعرضها.</p>
        ) : (
          <ul>
            {projects.map((project: any) => (
              <li key={project.id} onClick={() => handleProjectSelect(project.id)}>
                {project.name} - الحالة: {project.status}
                {/* TODO: Add quick links if needed */}
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedProject && (
        <div className="selected-project-details">
          <h2>تفاصيل المشروع: {selectedProject.name}</h2>

          {/* Navigation Tabs */}
          <div className="tabs">
            <button onClick={() => handleTabChange('overview')}>نظرة عامة</button>
            <button onClick={() => handleTabChange('progress')}>مراقبة التقدم</button>
            <button onClick={() => handleTabChange('reports')}>تقارير الكميات</button>
            <button onClick={() => handleTabChange('media')}>صور/فيديوهات</button>
            <button onClick={() => handleTabChange('comments')}>التعليقات/الاستفسارات</button>
            <button onClick={() => handleTabChange('timeline')}>الجدول الزمني</button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'overview' && (
              <div>
                <h3>نظرة عامة على المشروع</h3>
                <p>{selectedProject.description}</p>
                {/* TODO: Display other overview information */}
              </div>
            )}

            {/* 2. مراقبة تقدم المشروع - Progress Monitoring */}
            {activeTab === 'progress' && (
              <div>
                <h3>مراقبة تقدم المشروع</h3>
                {/* TODO: Display project progress, milestones, and updates */}
                <p>عرض حالة التقدم والمعالم والتحديثات هنا.</p>
              </div>
            )}

            {/* 3. عرض تقارير الكميات الموجزة - Quantity Reports */}
            {activeTab === 'reports' && (
              <div>
                <h3>تقارير الكميات الموجزة</h3>
                {/* TODO: Display summarized quantity reports */}
                <p>عرض تقارير كميات الأعمال المنجزة أو المواد المستخدمة هنا.</p>
              </div>
            )}

            {/* 4. عرض صور/فيديوهات التقدم - Media (Images/Videos) */}
            {activeTab === 'media' && (
              <div>
                <h3>صور/فيديوهات التقدم</h3>
                {/* TODO: Display images and videos */}
                <p>عرض الصور ومقاطع الفيديو المتعلقة بالتقدم هنا.</p>
                {/* Example placeholder for media display */}
                {/* <div className="media-gallery">
                  <img src="placeholder-image.jpg" alt="Progress Image" />
                  <video controls src="placeholder-video.mp4"></video>
                </div> */}
              </div>
            )}

            {/* 5. إضافة تعليقات/استفسارات - Comments/Inquiries */}
            {activeTab === 'comments' && (
              <div>
                <h3>التعليقات والاستفسارات</h3>
                {/* TODO: Display existing comments */}
                <div className="existing-comments">
                  <h4>التعليقات السابقة:</h4>
                  {/* TODO: Map and display comments */}
                  <p>لا يوجد تعليقات حاليًا.</p>
                </div>

                <h4>إضافة تعليق جديد:</h4>
                <textarea
                  rows={4}
                  cols={50}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="اكتب تعليقك أو استفسارك هنا..."
                ></textarea>
                <button onClick={handleAddComment}>إرسال التعليق</button>
              </div>
            )}

            {/* 6. عرض الجدول الزمني للمشروع - Project Timeline */}
            {activeTab === 'timeline' && (
              <div>
                <h3>الجدول الزمني للمشروع</h3>
                {/* TODO: Display project timeline */}
                <p>عرض الجدول الزمني للمشروع مع التواريخ الرئيسية والمواعيد النهائية هنا.</p>
                {/* Example placeholder for a timeline visualization */}
                {/* <div className="project-timeline">
                  Timeline visualization goes here (e.g., using a library)
                </div> */}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerAccountPage;
