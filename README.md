StudiQ - AI-Powered Personalized Learning Platform
<div align="center">
  <img src="https://img.shields.io/badge/Python-3.8+-blue.svg" alt="Python Version">
  <img src="https://img.shields.io/badge/Flask-2.3.3-green.svg" alt="Flask Version">
  <img src="https://img.shields.io/badge/MongoDB-Atlas-green.svg" alt="MongoDB">
  <img src="https://img.shields.io/badge/AI-Google_Gemini-orange.svg" alt="AI Powered">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License">
  <img src="https://img.shields.io/badge/Team-5_Members-purple.svg" alt="Team Size">
</div>
<p>🎯 Overview</p>
StudiQ is an innovative AI-powered educational platform developed by our team that revolutionizes learning by adapting to individual learning styles. Using advanced machine learning and natural language processing, our platform provides personalized tutoring experiences that cater to visual, auditory, kinesthetic, and reading/writing learners.

<p>✨ Key Features</p>
<p>🤖 AI-Powered Personalization</p>

Adaptive Learning: Our AI analyzes learning patterns and adapts content delivery
Google Gemini Integration: Advanced conversational AI for intelligent tutoring
Multi-Modal Support: Text, audio, and visual learning experiences

👥 Multi-Role Support

Students: Personalized learning experience with adaptive content
Teachers: Comprehensive tools for creating quizzes, managing syllabi, and tracking student progress
Administrators: Complete user management and system oversight capabilities

📊 Smart Learning Analytics

Learning Style Assessment: Comprehensive quiz to determine optimal learning approach
Knowledge Graphs: Visual representation of key concepts using KeyBERT
Progress Tracking: Real-time analytics and performance insights
Interactive Quizzes: AI-generated assessments based on uploaded content

🎨 Adaptive Learning Modes

Visual Learning: Enhanced with diagrams, flowcharts, and visual organization
Auditory Learning: Text-to-speech with attractive audio players and auto-play
Kinesthetic Learning: Hands-on exercises and practical applications
Reading/Writing: Detailed explanations and comprehensive text-based content

📁 Document Processing

Multi-Format Support: PDF, TXT, DOCX, PPTX file processing
Content Analysis: Automatic extraction and analysis of educational material
Quiz Generation: AI creates relevant questions from uploaded documents

🛠️ Technology Stack
Backend

Flask: Lightweight Python web framework
MongoDB Atlas: Cloud-based NoSQL database
PyMongo: MongoDB integration for Python
Google Generative AI: Advanced language model integration
KeyBERT: Keyword extraction for knowledge graphs

Frontend

HTML5/CSS3: Modern responsive design
JavaScript (ES6+): Interactive user interface
Remix Icons: Beautiful iconography
Google Fonts: Typography (Poppins)

AI & ML Libraries

Google Gemini: Conversational AI and content generation
gTTS: Google Text-to-Speech for auditory learning
KeyBERT: Keyword extraction and concept mapping
Sentence Transformers: Advanced NLP processing

File Processing

PyPDF2: PDF text extraction
python-pptx: PowerPoint processing
Werkzeug: Secure file handling

🚀 Quick Start
Prerequisites

Python 3.8 or higher
MongoDB Atlas account
Google Gemini API key

Installation

Clone the repository
bashgit clone https://github.com/devvsin/studiq-ai-tutor.git
cd studiq-ai-tutor

Create virtual environment
bashpython -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

Install dependencies
bashpip install -r requirements.txt

Environment Setup
bash# Create .env file
cp .env.example .env

# Add your configuration
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
SECRET_KEY=your_secret_key

Run the application
bashpython app.py

Access the application
http://localhost:5000


📋 Environment Variables
Create a .env file with the following variables:
env# Database Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/studiq

# API Keys
GEMINI_API_KEY=your_google_gemini_api_key

# Security
SECRET_KEY=your_secure_secret_key

# Optional
FLASK_ENV=development
PORT=5000
🎮 Usage Guide
For Students

Sign up and complete our comprehensive learning style assessment
Upload documents (PDFs, presentations, notes)
Chat with our AI tutor for personalized explanations
Take adaptive quizzes to test your knowledge
View progress through interactive knowledge graphs

For Teachers

Access teacher dashboard after role selection
Create custom quizzes with multiple question types
Design syllabi and course structures
Monitor student submissions and progress
Use AI assistance for content creation

For Administrators

Manage user accounts and permissions
Monitor system usage and performance
Configure platform settings
Access comprehensive analytics

🏗️ Project Structure
studiq-ai-tutor/
├── app.py                      # Main Flask application
├── requirements.txt            # Python dependencies
├── Procfile                   # Deployment configuration
├── .env                       # Environment variables
├── static/                    # Static assets
│   ├── css/
│   │   └── style.css         # Main stylesheet
│   ├── js/
│   │   └── app.js            # Frontend JavaScript
│   └── audio/                # Generated audio files
├── templates/                 # HTML templates
│   ├── index.html            # Main application interface
│   ├── landland.html         # Landing page
│   ├── login2.html           # Authentication
│   ├── quiz2.html            # Learning assessment
│   ├── teacher_dashboard.html # Teacher interface
│   ├── admin_dashboard.html  # Admin interface
│   └── create_quiz.html      # Quiz creation
└── uploads/                  # User uploaded files
🔧 API Endpoints
Authentication

POST /signup - User registration
POST /login - User authentication
GET /logout - User logout

Core Features

POST /api/chat - AI chat interactions
POST /api/upload - File upload and processing
POST /api/generate_quiz - AI quiz generation
POST /api/knowledge_graph - Knowledge graph creation

User Management

GET /api/user-preferences - Get user learning preferences
POST /api/learning-style - Update learning style

Admin & Teacher

POST /create_quiz - Create custom quizzes
GET /admin - Admin dashboard
POST /admin/create_user - Create new users

🎨 Features in Detail
Learning Style Adaptation
Our platform automatically adapts its teaching approach based on individual learning styles:

Visual Learners: Diagrams, flowcharts, mind maps, and visual organization
Auditory Learners: Text-to-speech, audio explanations, and conversational tone
Kinesthetic Learners: Interactive exercises, step-by-step guides, and practical examples
Reading/Writing Learners: Detailed explanations, comprehensive notes, and text-based content

AI-Powered Features

Intelligent Tutoring: Contextual responses based on uploaded content
Adaptive Questioning: Difficulty adjusts based on student performance
Content Analysis: Automatic extraction of key concepts and topics
Personalized Feedback: Tailored suggestions for improvement

🏆 Development Process
Our team followed an agile development methodology with:

Sprint Planning: Weekly planning sessions for feature development
Code Reviews: Peer review process for all major features
Testing: Comprehensive testing across different learning scenarios
Documentation: Collaborative documentation and knowledge sharing

🚀 Deployment
Railway Deployment

Connect GitHub repository to Railway
Configure environment variables
Deploy automatically with git push

Manual Deployment
bash# Build and run with Gunicorn
gunicorn --bind 0.0.0.0:$PORT app:app
🤝 Contributing
We welcome contributions from the community! Please see our Contributing Guidelines for details.
Development Setup

Fork the repository
Create a feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request

📝 License
This project is licensed under the MIT License - see the LICENSE file for details.
🙏 Acknowledgments

Google Gemini for advanced AI capabilities
MongoDB Atlas for reliable cloud database
KeyBERT for intelligent keyword extraction
Flask Community for excellent web framework
Open Source Contributors for various libraries used
Our Team Members for their dedication and collaborative spirit

📞 Support & Contact

Issues: GitHub Issues
Discussions: GitHub Discussions
Team Lead: devvsin

🔄 Roadmap
Phase 1 (Completed) ✅

✅ Multi-role user system
✅ AI-powered personalization
✅ Learning style adaptation
✅ Document processing
✅ Knowledge graphs
✅ Teacher and admin dashboards

Phase 2 (In Progress) 🔄

🔄 Advanced analytics dashboard
🔄 Collaborative learning features
🔄 Integration with popular LMS platforms
🔄 Voice interaction capabilities

📊 Project Statistics

Development Time: 4 weeks
Lines of Code: 5,000+
Features Implemented: 15+ core features
Supported File Formats: 4 (PDF, DOCX, PPTX, TXT)
Learning Styles Supported: 4 (Visual, Auditory, Kinesthetic, Reading/Writing)

👥 Our Team
This project was collaboratively developed by a dedicated team of 5 members, combining expertise in AI/ML, full-stack development, UI/UX design, and educational technology to create a comprehensive learning solution.


<div align="center">
  <h3>👥 Our Amazing Team</h3>
  <p>Developed with ❤️</p>
  
  <p><strong>Team Lead:</strong> <a href="https://github.com/devvsin">Devvrat</a></p>
  <p><strong>Team Member:</strong> <a href="https://github.com/Devasurya05">Devasurya</a></p>
  <p><strong>Team Member:</strong> <a href="https://github.com/NAKSHATHRA305">Nakshathra</a></p>
  <p><strong>Team Member:</strong> <a href="https://github.com/neeha-praveen">Neeha</a></p>
  <p><strong>Team Member:</strong> <a href="https://github.com/Ninmisha">Ninmisha</a></p>
  
  <br/>
  
  <p>⭐ <strong>Star this repository if you find our work helpful!</strong> ⭐</p>
  <p><em>"Transforming education through AI-powered personalization"</em></p>
  
  <p><img src="https://img.shields.io/badge/Made%20with-❤️%20by%205%20amazing%20developers-red" alt="Made with Love"></p>
</div>
