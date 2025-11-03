// src/components/CourseDetail.js
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../CourseDetails.css";

export default function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Course data - in real app, this would come from API
  const coursesData = {
    1: {
      id: 1,
      subject: "Mathematics",
      code: "23CS104",
      description: "Learn fundamental mathematical concepts including algebra, calculus, and statistics.",
      instructor: "Dr. Sarah Johnson",
      duration: "12 weeks",
      level: "Beginner",
      modules: [
        {
          id: 1,
          title: "Algebra Basics",
          topics: [
            "Linear Equations",
            "Quadratic Equations",
            "Polynomials",
            "Functions and Graphs"
          ],
          duration: "2 weeks",
          quiz: {
            title: "Algebra Basics Quiz",
            questions: [
              {
                id: 1,
                question: "What is the solution for x in 2x + 5 = 13?",
                options: ["4", "5", "6", "7"],
                correct: 0
              },
              {
                id: 2,
                question: "Which of these is a quadratic equation?",
                options: [
                  "2x + 3 = 7",
                  "x² + 2x + 1 = 0",
                  "3x - 2y = 5",
                  "x³ + 2x = 0"
                ],
                correct: 1
              },
              {
                id: 3,
                question: "What is the degree of polynomial 3x³ + 2x² - 5?",
                options: ["1", "2", "3", "4"],
                correct: 2
              }
            ]
          }
        },
        {
          id: 2,
          title: "Calculus Fundamentals",
          topics: [
            "Limits and Continuity",
            "Derivatives",
            "Integration",
            "Applications of Calculus"
          ],
          duration: "3 weeks",
          quiz: {
            title: "Calculus Fundamentals Quiz",
            questions: [
              {
                id: 1,
                question: "What is the derivative of x²?",
                options: ["x", "2x", "2x²", "x³"],
                correct: 1
              },
              {
                id: 2,
                question: "What does ∫ represent in calculus?",
                options: [
                  "Derivative",
                  "Integral",
                  "Limit",
                  "Function"
                ],
                correct: 1
              }
            ]
          }
        },
        {
          id: 3,
          title: "Statistics and Probability",
          topics: [
            "Descriptive Statistics",
            "Probability Theory",
            "Statistical Inference",
            "Hypothesis Testing"
          ],
          duration: "2 weeks",
          quiz: {
            title: "Statistics Quiz",
            questions: [
              {
                id: 1,
                question: "What is the mean of [2, 4, 6, 8]?",
                options: ["4", "5", "6", "7"],
                correct: 1
              }
            ]
          }
        }
      ]
    },
    2: {
      id: 2,
      subject: "English Literature",
      code: "23CS105",
      description: "Explore classic and contemporary English literature from Shakespeare to modern authors.",
      instructor: "Prof. Michael Brown",
      duration: "10 weeks",
      level: "Intermediate",
      modules: [
        {
          id: 1,
          title: "Shakespearean Literature",
          topics: [
            "Hamlet Analysis",
            "Macbeth Themes",
            "Sonnet Structure",
            "Elizabethan Context"
          ],
          duration: "3 weeks",
          quiz: {
            title: "Shakespeare Quiz",
            questions: [
              {
                id: 1,
                question: "Who wrote 'Romeo and Juliet'?",
                options: [
                  "Charles Dickens",
                  "William Shakespeare",
                  "Jane Austen",
                  "Mark Twain"
                ],
                correct: 1
              }
            ]
          }
        }
      ]
    },
    3: {
      id: 3,
      subject: "React Basics",
      code: "23CS201",
      description: "Master the fundamentals of React including components, hooks, and state management.",
      instructor: "Emma Wilson",
      duration: "8 weeks",
      level: "Beginner",
      modules: [
        {
          id: 1,
          title: "React Components",
          topics: [
            "Functional Components",
            "Class Components",
            "Props and State",
            "Component Lifecycle"
          ],
          duration: "2 weeks",
          quiz: {
            title: "React Components Quiz",
            questions: [
              {
                id: 1,
                question: "What is used to pass data to a component?",
                options: ["State", "Props", "Variables", "Functions"],
                correct: 1
              },
              {
                id: 2,
                question: "Which hook is used for state management?",
                options: ["useEffect", "useState", "useContext", "useReducer"],
                correct: 1
              }
            ]
          }
        },
        {
          id: 2,
          title: "React Hooks",
          topics: [
            "useState Hook",
            "useEffect Hook",
            "Custom Hooks",
            "Hook Rules"
          ],
          duration: "2 weeks",
          quiz: {
            title: "React Hooks Quiz",
            questions: [
              {
                id: 1,
                question: "Can hooks be called inside loops?",
                options: ["Yes", "No", "Sometimes", "Only in functional components"],
                correct: 1
              }
            ]
          }
        }
      ]
    },
    4: {
      id: 4,
      subject: "Data Structures",
      code: "23CS301",
      description: "Learn essential data structures and algorithms for efficient programming.",
      instructor: "Dr. Raj Patel",
      duration: "14 weeks",
      level: "Intermediate",
      modules: [
        {
          id: 1,
          title: "Arrays and Linked Lists",
          topics: [
            "Array Operations",
            "Singly Linked Lists",
            "Doubly Linked Lists",
            "Time Complexity Analysis"
          ],
          duration: "3 weeks",
          quiz: {
            title: "Arrays and Linked Lists Quiz",
            questions: [
              {
                id: 1,
                question: "What is the time complexity of accessing an element in an array?",
                options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
                correct: 0
              }
            ]
          }
        }
      ]
    },
    5: {
      id: 5,
      subject: "Web Development",
      code: "23CS401",
      description: "Complete web development course covering HTML, CSS, JavaScript and modern frameworks.",
      instructor: "Lisa Chen",
      duration: "16 weeks",
      level: "Beginner",
      modules: [
        {
          id: 1,
          title: "HTML and CSS Fundamentals",
          topics: [
            "HTML5 Semantic Elements",
            "CSS Flexbox and Grid",
            "Responsive Design",
            "CSS Animations"
          ],
          duration: "3 weeks",
          quiz: {
            title: "HTML/CSS Quiz",
            questions: [
              {
                id: 1,
                question: "Which HTML tag is used for main content?",
                options: ["<main>", "<content>", "<body>", "<section>"],
                correct: 0
              }
            ]
          }
        }
      ]
    }
  };

  const course = coursesData[courseId];

  if (!course) {
    return (
      <div className="course-detail">
        <div className="error-state">
          <h2>Course Not Found</h2>
          <p>The course you're looking for doesn't exist.</p>
          <button onClick={() => navigate("/user")} className="primary-btn">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentModule = course.modules[activeModule];

  const handleQuizAnswer = (questionId, answerIndex) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const calculateQuizScore = () => {
    let correct = 0;
    currentModule.quiz.questions.forEach(question => {
      if (quizAnswers[question.id] === question.correct) {
        correct++;
      }
    });
    return {
      correct,
      total: currentModule.quiz.questions.length,
      percentage: Math.round((correct / currentModule.quiz.questions.length) * 100)
    };
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  return (
    <div className="course-detail">
      {/* Header */}
      <header className="course-header">
        <button onClick={() => navigate("/user")} className="back-btn">
          ← Back to Dashboard
        </button>
        <div className="course-title-section">
          <h1>{course.subject}</h1>
          <p className="course-code">{course.code}</p>
        </div>
      </header>

      {/* Course Overview */}
      <div className="course-overview">
        <div className="course-info-card">
          <h3>Course Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <strong>Instructor:</strong>
              <span>{course.instructor}</span>
            </div>
            <div className="info-item">
              <strong>Duration:</strong>
              <span>{course.duration}</span>
            </div>
            <div className="info-item">
              <strong>Level:</strong>
              <span>{course.level}</span>
            </div>
            <div className="info-item">
              <strong>Modules:</strong>
              <span>{course.modules.length}</span>
            </div>
          </div>
          <p className="course-description">{course.description}</p>
        </div>
      </div>

      <div className="course-content">
        {/* Modules Navigation */}
        <div className="modules-sidebar">
          <h3>Course Modules</h3>
          <div className="modules-list">
            {course.modules.map((module, index) => (
              <div
                key={module.id}
                className={`module-item ${activeModule === index ? 'active' : ''}`}
                onClick={() => {
                  setActiveModule(index);
                  setShowQuiz(false);
                  setQuizSubmitted(false);
                  setQuizAnswers({});
                }}
              >
                <div className="module-number">Module {index + 1}</div>
                <div className="module-title">{module.title}</div>
                <div className="module-duration">{module.duration}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Module Content */}
        <div className="module-content">
          {!showQuiz ? (
            <>
              <div className="module-header">
                <h2>{currentModule.title}</h2>
                <button 
                  onClick={() => setShowQuiz(true)}
                  className="quiz-btn"
                >
                  Take Quiz
                </button>
              </div>

              <div className="topics-section">
                <h3>Topics Covered</h3>
                <div className="topics-list">
                  {currentModule.topics.map((topic, index) => (
                    <div key={index} className="topic-item">
                      <span className="topic-icon">📚</span>
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="learning-materials">
                <h3>Learning Materials</h3>
                <div className="materials-grid">
                  <div className="material-card">
                    <div className="material-icon">📖</div>
                    <h4>Study Notes</h4>
                    <p>Detailed notes and explanations for all topics in this module.</p>
                    <button className="secondary-btn">View Notes</button>
                  </div>
                  <div className="material-card">
                    <div className="material-icon">🎬</div>
                    <h4>Video Lectures</h4>
                    <p>Recorded lectures and demonstrations by the instructor.</p>
                    <button className="secondary-btn">Watch Videos</button>
                  </div>
                  <div className="material-card">
                    <div className="material-icon">💻</div>
                    <h4>Practice Exercises</h4>
                    <p>Hands-on exercises to reinforce your learning.</p>
                    <button className="secondary-btn">Start Exercises</button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Quiz Section */
            <div className="quiz-section">
              <div className="quiz-header">
                <h2>{currentModule.quiz.title}</h2>
                <div className="quiz-info">
                  <span>{currentModule.quiz.questions.length} Questions</span>
                  {!quizSubmitted && (
                    <button onClick={handleQuizSubmit} className="primary-btn">
                      Submit Quiz
                    </button>
                  )}
                </div>
              </div>

              <div className="questions-list">
                {currentModule.quiz.questions.map((question, qIndex) => (
                  <div key={question.id} className="question-card">
                    <h4>Question {qIndex + 1}</h4>
                    <p>{question.question}</p>
                    <div className="options-list">
                      {question.options.map((option, oIndex) => (
                        <label key={oIndex} className="option-item">
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            checked={quizAnswers[question.id] === oIndex}
                            onChange={() => handleQuizAnswer(question.id, oIndex)}
                            disabled={quizSubmitted}
                          />
                          <span className={`option-text ${
                            quizSubmitted 
                              ? oIndex === question.correct 
                                ? 'correct' 
                                : quizAnswers[question.id] === oIndex 
                                  ? 'incorrect'
                                  : ''
                              : ''
                          }`}>
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                    {quizSubmitted && quizAnswers[question.id] === question.correct && (
                      <div className="feedback correct-feedback">
                        ✅ Correct! Well done.
                      </div>
                    )}
                    {quizSubmitted && quizAnswers[question.id] !== question.correct && (
                      <div className="feedback incorrect-feedback">
                        ❌ Incorrect. The correct answer is: {question.options[question.correct]}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {quizSubmitted && (
                <div className="quiz-results">
                  <h3>Quiz Results</h3>
                  <div className="score-card">
                    <div className="score-percentage">
                      {calculateQuizScore().percentage}%
                    </div>
                    <div className="score-details">
                      <p>You got {calculateQuizScore().correct} out of {calculateQuizScore().total} questions correct.</p>
                      {calculateQuizScore().percentage >= 70 ? (
                        <div className="success-message">🎉 Excellent! You passed this quiz!</div>
                      ) : (
                        <div className="retry-message">📚 Keep studying and try again!</div>
                      )}
                    </div>
                  </div>
                  <div className="quiz-actions">
                    <button onClick={resetQuiz} className="primary-btn">
                      Retry Quiz
                    </button>
                    <button 
                      onClick={() => setShowQuiz(false)}
                      className="secondary-btn"
                    >
                      Back to Module
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}