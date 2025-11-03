// src/components/Roadmap.js
import React, { useState } from "react";

export default function Roadmap() {
  const [topic, setTopic] = useState("");
  const [roadmap, setRoadmap] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const learningResources = {
    "computer networks": {
      basic: [
        {
          title: "Network Fundamentals & OSI Model",
          resources: [
            { name: "Computer Networks Basics - GeeksforGeeks", url: "https://www.geeksforgeeks.org/basics-computer-networking/" },
            { name: "OSI Model Explained - YouTube", url: "https://www.youtube.com/results?search_query=osi+model+explained" },
            { name: "Network Topologies Tutorial", url: "https://www.geeksforgeeks.org/types-of-network-topology/" }
          ]
        },
        {
          title: "TCP/IP Protocol Suite",
          resources: [
            { name: "TCP/IP Model Complete Guide", url: "https://www.geeksforgeeks.org/tcp-ip-model/" },
            { name: "TCP vs UDP Explained", url: "https://www.youtube.com/results?search_query=tcp+vs+udp+explained" },
            { name: "IP Addressing Tutorial", url: "https://www.geeksforgeeks.org/ip-addressing-introduction-and-classful-addressing/" }
          ]
        }
      ],
      intermediate: [
        {
          title: "Network Routing & Switching",
          resources: [
            { name: "Routing Algorithms Guide", url: "https://www.geeksforgeeks.org/classification-of-routing-algorithms/" },
            { name: "Switching Techniques", url: "https://www.geeksforgeeks.org/switching-techniques/" },
            { name: "Subnetting Practice", url: "https://www.youtube.com/results?search_query=subnetting+practice" }
          ]
        },
        {
          title: "Network Security Fundamentals",
          resources: [
            { name: "Network Security Basics", url: "https://www.geeksforgeeks.org/network-security/" },
            { name: "Firewalls and VPNs", url: "https://www.youtube.com/results?search_query=firewall+and+vpn+explained" },
            { name: "Cryptography Introduction", url: "https://www.geeksforgeeks.org/cryptography-introduction/" }
          ]
        }
      ],
      advanced: [
        {
          title: "Wireless Networks & Cloud Networking",
          resources: [
            { name: "Wireless Networking Guide", url: "https://www.geeksforgeeks.org/wireless-security/" },
            { name: "Cloud Networking Concepts", url: "https://www.youtube.com/results?search_query=cloud+networking+basics" },
            { name: "SDN and Network Virtualization", url: "https://www.geeksforgeeks.org/software-defined-networking-sdn/" }
          ]
        },
        {
          title: "Network Protocols Deep Dive",
          resources: [
            { name: "Advanced TCP/IP", url: "https://www.geeksforgeeks.org/tcp-and-udp-in-transport-layer/" },
            { name: "DNS, DHCP, HTTP Protocols", url: "https://www.youtube.com/results?search_query=dns+dhcp+http+protocols" },
            { name: "Network Troubleshooting", url: "https://www.geeksforgeeks.org/network-troubleshooting-commands/" }
          ]
        }
      ]
    },
    "react basics": {
      basic: [
        {
          title: "JavaScript ES6+ Fundamentals",
          resources: [
            { name: "Modern JavaScript Tutorial", url: "https://www.geeksforgeeks.org/javascript-tutorial/" },
            { name: "ES6 Features Guide", url: "https://www.youtube.com/results?search_query=es6+javascript+tutorial" },
            { name: "JavaScript Arrays & Objects", url: "https://www.geeksforgeeks.org/arrays-in-javascript/" }
          ]
        },
        {
          title: "React Components & JSX",
          resources: [
            { name: "React Official Tutorial", url: "https://reactjs.org/tutorial/tutorial.html" },
            { name: "JSX Complete Guide", url: "https://www.geeksforgeeks.org/jsx-full-form/" },
            { name: "Components & Props", url: "https://reactjs.org/docs/components-and-props.html" }
          ]
        }
      ],
      intermediate: [
        {
          title: "State & Props Management",
          resources: [
            { name: "React State Management", url: "https://reactjs.org/docs/state-and-lifecycle.html" },
            { name: "Props Deep Dive", url: "https://www.youtube.com/results?search_query=react+props+tutorial" },
            { name: "Event Handling Guide", url: "https://reactjs.org/docs/handling-events.html" }
          ]
        },
        {
          title: "React Hooks & Effects",
          resources: [
            { name: "React Hooks Guide", url: "https://reactjs.org/docs/hooks-intro.html" },
            { name: "useState & useEffect", url: "https://www.youtube.com/results?search_query=react+hooks+tutorial" },
            { name: "Custom Hooks", url: "https://reactjs.org/docs/hooks-custom.html" }
          ]
        }
      ],
      advanced: [
        {
          title: "Routing & Project Building",
          resources: [
            { name: "React Router Tutorial", url: "https://reactrouter.com/en/main/start/tutorial" },
            { name: "Project Structure Best Practices", url: "https://www.youtube.com/results?search_query=react+project+structure" },
            { name: "State Management Libraries", url: "https://www.geeksforgeeks.org/reactjs-redux/" }
          ]
        },
        {
          title: "Performance Optimization",
          resources: [
            { name: "React Performance Guide", url: "https://reactjs.org/docs/optimizing-performance.html" },
            { name: "Code Splitting", url: "https://www.youtube.com/results?search_query=react+performance+optimization" },
            { name: "Testing React Apps", url: "https://reactjs.org/docs/testing.html" }
          ]
        }
      ]
    },
    "machine learning": {
      basic: [
        {
          title: "Python & Data Analysis",
          resources: [
            { name: "Python for Data Science", url: "https://www.geeksforgeeks.org/python-programming-language/" },
            { name: "Pandas Tutorial", url: "https://www.youtube.com/results?search_query=pandas+python+tutorial" },
            { name: "NumPy Guide", url: "https://www.geeksforgeeks.org/numpy-tutorial/" }
          ]
        },
        {
          title: "Statistics & Probability",
          resources: [
            { name: "Statistics for ML", url: "https://www.geeksforgeeks.org/statistics-for-machine-learning/" },
            { name: "Probability Basics", url: "https://www.youtube.com/results?search_query=probability+for+machine+learning" },
            { name: "Linear Algebra", url: "https://www.geeksforgeeks.org/linear-algebra/" }
          ]
        }
      ],
      intermediate: [
        {
          title: "Supervised Learning Algorithms",
          resources: [
            { name: "Linear Regression Guide", url: "https://www.geeksforgeeks.org/ml-linear-regression/" },
            { name: "Classification Algorithms", url: "https://www.youtube.com/results?search_query=classification+algorithms+machine+learning" },
            { name: "Decision Trees & Random Forest", url: "https://www.geeksforgeeks.org/random-forest-algorithm-in-machine-learning/" }
          ]
        },
        {
          title: "Unsupervised Learning",
          resources: [
            { name: "Clustering Algorithms", url: "https://www.geeksforgeeks.org/clustering-in-machine-learning/" },
            { name: "K-Means Tutorial", url: "https://www.youtube.com/results?search_query=k+means+clustering+tutorial" },
            { name: "Dimensionality Reduction", url: "https://www.geeksforgeeks.org/dimensionality-reduction/" }
          ]
        }
      ],
      advanced: [
        {
          title: "Neural Networks & Deep Learning",
          resources: [
            { name: "Neural Networks Guide", url: "https://www.geeksforgeeks.org/neural-networks-a-beginners-guide/" },
            { name: "TensorFlow/PyTorch Tutorials", url: "https://www.youtube.com/results?search_query=tensorflow+tutorial" },
            { name: "CNN & RNN Architectures", url: "https://www.geeksforgeeks.org/cnn-convolutional-neural-networks/" }
          ]
        },
        {
          title: "Real-world Projects & Deployment",
          resources: [
            { name: "ML Project Deployment", url: "https://www.geeksforgeeks.org/deploying-ml-models-as-apis-using-fastapi/" },
            { name: "Model Evaluation Techniques", url: "https://www.youtube.com/results?search_query=machine+learning+model+evaluation" },
            { name: "MLOps Basics", url: "https://www.geeksforgeeks.org/mlops-machine-learning-operations/" }
          ]
        }
      ]
    }
  };

  const generateRoadmap = async () => {
    if (!topic.trim()) {
      alert("Please enter a topic!");
      return;
    }

    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const topicKey = topic.toLowerCase();
    const topicData = learningResources[topicKey];

    if (!topicData) {
      // Generate generic roadmap for unknown topics
      setRoadmap({
        topic: topic,
        levels: {
          basic: [
            {
              title: `Introduction to ${topic}`,
              resources: [
                { name: `${topic} Fundamentals - GeeksforGeeks`, url: `https://www.geeksforgeeks.org/?s=${topic}` },
                { name: `${topic} Basics - YouTube`, url: `https://www.youtube.com/results?search_query=${topic}+basics` },
                { name: `${topic} Documentation`, url: `https://www.google.com/search?q=${topic}+documentation` }
              ]
            },
            {
              title: `Core Concepts of ${topic}`,
              resources: [
                { name: `${topic} Core Concepts Tutorial`, url: `https://www.geeksforgeeks.org/?s=${topic}+concepts` },
                { name: `${topic} Practice Problems`, url: `https://www.youtube.com/results?search_query=${topic}+practice` },
                { name: `${topic} GitHub Repositories`, url: `https://github.com/search?q=${topic}` }
              ]
            }
          ],
          intermediate: [
            {
              title: `Advanced ${topic} Techniques`,
              resources: [
                { name: `${topic} Advanced Topics`, url: `https://www.geeksforgeeks.org/?s=advanced+${topic}` },
                { name: `${topic} Projects Tutorial`, url: `https://www.youtube.com/results?search_query=${topic}+projects` },
                { name: `${topic} Best Practices`, url: `https://www.google.com/search?q=${topic}+best+practices` }
              ]
            },
            {
              title: `${topic} Implementation`,
              resources: [
                { name: `${topic} Real-world Examples`, url: `https://www.geeksforgeeks.org/?s=${topic}+examples` },
                { name: `${topic} Case Studies`, url: `https://www.youtube.com/results?search_query=${topic}+case+studies` },
                { name: `${topic} Community Resources`, url: `https://stackoverflow.com/questions/tagged/${topic}` }
              ]
            }
          ],
          advanced: [
            {
              title: `Mastering ${topic}`,
              resources: [
                { name: `${topic} Expert Guide`, url: `https://www.geeksforgeeks.org/?s=expert+${topic}` },
                { name: `${topic} Advanced Concepts`, url: `https://www.youtube.com/results?search_query=advanced+${topic}` },
                { name: `${topic} Research Papers`, url: `https://scholar.google.com/scholar?q=${topic}` }
              ]
            },
            {
              title: `${topic} in Production`,
              resources: [
                { name: `${topic} Deployment Guide`, url: `https://www.geeksforgeeks.org/?s=${topic}+deployment` },
                { name: `${topic} Performance Optimization`, url: `https://www.youtube.com/results?search_query=${topic}+performance` },
                { name: `${topic} Industry Applications`, url: `https://www.google.com/search?q=${topic}+industry+applications` }
              ]
            }
          ]
        }
      });
    } else {
      setRoadmap({
        topic: topic,
        levels: topicData
      });
    }

    setIsLoading(false);
  };

  const openResource = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="roadmap-section">
      <div className="roadmap-header">
        <h3>📚 AI-Powered Study Roadmap</h3>
        <p>Get a structured learning path with curated resources for any topic</p>
      </div>

      <div className="roadmap-input-group">
        <input
          type="text"
          placeholder="Enter topic (e.g., computer networks, react basics, machine learning)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="form-input"
          onKeyPress={(e) => e.key === 'Enter' && generateRoadmap()}
        />
        <button 
          onClick={generateRoadmap} 
          className="primary-btn"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="spinner"></div>
              Generating...
            </>
          ) : (
            'Generate Roadmap'
          )}
        </button>
      </div>

      {roadmap && (
        <div className="roadmap-container">
          <div className="roadmap-topic-header">
            <h4>🎯 Learning Path for: {roadmap.topic}</h4>
            <p className="roadmap-subtitle">Structured from Basic to Advanced levels</p>
          </div>

          <div className="learning-levels">
            {/* Beginner Level */}
            <div className="level-section">
              <div className="level-header beginner">
                <span className="level-icon">🟢</span>
                <h5>Beginner Level (Weeks 1-4)</h5>
                <span className="level-badge">Foundation</span>
              </div>
              <div className="level-content">
                {roadmap.levels.basic.map((module, index) => (
                  <div key={index} className="learning-module">
                    <div className="module-header">
                      <span className="module-number">{index + 1}</span>
                      <h6>{module.title}</h6>
                    </div>
                    <div className="module-resources">
                      <p className="resources-label">Learning Resources:</p>
                      <div className="resource-links">
                        {module.resources.map((resource, resIndex) => (
                          <button
                            key={resIndex}
                            className="resource-link"
                            onClick={() => openResource(resource.url)}
                          >
                            <span className="link-icon">🔗</span>
                            {resource.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Intermediate Level */}
            <div className="level-section">
              <div className="level-header intermediate">
                <span className="level-icon">🟡</span>
                <h5>Intermediate Level (Weeks 5-8)</h5>
                <span className="level-badge">Building Skills</span>
              </div>
              <div className="level-content">
                {roadmap.levels.intermediate.map((module, index) => (
                  <div key={index} className="learning-module">
                    <div className="module-header">
                      <span className="module-number">{index + 1}</span>
                      <h6>{module.title}</h6>
                    </div>
                    <div className="module-resources">
                      <p className="resources-label">Learning Resources:</p>
                      <div className="resource-links">
                        {module.resources.map((resource, resIndex) => (
                          <button
                            key={resIndex}
                            className="resource-link"
                            onClick={() => openResource(resource.url)}
                          >
                            <span className="link-icon">🔗</span>
                            {resource.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Advanced Level */}
            <div className="level-section">
              <div className="level-header advanced">
                <span className="level-icon">🔴</span>
                <h5>Advanced Level (Weeks 9-12)</h5>
                <span className="level-badge">Mastery</span>
              </div>
              <div className="level-content">
                {roadmap.levels.advanced.map((module, index) => (
                  <div key={index} className="learning-module">
                    <div className="module-header">
                      <span className="module-number">{index + 1}</span>
                      <h6>{module.title}</h6>
                    </div>
                    <div className="module-resources">
                      <p className="resources-label">Learning Resources:</p>
                      <div className="resource-links">
                        {module.resources.map((resource, resIndex) => (
                          <button
                            key={resIndex}
                            className="resource-link"
                            onClick={() => openResource(resource.url)}
                          >
                            <span className="link-icon">🔗</span>
                            {resource.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="roadmap-footer">
            <div className="study-tips">
              <h6>💡 Study Tips:</h6>
              <ul>
                <li>Spend 1-2 hours daily on each module</li>
                <li>Practice with hands-on projects</li>
                <li>Join online communities for support</li>
                <li>Review and revise weekly</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Popular Topics */}
      <div className="popular-topics">
        <h5>🚀 Popular Learning Paths:</h5>
        <div className="topic-buttons">
          {Object.keys(learningResources).map(topic => (
            <button
              key={topic}
              className="topic-btn"
              onClick={() => {
                setTopic(topic);
                setTimeout(() => generateRoadmap(), 100);
              }}
            >
              {topic.charAt(0).toUpperCase() + topic.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}