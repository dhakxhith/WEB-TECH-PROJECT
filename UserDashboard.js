// src/components/UserDashboard.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Roadmap from "./Roadmap";
import "../styles.css";

export default function UserDashboard() {
  const [joinedCourses, setJoinedCourses] = useState([]);
  const [joinInfo, setJoinInfo] = useState({ name: "", code: "" });
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  
  const notifications = [
    "New quiz available in React Basics!",
    "You moved up to #3 on the leaderboard! 🏆",
    "Assignment due tomorrow: Math Problem Set",
  ];

  const availableCourses = [
    { id: 1, subject: "Mathematics", code: "23CS104", progress: 0 },
    { id: 2, subject: "English Literature", code: "23CS105", progress: 0 },
    { id: 3, subject: "React Basics", code: "23CS201", progress: 0 },
    { id: 4, subject: "Data Structures", code: "23CS301", progress: 0 },
    { id: 5, subject: "Web Development", code: "23CS401", progress: 0 },
  ];

  const leaderboard = [
    { id: 1, name: "Jane Smith", points: 300, avatar: "👩‍💻" },
    { id: 2, name: "John Doe", points: 250, avatar: "👨‍💻" },
    { id: 3, name: "You", points: 200, avatar: "😊" },
    { id: 4, name: "Alice Johnson", points: 150, avatar: "👩‍🎓" },
  ];

  // const getGreeting = () => {
  //   const hour = new Date().getHours();
  //   if (hour < 12) return "Good Morning";
  //   if (hour < 18) return "Good Afternoon";
  //   return "Good Evening";
  // };

  const joinCourse = () => {
    if (!joinInfo.name.trim() || !joinInfo.code.trim()) {
      alert("Please fill in all fields!");
      return;
    }
    
    const foundCourse = availableCourses.find((course) => course.code === joinInfo.code);
    if (!foundCourse) {
      alert("Course not found! Please check the course code.");
      return;
    }
    
    const alreadyJoined = joinedCourses.find(course => course.code === joinInfo.code);
    if (alreadyJoined) {
      alert("You've already joined this course!");
      return;
    }
    
    const courseToJoin = {
      ...foundCourse,
      name: joinInfo.name,
      joinedDate: new Date().toLocaleDateString(),
      progress: 0
    };
    
    setJoinedCourses([...joinedCourses, courseToJoin]);
    setJoinInfo({ name: "", code: "" });
  };

  const addTask = () => {
    if (newTask.trim() === "") return;
    
    const task = {
      id: Date.now(),
      text: newTask.trim(),
      completed: false,
      createdAt: new Date().toLocaleString()
    };
    
    setTasks([...tasks, task]);
    setNewTask("");
  };

  const toggleTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const getCompletedTasksCount = () => {
    return tasks.filter(task => task.completed).length;
  };

  const getCourseProgress = () => {
    if (joinedCourses.length === 0) return 0;
    const totalProgress = joinedCourses.reduce((sum, course) => sum + course.progress, 0);
    return Math.round(totalProgress / joinedCourses.length);
  };

  const handleContinueLearning = (courseId) => {
    // Navigate to course detail page
    navigate(`/course/${courseId}`);
  };

  return (
    <div className="modern-dashboard">
      

      {/* Navigation Tabs */}
      <nav className="dashboard-nav">
        {[
          { id: "overview", label: "Overview" },
          { id: "courses", label: "Courses" },
          { id: "progress", label: "Progress" },
          { id: "resources", label: "Resources" }
        ].map(tab => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="dashboard-content">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="tab-content">
            {/* Stats Overview */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📚</div>
                <div className="stat-info">
                  <h3>{joinedCourses.length}</h3>
                  <p>Enrolled Courses</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🏆</div>
                <div className="stat-info">
                  <h3>200</h3>
                  <p>Total Points</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📅</div>
                <div className="stat-info">
                  <h3>{tasks.filter(task => !task.completed).length}</h3>
                  <p>Pending Tasks</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-info">
                  <h3>{getCourseProgress()}%</h3>
                  <p>Overall Progress</p>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="section">
              <div className="section-header">
                <h3>🔔 Notifications</h3>
                <span className="badge">{notifications.length}</span>
              </div>
              <div className="notifications-list">
                {notifications.map((notification, index) => (
                  <div key={index} className="notification-item">
                    <div className="notification-dot"></div>
                    <p>{notification}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="section">
              <h3>🚀 Quick Actions</h3>
              <div className="quick-actions">
                <button className="action-btn" onClick={() => setActiveTab('courses')}>
                  📚 Browse Courses
                </button>
                <button className="action-btn" onClick={() => setActiveTab('resources')}>
                  🔍 Find Resources
                </button>
                <button className="action-btn" onClick={() => setActiveTab('progress')}>
                  📊 View Progress
                </button>
              </div>
            </div>

            {/* Recent Courses */}
            {joinedCourses.length > 0 && (
              <div className="section">
                <h3>📘 Recent Courses</h3>
                <div className="courses-grid">
                  {joinedCourses.slice(0, 3).map((course) => (
                    <div className="course-card" key={course.id}>
                      <div className="course-header">
                        <h4>{course.subject}</h4>
                        <span className="course-code">{course.code}</span>
                      </div>
                      <div className="course-progress">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                        <span className="progress-text">{course.progress}%</span>
                      </div>
                      <button 
                        className="primary-btn"
                        onClick={() => handleContinueLearning(course.id)}
                      >
                        Continue Learning
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === "courses" && (
          <div className="tab-content">
            {/* Join Course */}
            <div className="section">
              <h3>Join New Course</h3>
              <div className="join-course-form">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={joinInfo.name}
                  onChange={(e) => setJoinInfo({ ...joinInfo, name: e.target.value })}
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="Course Code (e.g., 23CS104)"
                  value={joinInfo.code}
                  onChange={(e) => setJoinInfo({ ...joinInfo, code: e.target.value })}
                  className="form-input"
                />
                <button onClick={joinCourse} className="primary-btn">
                  Join Course
                </button>
              </div>
            </div>

            {/* Available Courses */}
            <div className="section">
              <div className="section-header">
                <h3>📖 Available Courses</h3>
                <span className="courses-count">{availableCourses.length} courses available</span>
              </div>
              <div className="courses-grid">
                {availableCourses.map((course) => (
                  <div className="course-card available" key={course.id}>
                    <div className="course-header">
                      <h4>{course.subject}</h4>
                      <span className="course-code">{course.code}</span>
                    </div>
                    <div className="course-info">
                      <p>Join this course to start learning</p>
                    </div>
                    <button 
                      className="secondary-btn"
                      onClick={() => {
                        setJoinInfo({ name: "", code: course.code });
                        document.querySelector('.join-course-form')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      Quick Join
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* My Courses */}
            <div className="section">
              <div className="section-header">
                <h3>📘 My Courses</h3>
                <span className="courses-count">{joinedCourses.length} courses joined</span>
              </div>
              <div className="courses-grid">
                {joinedCourses.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📚</div>
                    <p>No courses joined yet</p>
                    <p className="empty-subtitle">Join a course above to get started!</p>
                  </div>
                ) : (
                  joinedCourses.map((course) => (
                    <div className="course-card enrolled" key={course.id}>
                      <div className="course-header">
                        <h4>{course.subject}</h4>
                        <span className="course-code">{course.code}</span>
                      </div>
                      <div className="course-progress">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                        <span className="progress-text">{course.progress}%</span>
                      </div>
                      <div className="course-actions">
                        <button 
                          className="primary-btn"
                          onClick={() => handleContinueLearning(course.id)}
                        >
                          Continue Learning
                        </button>
                        <button 
                          className="secondary-btn"
                          onClick={() => {
                            // Simulate progress update
                            setJoinedCourses(joinedCourses.map(c => 
                              c.id === course.id 
                                ? { ...c, progress: Math.min(100, c.progress + 10) }
                                : c
                            ));
                          }}
                        >
                          Mark Progress
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === "progress" && (
          <div className="tab-content">
            {/* Progress Overview */}
            <div className="section">
              <h3>📊 Learning Progress</h3>
              <div className="progress-cards">
                <div className="progress-card">
                  <div className="progress-icon">🎯</div>
                  <div className="progress-info">
                    <h4>Completion Rate</h4>
                    <p>{getCourseProgress()}% Overall</p>
                  </div>
                </div>
                <div className="progress-card">
                  <div className="progress-icon">⏱️</div>
                  <div className="progress-info">
                    <h4>Study Time</h4>
                    <p>24h this week</p>
                  </div>
                </div>
                <div className="progress-card">
                  <div className="progress-icon">✅</div>
                  <div className="progress-info">
                    <h4>Tasks Completed</h4>
                    <p>{getCompletedTasksCount()}/{tasks.length} tasks</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Study Planner */}
            <div className="section">
              <h3>🗓️ Study Planner</h3>
              <div className="task-input-group">
                <input
                  type="text"
                  placeholder="Add a study task..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  className="form-input"
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                />
                <button onClick={addTask} className="primary-btn">
                  Add Task
                </button>
              </div>
              <div className="tasks-list">
                {tasks.length === 0 ? (
                  <div className="empty-state">
                    <p>No tasks yet. Add your first study task!</p>
                  </div>
                ) : (
                  tasks.map((task) => (
                    <div key={task.id} className="task-item">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        className="task-checkbox"
                      />
                      <span className={task.completed ? "task-text completed" : "task-text"}>
                        {task.text}
                      </span>
                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="delete-task-btn"
                        title="Delete task"
                      >
                        🗑️
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Leaderboard */}
            <div className="section">
              <h3>🏅 Leaderboard</h3>
              <div className="leaderboard">
                {leaderboard.map((user, index) => (
                  <div 
                    key={user.id} 
                    className={`leaderboard-item ${user.name === 'You' ? 'current-user' : ''}`}
                  >
                    <div className="rank">#{index + 1}</div>
                    <div className="user-info">
                      <span className="user-avatar">{user.avatar}</span>
                      <span className="user-name">{user.name}</span>
                    </div>
                    <div className="user-points">{user.points} pts</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === "resources" && (
          <div className="tab-content">
            {/* Learning Resources */}
            <div className="section">
              <h3>🔍 Learning Resources</h3>
              <p>Search for learning materials across platforms:</p>
              <input
                type="text"
                placeholder="Search topics (e.g., Sorting Algorithms, React Hooks)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
              />
              {searchQuery && (
                <div className="resources-grid">
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery + ' tutorial')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-card"
                  >
                    <div className="resource-icon">📺</div>
                    <div className="resource-info">
                      <h4>YouTube Videos</h4>
                      <p>Video tutorials and lectures</p>
                    </div>
                  </a>
                  <a
                    href={`https://www.geeksforgeeks.org/?s=${encodeURIComponent(searchQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-card"
                  >
                    <div className="resource-icon">📝</div>
                    <div className="resource-info">
                      <h4>GeeksforGeeks</h4>
                      <p>Articles and code examples</p>
                    </div>
                  </a>
                  <a
                    href={`https://github.com/search?q=${encodeURIComponent(searchQuery)}&type=repositories`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-card"
                  >
                    <div className="resource-icon">💻</div>
                    <div className="resource-info">
                      <h4>GitHub Repositories</h4>
                      <p>Open-source projects and code</p>
                    </div>
                  </a>
                  <a
                    href={`https://stackoverflow.com/search?q=${encodeURIComponent(searchQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-card"
                  >
                    <div className="resource-icon">❓</div>
                    <div className="resource-info">
                      <h4>Stack Overflow</h4>
                      <p>Q&A and problem solutions</p>
                    </div>
                  </a>
                </div>
              )}
            </div>

            {/* AI Roadmap */}
            <div className="section">
              <h3>📚 AI-Powered Study Roadmap</h3>
              <Roadmap />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}