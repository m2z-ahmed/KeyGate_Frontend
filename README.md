# Lethem

![Status](https://img.shields.io/badge/status-active-22c55e)
![Version](https://img.shields.io/badge/version-v1-blue)
![License](https://img.shields.io/badge/license-Private-red)

> Secure AI API Access Management & Gateway

Lethem is a developer-first platform for securely managing AI provider credentials, generating scoped API subkeys, monitoring usage, and controlling access across projects and teams.

Instead of exposing your provider API keys directly to applications or teammates, Lethem acts as a secure gateway between your applications and AI providers.

---

## Why Lethem?

Most AI applications expose or tightly couple provider API keys with backend services.

Lethem helps you:

- 🔐 Keep provider API keys private
- 🔑 Generate scoped subkeys with permissions
- 📊 Monitor requests, tokens, and costs
- 👥 Manage team access using roles
- 🚦 Apply quotas and request limits
- 📈 View analytics and usage insights
- 🛡 Detect abuse and unusual activity
- 🔄 Rotate provider credentials without changing client integrations

---

## Features

### Provider Keys

Securely store your AI provider API keys.

Supported providers include:

- Google AI
- OpenAI
- Anthropic
- Groq
- OpenRouter
- Together AI
- DeepSeek
- Mistral AI

(Additional providers can be added.)

---

### Subkeys

Generate secure API subkeys that reference your provider keys without exposing them.

Configure:

- Token quotas
- Request limits
- Expiration dates
- Permissions
- Status
- Usage tracking

---

### Projects

Organize AI resources into separate projects.

Each project contains its own:

- Provider Keys
- Subkeys
- Team Members
- Roles
- Analytics
- Logs

---

### Team Collaboration

Invite teammates with role-based permissions.

Examples:

- Owner
- Admin
- Developer
- Viewer

Each role has configurable permissions.

---

### Monitoring

Monitor everything happening inside your project.

Includes:

- Usage Analytics
- Token Consumption
- Request Logs
- Notifications
- Health Monitoring

---

### Security

Built with security first.

Features include:

- Encrypted provider keys
- Scoped subkeys
- Permission-based access
- Audit logs
- Abuse detection
- Request validation

---

## Architecture

```
Client Application
        │
        ▼
     Lethem API
        │
        ▼
 Permission Checks
 Quotas
 Logging
 Analytics
 Routing
        │
        ▼
 AI Provider
(OpenAI, Google, Groq, etc.)
```

---

## Example Flow

```
Developer

↓

Creates Project

↓

Adds Provider Key

↓

Generates Subkey

↓

Uses Subkey in Application

↓

Lethem securely forwards requests

↓

Provider returns response
```

---

## Use Cases

- AI SaaS products
- Internal AI tools
- Team collaboration
- API key protection
- Cost monitoring
- Multi-provider routing
- Enterprise AI integrations

---

## Pricing

Lethem offers multiple plans for individuals, startups, and growing teams.

See the latest pricing on the website.

---

## Roadmap

- SDKs
- Webhooks
- Provider Failover
- Bring Your Own Models
- Additional AI Providers
- Enterprise Features

---

## Security

Provider API keys are encrypted before storage.

Applications should always use generated subkeys instead of provider credentials directly.

---

## Contributing

Contributions, discussions, and feature requests are welcome.

Please open an issue before submitting large changes.

---

## License

Copyright © Lethem.

All rights reserved.
