
Tredence Analytics
Job Description: Full Stack Engineering Intern (AI Agentic Platforms)
Location: Bengaluru Duration: 6 months to 1 year (extendable / convertible), PPO will be given based on performance.
Stipend : 30k per month/-
About Tredence Studio
At Tredence Studio, we are not just following trends; we are building the future of AI. We are developing State-of-the-Art (SOTA) capabilities in AI Agentic Engineering to build a paradigm-shifting platform from the ground up. We are looking for an elite Full Stack Engineering Intern who is ready to move beyond coursework and solve complex, real-world problems. This is a zero-to-one role, and you will be a core contributor to a product built to challenge industry leaders.
The Opportunity
This is not a typical internship. You will not be on the sidelines. You will be in the trenches with a team of expert engineers, tackling difficult architectural and product challenges. You will gain deep, hands-on mastery of the entire development lifecycle, from architecting scalable frontend components in React and TypeScript to engineering high-performance Python backends, and deploying them on a robust Kubernetes infrastructure. We are seeking a candidate with a relentless drive to learn and a passion for building truly exceptional software.
Core Responsibilities
 Architect and Develop: Design, build, and scale critical application features across the full stack using React, Next.js, TypeScript, Node.js, and Python (FastAPI).
 Master Clean Architecture: Go beyond basic coding to implement and uphold elite standards of software design, including strong typing, modular design, and creating highly maintainable and performant code.
 Engineer Advanced UIs: Build highly responsive, reusable, and scalable UI components that are pixel-perfect representations of our design systems.
 Build Robust Backends: Design and implement complex backend APIs, sophisticated data models, and high-throughput integration workflows. You will work extensively with SQL (PostgreSQL) and NoSQL (Firestore) databases.
Tredence Analytics
 Implement Real-Time Systems: Engineer and optimize real-time features using WebSockets and Server-Sent Events (SSE) to deliver instantaneous data to users.
 Secure and Deploy: Integrate and manage secure authentication and authorization flows (OAuth/OIDC/JWT) with Azure. You will gain hands-on experience deploying and managing services in a cloud-native environment (Kubernetes).
 Own Code Quality: Drive code quality by writing comprehensive unit tests (Jest/RTL) and E2E tests (Cypress/Playwright), ensuring the reliability of our platform.
 Solve Hard Problems: Apply your deep understanding of Data Structures, Algorithms, and architectural patterns to solve complex performance and scalability challenges.
Required Skills & Qualifications
 Pursuing or recently completed a B.S., M.S., or Ph.D. in Computer Science or a related quantitative field.
 Demonstrable, high-level proficiency in React, TypeScript, and Python, showcased through a strong portfolio of projects (e.g., a detailed GitHub profile).
 Deep understanding of CS fundamentals, including Data Structures, Algorithms, operating systems, and computer networks.
 Strong foundation in modern web technologies, including HTML, CSS (Tailwind), and responsive design principles.
 A provable passion for building products from the ground up and a "zero-to-one" mindset.
 Excellent problem-solving abilities, with a talent for structured, analytical debugging.
Preferred (Bonus) Qualifications
 Experience contributing to open-source projects.
 Hands-on experience with Kubernetes, Docker, and building/managing CI/CD pipelines (e.g., GitHub Actions, Jenkins).
 Familiarity with advanced architectural patterns like monorepos (Nx/Turborepo) or micro-frontends.
 Knowledge of advanced optimization techniques, including Server-Side Rendering (SSR)/Static Site Generation (SSG) and scalable API design.
 Exposure to building and maintaining design systems with tools like Storybook.
 Experience with cloud monitoring, logging, and alerting tools.
Tredence Analytics
Case Study – Full stack Engineering Intern
Build Prototype: HR Workflow Designer Module (React + React Flow)
Objective
Design and implement a mini–HR Workflow Designer module where an HR admin can visually create and test internal workflows such as onboarding, leave approval, or document verification.
You will build a functional prototype that demonstrates:

 Deep knowledge of React and React Flow

 Ability to architect modular, scalable front-end systems

 Ability to integrate mock APIs

 Ability to build configurable nodes with custom edit forms

 Ability to simulate/test designed workflows in a small sandbox
This exercise is time-boxed to 4–6 hours. Focus on architectural clarity and working functionality, not pixel-perfect UI.
Deliverables
A GitHub repository (or zipped project) that includes:
1. React application (Vite or Next.js preferred)
2. React Flow canvas with multiple custom nodes
3. Node configuration/editing forms for each node type
4. Mock API integration
5. Workflow Test/Sandbox panel
6. README explaining architecture, design choices, and assumptions
No authentication or backend persistence is required.
Functional Requirements
1. Workflow Canvas (React Flow)
Implement a drag-and-drop workflow canvas with:
Node Types

 Start Node – workflow entry point

 Task Node – human task (e.g., collect documents)

 Approval Node – manager or HR approval step
Tredence Analytics

 Automated Step Node – system-triggered actions (e.g., send email, generate PDF)

 End Node – workflow completion
Supported Canvas Actions

 Drag nodes from a sidebar onto the canvas

 Connect nodes with edges

 Select a node to edit it

 Delete nodes/edges

 Auto-validate basic constraints (e.g., Start Node must be first)
2. Node Editing / Configuration Forms (Key Requirement)
Each node type must have an editable “Node Form Panel” that appears when the node is selected.
Minimum Required Fields
Start Node

 Start title

 Optional metadata key-value pairs
Task Node

 Title (required)

 Description

 Assignee (string input)

 Due date (text input or simple date field)

 Optional custom fields (key-value)
Approval Node

 Title

 Approver role (e.g., “Manager”, “HRBP”, “Director”)

 Auto-approve threshold (number)
Automated Step Node

 Title

 Choose an action from a mock API list

 Action parameters (dynamic based on mock action definition)
End Node

 End message
Tredence Analytics

 Summary flag (boolean toggle)
Evaluation: dynamic forms, controlled components, clean state handling, type safety, modularity.
3. Mock API Layer
Create a lightweight API layer using JSON server, MSW, or local mocks.
Must support:

 GET /automations Returns mock automated actions such as:

 [

 { "id": "send_email", "label": "Send Email", "params": ["to", "subject"] },

 { "id": "generate_doc", "label": "Generate Document", "params": ["template", "recipient"] }

 ]

 POST /simulate Accepts workflow JSON and returns a mock step-by-step execution result.
4. Workflow Testing / Sandbox Panel
A small panel or modal that:

 Serializes the entire workflow graph

 Sends it to the mock /simulate API

 Displays a step-by-step execution log (basic text or timeline UI)

 Validates structure (e.g., missing connections, cycles)
This tests the candidate’s reasoning around state, graph structures, and API workflows.
5. Architecture Expectations
We will evaluate:

 A clean folder structure

 Separation of canvas logic, node logic, and API logic

 Reusable custom hooks

 Ability to design abstractions that scale

 Thoughtful component decomposition

 Form structure that can be extended to new node types
Tredence Analytics

 Clarity of interfaces/types for workflow nodes
Optional (Bonus, Not Required)
If time permits:

 Export/Import workflow as JSON

 Node templates

 Undo/Redo

 Mini-map or zoom controls

 Workflow validation errors visually shown on nodes

 Auto-layout

 Node version history
Assessment Criteria
Area
What We Look For
React Flow proficiency
Custom nodes, positioning, edge management
React architecture
Hooks, context, components, folder structure
Complex form handling
Node forms, dynamic fields, validation
Mock API interaction
Data layer, async patterns, abstraction
Scalability
Is the solution extensible?
Communication
README, assumptions, design notes
Delivery speed
Can a senior engineer ship value fast?
What the Candidate Submits

 GitHub repo or zipped project

 README explaining:
o Architecture
o How to run
o Design decisions
o What they completed vs. what they would add with more time
Tredence Analytics
UI Reference :
Reference 1

 Use this as a broad reference for the UI, Theme and the Canvas. This is not the design spec

 Your solution need not implement all the Specs implemented in this UI and this is only to be used as design reference.

 Improvements and innovations on this design reference is encouraged and incentivized
Tredence Analytics
Reference 2
Instructions :
Dear Student,
Tredence Studio’s AI Agents Engineering team is inviting applications for the AI Engineering Internship – 2025 Cohort. This internship offers a rare opportunity to work on frontier engineering and research in the fast-growing domain of AI Agent Engineering.
If you are genuinely passionate about building the next generation of intelligent systems, this is for you.
We’re opening a Frontend Internship Project for students who genuinely enjoy building web apps and APIs and have spent a few years building things in React/TypeScript on their own — college projects, freelance work, side apps, anything real.
This is a practical, hands-on internship. You’ll get to build real UI modules for our AI products and work closely with senior engineers.
Tredence Analytics
Who this is for :

 Students who have been coding frontend apps for 3–5 years

 People who can take a small requirement and turn it into a working UI

 Students who like debugging, polishing components, and writing clean code

 Basic understanding of APIs, SQL etc.

 Strong DSA and Problem solving skills
Bonus (Not mandatory) :

 Experience in writing REST APIs in Python, NodeJs

 Experience in Rust
Nice to have: Tailwind, Zustand/Redux, Vite, and some UI/UX sense.
To Apply, Reply with:
1. GitHub link to your project
2. Any other apps or repos you’ve built
3. A short note on one tricky frontend bug you solved
4. Your resume or LinkedIn
We’re looking for students who have genuinely spent time building things and want to work on real features. If that’s you, would love to see your submission.
Note : Kindly submit your GitHub URLs without fail
If you believe you have the depth, passion, and discipline to work on cutting-edge AI Agent systems, we’d love to see your application.
Best regards, Tredence Studio — AI Agents Engineering Team