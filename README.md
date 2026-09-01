# 📚 Book Store Microservices

A production-ready **Book Store Microservices** application built using **React, Next.js API Gateway, FastAPI, MongoDB, Docker, and Kubernetes**. This project demonstrates modern cloud-native application development using microservices architecture, containerization, orchestration, and scalable deployment practices.

---

## 🚀 Project Overview

This project is designed to simulate a real-world online bookstore where users can browse books, manage their accounts, and administrators can manage books and categories.

Instead of using a single backend, the application is divided into independent microservices that communicate through an API Gateway, making the system scalable, maintainable, and production-ready.

---

## 🏗️ Architecture

```text
                        Users
                           │
                           ▼
                  React Frontend (Vite)
                           │
                           ▼
                 API Gateway (Next.js)
                           │
         ┌─────────────────┴─────────────────┐
         │                                   │
         ▼                                   ▼
  User Service (FastAPI)          Book Service (FastAPI)
         │                                   │
         └─────────────────┬─────────────────┘
                           ▼
                        MongoDB
```

---

## ✨ Features

### 👤 User Features

* User Registration
* Secure Login
* JWT Authentication
* User Profile
* Book Search
* Browse Categories
* View Book Details

### 🛠️ Admin Features

* Admin Login
* Add Books
* Update Books
* Delete Books
* Manage Categories
* Manage Users

---

## 🧱 Tech Stack

| Layer            | Technology                       |
| ---------------- | -------------------------------- |
| Frontend         | React + Vite                     |
| API Gateway      | Next.js                          |
| Backend          | FastAPI                          |
| Database         | MongoDB                          |
| Authentication   | JWT                              |
| Containerization | Docker                           |
| Orchestration    | Kubernetes                       |
| Reverse Proxy    | NGINX Ingress                    |
| Monitoring       | Prometheus + Grafana *(Planned)* |
| CI/CD            | GitHub Actions *(Planned)*       |

---

## 📁 Project Structure

```text
bookstore-microservices/
│
├── frontend/
├── gateway/
├── services/
│   ├── user-service/
│   ├── book-service/
│   ├── order-service/
│   ├── admin-service/
│   └── notification-service/
│
├── kubernetes/
│   ├── namespace/
│   ├── mongodb/
│   ├── redis/
│   ├── frontend/
│   ├── gateway/
│   ├── user-service/
│   ├── book-service/
│   ├── ingress/
│   └── monitoring/
│
├── docker/
├── docs/
├── scripts/
├── .github/
│   └── workflows/
│
├── docker-compose.yml
├── README.md
└── LICENSE
```

---

## 🎯 Learning Objectives

This project is built to provide practical experience with:

* Microservices Architecture
* REST API Development
* API Gateway Pattern
* JWT Authentication
* Docker Containerization
* Kubernetes Deployments
* Kubernetes Services
* ConfigMaps & Secrets
* Ingress Controller
* Horizontal Pod Autoscaling
* CI/CD Pipelines
* Cloud-Native Development

---

## 🗺️ Development Roadmap

* [ ] Project Setup
* [ ] User Service
* [ ] Book Service
* [ ] React Frontend
* [ ] API Gateway
* [ ] Docker
* [ ] Docker Compose
* [ ] Kubernetes Deployment
* [ ] ConfigMaps & Secrets
* [ ] Ingress Controller
* [ ] Horizontal Pod Autoscaler
* [ ] Monitoring (Prometheus & Grafana)
* [ ] Logging
* [ ] GitHub Actions CI/CD

---

## 🔮 Planned Enhancements

* Order Service
* Shopping Cart
* Payment Integration
* Notification Service
* Inventory Management
* AI Book Recommendation
* Elasticsearch Integration
* Redis Caching
* Rate Limiting
* Role-Based Access Control (RBAC)

---

## 📖 Purpose

The primary goal of this project is to learn and demonstrate production-grade software engineering practices, including clean architecture, microservices, Docker, Kubernetes, and cloud-native application deployment.

---

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome. Feel free to fork the repository, create a feature branch, and submit a pull request.

---

## 📄 License

This project is licensed under the **MIT License**. See the `LICENSE` file for more information.
