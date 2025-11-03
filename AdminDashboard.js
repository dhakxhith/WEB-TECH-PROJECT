import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { jsPDF } from "jspdf";
import Navbar from "./Navbar"; // Make sure this path is correct

export default function AdminDashboard({ auth, onLogout }) {
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", role: "user", points: 120 },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "user", points: 200 },
    { id: 3, name: "Admin One", email: "admin@skillsphere.com", role: "admin", points: 0 },
  ]);

  const [courses, setCourses] = useState([
    { 
      id: 1, 
      subject: "Mathematics", 
      code: "23CS104", 
      description: "Learn fundamental mathematical concepts including algebra, calculus, and statistics.",
      instructor: "Dr. Sarah Johnson",
      duration: "12 weeks",
      level: "Beginner",
      students: [], 
      progress: 65,
      modules: [
        {
          id: 1,
          title: "Algebra Basics",
          topics: ["Linear Equations", "Quadratic Equations", "Polynomials"],
          duration: "2 weeks",
          quiz: null
        }
      ]
    },
    { 
      id: 2, 
      subject: "English Literature", 
      code: "23CS105", 
      description: "Explore classic and contemporary English literature from Shakespeare to modern authors.",
      instructor: "Prof. Michael Brown",
      duration: "10 weeks",
      level: "Intermediate",
      students: [], 
      progress: 42,
      modules: [
        {
          id: 1,
          title: "Shakespearean Literature",
          topics: ["Hamlet Analysis", "Macbeth Themes", "Sonnet Structure"],
          duration: "3 weeks",
          quiz: null
        }
      ]
    },
  ]);

  // Static available courses data
  const availableCourses = [
    { 
      id: 1, 
      subject: "Mathematics", 
      code: "23CS104",
      description: "Learn fundamental mathematical concepts including algebra, calculus, and statistics.",
      instructor: "Dr. Sarah Johnson",
      duration: "12 weeks",
      level: "Beginner"
    },
    { 
      id: 2, 
      subject: "Data Structures", 
      code: "23CS301",
      description: "Master essential data structures and algorithms for efficient programming.",
      instructor: "Dr. Raj Patel",
      duration: "14 weeks",
      level: "Intermediate"
    },
    { 
      id: 3, 
      subject: "English Literature", 
      code: "23CS105",
      description: "Explore classic and contemporary English literature from Shakespeare to modern authors.",
      instructor: "Prof. Michael Brown",
      duration: "10 weeks",
      level: "Intermediate"
    },
    { 
      id: 4, 
      subject: "Web Development", 
      code: "23CS401",
      description: "Complete web development course covering HTML, CSS, JavaScript and modern frameworks.",
      instructor: "Lisa Chen",
      duration: "16 weeks",
      level: "Beginner"
    },
    { 
      id: 5, 
      subject: "React Basics", 
      code: "23CS201",
      description: "Master the fundamentals of React including components, hooks, and state management.",
      instructor: "Emma Wilson",
      duration: "8 weeks",
      level: "Beginner"
    }
  ];

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "addCourse", "editCourse", "addModule", "addTopic", "addQuiz"
  const [currentCourse, setCurrentCourse] = useState(null);
  const [currentModule, setCurrentModule] = useState(null);
  
  // Form states
  const [courseForm, setCourseForm] = useState({
    subject: "", 
    code: "",
    description: "",
    instructor: "",
    duration: "",
    level: "Beginner"
  });

  const [moduleForm, setModuleForm] = useState({
    title: "",
    duration: ""
  });

  const [topicForm, setTopicForm] = useState({
    name: ""
  });

  const [quizForm, setQuizForm] = useState({
    title: "",
    questions: [{
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0
    }]
  });

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });

  const [assignData, setAssignData] = useState({ 
    student: "", 
    points: "",
    studentName: ""
  });

  const [activeTab, setActiveTab] = useState("overview");
  
  // AI States
  const [aiQuizData, setAiQuizData] = useState({
    topic: "",
    code: "",
    loading: false
  });

  const [generatedQuiz, setGeneratedQuiz] = useState(null);

  // AI Course Suggestions
  const aiSuggestions = [
    { 
      id: 1, 
      subject: "React Basics", 
      description: "Master the fundamentals of React including components, hooks, and state management.",
      level: "Beginner",
      duration: "8 weeks"
    },
    { 
      id: 2, 
      subject: "Node.js APIs", 
      description: "Learn to build robust RESTful APIs with Node.js and Express framework.",
      level: "Intermediate",
      duration: "10 weeks"
    },
    { 
      id: 3, 
      subject: "MongoDB Queries", 
      description: "Master MongoDB query operations, aggregation pipelines, and database optimization.",
      level: "Intermediate",
      duration: "6 weeks"
    },
    { 
      id: 4, 
      subject: "Express Middleware", 
      description: "Deep dive into Express middleware, authentication, and advanced routing techniques.",
      level: "Advanced",
      duration: "4 weeks"
    }
  ];

  // ============ GEMINI API INTEGRATION ============
  
  // Replace this with your actual Gemini API key
  const GEMINI_API_KEY = "AIzaSyC5z_JPUfK9_TtGEV9U3bm50clK_pX1CdU";
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

  // Function to call Gemini API for quiz generation
  const callGeminiAPI = async (topic, questionCount = 15) => {
    try {
      const prompt = `Generate ${questionCount} multiple choice questions about ${topic}. 
      For each question, provide:
      1. The question text
      2. Four options (A, B, C, D)
      3. The correct answer (A, B, C, or D)
      
      Format the response as a JSON array where each object has:
      - "question": string
      - "options": array of 4 strings
      - "correctAnswer": number (0 for A, 1 for B, 2 for C, 3 for D)
      
      Make the questions diverse, covering different aspects of ${topic}. 
      Include questions about fundamentals, advanced concepts, practical applications, and historical context.
      
      Return ONLY the JSON array, no additional text.`;

      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response format from Gemini API');
      }

      const responseText = data.candidates[0].content.parts[0].text;
      
      // Extract JSON from the response (in case there's additional text)
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const questions = JSON.parse(jsonMatch[0]);
      
      // Validate the questions structure
      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error('Invalid questions format received');
      }

      return questions.map((q, index) => ({
        id: index + 1,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer
      }));

    } catch (error) {
      console.error('Gemini API Error:', error);
      // Fallback to simulated questions if API fails
      return generateFallbackQuestions(topic, questionCount);
    }
  };

  // Fallback function if Gemini API fails
  const generateFallbackQuestions = (topic, questionCount) => {
    const questionTypes = [
      `What is the primary purpose of ${topic}?`,
      `Which technology is most commonly associated with ${topic}?`,
      `What are the main benefits of using ${topic}?`,
      `Which concept is fundamental to understanding ${topic}?`,
      `What problem does ${topic} primarily solve?`,
      `Which programming language is often used with ${topic}?`,
      `What is a common misconception about ${topic}?`,
      `How does ${topic} improve system performance?`,
      `What are the security considerations for ${topic}?`,
      `Which company originally developed ${topic}?`,
      `What year was ${topic} first introduced?`,
      `What are the alternative technologies to ${topic}?`,
      `How does ${topic} handle data storage?`,
      `What is the learning curve like for ${topic}?`,
      `Which industry uses ${topic} the most?`,
      `What are the scalability limitations of ${topic}?`,
      `How does ${topic} compare to traditional methods?`,
      `What are the prerequisites for learning ${topic}?`,
      `Which certification is most valuable for ${topic}?`,
      `What is the future outlook for ${topic}?`
    ];

    const optionTemplates = [
      ["Improve efficiency", "Reduce costs", "Enhance security", "All of the above"],
      ["JavaScript", "Python", "Java", "C++"],
      ["Faster development", "Better performance", "Easier maintenance", "All of these"],
      ["Basic principles", "Advanced algorithms", "Complex mathematics", "Historical context"],
      ["Data management", "User interface", "Network security", "System optimization"],
      ["For small projects", "For enterprise applications", "For mobile development", "All scenarios"],
      ["It's easy to learn", "It's only for experts", "It's outdated", "It's too expensive"],
      ["Caching mechanisms", "Parallel processing", "Load balancing", "All of these"],
      ["Data encryption", "Access control", "Audit logging", "All security measures"],
      ["Google", "Microsoft", "Apple", "Open source community"]
    ];

    const questions = [];
    
    for (let i = 0; i < questionCount; i++) {
      const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
      const optionTemplate = optionTemplates[Math.floor(Math.random() * optionTemplates.length)];
      
      // Shuffle options to make them more varied
      const shuffledOptions = [...optionTemplate].sort(() => Math.random() - 0.5);
      
      questions.push({
        id: i + 1,
        question: questionType,
        options: shuffledOptions,
        correctAnswer: Math.floor(Math.random() * 4)
      });
    }

    return questions;
  };

  // AI Quiz Generation with REAL Gemini API
  const generateAIQuiz = async () => {
    if (!aiQuizData.topic.trim()) {
      alert("Please enter a topic for the quiz!");
      return;
    }

    setAiQuizData(prev => ({ ...prev, loading: true }));

    try {
      // Use REAL Gemini API
      const questions = await callGeminiAPI(aiQuizData.topic, 15);
      
      const quiz = {
        id: Date.now(),
        title: `${aiQuizData.topic} Quiz`,
        code: aiQuizData.code || `QUIZ${Date.now().toString().slice(-6)}`,
        topic: aiQuizData.topic,
        questions: questions,
        generatedAt: new Date().toISOString(),
        source: "Gemini AI"
      };
      
      setGeneratedQuiz(quiz);
      alert(`AI generated a quiz with ${quiz.questions.length} unique questions for ${aiQuizData.topic}!`);
      
    } catch (error) {
      console.error("Error generating quiz:", error);
      alert("Failed to generate quiz. Please try again.");
    } finally {
      setAiQuizData(prev => ({ ...prev, loading: false }));
    }
  };

  // Download Quiz as PDF
  const downloadQuizPDF = () => {
    if (!generatedQuiz) {
      alert("No quiz generated yet!");
      return;
    }

    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text(generatedQuiz.title, 105, 20, { align: 'center' });
    
    // Topic and Info
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Topic: ${generatedQuiz.topic}`, 20, 35);
    doc.text(`Code: ${generatedQuiz.code}`, 20, 45);
    doc.text(`Total Questions: ${generatedQuiz.questions.length}`, 20, 55);
    doc.text(`Generated: ${new Date(generatedQuiz.generatedAt).toLocaleDateString()}`, 20, 65);
    doc.text(`Source: ${generatedQuiz.source}`, 20, 75);
    
    // Questions
    let yPosition = 90;
    let pageNumber = 1;
    
    generatedQuiz.questions.forEach((q, index) => {
      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage();
        pageNumber++;
        yPosition = 20;
        
        // Add page header
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${pageNumber} - ${generatedQuiz.title}`, 105, 10, { align: 'center' });
        yPosition = 20;
      }
      
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(`${q.id}. ${q.question}`, 20, yPosition);
      yPosition += 10;
      
      // Options
      doc.setFontSize(12);
      doc.setTextColor(60, 60, 60);
      q.options.forEach((option, optIndex) => {
        const optionText = `${String.fromCharCode(65 + optIndex)}) ${option}`;
        // Handle long options by splitting text
        if (optionText.length > 80) {
          const lines = doc.splitTextToSize(optionText, 170);
          lines.forEach((line, lineIndex) => {
            doc.text(line, 25, yPosition + (lineIndex * 5));
          });
          yPosition += (lines.length * 5);
        } else {
          doc.text(optionText, 25, yPosition);
          yPosition += 6;
        }
      });
      
      yPosition += 8;
    });
    
    // Answer Key (separate page)
    doc.addPage();
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text("Answer Key", 105, 20, { align: 'center' });
    
    yPosition = 40;
    doc.setFontSize(12);
    
    generatedQuiz.questions.forEach((q, index) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      
      const correctAnswer = String.fromCharCode(65 + q.correctAnswer);
      doc.text(`${q.id}. Correct Answer: ${correctAnswer}`, 20, yPosition);
      yPosition += 10;
    });
    
    // Save the PDF
    doc.save(`${generatedQuiz.topic.replace(/\s+/g, '_')}_Quiz.pdf`);
  };

  // Modal handlers
  const openModal = (type, course = null, module = null) => {
    setModalType(type);
    setCurrentCourse(course);
    setCurrentModule(module);
    setShowModal(true);
    
    // Reset forms based on modal type
    if (type === "addCourse") {
      setCourseForm({
        subject: "", 
        code: "",
        description: "",
        instructor: "",
        duration: "",
        level: "Beginner"
      });
    } else if (type === "editCourse" && course) {
      setCourseForm({ ...course });
    } else if (type === "addModule") {
      setModuleForm({ title: "", duration: "" });
    } else if (type === "addTopic") {
      setTopicForm({ name: "" });
    } else if (type === "addQuiz") {
      setQuizForm({
        title: "",
        questions: [{
          question: "",
          options: ["", "", "", ""],
          correctAnswer: 0
        }]
      });
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType("");
    setCurrentCourse(null);
    setCurrentModule(null);
  };

  // Course management
  const handleAddCourse = () => {
    if (!courseForm.subject || !courseForm.code || !courseForm.description || !courseForm.instructor || !courseForm.duration) {
      alert("Please fill all required fields!");
      return;
    }

    const course = {
      id: Date.now(),
      ...courseForm,
      students: [],
      progress: 0,
      modules: []
    };

    setCourses([...courses, course]);
    closeModal();
    alert("Course added successfully!");
  };

  const handleUpdateCourse = () => {
    if (!courseForm.subject || !courseForm.code || !courseForm.description || !courseForm.instructor || !courseForm.duration) {
      alert("Please fill all required fields!");
      return;
    }

    setCourses(courses.map(course => 
      course.id === currentCourse.id ? { ...course, ...courseForm } : course
    ));
    closeModal();
    alert("Course updated successfully!");
  };

  const quickAddCourse = (course) => {
    const existingCourse = courses.find(c => c.code === course.code);
    if (existingCourse) {
      alert("This course is already added to your catalog!");
      return;
    }

    const newCourseToAdd = {
      ...course,
      id: Date.now(),
      students: [],
      progress: 0,
      modules: []
    };

    setCourses([...courses, newCourseToAdd]);
    alert(`${course.subject} has been added to your course catalog!`);
  };

  // Add AI Suggested Course
  const addAISuggestedCourse = (suggestion) => {
    const courseCode = `AI${Date.now().toString().slice(-4)}`;
    
    const newCourse = {
      id: Date.now(),
      subject: suggestion.subject,
      code: courseCode,
      description: suggestion.description,
      instructor: "AI Instructor",
      duration: suggestion.duration,
      level: suggestion.level,
      students: [],
      progress: 0,
      modules: []
    };

    setCourses([...courses, newCourse]);
    setActiveTab("courses"); // Redirect to courses tab
    alert(`${suggestion.subject} has been added to your course catalog!`);
  };

  const deleteCourse = (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      setCourses(courses.filter(course => course.id !== courseId));
      alert("Course deleted successfully!");
    }
  };

  // Module management
  const handleAddModule = () => {
    if (!moduleForm.title || !moduleForm.duration) {
      alert("Please fill all required fields!");
      return;
    }

    const newModule = {
      id: Date.now(),
      title: moduleForm.title,
      topics: [],
      duration: moduleForm.duration,
      quiz: null
    };

    const updatedCourses = courses.map(course => 
      course.id === currentCourse.id 
        ? { ...course, modules: [...course.modules, newModule] }
        : course
    );

    setCourses(updatedCourses);
    closeModal();
    alert("Module added successfully!");
  };

  // Topic management
  const handleAddTopic = () => {
    if (!topicForm.name) {
      alert("Please enter topic name!");
      return;
    }

    const updatedCourses = courses.map(course => {
      if (course.id === currentCourse.id) {
        const updatedModules = course.modules.map(module => {
          if (module.id === currentModule.id) {
            return { ...module, topics: [...module.topics, topicForm.name] };
          }
          return module;
        });
        return { ...course, modules: updatedModules };
      }
      return course;
    });

    setCourses(updatedCourses);
    closeModal();
    alert("Topic added successfully!");
  };

  // Quiz management
  const handleAddQuiz = () => {
    if (!quizForm.title || quizForm.questions.some(q => !q.question || q.options.some(opt => !opt))) {
      alert("Please fill all quiz fields!");
      return;
    }

    const updatedCourses = courses.map(course => {
      if (course.id === currentCourse.id) {
        const updatedModules = course.modules.map(module => {
          if (module.id === currentModule.id) {
            return { ...module, quiz: { ...quizForm, id: Date.now() } };
          }
          return module;
        });
        return { ...course, modules: updatedModules };
      }
      return course;
    });

    setCourses(updatedCourses);
    closeModal();
    alert("Quiz added successfully!");
  };

  const addQuizQuestion = () => {
    setQuizForm({
      ...quizForm,
      questions: [
        ...quizForm.questions,
        {
          question: "",
          options: ["", "", "", ""],
          correctAnswer: 0
        }
      ]
    });
  };

  const updateQuizQuestion = (index, field, value) => {
    const updatedQuestions = [...quizForm.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };
    setQuizForm({ ...quizForm, questions: updatedQuestions });
  };

  const updateQuizOption = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...quizForm.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuizForm({ ...quizForm, questions: updatedQuestions });
  };

  const deleteQuiz = (courseId, moduleId) => {
    const updatedCourses = courses.map(course => {
      if (course.id === courseId) {
        const updatedModules = course.modules.map(module => {
          if (module.id === moduleId) {
            return { ...module, quiz: null };
          }
          return module;
        });
        return { ...course, modules: updatedModules };
      }
      return course;
    });

    setCourses(updatedCourses);
    alert("Quiz deleted successfully!");
  };

  // User management
  const addUser = () => {
    const { name, email, password, role } = newUser;

    if (!name || !email || !password) {
      alert("Please fill all fields!");
      return;
    }

    if (users.some((u) => u.email === email)) {
      alert("User with this email already exists!");
      return;
    }

    const newUserObj = {
      id: Date.now(),
      name,
      email,
      password,
      role: role || "user",
      points: 0,
    };

    setUsers([...users, newUserObj]);
    setNewUser({
      name: "",
      email: "",
      password: "",
      role: "user"
    });
    alert(`${name} added successfully as ${role}!`);
  };

  const assignPoints = (studentName, points) => {
    if (!studentName || !points) {
      alert("Please enter student name and points!");
      return;
    }
    setUsers(users.map(u => 
      u.name === studentName ? { ...u, points: u.points + Number(points) } : u
    ));
    setAssignData({ ...assignData, student: "", points: "" });
  };

  // AI Tools functions
  const analyzeStudentMood = () => {
    const moods = ["😊 Positive", "😐 Neutral", "😟 Stressed", "😎 Motivated"];
    const randomMood = moods[Math.floor(Math.random() * moods.length)];
    alert(`AI Analysis Result: Most students seem ${randomMood}`);
  };

  const predictProgress = () => {
    const name = assignData.studentName?.trim();
    if (!name) {
      alert("Please enter a student name!");
      return;
    }

    const student = users.find(u => u.name.toLowerCase() === name.toLowerCase());
    if (!student) {
      alert("Student not found!");
      return;
    }

    const prediction = ["Excellent Growth 📊", "Stable Performance 📘", "Needs Improvement 🔧"];
    const randomPrediction = prediction[Math.floor(Math.random() * prediction.length)];
    alert(`AI Prediction for ${student.name}: ${randomPrediction}`);
    setAssignData({ ...assignData, studentName: "" });
  };

  const suggestCareerPath = () => {
    const studentList = users.filter(u => u.role === "user");
    if (studentList.length === 0) {
      alert("No students available!");
      return;
    }

    const careerDomains = [
      "Full Stack Developer 💻",
      "Data Scientist 📊",
      "Cybersecurity Analyst 🔐",
      "AI Engineer 🤖",
      "Cloud Architect ☁️",
      "UI/UX Designer 🎨"
    ];

    const randomStudent = studentList[Math.floor(Math.random() * studentList.length)];
    const randomCareer = careerDomains[Math.floor(Math.random() * careerDomains.length)];
    alert(`${randomStudent.name} seems suited for a career as a ${randomCareer}`);
  };

  const analyticsData = [
    { name: "Active Users", count: users.filter(u => u.role === "user").length },
    { name: "Total Courses", count: courses.length },
    { name: "Total Points", count: users.reduce((sum, u) => sum + u.points, 0) },
    { name: "Avg Progress", count: Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / courses.length) },
  ];

  return (
    <div className="modern-dashboard">
      {/* Navbar Component */}
      <Navbar auth={auth} onLogout={onLogout} />
      
      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            {/* Add/Edit Course Modal */}
            {(modalType === "addCourse" || modalType === "editCourse") && (
              <>
                <h3>{modalType === "addCourse" ? "📘 Add New Course" : "✏️ Edit Course"}</h3>
                <div className="modal-form">
                  <input
                    type="text"
                    placeholder="Course Subject *"
                    value={courseForm.subject}
                    onChange={(e) => setCourseForm({...courseForm, subject: e.target.value})}
                    className="form-input"
                  />
                  <input
                    type="text"
                    placeholder="Course Code *"
                    value={courseForm.code}
                    onChange={(e) => setCourseForm({...courseForm, code: e.target.value})}
                    className="form-input"
                  />
                  <input
                    type="text"
                    placeholder="Instructor Name *"
                    value={courseForm.instructor}
                    onChange={(e) => setCourseForm({...courseForm, instructor: e.target.value})}
                    className="form-input"
                  />
                  <input
                    type="text"
                    placeholder="Duration (e.g., 12 weeks) *"
                    value={courseForm.duration}
                    onChange={(e) => setCourseForm({...courseForm, duration: e.target.value})}
                    className="form-input"
                  />
                  <select
                    value={courseForm.level}
                    onChange={(e) => setCourseForm({...courseForm, level: e.target.value})}
                    className="form-select"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                  <textarea
                    placeholder="Course Description *"
                    value={courseForm.description}
                    onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
                    className="form-textarea"
                    rows="3"
                  />
                </div>
                <div className="modal-actions">
                  <button 
                    onClick={modalType === "addCourse" ? handleAddCourse : handleUpdateCourse} 
                    className="primary-btn"
                  >
                    {modalType === "addCourse" ? "Add Course" : "Update Course"}
                  </button>
                  <button onClick={closeModal} className="secondary-btn">
                    Cancel
                  </button>
                </div>
              </>
            )}

            {/* Add Module Modal */}
            {modalType === "addModule" && (
              <>
                <h3>📖 Add New Module to {currentCourse?.subject}</h3>
                <div className="modal-form">
                  <input
                    type="text"
                    placeholder="Module Title *"
                    value={moduleForm.title}
                    onChange={(e) => setModuleForm({...moduleForm, title: e.target.value})}
                    className="form-input"
                  />
                  <input
                    type="text"
                    placeholder="Duration (e.g., 2 weeks) *"
                    value={moduleForm.duration}
                    onChange={(e) => setModuleForm({...moduleForm, duration: e.target.value})}
                    className="form-input"
                  />
                </div>
                <div className="modal-actions">
                  <button onClick={handleAddModule} className="primary-btn">
                    Add Module
                  </button>
                  <button onClick={closeModal} className="secondary-btn">
                    Cancel
                  </button>
                </div>
              </>
            )}

            {/* Add Topic Modal */}
            {modalType === "addTopic" && (
              <>
                <h3>📚 Add Topic to {currentModule?.title}</h3>
                <div className="modal-form">
                  <input
                    type="text"
                    placeholder="Topic Name *"
                    value={topicForm.name}
                    onChange={(e) => setTopicForm({...topicForm, name: e.target.value})}
                    className="form-input"
                  />
                </div>
                <div className="modal-actions">
                  <button onClick={handleAddTopic} className="primary-btn">
                    Add Topic
                  </button>
                  <button onClick={closeModal} className="secondary-btn">
                    Cancel
                  </button>
                </div>
              </>
            )}

            {/* Add Quiz Modal */}
            {modalType === "addQuiz" && (
              <>
                <h3>🎯 Add Quiz to {currentModule?.title}</h3>
                <div className="modal-form">
                  <input
                    type="text"
                    placeholder="Quiz Title *"
                    value={quizForm.title}
                    onChange={(e) => setQuizForm({...quizForm, title: e.target.value})}
                    className="form-input"
                  />
                  
                  {quizForm.questions.map((question, qIndex) => (
                    <div key={qIndex} className="quiz-question">
                      <h4>Question {qIndex + 1}</h4>
                      <input
                        type="text"
                        placeholder="Enter question *"
                        value={question.question}
                        onChange={(e) => updateQuizQuestion(qIndex, "question", e.target.value)}
                        className="form-input"
                      />
                      
                      <div className="quiz-options">
                        {question.options.map((option, oIndex) => (
                          <div key={oIndex} className="option-input">
                            <input
                              type="radio"
                              name={`correct-${qIndex}`}
                              checked={question.correctAnswer === oIndex}
                              onChange={() => updateQuizQuestion(qIndex, "correctAnswer", oIndex)}
                            />
                            <input
                              type="text"
                              placeholder={`Option ${oIndex + 1} *`}
                              value={option}
                              onChange={(e) => updateQuizOption(qIndex, oIndex, e.target.value)}
                              className="form-input small"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  <button onClick={addQuizQuestion} className="secondary-btn">
                    + Add Another Question
                  </button>
                </div>
                <div className="modal-actions">
                  <button onClick={handleAddQuiz} className="primary-btn">
                    Add Quiz
                  </button>
                  <button onClick={closeModal} className="secondary-btn">
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <nav className="dashboard-nav">
        {["overview", "courses", "users", "analytics", "ai-tools"].map(tab => (
          <button
            key={tab}
            className={`nav-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
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
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <h3>{users.filter(u => u.role === "user").length}</h3>
                  <p>Active Students</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📚</div>
                <div className="stat-info">
                  <h3>{courses.length}</h3>
                  <p>Total Courses</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🏆</div>
                <div className="stat-info">
                  <h3>{users.reduce((sum, u) => sum + u.points, 0)}</h3>
                  <p>Total Points</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-info">
                  <h3>{Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / courses.length)}%</h3>
                  <p>Avg Progress</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="section">
              <h3>🚀 Quick Actions</h3>
              <div className="quick-actions">
                <button className="action-btn" onClick={() => setActiveTab('courses')}>
                  📚 Manage Courses
                </button>
                <button className="action-btn" onClick={() => setActiveTab('users')}>
                  👥 User Management
                </button>
                <button className="action-btn" onClick={() => setActiveTab('ai-tools')}>
                  🤖 AI Tools
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="section">
              <h3>📈 Recent Activity</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon">🎯</div>
                  <div className="activity-content">
                    <p><strong>Jane Smith</strong> earned 50 points</p>
                    <span className="activity-time">2 hours ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">📚</div>
                  <div className="activity-content">
                    <p>New course <strong>React Basics</strong> was added</p>
                    <span className="activity-time">5 hours ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">👤</div>
                  <div className="activity-content">
                    <p>New user <strong>John Doe</strong> registered</p>
                    <span className="activity-time">1 day ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === "courses" && (
          <div className="tab-content">
            {/* Course Management Header */}
            <div className="section">
              <div className="section-header">
                <h3>📚 Course Management</h3>
                <button 
                  onClick={() => openModal("addCourse")} 
                  className="primary-btn"
                >
                  + Add New Course
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
                {availableCourses.map(course => (
                  <div className="course-card available" key={course.id}>
                    <div className="course-header">
                      <h4>{course.subject}</h4>
                      <span className="course-code">{course.code}</span>
                    </div>
                    <div className="course-info">
                      <p><strong>Instructor:</strong> {course.instructor}</p>
                      <p><strong>Duration:</strong> {course.duration}</p>
                      <p><strong>Level:</strong> {course.level}</p>
                      <p className="course-description">{course.description}</p>
                    </div>
                    <button 
                      onClick={() => quickAddCourse(course)}
                      className="primary-btn"
                    >
                      Quick Add
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* My Courses */}
            <div className="section">
              <div className="section-header">
                <h3>📋 My Course Catalog</h3>
                <span className="courses-count">{courses.length} courses</span>
              </div>
              <div className="courses-grid">
                {courses.map(course => (
                  <div className="course-card" key={course.id}>
                    <div className="course-header">
                      <h4>{course.subject}</h4>
                      <span className="course-code">{course.code}</span>
                    </div>
                    <div className="course-info">
                      <p><strong>Instructor:</strong> {course.instructor}</p>
                      <p><strong>Duration:</strong> {course.duration}</p>
                      <p><strong>Level:</strong> {course.level}</p>
                    </div>
                    <div className="course-stats">
                      <div className="stat">
                        <span className="stat-label">Students</span>
                        <span className="stat-value">{course.students.length}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Modules</span>
                        <span className="stat-value">{course.modules.length}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Progress</span>
                        <span className="stat-value">{course.progress}%</span>
                      </div>
                    </div>
                    <div className="course-progress">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${course.progress}%` }}></div>
                      </div>
                    </div>

                    {/* Modules Section */}
                    <div className="modules-section">
                      <div className="section-header">
                        <h5>Modules</h5>
                        <button 
                          onClick={() => openModal("addModule", course)}
                          className="secondary-btn small"
                        >
                          + Add Module
                        </button>
                      </div>
                      {course.modules.length === 0 ? (
                        <p className="no-data">No modules added yet.</p>
                      ) : (
                        <div className="modules-list">
                          {course.modules.map(module => (
                            <div key={module.id} className="module-item">
                              <div className="module-header">
                                <h6>{module.title}</h6>
                                <span className="module-duration">{module.duration}</span>
                              </div>
                              <div className="module-content">
                                <div className="module-topics">
                                  <strong>Topics:</strong>
                                  {module.topics.length === 0 ? (
                                    <span className="no-data"> No topics</span>
                                  ) : (
                                    <ul>
                                      {module.topics.map((topic, index) => (
                                        <li key={index}>{topic}</li>
                                      ))}
                                    </ul>
                                  )}
                                  <button 
                                    onClick={() => openModal("addTopic", course, module)}
                                    className="secondary-btn small"
                                  >
                                    + Add Topic
                                  </button>
                                </div>
                                
                                <div className="module-quiz">
                                  <strong>Quiz:</strong>
                                  {module.quiz ? (
                                    <div className="quiz-info">
                                      <span>{module.quiz.title}</span>
                                      <span>{module.quiz.questions.length} questions</span>
                                      <div className="quiz-actions">
                                        <button className="secondary-btn small">View</button>
                                        <button 
                                          onClick={() => deleteQuiz(course.id, module.id)}
                                          className="danger-btn small"
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div>
                                      <span className="no-data">No quiz</span>
                                      <button 
                                        onClick={() => openModal("addQuiz", course, module)}
                                        className="primary-btn small"
                                      >
                                        + Add Quiz
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="course-actions">
                      <button 
                        onClick={() => openModal("editCourse", course)}
                        className="secondary-btn"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => deleteCourse(course.id)}
                        className="danger-btn"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="tab-content">
            {/* Add User */}
            <div className="section">
              <h3>👥 Add New User</h3>
              <div className="form-group">
                <div className="input-grid">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="form-input"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="form-input"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="form-input"
                  />
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="form-select"
                  >
                    <option value="user">Student</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button onClick={addUser} className="primary-btn">
                  Add User
                </button>
              </div>
            </div>

            {/* User Management */}
            <div className="section">
              <div className="section-header">
                <h3>👤 User Management</h3>
                <span className="users-count">{users.length} users</span>
              </div>
              <div className="users-grid">
                {users.map(user => (
                  <div className="user-card" key={user.id}>
                    <div className="user-header">
                      <div className="user-avatar">
                        {user.role === 'admin' ? '👨‍💼' : '👤'}
                      </div>
                      <div className="user-info">
                        <h4>{user.name}</h4>
                        <p>{user.email}</p>
                        <span className={`user-role ${user.role}`}>
                          {user.role}
                        </span>
                      </div>
                    </div>
                    <div className="user-stats">
                      <div className="stat">
                        <span className="stat-label">Points</span>
                        <span className="stat-value">{user.points}</span>
                      </div>
                    </div>
                    {user.role === "user" && (
                      <div className="user-actions">
                        <input
                          type="number"
                          placeholder="Add points"
                          value={assignData.student === user.name ? assignData.points : ""}
                          onChange={(e) =>
                            setAssignData({ student: user.name, points: e.target.value })
                          }
                          className="form-input small"
                        />
                        <button 
                          onClick={() => assignPoints(user.name, assignData.points)}
                          className="secondary-btn"
                        >
                          Add Points
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Leaderboard */}
            <div className="section">
              <h3>🏆 Leaderboard</h3>
              <div className="leaderboard">
                {users
                  .filter(u => u.role === "user")
                  .sort((a, b) => b.points - a.points)
                  .map((user, index) => (
                    <div key={user.id} className={`leaderboard-item ${index < 3 ? 'top-three' : ''}`}>
                      <div className="rank">#{index + 1}</div>
                      <div className="user-info">
                        <span className="user-avatar">👤</span>
                        <span className="user-name">{user.name}</span>
                      </div>
                      <div className="user-points">{user.points} pts</div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="tab-content">
            {/* Platform Analytics */}
            <div className="section">
              <h3>📊 Platform Analytics</h3>
              <div className="analytics-chart">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar 
                      dataKey="count" 
                      fill="#6366f1" 
                      radius={[4, 4, 0, 0]}
                      barSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Suggestions */}
            <div className="section">
              <h3>💡 AI Course Suggestions</h3>
              <div className="suggestions-grid">
                {aiSuggestions.map((suggestion, i) => (
                  <div className="suggestion-card" key={suggestion.id}>
                    <div className="suggestion-icon">💡</div>
                    <div className="suggestion-content">
                      <h4>{suggestion.subject}</h4>
                      <p>{suggestion.description}</p>
                      <div className="suggestion-meta">
                        <span className="level-badge">{suggestion.level}</span>
                        <span className="duration">{suggestion.duration}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => addAISuggestedCourse(suggestion)}
                      className="secondary-btn small"
                    >
                      Add to Catalog
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI Tools Tab */}
        {activeTab === "ai-tools" && (
          <div className="tab-content">
            {/* AI Quiz Generator */}
            <div className="section">
              <h3>🤖 AI Smart Quiz Generator</h3>
              <div className="form-group">
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Enter Topic (e.g., Machine Learning, React Hooks, Python Programming)"
                    value={aiQuizData.topic}
                    onChange={(e) => setAiQuizData(prev => ({ ...prev, topic: e.target.value }))}
                    className="form-input"
                  />
                  <input
                    type="text"
                    placeholder="Quiz Code (Optional)"
                    value={aiQuizData.code}
                    onChange={(e) => setAiQuizData(prev => ({ ...prev, code: e.target.value }))}
                    className="form-input"
                  />
                  <button 
                    onClick={generateAIQuiz} 
                    className="primary-btn"
                    disabled={aiQuizData.loading}
                  >
                    {aiQuizData.loading ? "🔄 Generating Unique Questions..." : "🧠 Generate Smart Quiz"}
                  </button>
                </div>
                <p className="help-text">
                  💡 Powered by Google Gemini AI - Generates 15 unique, diverse questions covering different aspects of your topic.
                </p>
              </div>

              {/* Generated Quiz Preview */}
              {generatedQuiz && (
                <div className="generated-quiz">
                  <div className="quiz-preview">
                    <h4>🎯 Generated Quiz: {generatedQuiz.title}</h4>
                    <div className="quiz-info">
                      <p><strong>Topic:</strong> {generatedQuiz.topic}</p>
                      <p><strong>Code:</strong> {generatedQuiz.code}</p>
                      <p><strong>Questions:</strong> {generatedQuiz.questions.length} unique questions</p>
                      <p><strong>Source:</strong> {generatedQuiz.source}</p>
                    </div>
                    <div className="quiz-actions">
                      <button onClick={downloadQuizPDF} className="primary-btn">
                        📄 Download PDF Quiz
                      </button>
                      <button 
                        onClick={() => setGeneratedQuiz(null)} 
                        className="secondary-btn"
                      >
                        🆕 Generate New Quiz
                      </button>
                    </div>
                    
                    {/* Quiz Questions Preview */}
                    <div className="questions-preview">
                      <h5>Questions Preview (First 3):</h5>
                      {generatedQuiz.questions.slice(0, 3).map((q, index) => (
                        <div key={q.id} className="question-preview">
                          <p><strong>Q{q.id}:</strong> {q.question}</p>
                          <div className="options-preview">
                            {q.options.map((option, optIndex) => (
                              <div key={optIndex} className="option">
                                <span className="option-letter">{String.fromCharCode(65 + optIndex)})</span>
                                <span className="option-text">{option}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                      {generatedQuiz.questions.length > 3 && (
                        <p className="more-questions">... and {generatedQuiz.questions.length - 3} more unique questions</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* AI Tools Grid */}
            <div className="tools-grid">
              <div className="tool-card">
                <div className="tool-icon">🧠</div>
                <div className="tool-content">
                  <h4>Student Mood Analyzer</h4>
                  <p>Analyze overall student sentiment and engagement levels</p>
                </div>
                <button onClick={analyzeStudentMood} className="primary-btn">
                  Analyze Mood
                </button>
              </div>

              <div className="tool-card">
                <div className="tool-icon">📈</div>
                <div className="tool-content">
                  <h4>Progress Predictor</h4>
                  <p>Predict future performance based on current activity</p>
                </div>
                <div className="tool-input">
                  <input
                    type="text"
                    placeholder="Enter Student Name"
                    value={assignData.studentName}
                    onChange={(e) => setAssignData({ ...assignData, studentName: e.target.value })}
                    className="form-input"
                  />
                  <button onClick={predictProgress} className="primary-btn">
                    Predict
                  </button>
                </div>
              </div>

              <div className="tool-card">
                <div className="tool-icon">🎯</div>
                <div className="tool-content">
                  <h4>Career Recommender</h4>
                  <p>Discover ideal career paths for students</p>
                </div>
                <button onClick={suggestCareerPath} className="primary-btn">
                  Suggest Career
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}