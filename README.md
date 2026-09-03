# Content Systems portfolio

익명화한 AI 콘텐츠 자동화 사례를 설명하는 한국어 정적 포트폴리오. `/`와 `/work/content-automation` 두 페이지입니다. 외부 API·DB·게시 기능은 없습니다.

## 개발

Node.js 22.13 이상(로컬 검증: 24), npm을 사용합니다.

```sh
npm ci
npm run dev
npm test
npm run typecheck
npm run lint
npm run format -- --check
npm run build
prek run --all-files
```

`data/case-study.ts`는 공개 가능한 원고·근거 목록입니다. `app/page.tsx`가 요약, `app/work/content-automation/page.tsx`가 상세 사례를 렌더링합니다. `public/evidence/`에는 익명화된 검증 요약과 독립 규칙 재현 예시만 포함합니다. 원본 시스템의 코드와 연결하지 않습니다.

## 공개 경계

기획·설계·검수 주도 / AI 협업 구현. 합성 테스트는 운영 성과가 아닙니다. 학력·기여도·성과를 추정하지 않습니다. 비공개 근거·지원 준비 문서는 이 저장소 밖에서 관리합니다. 첫 배포는 owner-only이며 공개 전환은 별도 승인 사항입니다. `noindex`는 검색 수집 설정이지 접근 제어가 아닙니다.

Sites 프로젝트 ID는 `.openai/hosting.json`의 값을 재사용합니다. 자격증명·`.env`·원본 파일·소스맵은 배포하지 않습니다. 배포 전 Gitleaks 및 변경에 따른 보안 검사를 실행합니다.

## 참고·라이선스

[Magic UI Portfolio](https://github.com/magicuidesign/portfolio)의 간결한 프로젝트 탐색 방식을 참고했습니다. 템플릿 코드·제작자 경력·사진은 복사하지 않았습니다. 원본은 [MIT](https://raw.githubusercontent.com/magicuidesign/portfolio/main/LICENSE), copyright 2024 Dillion Verma입니다. Sites의 React·TypeScript·shadcn 기본 구성을 사용하며 패키지별 라이선스는 각 배포본에 유지됩니다.

자동 검증 설정은 `project-validation-bootstrap`으로 관리합니다. Serena 메모 참조 확인: `serena memories check`.
