 # Task Management Project

This project is a task management application that helps individuals or teams organize their tasks and stay productive.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- Add, edit, and delete tasks
- Categorize tasks by project or priority
- Mark tasks as completed
- User authentication for personalized task management
- [Add any other features your project has]

## Getting Started

### Prerequisites

- Node.js and npm installed
- [Add any other prerequisites]

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Pavanmm1762/task-management.git
cd task-management

Task Management System Documentation
Backend Code
Golang Code
The backend of the Task Management System is implemented using the Go programming language. The source code is organized into well-structured packages and follows the standard Go project layout.

Directory Structure

cmd: Main applications of the system.
internal: Private application and library code.
pkg: Library code that's ok to use by external applications.
api: RESTful API implementations.
...
Documentation

Each package and major function is documented, providing details on usage and purpose.
Dependencies

A clear list of dependencies is provided in the documentation.
Build and Deployment

Instructions for building and deploying the backend are included.
Frontend Code
Source Code
The frontend of the Task Management System is built using React.js, Tailwind CSS, and other relevant technologies. The source code is organized following best practices.

Directory Structure

src: Main source code.
public: Static assets.
components: Reusable React components.
pages: Components representing entire pages.
...
Documentation

Each component and major function is documented.
Instructions for running the frontend locally.
Dependencies

A clear list of dependencies is provided in the documentation.
Build and Deployment

Instructions for building and deploying the frontend.
Database Schema
Cassandra Database Schema
The Task Management System uses Cassandra as its database. The schema is designed to efficiently store and retrieve project and task-related information.

Tables

projects: Stores information about projects.
tasks: Stores information about tasks related to projects.
Indexes: projects id, user id, admin_id and task_id are the necessary indexes for optimizing queries.
Design Choices
Below are the database structures for storing and quering

type LoginUser struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type RegisterUser struct {
	Admin_id gocql.UUID `json:"admin_id"`
	Username string     `json:"username"`
	Email    string     `json:"email"`
	Password string     `json:"password"`
}

type Project struct {
	ID          gocql.UUID `json:"id"`
	Name        string     `json:"name"`
	Description string     `json:"description"`
	StartDate   time.Time  `json:"start_date"`
	DueDate     time.Time  `json:"due_date"`
	Status      string     `json:"status"`
	OwnerID     gocql.UUID `json:"owner_id"`
}

type Task struct {
	ID          gocql.UUID `json:"task_id"`
	Title       string     `json:"task_name"`
	ProjectName string     `json:"project_name"`
	Description string     `json:"description"`
	Progress    int        `json:"progress"`
	Status      string     `json:"status"`
	ProjectID   gocql.UUID `json:"project_id"`
	// Add more fields as needed
}

type Users struct {
	UserId       gocql.UUID `json:"user_id"`
	FirstName    string     `json:"firstname"`
	LastName     string     `json:"lastname"`
	UserRole     string     `json:"role"`
	UserEmail    string     `json:"email"`
	UserPassword string     `json:"password"`
}

type Reports struct {
	ProjectName    string  `json:"project_name"`
	TotalTasks     int     `json:"total_tasks"`
	CompletedTasks int     `json:"completed_tasks"`
	Progress       float64 `json:"progress"`
	Status         string  `json:"status"`
}

type Dashboard struct {
	TotalProjects     int `json:"total_projects"`
	CompletedProjects int `json:"completed_projects"`
	TotalUsers        int `json:"total_users"`
}

type Comment struct {
	ID     gocql.UUID `json:"id"`
	Text   string     `json:"text"`
	UserID gocql.UUID `json:"user_id"`
	TaskID gocql.UUID `json:"task_id"`
	// Add more fields as needed
}

type Notification struct {
	ID      gocql.UUID `json:"id"`
	Message string     `json:"message"`
	UserID  gocql.UUID `json:"userId"`
	// Add more fields as needed
}


Explanation of the rationale behind the chosen schema design.
API Documentation
RESTful API Documentation
The Task Management System exposes RESTful APIs to interact with the backend. The documentation includes details about each endpoint, request and response formats, and usage instructions.

Endpoints

/api/projects: Manages projects.
/api/tasks: Manages tasks.
Request/Response Formats

Clear definition of data formats for requests and responses.

Usage Instructions
The full endppoints of access backend server are;
http://localhost:3000/auth/login - for authentication(we use jwt token for authentication)
http://localhost:3000/auth/register - for storing users
http://localhost:3000/api/projects - to handle projects
http://localhost:3000/api/tasks - to handle tasks
http://localhost:3000/api/users - to handle users

 
Testing Reports
Testing Processes and Findings
The testing processes involved in ensuring the reliability and functionality of the Task Management System are documented. This includes unit testing, integration testing, and  other relevant testing processes.

Test Coverage

We tested this with small dataset and we still improving this for efficient usage.
Findings

Documentation of any issues found during testing.

 Code Coverage Summary:

Definition:

Code coverage measures the proportion of code that has been executed by the test suite.
Metrics:

The percentage of lines of code covered.
The percentage of functions/methods covered.
The percentage of branches/decision points covered.
Testing Processes:

Unit Testing: Coverage analysis for individual units (functions, methods).
Integration Testing: Ensuring that integrated components work together as expected.
End-to-End Testing: Testing the entire system from start to finish.
Coverage Tools:

Usage of code coverage tools to collect data.
Examples include JaCoCo, Istanbul, or built-in tools in testing frameworks.
Findings:

Identification of areas with low coverage.
Addressing uncovered or undercovered code segments.
Improvements Made:

Documentation of enhancements made to increase code coverage.
 
Higher code coverage indicates a more thoroughly tested application.
Helps identify areas of the codebase that may need additional testing.
Contributes to overall software quality and reliability.
Conclusion:

The achieved code coverage percentage reflects the extent to which the Task Management System has been tested, ensuring a higher level of confidence in its functionality and reliability.
Remember, while high code coverage is desirable, it's equally important to have meaningful tests that cover critical paths and edge cases, ensuring robust and resilient software.