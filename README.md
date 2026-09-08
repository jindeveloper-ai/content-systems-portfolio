# Content Systems portfolio

AI 콘텐츠 자동화 사례와 작업 이력을 설명하는 KO / EN 정적 포트폴리오. `/`, `/about/`, `/work/content-automation/` 세 페이지입니다. 외부 API·DB·게시 기능은 없습니다.

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
npm run test:seo
prek run --all-files
```

`data/case-study.ts`는 공개 가능한 원고·근거 목록입니다. `app/page.tsx`가 요약, `app/work/content-automation/page.tsx`가 상세 사례를 렌더링합니다. `public/evidence/`에는 익명화된 검증 요약과 독립 규칙 재현 예시만 포함합니다. 원본 시스템의 코드와 연결하지 않습니다.

## 공개 경계

기획·설계·검수 주도 / AI 협업 구현. 합성 테스트는 운영 성과가 아닙니다. 학력·기여도·성과를 추정하지 않습니다. HTML에는 학력을 싣지 않으며, About의 경력명·연락처와 `public/resume/`의 원본 PDF 두 개는 사용자가 공개 승인했습니다. PDF는 언어에 맞춰 연결하고 해시로 원본 동일성을 검사합니다. 비공개 근거·지원 준비 문서는 이 저장소 밖에서 관리합니다.

공개 기본 주소는 https://su-jin-lee-portfolio.pages.dev/ 이며 기존 Sites 주소는 미러로 유지합니다. 각 페이지의 canonical(검색엔진에 알리는 대표 주소)은 해당 Cloudflare 경로를 가리킵니다. 최초 정적 HTML은 한국어이며 별도 언어 URL이 없으므로 hreflang은 사용하지 않습니다. `public/robots.txt`와 `public/sitemap.xml`은 세 페이지를 안내합니다. `public/_headers`는 PDF에만 `X-Robots-Tag: noindex`를 설정하고 기존 정적 자산 캐시를 보존합니다. 호스팅별 실제 응답을 배포 후 확인해야 합니다. `noindex`는 접근 제어가 아니며 PDF는 계속 공개됩니다.

Sites 프로젝트 ID는 `.openai/hosting.json`의 값을 재사용합니다. 자격증명·`.env`·비공개 원본 미디어·소스맵은 배포하지 않습니다. 배포 전 Gitleaks 및 변경에 따른 보안 검사를 실행합니다.

## 참고·라이선스

[Magic UI Portfolio](https://github.com/magicuidesign/portfolio)의 간결한 프로젝트 탐색 방식을 참고했습니다. 템플릿 코드·제작자 경력·사진은 복사하지 않았습니다. 원본은 [MIT](https://raw.githubusercontent.com/magicuidesign/portfolio/main/LICENSE), copyright 2024 Dillion Verma입니다. Sites의 React·TypeScript·shadcn 기본 구성을 사용하며 패키지별 라이선스는 각 배포본에 유지됩니다.

자동 검증 설정은 `project-validation-bootstrap`으로 관리합니다. Serena 메모 참조 확인: `serena memories check`.
