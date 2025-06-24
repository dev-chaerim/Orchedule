# 🗃️ 데이터 모델 구조

이 폴더는 MongoDB에 저장되는 주요 데이터 구조를 정의한 Mongoose 모델입니다.

✅ 설계 참고 사항
대부분의 모델은 ObjectId 문자열을 저장하여 다른 컬렉션의 데이터를 참조할 수 있도록 설계되어 있습니다.
Mongoose의 ref는 현재 일부 필드(Season.members)에만 명시되어 있으며, 나머지 참조 관계는 필요 시 확장 가능합니다.

## 주요 모델

### 🏷️ Season

| 필드         | 타입                | 설명                                       |
|--------------|---------------------|--------------------------------------------|
| `name`       | string              | 시즌 이름 (예: `"2025 여름 시즌"`)           |
| `startDate`  | Date                | 시즌 시작 날짜                              |
| `endDate`    | Date (옵션)         | 시즌 종료 날짜 (없을 경우 진행 중으로 간주)   |
| `pieces`     | string[]            | 시즌 내 연주 예정 곡 제목 목록               |
| `members`    | ObjectId[] (ref: Member) | 시즌에 속한 단원의 ID 목록 (참조 관계)  |
| `createdAt`  | Date                | 생성 시각 (자동 생성)                       |
| `updatedAt`  | Date                | 수정 시각 (자동 생성)                       |

---

#### ✅ 설계 포인트

- **시즌 단위로 모든 데이터가 연결됨:**  
  출석, 공지, 악보, 자리배치 등은 모두 특정 시즌에 종속되며 `seasonId`를 통해 연동됩니다.
- **`members`는 단원 전체가 아닌 시즌 참여자만 포함:**  
  단원 목록과 시즌별 참여자는 분리해서 관리하며, 이 구조로 인해 시즌 필터링이 매우 쉬워집니다.
- **`pieces`는 간단한 문자열 배열로 구성:**  
  실제 악보는 별도 모델(`Score`, `ScoreCheck`)로 관리되지만, 시즌 정보에는 곡 이름만 저장해 간결하게 유지합니다.


이 모델은 💡 **오케스트라 전체 시즌/운영의 뼈대 역할**을 하므로  
다른 모든 모델(`Attendance`, `Schedule`, `Notice` 등)의 `seasonId`는 이 모델을 기준으로 삼습니다.

---

### 📌 Member

| 필드       | 타입             | 설명                             |
|------------|------------------|----------------------------------|
| `_id`      | ObjectId         | 단원 고유 ID (자동 생성)         |
| `name`     | string           | 단원 이름                         |
| `part`     | string           | 파트 (예: Vn1, Va, 지휘자 등)     |
| `email`    | string           | 이메일 (로그인 ID, 고유값)       |
| `password` | string           | 해싱된 비밀번호                   |
| `role`     | 'admin' / 'user' | 권한 구분 (기본값: user)         |
| `joinedAt` | Date             | 가입일                           |

#### ✅ 설계 포인트

- 단원마다 로그인 정보(email, password)와 역할(role)을 포함해 관리합니다.
- `part` 필드는 enum 제한으로 유효한 파트만 선택 가능하게 했습니다 (`orderedParts` 기반).
- `joinedAt` 필드를 통해 가입일 기준 정렬 및 시즌 필터링이 가능하도록 했습니다.

---


### 📌 Attendance

| 필드        | 타입            | 설명                            |
|-------------|-----------------|---------------------------------|
| `date`      | string (YYYY-MM-DD) | 출석 날짜 예: `"2025-04-29"`    |
| `seasonId`  | string           | 시즌 식별자 (ObjectId 문자열)   |
| `records`   | Record[]         | 각 단원의 출석 상태 목록        |

#### 📍 Record (내부 서브 필드)

| 필드        | 타입     | 설명                        |
|-------------|----------|-----------------------------|
| `memberId`  | string   | 단원 ID (ObjectId 문자열)   |
| `status`    | string   | 출석 상태: `출석`, `지각`, `불참` |

#### ✅ 설계 포인트

- 하나의 `Attendance` 문서는 **특정 날짜 + 시즌** 기준으로 단체 출석을 관리합니다.
- `records` 배열을 사용하여 단원 개별 출석 상태를 구조화합니다.
- 추후 `memberId`를 통해 단원 정보 연동이 가능하며, `seasonId` 기준으로 통계 분석이 용이합니다.

---

### 📌 PracticeSchedule

| 필드              | 타입                  | 설명                          |
|-------------------|-----------------------|-------------------------------|
| date              | Date                  | 연습 날짜                     |
| orchestraSessions | OrchestraSession[]    | 전체 합주 세션 목록            |
| partSessions      | PartSession[]         | 파트별 연습 세션              |
| specialNotices    | string[]              | 특이사항 (시간 변경 등)       |

### 📌 PracticeSchedule (Schedule)

| 필드               | 타입                     | 설명                          |
|--------------------|--------------------------|-------------------------------|
| `seasonId`         | string                   | 시즌 식별자 (ObjectId 문자열) |
| `date`             | string (YYYY-MM-DD)      | 연습 날짜                     |
| `isCancelled`      | boolean                  | 휴강 여부 (기본값: false)     |
| `auditionSessions` | PracticeSession[]        | 오디션 세션 목록              |
| `partSessions`     | PracticeSession[]        | 파트별 연습 세션              |
| `orchestraSessions`| OrchestraSession[]       | 전체 합주 세션                |
| `specialNotices`   | SpecialNotice[]          | 특이사항 메시지               |
| `createdAt`        | Date                     | 생성 시각 (자동)              |
| `updatedAt`        | Date                     | 수정 시각 (자동)              |

---

#### 📍 PracticeSession

| 필드      | 타입     | 설명                     |
|-----------|----------|--------------------------|
| `time`    | string   | 시간 (예: `"15:00 - 15:30"`) |
| `title`   | string   | 세션 제목 (예: `"첼로 오디션"`) |
| `location`| string   | 장소                     |
| `conductor` | string | 지휘자 이름 (옵션)       |
| `parts`   | string[] | 해당 세션 파트 목록       |
| `note`    | string   | 비고 (옵션)              |

---

#### 📍 OrchestraSession

| 필드      | 타입      | 설명                     |
|-----------|-----------|--------------------------|
| `time`    | string    | 시간                     |
| `location`| string    | 장소                     |
| `conductor`| string   | 지휘자 이름              |
| `pieces`  | Piece[]   | 연주 곡 목록             |

---

#### 📍 Piece

| 필드       | 타입      | 설명                       |
|------------|-----------|----------------------------|
| `title`    | string    | 곡 제목                    |
| `movements`| string[]  | 악장 정보 (예: `["1st", "3rd"]`) |
| `isEncore` | boolean   | 앙코르 곡 여부              |
| `highlight`| boolean   | 하이라이트 표시 여부        |
| `note`     | string    | 비고 (옵션)                |

---

#### 📍 SpecialNotice

| 필드     | 타입   | 설명                                 |
|----------|--------|--------------------------------------|
| `content`| string | 공지 내용                             |
| `level`  | string | 중요도: `"default"` / `"warning"` / `"important"` |


#### ✅ 설계 포인트

- 연습 일정은 `auditionSessions`, `partSessions`, `orchestraSessions`로 세분화되어 관리됩니다.
- `orchestraSessions.pieces`는 서브 스키마(`Piece`)로 구조화되어 있어 곡별 구성과 하이라이트 지정이 가능합니다.
- `specialNotices`는 수준(`level`) 필드를 통해 공지 스타일(예: 경고, 중요 공지 등)을 조절할 수 있게 설계되었습니다.
- 단일 날짜 기준으로 하나의 `Schedule` 문서를 생성하고, 이를 달력 기반 UI와 연결하여 조회합니다.

---


## 🔗 관계도

- `Attendance` → `Member` 참조 (`records[].memberId`)
- `Attendance` → `Season` 참조 (`seasonId`)
- `Schedule` → `Season` 참조 (`seasonId`)
- `Season` → `Member` 참조 (`members[]`)
- `Score`, `ScoreCheck`, `Notice` → `Season` 참조 (`seasonId`)
---



