# Phase 2 Completion Report: Database, Domain Model & Persistence

**Phase:** 2  
**Status:** PASS  
**Timestamp:** 2026-09-15T21:48:00+05:30  

---

## Objective
Create the durable data foundation: typed models for user sessions, intake state, domain classification, legal corpus, citations, uploaded documents, OCR, extracted deadlines, generated documents, escalation resources, and evaluation results, with repositories, migration management, and privacy-preserving data minimization.

---

## Implemented & Delivered

### 1. Database Connection & Session Factory (`app/core/database.py`)
- Async SQLAlchemy engine supporting dual modes:
  - **Production:** PostgreSQL with `postgresql+asyncpg://`
  - **Development / Local Fallback:** SQLite with `sqlite+aiosqlite:///` (`check_same_thread: False`)
- `Base` declarative base class providing UUID primary keys (`id: str`) and automatic UTC audit timestamps (`created_at`, `updated_at`).
- `AsyncSessionLocal` async sessionmaker and FastAPI `get_db` dependency generator with automatic commit/rollback.
- `init_db()` schema initializer.

### 2. Typed Domain Models (All 15 Entities in `app/models/entities.py`)
| # | Model | Table Name | Key Attributes & Capabilities |
|:---|:---|:---|:---|
| 1 | `UserSession` | `user_sessions` | Anonymous token UUID, locale (`en`/`hi`), disclaimer acceptance, IP hash (zero raw IP), 24h expiration. |
| 2 | `IntakeState` | `intake_states` | Multi-turn stage machine (`INITIAL` → `READY_FOR_ADVICE`), collected/missing facts JSON, urgency flag & reason. |
| 3 | `DomainClassification` | `domain_classifications` | Primary/secondary domain, confidence score, rationale, detected keywords JSON. |
| 4 | `Source` | `sources` | Source code, name, tier (1/2/3), publisher, source URL, jurisdiction, update cadence, health timestamps. |
| 5 | `SourceSnapshot` | `source_snapshots` | Version label, SHA-256 content hash, fetch status, raw content URI, item count. |
| 6 | `LegalDocument` | `legal_documents` | Act code (`BNS_2023`, `BNSS_2023`, etc.), act name, year, jurisdiction, effective date, `repeals_or_replaces`. |
| 7 | `LegalSection` | `legal_sections` | Section number, chapter, title, full text, plain English/Hindi, penalties, cognizable/bailable/compoundable flags. |
| 8 | `Citation` | `citations` | Act name, section number, pinpoint, verified status (`VERIFIED_TIER_1`), statutory quote, official India Code URL. |
| 9 | `RetrievalChunk` | `retrieval_chunks` | Chunk index, chunk text, token count, embedding reference, statutory breadcrumb metadata JSON. |
| 10 | `UploadedDocument` | `uploaded_documents` | File hash, mime type, size, 24h retention deadline (`retention_deadline`), soft deletion (`is_deleted`), redacted text. |
| 11 | `OCRResult` | `ocr_results` | Extracted text, confidence score, detected language, page count, OCR engine. |
| 12 | `ExtractedDeadline` | `extracted_deadlines` | Trigger event, label, statutory basis, urgency level (`CRITICAL`/`HIGH`/`MEDIUM`/`LOW`), firm flag. |
| 13 | `GeneratedDocument` | `generated_documents` | Template type (`RTI_APPLICATION`, `CONSUMER_COMPLAINT_NOTICE`, `TENANT_REPLY_NOTICE`), slot values, markdown, PDF path. |
| 14 | `EscalationResource` | `escalation_resources` | Resource type (`NALSA`/`SLSA`/`DLSA`/`TELE_LAW`), state, district, helpline numbers, address, languages. |
| 15 | `EvaluationResult` | `evaluation_results` | Test suite, test case ID, query, passed, citation accuracy, faithfulness score, latency ms, details JSON. |

### 3. Pydantic v2 Schemas & RAG Contract (`app/models/schemas.py`)
- Full Request / Create / Update / Response schemas for all 15 models with `from_attributes = True`.
- Strict RAG Response Contract (`RAGResponseContract`):
  ```json
  {
    "summary": "...",
    "rights": [],
    "next_steps": [],
    "deadlines": [],
    "citations": [],
    "uncertainties": [],
    "escalation_needed": false
  }
  ```

### 4. Repository Layer (`app/repositories/`)
- `BaseRepository[ModelType]`: Generic async CRUD operations (`get_by_id`, `get_all`, `create`, `update`, `delete`, `count`).
- `SessionRepository`: Anonymous session management, disclaimer acceptance, expiration verification.
- `IntakeRepository`: Stage transitions, progressive fact collection, urgent case tagging.
- `SourceRepository`: Source registry lookups, health logging, snapshot versioning.
- `LegalCorpusRepository`: Act and section queries, full-text / title search, citation recording.
- `DocumentRepository`: Upload metadata tracking, OCR recording, statutory deadline extraction, and **24h retention expiration purging**.
- `EscalationRepository`: Jurisdiction-based legal aid lookup (State/District/National).

### 5. Migration Management (`backend/alembic/`)
- `alembic.ini` configured with async engine support.
- `alembic/env.py` configured for both offline and async online migrations.
- `alembic/versions/001_initial_schema.py`: Clean initial migration defining all 15 tables, foreign keys, and indexes, with reversible downgrade.

### 6. Privacy & Data Minimization Compliance
- **Zero user accounts in MVP:** All operations tied to anonymous UUID session tokens.
- **No raw IP storage:** Only salted/hashed representations.
- **Strict 24h upload retention:** `DocumentRepository.purge_expired_documents()` soft-deletes and purges document bodies past retention.
- **Zero raw PII in logs:** Ensured via StructuredLoggingMiddleware from Phase 1.

---

## Verification & Tests

- `backend/tests/test_database.py`: Verifies async engine and metadata creation of all 15 tables.
- `backend/tests/test_models.py`: Validates Pydantic v2 schemas and RAG response contract adherence.
- `backend/tests/test_repositories.py`: Tests session lifecycle, intake updates, corpus queries, 24h retention purging, and escalation queries.
