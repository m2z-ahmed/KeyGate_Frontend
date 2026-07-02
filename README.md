<div align="center">

# Lethem

### Developer-first AI Gateway for secure API key management, access control, and observability.

<p>
  <img src="https://img.shields.io/badge/status-active-22c55e?style=for-the-badge" />
  <img src="https://img.shields.io/badge/version-v1.0-3B82F6?style=for-the-badge" />
  <img src="https://img.shields.io/badge/license-Private-E11D48?style=for-the-badge" />
</p>

<p>
  <img src="https://img.shields.io/badge/AI-Gateway-7C3AED?style=for-the-badge" />
  <img src="https://img.shields.io/badge/RBAC-Enabled-9333EA?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Security-Encrypted-16A34A?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Monitoring-Live-F59E0B?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Subkeys-Scoped-0EA5E9?style=for-the-badge" />
</p>

</div>

---

## Overview

Lethem is a secure AI gateway that sits between your applications and AI providers.

Instead of exposing provider API keys directly inside your applications, Lethem allows you to securely store provider credentials, generate scoped subkeys, monitor usage, enforce limits, and manage team access from a single platform.

Designed for developers, startups, and AI products that need security, visibility, and control.

---

## Why Lethem?

Most AI applications eventually face problems like:

- Sharing provider API keys across multiple applications
- No way to revoke access without rotating the original key
- Limited visibility into usage and spending
- Difficult team management
- No centralized monitoring
- Weak permission controls

Lethem solves these problems by introducing a secure gateway layer between your applications and AI providers.

---

## Features

### 🔐 Secure Provider Keys

Store provider API keys securely.

Supported providers include:

- Google AI
- OpenAI
- Anthropic
- Groq
- OpenRouter
- Together AI
- DeepSeek
- Mistral AI

Additional providers can be added without changing your applications.

---

### 🔑 Scoped Subkeys

Generate secure subkeys instead of exposing provider credentials.

Configure:

- Token quotas
- Request limits
- Expiration dates
- Permissions
- Status
- Usage tracking

---

### 📁 Projects

Organize resources into isolated projects.

Each project includes:

- Provider Keys
- Subkeys
- Members
- Roles
- Analytics
- Logs
- Settings

---

### 👥 Team Management

Collaborate securely with role-based access control.

Roles include:

- Owner
- Admin
- Developer
- Viewer

Permissions are configurable per project.

---

### 📊 Monitoring

Gain complete visibility into your AI usage.

Features include:

- Analytics
- Usage Tracking
- Request Logs
- Notifications
- Health Monitoring

---

### 🛡 Security

Built with security as a first-class feature.

- Encrypted Provider Keys
- Scoped API Subkeys
- Role-Based Access Control
- Audit Logs
- Abuse Detection
- Request Validation

---

## Architecture

```text
                Client Application
                        │
                        ▼
                Lethem Gateway
      ┌────────────────────────────────┐
      │ Authentication                 │
      │ Permission Checks              │
      │ Request Validation             │
      │ Quotas & Rate Limits           │
      │ Logging & Analytics            │
      │ Provider Routing               │
      └────────────────────────────────┘
                        │
                        ▼
        Google • OpenAI • Anthropic • Groq
```

---

## Typical Workflow

```text
Create Project
      │
      ▼
Add Provider Key
      │
      ▼
Generate Subkey
      │
      ▼
Integrate Subkey
      │
      ▼
Lethem validates every request
      │
      ▼
AI Provider
```

---

## Use Cases

- AI SaaS Platforms
- Internal AI Tools
- Team Collaboration
- API Key Protection
- Cost Monitoring
- Multi-Provider Routing
- Enterprise AI Applications

---

## Planned Features

- SDKs
- Webhooks
- Provider Failover
- Bring Your Own Models
- Additional AI Providers
- Enterprise Features

---

## Philosophy

Applications should never require direct access to provider API keys.

Instead:

```text
Application
      │
      ▼
Scoped Subkey
      │
      ▼
Lethem Gateway
      │
      ▼
AI Provider
```

This approach improves security, simplifies key rotation, enables granular permissions, and provides centralized observability.

---

## Contributing

Feature requests, discussions, and bug reports are welcome.

If you'd like to contribute, please open an issue before submitting large changes.

---

## License

Copyright © Lethem.

All rights reserved.
