# Kafka Event Contracts

This directory contains **canonical JSON Schema definitions** for all Kafka events
used across the Activity Builder platform.

These schemas define the **contract** between producers and consumers.
All services MUST follow these schemas when publishing or consuming Kafka messages.

This enables:

- Loose coupling between microservices
- Safe independent deployments
- Clear ownership and responsibilities
- Backward-compatible evolution

---

## 📦 Event Categories

### 1. Job Request Events

Emitted by the **API Gateway** (or Orchestrator in the future).

These events represent **user-initiated requests** that require asynchronous
processing.

- `text-job.json`

  - Topic: `text-jobs`
  - Emitted when a user requests a text-based activity
  - Consumed by: **Text Service**

- `image-job.json`
  - Topic: `image-jobs`
  - Emitted when a user requests an image-based activity
  - Consumed by: **Image Service**

---

### 2. Result Events

Emitted by **worker services** after completing a job.

- `activity-result.json`
  - Topic: `activity-results`
  - Emitted when a text or image activity is successfully generated
  - Consumed by:
    - API Gateway (status lookup / polling)
    - User Service (activity history persistence)

---

### 3. Job Lifecycle / Status Events

Used to track asynchronous job progress.

- `job-status.json`
  - Topic: `job-status`
  - Emitted on job state changes (queued, processing, completed, failed)
  - Enables real-time progress tracking and retries

---

## 🧱 Common Event Structure

All events **must** include the following top-level fields:

| Field       | Purpose                                                |
| ----------- | ------------------------------------------------------ |
| `eventType` | Immutable event identifier (e.g. `TEXT_JOB_REQUESTED`) |
| `version`   | Schema version (used for evolution)                    |
| `jobId`     | Correlates all events related to the same job          |
| `userId`    | Owner of the job                                       |
| `timestamp` | ISO-8601 event creation time                           |
| `payload`   | Event-specific data                                    |

---

## 🔐 Contract Rules (VERY IMPORTANT)

### 1️⃣ Backward Compatibility

- Existing consumers must continue to work after changes
- Only **add optional fields**
- Never remove or rename existing fields

### 2️⃣ Versioning

- Increment `version` **only** for breaking changes
- Consumers must handle older versions gracefully

### 3️⃣ Immutability

- `eventType` MUST NEVER change
- Published events are append-only and immutable

### 4️⃣ Validation

- All producers MUST validate events against these schemas
- Invalid events must never be published to Kafka

---

## 🧪 Local Development

These schemas are used for:

- Kafka message validation (AJV)
- Contract testing
- Documentation
- Onboarding new services

Shared usage example:

```js
import schema from "@shared/events/text-job.json";
```
