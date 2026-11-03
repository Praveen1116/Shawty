
# Shawty V1 — Testing Documentation

## 1. Overview

This document records the testing performed during the development of Shawty V1, a URL shortener built using FastAPI and PostgreSQL.

The objective is to verify short-code generation, URL validation, URL creation, redirection, database persistence, collision handling, and database failure handling.

Testing has been performed through automated unit tests, automated API integration tests, and manual integration experiments.

## 2. Testing Environment

| Component        | Version / Technology |
| ---------------- | -------------------- |
| Operating System | Ubuntu Linux         |
| Python           | 3.12.3               |
| FastAPI          | 0.162.0              |
| PostgreSQL       | 16.15                |
| Psycopg          | 3.3.6                |
| pytest           | 9.2.0                |
| httpx2           | 2.16.0               |
| Database         | PostgreSQL — shawty |

## 3. Automated Unit Testing

### 3.1 Short-Code Generation

File: `tests/test_short_code.py`

| Test Case                                            | Description                                                            | Result |
| ---------------------------------------------------- | ---------------------------------------------------------------------- | ------ |
| `test_short_code_length`                           | Verifies that a generated short code contains exactly 6 characters.    | PASSED |
| `test_short_contains_only_alphanumeric_characters` | Verifies that a generated short code contains only letters and digits. | PASSED |
| `test_multiple_generated_codes_are_valid`          | Generates 100 codes and verifies their length and alphanumeric format. | PASSED |

### 3.2 URL Validation

File: `tests/test_url_validation.py`

URL validation is implemented using Pydantic's `HttpUrl` type through the `URLRequest` model.

| Test Case            | Description                                                            | Result |
| -------------------- | ---------------------------------------------------------------------- | ------ |
| `test_valid_url`   | Verifies that a valid URL is accepted and normalized.                  | PASSED |
| `test_invalid_url` | Verifies that invalid URL input raises a Pydantic `ValidationError`. | PASSED |

## 4. Automated API Integration Testing

File: `tests/test_api.py`

FastAPI's `TestClient` is used to send simulated HTTP requests to the application. API tests verify endpoint behavior and, where applicable, interaction with the PostgreSQL database.

### 4.1 URL Creation

Endpoint:

```http
POST /api/v1/urls
```

| Test Case                                  | Description                            | Expected Status | Result |
| ------------------------------------------ | -------------------------------------- | --------------- | ------ |
| `test_create_short_url`                  | Creates a short URL using valid input. | 201             | PASSED |
| `test_create_short_url_with_invalid_url` | Submits an invalid URL.                | 422             | PASSED |

### 4.2 URL Redirection

Endpoint:

```http
GET /{short_code}
```

| Test Case                                | Description                                                            | Expected Status | Result |
| ---------------------------------------- | ---------------------------------------------------------------------- | --------------- | ------ |
| `test_redirect_existing_short_code`    | Creates a URL and verifies redirection using its generated short code. | 302             | PASSED |
| `test_redirect_nonexistent_short_code` | Requests a short code that does not exist.                             | 404             | PASSED |

The redirect test uses `follow_redirects=False` to verify the actual HTTP redirect response and its `Location` header.

### 4.3 Database Failure Handling

| Test Case                                      | Description                                                  | Expected Status | Result |
| ---------------------------------------------- | ------------------------------------------------------------ | --------------- | ------ |
| `test_create_short_url_database_unavailable` | Simulates a database connection failure using `AsyncMock`. | 503             | PASSED |

The database connection function is mocked to raise `psycopg.OperationalError`.

The test verifies that the API returns:

```json
{
  "detail": "Database temporarily unavailable"
}
```

The test does not stop PostgreSQL or modify the database.

## 5. Manual Integration Testing

Manual integration experiments were performed against the running FastAPI application and local PostgreSQL database.

### 5.1 URL Creation

- Valid URLs were submitted through Swagger UI.
- The API returned HTTP 201.
- Multiple short codes were generated for the same original URL.

Result: PASSED.

### 5.2 URL Redirection

- Existing short codes redirected to their original URLs with HTTP 302.
- Nonexistent short codes returned HTTP 404.

Result: PASSED.

### 5.3 Database Persistence

The FastAPI application was stopped and restarted. Previously created short URLs were tested again.

Result: Existing URL mappings remained available after the application restart.

This verified persistence through PostgreSQL rather than in-memory storage.

### 5.4 Short-Code Collision Handling

A controlled short-code generator was used to intentionally generate an existing code.

The application detected the uniqueness conflict and retried with another generated code.

| Scenario                          | Result             |
| --------------------------------- | ------------------ |
| Existing short code generated     | Collision detected |
| Retry with a new code             | Successful         |
| Generator calls during experiment | 2                  |
| URL creation response             | HTTP 201           |

Result: PASSED.

This was a standalone manual integration experiment, not part of the automated pytest suite.

### 5.5 Database Failure Handling

PostgreSQL was temporarily stopped to test the application's behavior when the database was unavailable.

| Endpoint              | Expected Status | Result |
| --------------------- | --------------- | ------ |
| `POST /api/v1/urls` | 503             | PASSED |
| `GET /{short_code}` | 503             | PASSED |

PostgreSQL was restarted afterward, and API operations resumed successfully.

Result: PASSED.

## 6. Automated Test Execution Results

Command:

```bash
pytest -v
```

Final result:

- Total automated tests: 10
- Passed: 10
- Failed: 0

All automated unit and API integration tests passed when executed together.

## 7. Current Testing Status

| Testing Category                         | Status        |
| ---------------------------------------- | ------------- |
| Short-code generation unit tests         | Completed     |
| URL validation unit tests                | Completed     |
| URL creation API tests                   | Completed     |
| URL redirection API tests                | Completed     |
| Database unavailable API test            | Completed     |
| Manual collision handling experiment     | Completed     |
| Manual database persistence verification | Completed     |
| Manual database failure verification     | Completed     |
| Browser-based end-to-end testing         | Not performed |
| Load testing                             | Not performed |

## 8. Conclusion

The initial testing phase verified the fundamental behavior of Shawty V1.

Automated unit tests confirmed short-code generation and URL validation. Automated API integration tests verified URL creation, invalid input handling, redirection, nonexistent short-code handling, and database failure responses.

Manual integration experiments verified collision retry behavior, PostgreSQL persistence, and database failure recovery.

All 10 automated tests passed.

Load testing and performance evaluation will be performed after deployment. No performance or throughput results are claimed at this stage.
