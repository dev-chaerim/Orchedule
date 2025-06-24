## 📁 orchedule_dev

오케쥴 프로젝트의 개발 관련 문서 모음입니다.  
각 문서는 `/docs/` 디렉토리에 있으며, 아래 링크를 통해 확인할 수 있습니다.

#### 📄 문서 목록

- [프로젝트 폴더 구조 및 실행방법 설명](./docs/structure.md)
- [데이터 모델 및 참조 관계](./docs/models.md)
- [API 명세 정리](./docs/api.md)



#### 📦 프로젝트 폴더 구조 개요

```bash
orchedule_dev/
├── app/                 # 페이지 라우팅 및 API 핸들링 (Next.js app router 기반)
├── components/          # 공통 UI 및 기능별 컴포넌트 모음
├── docs/                # 개발 문서 (모델 구조, API 명세 등)
├── public/              # 정적 자산 (이미지, manifest 등)
├── src/                 # 상태, 타입, 유틸, 모델 등 내부 로직 구성
├── styles/              # 글로벌 스타일 및 Tailwind 설정
├── middleware.ts        # 인증 및 리디렉션 처리용 미들웨어
└── 기타 설정 파일       # .env, next.config.js, tsconfig.json 등

📌 자세한 설명은 📄 프로젝트 구조 문서에서 확인할 수 있습니다.