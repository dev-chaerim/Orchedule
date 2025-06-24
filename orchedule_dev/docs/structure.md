## Orchedule 프로젝트 구조

본 문서는 개발자 관점에서 오케쥴 프로젝트의 폴더 구조 및 주요 파일 설명을 정리한 문서입니다.

#### 📦 설치 및 실행 방법 (Installation & Run)
```
git clone https://github.com/dev-chaerim/Orchedule.git
cd orchedule_dev
npm install
npm run dev
```

#### 📁 디렉토리 구조
```
orchedule_dev/
├── app/                         # Next.js의 App Router 기반 페이지 디렉토리
│   ├── (authenticated)/         # 로그인 후 접근 가능한 페이지들
│   │   ├── admin/               # 관리자 페이지 (출석, 단원, 공지, 일정, 시즌, 자리 관리)
│   │   │   ├── attendance/      # 출석 현황 관리
│   │   │   ├── member/          # 단원 목록 및 가입 요청 관리
│   │   │   ├── notice/          # 공지사항 등록 및 수정
│   │   │   ├── schedule/        # 연습일정 등록 및 관리
│   │   │   ├── season/          # 시즌 생성 및 편집
│   │   │   ├── seatAssignment/  # 자리배치 관리 (좌석 번호, 좌우 위치 설정)
│   │   │   └── page.tsx         # 관리자 대시보드 홈
│   │   ├── board/               # 게시판 (기획 중)
│   │   ├── menu/                # 메뉴 탭 (공지/출석/악보 등 서브탭 연결)
│   │   ├── practice/            # 연습일지 탭 (기획 중)
│   │   ├── ClientWrapper.tsx    # 공통 레이아웃 Wrapper
│   │   ├── layout.tsx           # 앱 전체 레이아웃 정의
│   │   └── page.tsx             # 로그인 후 홈 화면
│   ├── (unauthenticated)/       # 로그인 전 접근 가능한 페이지
│   │   ├── forgot-password/     # 비밀번호 찾기
│   │   ├── join/                # 회원가입
│   │   ├── join-success/        # 가입 완료 화면
│   │   ├── login/               # 로그인
│   │   └── reset-password/      # 비밀번호 재설정
│   └── api/                     # Next.js API 라우트
│       ├── attendances/         # 출석 관련 API
│       ├── forgot-password/     # 비밀번호 찾기 메일 전송
│       ├── join-requests/       # 가입 요청 승인/거절 API
│       ├── login/               # 로그인 처리
│       ├── logout/              # 로그아웃 처리
│       ├── me/                  # 현재 사용자 정보 조회
│       ├── database/            # DB 연결 테스트 API
│       │   └── route.ts
│       ├── members/             # 단원 목록 CRUD
│       ├── notices/             # 공지 CRUD
│       ├── reset-password/      # 비밀번호 재설정 처리
│       ├── schedules/           # 연습일정 API
│       ├── score-checks/        # 악보체크 관련 API
│       ├── season-scores/       # 시즌 악보 등록/수정 API
│       ├── seasons/             # 시즌 정보 CRUD
│       ├── seat-assignments/    # 자리배치 저장/조회 API
│       └── upload-s3/           # Cloudinary 파일 업로드 API
│
├── components/                  # 공통 UI 및 기능 컴포넌트
│   ├── admin/                   # 관리자 전용 UI
│   ├── attendance/              # 출석 관련 UI
│   ├── comments/                # 댓글 UI
│   ├── common/                  # 헤더, 푸터, 버튼 등 공통 요소
│   ├── dropdown/                # 드롭다운 필터, 선택 컴포넌트
│   ├── home/                    # 홈 화면 UI
│   ├── layout/                  # Wrapper, 탭, 상단바 등 레이아웃 구성
│   ├── modals/                  # 확인/알림/삭제 모달
│   ├── search/                  # 검색 오버레이/검색창
│   └── ui/                      # 범용 UI 요소 (카드, 뱃지, 입력창 등)
│
├── docs/                        # 프로젝트 관련 문서 (모델/API 명세 등)
│   ├── model.md                 # 데이터 모델 설명 문서
│   └── api.md                   # API 명세 문서
│
├── public/                      # 정적 파일 (이미지, manifest 등)
│
├── src/                         # 주요 기능 로직
│   ├── constants/               # 전역 상수 (역할, 파트 라벨 등)
│   ├── context/                 # 전역 상태 Context
│   ├── hooks/                   # 커스텀 훅
│   ├── models/                  # Mongoose 모델 정의
│   ├── lib/
│   │   ├── mail/                # 이메일 발송 유틸
│   │   ├── mock/                # mock 데이터
│   │   ├── store/               # Zustand 상태 저장소
│   │   ├── types/               # 타입 정의
│   │   ├── utils/               # 날짜 계산, 파일 처리 등 유틸
│   │   ├── auth.ts              # 인증 유틸
│   │   ├── fonts.ts             # 웹폰트 설정
│   │   └── mongoose.ts          # MongoDB 연결 설정
│
├── styles/                      # 전역 스타일 설정
├── middleware.ts                # 인증 및 리디렉션 미들웨어
└── 환경 설정 파일들              # .env, tsconfig.json, next.config.js 등

```

