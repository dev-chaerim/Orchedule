# 🗂️ Orchedule 프로젝트 구조

본 문서는 개발자 관점에서 오케쥴 프로젝트의 폴더 구조 및 주요 파일 설명을 정리한 문서입니다.

## 📁 디렉토리 구조
```
app
├── (authenticated)               # 로그인 후 접근 가능한 페이지
│   ├── admin                     # 관리자 전용 페이지 (출석, 단원, 공지, 일정, 시즌, 자리 관리 등)
│   │   ├── attendance/           # 출석 현황 관리
│   │   ├── member/               # 단원 목록 및 가입 요청 관리
│   │   ├── notice/               # 공지사항 등록 및 수정
│   │   ├── schedule/             # 연습일정 등록 및 관리
│   │   ├── season/               # 시즌 생성 및 편집
│   │   ├── seatAssignment/       # 자리배치 관리 (좌석 번호, 좌우 위치 설정)
│   │   └── page.tsx              # 관리자 대시보드 홈
│   ├── board/                    # 게시판 (미구현/기획 중)
│   ├── menu/                     # 메뉴 탭 라우팅 (공지/출석/악보 등 서브탭 연결)
│   ├── practice/                 # 연습일지 탭 (미구현/기획 중)
│   ├── ClientWrapper.tsx         # 레이아웃 공통 wrapper, 모바일/데스크탑 헤더 포함
│   ├── layout.tsx                # 전체 앱 공통 레이아웃 정의
│   └── page.tsx                  # 로그인 후 홈 화면
│
├── (unauthenticated)             # 로그인 전 접근 가능한 페이지
│   ├── forgot-password/          # 비밀번호 찾기
│   ├── join/                     # 회원가입
│   ├── join-success/             # 회원가입 성공 페이지
│   ├── login/                    # 로그인
│   └── reset-password/           # 비밀번호 재설정
│
├── api                           # Next.js API 라우트
│   ├── attendances/              # 출석 관련 API 
│   ├── forgot-password/          # 비밀번호 찾기 메일 발송 API
│   ├── join-requests/            # 가입 요청 승인/거절 API
│   ├── login/                    # 로그인 처리 API
│   ├── logout/                   # 로그아웃 처리 API
│   ├── me/                       # 현재 로그인된 사용자 정보 조회 API
│   ├── database
│   │   └── route.ts              # MongoDB 연결 확인용 테스트 API
│   ├── members/                  # 단원 목록 조회 및 등록/삭제 API
│   ├── notices/                  # 공지사항 CRUD API
│   ├── reset-password/           # 비밀번호 재설정 처리 API
│   ├── schedules/                # 연습일정 등록/조회/삭제 API
│   ├── score-checks/             # 악보체크(보잉체크) 관련 API
│   ├── season-scores/            # 시즌별 악보 등록 및 수정 API
│   ├── seasons/                  # 시즌 정보 CRUD API
│   ├── seat-assignments/         # 자리배치 정보 조회 및 저장 API
│   └── upload-s3/                # S3 파일 업로드 처리 API (Cloudinary 또는 AWS용)

│
├── components                    # 공통 UI 및 기능별 컴포넌트 모음
│   ├── admin/                    # 관리자용 전용 UI 컴포넌트
│   ├── attendance/               # 출석 기능 관련 UI 컴포넌트
│   ├── comments/                 # 댓글 기능 컴포넌트
│   ├── common/                   # 헤더, 푸터, 버튼 등 공통 요소
│   ├── dropdown/                 # 필터링, 선택용 드롭다운 UI
│   ├── home/                     # 홈 화면에서 사용하는 전용 컴포넌트
│   ├── layout/                   # 클라이언트 Wrapper, 탭, 상단바 등 레이아웃 요소
│   ├── modals/                   # 확인/알림/삭제용 모달 컴포넌트
│   ├── search/                   # 검색창 오버레이 및 검색 UI 컴포넌트
│   └── ui/                       # 카드, 뱃지, 입력창 등 범용 UI 요소
│
├── public/                       # 정적 자산 (이미지, manifest.json 등)
├── src
│   ├── constants/                # 전역 상수 정의 (예: 역할, 파트 키, 라벨 등)
│   ├── context/                  # 전역 상태 관리용 React Context들
│   ├── hooks/                    # 커스텀 훅 정의 (예: useUserStore, useToastStore 등)
│   └── lib                      # 유틸리티 및 공통 라이브러리 함수
│      ├── mail/                  # 이메일 발송 관련 유틸
│      ├── mock/                  # 개발용 mock 데이터
│      ├── store/                 # Zustand 등 클라이언트 전역 상태 저장소
│      ├── types/                 # 공통 타입 정의 (예: Schedule, Score 등)
│      ├── utils/                 # 공통 유틸 함수 (예: 날짜 계산, 파일 처리 등)
│      ├── auth.ts                # 인증 관련 함수 (예: 쿠키 파싱, 세션 검증 등)
│      ├── fonts.ts               # 웹폰트 설정 (예: next/font 사용)
│      └── mongoose.ts            # MongoDB 연결 설정
├── models/                       # Mongoose 모델 정의 (예: Member, Attendance 등)
├── styles/                       # 전역 스타일 (Tailwind 설정 및 커스텀 CSS)
├── middleware.ts                 # 인증 및 리디렉션 처리용 미들웨어
└── 기타 환경 설정 파일들          # .env, next.config.js, tsconfig.json 등
