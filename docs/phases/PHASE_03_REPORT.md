# Phase 3 Completion Report: Source Registry & Live Data Connectors

**Phase:** 3  
**Status:** PASS  
**Timestamp:** 2026-09-15T21:49:00+05:30  

---

## Objective
Make the system capable of acquiring, validating, and monitoring official legal information with full provenance, circuit breakers, and change detection, adhering strictly to the Source Policy and anti-scraping compliance boundaries.

---

## Implemented & Delivered

### 1. Source Adapter Framework (`app/sources/base.py`)
- **`SourceAdapter` Abstract Base Class:**
  - Standardized interface: `fetch_latest()`, `health_check()`, `compute_hash()`, `detect_changes()`, `get_provenance()`.
- **`CircuitBreaker` Pattern:**
  - States: `CLOSED` (normal operation), `OPEN` (tripped after failure threshold), `HALF_OPEN` (testing recovery).
  - Configurable failure threshold (default: 3) and recovery timeout (default: 30s).
- **`SourceMetadata` Schema:**
  - Standard source metadata: source code, official name, tier (1=Authoritative Primary, 2=Official Secondary, 3=Trusted Secondary), publisher, source URL, jurisdiction, update cadence.
- **Change Detection & Audit Hashing:**
  - Deterministic SHA-256 content hashing across all ingested statutory and directory records.

### 2. Official Tier-1 Adapters (`app/sources/`)
| Adapter | Source Code | Tier | Official Publisher / URL | Responsibilities |
|:---|:---|:---|:---|:---|
| `IndiaCodeAdapter` | `INDIA_CODE` | 1 | Legislative Department, Ministry of Law & Justice<br>`https://www.indiacode.nic.in` | Authoritative primary central legislation: BNS 2023, BNSS 2023, BSA 2023, Consumer Protection Act 2019, RTI Act 2005. Offline seed resilience. |
| `NALSADirectoryAdapter` | `NALSA_DIRECTORY` | 1 | National Legal Services Authority, Dept. of Justice<br>`https://nalsa.gov.in` | National Legal Aid Helpline 15100, State Legal Services Authorities (SLSAs), Section 12 free legal aid eligibility criteria. |
| `ECourtsAdapter` | `ECOURTS` | 1 | e-Committee, Supreme Court of India<br>`https://ecourts.gov.in` | Compliant 16-character alphanumeric CNR structure, case tracking guidance, District/High Court portal links. Non-scraping compliant. |
| `TeleLawAdapter` | `TELE_LAW` | 1 | Department of Justice & MeitY (CSC)<br>`https://www.tele-law.in` | Pre-litigation video consultation workflow, free aid for eligible citizens, Common Service Center touchpoints. |

### 3. Central Source Registry (`app/sources/registry.py`)
- Central orchestration of all registered adapters.
- Registry discovery, health reporting, and live status inspection.
- Singleton factory `get_source_registry()`.

### 4. Sources API Endpoints (`app/routers/sources.py`)
- `GET /api/v1/sources/registry`: Lists all active adapters, tiers, publisher info, and last fetched timestamps.
- `GET /api/v1/sources/health`: Circuit breaker health checks across all adapters.
- `GET /api/v1/sources/{source_code}/provenance`: Pinpoint provenance audit responder answering the Phase 3 exit condition.

---

## Exit Condition Verification: "Where did this fact come from?"
Every statutory and directory record derived by the system carries a verifiable provenance trail:
```json
{
  "source_code": "NALSA_DIRECTORY",
  "source_name": "National Legal Services Authority (NALSA) Official Directory",
  "tier": 1,
  "publisher": "National Legal Services Authority, Department of Justice",
  "official_url": "https://nalsa.gov.in",
  "jurisdiction": "Union of India",
  "item_id": "helpline_15100",
  "verified_at": "2026-09-15T16:15:00.000000+00:00",
  "content_hash": "a4f8e..."
}
```

---

## Verification & Tests

- `backend/tests/test_sources.py`:
  - `test_source_registry_registration`: PASS (all 4 Tier-1 adapters registered).
  - `test_india_code_seed_and_hash`: PASS (change detection and SHA-256 hash verified).
  - `test_nalsa_directory_and_provenance`: PASS (verified helpline 15100 and provenance audit).
  - `test_circuit_breaker_transitions`: PASS (CLOSED → OPEN on failures → HALF_OPEN on timeout → CLOSED on recovery).
  - `test_sources_api_endpoints`: PASS (FastAPI routes respond with 200 OK).
