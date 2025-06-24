## 🧾 API 명세서

오케쥴 프로젝트의 주요 API 명세입니다.  
각 API는 요청 방식, 경로, 설명, 요청/응답 형식 등을 포함합니다.

## 📌 API 목록

- [🔐 /api/login](#-apilogin)
- [🙋‍♂️ /api/me](#-apime)
- [📆 /api/schedules](#-apischedules)
- [📆 /api/schedules/:id](#-apischedulesid)
- [📅 /api/seasons](#-apiseasons)
- [📅 /api/seasons/:id](#-apiseasonsid)
- [👥 /api/members](#-apimembers)
- [👥 /api/members/:id](#-apimembersid)
- [🧾 /api/attendances](#-apiattendances)
- [🧾 /api/attendances/me](#-apiattendancesme)


---

## 🔐 /api/login

#### POST
- 설명: 로그인 후 JWT 토큰을 `orchedule-auth` 쿠키에 저장
- 요청:
  ```json
  {
    "email": "test@example.com",
    "password": "1234"
  }
  ```
- 응답:
  ```json
  {
    "success": true,
    "user": {
      "id": "string",
      "name": "string",
      "part": "PartKey",
      "email": "string",
      "role": "user | admin"
    }
  }
  ```
- 상태코드: `200 OK` | `401 Unauthorized` | `404 Not Found`

---

## 🙋‍♂️ /api/me

#### GET
- 설명: 쿠키에 저장된 JWT 토큰을 통해 현재 로그인된 사용자 정보를 반환
- 요청:
  _(요청 바디 없음 — 쿠키 자동 포함)_
- 응답:
  ```json
  {
    "success": true,
    "user": {
      "id": "string",
      "name": "string",
      "part": "PartKey",
      "role": "user | admin",
      "iat": 1234567890,
      "exp": 1234567890
    }
  }
  ```
- 상태코드: `200 OK` | `401 Unauthorized`

---

## 📆 /api/schedules

#### GET
- 설명: 모든 연습일정 조회 (선택적으로 `seasonId` 필터링)
- 요청:
  - Query: `?seasonId=string (optional)`
- 응답:
  ```json
  PracticeSchedule[]
  ```
- 상태코드: `200 OK` | `500 Internal Server Error`

#### POST
- 설명: 새로운 연습일정을 등록하고, 출석 데이터도 함께 생성
- 요청:
  ```json
  {
    "seasonId": "string",
    "date": "YYYY-MM-DD",
    "auditionSessions": [...],
    "partSessions": [...],
    "orchestraSessions": [...],
    "specialNotices": [...],
    "isCancelled": false
  }
  ```
- 응답:
  ```json
  PracticeSchedule
  ```
- 상태코드: `201 Created` | `400 Bad Request` | `500 Internal Server Error`

---

## 📆 /api/schedules/:id

#### GET
- 설명: 특정 연습일정 상세 조회
- 요청: 없음
- 응답:
  ```json
  PracticeSchedule
  ```
- 상태코드: `200 OK` | `404 Not Found` | `500 Internal Server Error`

#### PATCH
- 설명: 특정 연습일정을 수정
- 요청:
  ```json
  {
    "date": "YYYY-MM-DD",
    "auditionSessions": [...],
    "partSessions": [...],
    "orchestraSessions": [...],
    "specialNotices": [...],
    "isCancelled": true
  }
  ```
- 응답:
  ```json
  PracticeSchedule
  ```
- 상태코드: `200 OK` | `404 Not Found` | `500 Internal Server Error`

#### DELETE
- 설명: 특정 연습일정을 삭제하며 관련 출석 정보도 함께 삭제
- 요청: 없음
- 응답:
  ```json
  {
    "message": "Deleted successfully"
  }
  ```
- 상태코드: `200 OK` | `404 Not Found` | `500 Internal Server Error`

---

## 📅 /api/seasons

#### GET
- 설명: 전체 시즌 목록을 조회 (시작일 기준 내림차순 정렬, 단원 정보 포함)
- 요청: 없음
- 응답:
  ```json
  Season[]
  ```
- 상태코드: `200 OK` | `500 Internal Server Error`


#### POST
- 설명: 새 시즌을 등록하고, 등록된 시즌 정보를 반환 (단원 포함)
- 요청:
  ```json
  {
    "name": "2025 시즌 1",
    "startDate": "2025-03-01",
    "endDate": "2025-07-31",
    "pieces": [...],
    "members": [...]
  }
  ```
- 응답:
  ```json
  Season
  ```
- 상태코드: `201 Created` | `400 Bad Request` | `500 Internal Server Error`

---

## 📅 /api/seasons/:id

#### GET
- 설명: 특정 시즌의 상세 정보를 조회 (단원 포함)
- 요청: 없음
- 응답:
  ```json
  Season
  ```
- 상태코드: `200 OK` | `404 Not Found` | `500 Internal Server Error`


#### PATCH
- 설명: 특정 시즌의 정보를 수정 (단원, 곡 목록 등 포함)
- 요청:
  ```json
  {
    "name": "수정된 시즌명",
    "startDate": "2025-03-01",
    "endDate": "2025-07-31",
    "pieces": [...],
    "members": [...]
  }
  ```
- 응답:
  ```json
  Season
  ```
- 상태코드: `200 OK` | `500 Internal Server Error`


#### DELETE
- 설명: 특정 시즌을 삭제
- 요청: 없음
- 응답:
  ```json
  {
    "message": "시즌 삭제 완료"
  }
  ```
- 상태코드: `200 OK` | `500 Internal Server Error`


---

## 👥 /api/members

#### GET
- 설명: 전체 단원 목록을 파트, 이름 기준으로 정렬하여 조회
- 요청: 없음
- 응답:
  ```json
  Member[]
  ```
- 상태코드: `200 OK` | `500 Internal Server Error`


#### POST
- 설명: 새로운 단원을 등록 (비밀번호는 해시 처리)
- 요청:
  ```json
  {
    "name": "홍길동",
    "part": "Vn1",
    "email": "hong@example.com",
    "password": "1234"
  }
  ```
- 응답:
  ```json
  Member
  ```
- 상태코드: `201 Created` | `400 Bad Request` | `409 Conflict` | `500 Internal Server Error`

---

## 👥 /api/members/:id

#### PATCH
- 설명: 특정 단원의 이름 및 파트를 수정 (파트 변경 시 좌석 배정도 초기화)
- 요청:
  ```json
  {
    "name": "홍길동",
    "part": "Vn2"
  }
  ```
- 응답:
  ```json
  Member
  ```
- 상태코드: `200 OK` | `400 Bad Request` | `404 Not Found` | `500 Internal Server Error`


#### DELETE
- 설명: 특정 단원을 삭제
- 요청: 없음
- 응답:
  ```json
  {
    "message": "멤버 삭제 완료",
    "deletedId": "string"
  }
  ```
- 상태코드: `200 OK` | `404 Not Found` | `500 Internal Server Error`

---
## 📅 /api/attendances

#### GET
- 설명: 특정 날짜와 시즌의 출석 데이터 조회
- 쿼리 파라미터: `date`, `seasonId`
- 응답:
  ```json
  {
    "date": "yyyy-MM-dd",
    "records": [
      {
        "memberId": "string",
        "status": "출석 | 지각 | 불참"
      }
    ]
  }
  ```
- 상태코드: `200 OK` | `400 Bad Request`


#### POST
- 설명: 출석 데이터 생성 또는 한 명의 출석 상태 추가/갱신
- 요청:
  ```json
  {
    "date": "yyyy-MM-dd",
    "seasonId": "string",
    "memberId": "string",
    "status": "출석 | 지각 | 불참"
  }
  ```
- 응답:
  ```json
  {
    "message": "출석 상태가 저장되었습니다." | "출석 상태가 업데이트되었습니다."
  }
  ```
- 상태코드: `201 Created` | `200 OK` | `400 Bad Request`


#### PATCH
- 설명: 특정 단원의 출석 상태만 수정
- 요청:
  ```json
  {
    "date": "yyyy-MM-dd",
    "seasonId": "string",
    "memberId": "string",
    "status": "출석 | 지각 | 불참"
  }
  ```
- 응답:
  ```json
  {
    "message": "출석 상태가 수정되었습니다."
  }
  ```
- 상태코드: `200 OK` | `400 Bad Request` | `404 Not Found`


#### PUT
- 설명: 전체 출석 데이터 덮어쓰기 (records 배열 전체 수정)
- 요청:
  ```json
  {
    "date": "yyyy-MM-dd",
    "seasonId": "string",
    "records": [
      {
        "memberId": "string",
        "status": "출석 | 지각 | 불참"
      }
    ]
  }
  ```
- 응답:
  ```json
  {
    "_id": "string",
    "date": "yyyy-MM-dd",
    "seasonId": "string",
    "records": [
      {
        "memberId": "string",
        "status": "출석 | 지각 | 불참"
      }
    ]
  }
  ```
- 상태코드: `200 OK` | `400 Bad Request`

---
## 🧾 /api/attendances/me

#### GET
- 설명: 특정 시즌의 출석 통계를 조회 (가입일 이후 마지막 출석부가 열린 일정까지만 포함)
- 요청:
  ```
  GET /api/attendances/me?seasonId={seasonId}
  ```
- 응답:
  ```json
  {
    "attended": 12,
    "absent": 2,
    "tardy": 1,
    "notParticipated": 3,
    "total": 18,
    "effectiveTotal": 15,
    "rate": 80,
    "joinedAt": "2024-03-01T00:00:00.000Z"
  }
  ```
- 상태코드: `200 OK` | `400 Bad Request` | `401 Unauthorized` | `404 Not Found` | `500 Internal Server Error`


