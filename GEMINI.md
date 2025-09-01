# Claude 지침

## 언어 설정
- 사용자에게 질문할 때는 한글로 질문해주세요.

## 프로젝트 정보
이 프로젝트는 React Native를 사용한 퀴즈 앱 "qtube"입니다.

- 메인 프로젝트: `/qtube/FE/` (React Native/Expo/TypeScript)
- api 서버 : `/qtube/BE/` (nodejs/fastify/postgres/redis)

## 기술 스택

### Frontend (React Native)
- **Framework**: React Native + Expo
- **Language**: TypeScript
- **State Management**: Zustand, react-query
- **Validation**: Zod
- **Directory Structure**:
  - `src/components/`: 재사용 가능한 컴포넌트
  - `src/types/`: TypeScript 타입 정의
  - `src/utils/`: 유티리티 함수

### Backend 주요 기술 스택:

1. **핵심 프레임워크/언어**
- TypeScript
- Fastify (Node.js 웹 프레임워크)

2. **데이터베이스 & 캐싱**
- PostgreSQL (`pg`, `@fastify/postgres`)
- Redis (`@fastify/redis`, `ioredis`)
- TypeORM (ORM)

3. **API 문서화**
- Swagger (`@fastify/swagger`, `@fastify/swagger-ui`)

4. **인증/보안**
- JWT (`@fastify/jwt`)
- Firebase Admin SDK (`firebase-admin`)

5. **유틸리티**
- Zod (스키마 검증)
- node-cron (스케줄링)
- date-fns (날짜 처리)

### BE 프로젝트 구조:
```
BE/
├── src/
│   ├── config/         # 데이터베이스, 환경변수 등 설정
│   ├── entities/       # TypeORM 엔티티 정의
│   ├── migrations/     # 데이터베이스 마이그레이션
│   ├── modules/        # 기능별 모듈 (MVC 패턴)
│   │   ├── Answer/
│   │   ├── Auth/
│   │   ├── Badge/
│   │   ├── Category/
│   │   ├── Quiz/
│   │   ├── Ranking/
│   │   ├── Report/
│   │   └── User/
│   ├── plugins/        # Fastify 플러그인
│   ├── types/         # TypeScript 타입 정의
│   └── utils/         # 유틸리티 함수
```

### 아키텍처 특징:
1. **모듈식 구조**: 각 기능이 독립적인 모듈로 분리되어 있으며, 각 모듈은 controllers, interfaces, routes 등을 포함
2. **마이그레이션 지원**: TypeORM을 사용한 데이터베이스 마이그레이션 관리
3. **API 문서화**: Swagger를 통한 자동 API 문서화
4. **타입 안정성**: TypeScript와 Zod를 통한 강력한 타입 체크와 검증
5. **캐싱 전략**: Redis를 활용한 캐싱 구현

이 프로젝트는 퀴즈 애플리케이션의 백엔드로, 사용자 관리, 퀴즈 관리, 랭킹 시스템, 뱃지 시스템 등 다양한 기능을 제공하는 것으로 보입니다.

### 개발 가이드라인
- TypeScript를 사용하여 모든 파일을 작성
- Zod를 사용하여 폼 validation 및 데이터 스키마 정의
- Zustand를 사용하여 전역 상태 관리
- 컴포넌트는 함수형 컴포넌트로 작성
- 파일명은 PascalCase 사용 (예: LoginScreen.tsx)
- 스타일은 StyleSheet.create() 사용
- 웹버전은 만들지 않고 ios와 android 버전만 만듭니다.
- context7 mcp를 이용해 항상 최신 문서를 확인하고 작업합니다.
- 파일에 대한 경로를 알려주면 직접 접근이 힘들 때는 @wonderwhy-er/desktop-commander 를 사용하여 접근한다.
- 로컬 postgre에 접속할 땐 postgre-sql-mcp-server 를 사용하여 접근한다.
