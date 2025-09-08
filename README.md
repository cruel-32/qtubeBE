# 📱 QTube - 지식 엔터테인먼트 퀴즈 앱

## 🎯 프로젝트 개요
다양한 분야의 퀴즈를 통해 지식과 재미를 모두 챙길 수 있는 모바일 엔터테인먼트 앱입니다. 개인 맞춤형 퀴즈 시스템과 실시간 랭킹 기능을 제공하여 사용자 참여도를 높였습니다.

**개발 기간**: 개인 프로젝트  
**역할**: 풀스택 개발 (기획, 설계, 개발, 배포)

## 🛠 기술 스택

### Frontend (React Native)
- **Framework**: React Native + Expo SDK 53
- **Language**: TypeScript
- **State Management**: Zustand, React Query (@tanstack/react-query)
- **Validation**: Zod
- **Authentication**: Firebase Auth + Google Sign-in
- **Navigation**: React Navigation v7
- **UI/UX**: React Native Reanimated, Expo Blur, Haptic Feedback
- **Push Notification**: Firebase Cloud Messaging, Expo Notifications

### Backend (Node.js)
- **Framework**: Fastify (Node.js)
- **Language**: TypeScript
- **Database**: PostgreSQL with TypeORM
- **Background Jobs**: node-cron
- **Authentication**: JWT + Firebase Admin SDK
- **API Documentation**: Swagger/OpenAPI
- **Deployment**: Docker + Railway

### Development & DevOps
- **Version Control**: Git
- **Database Migration**: TypeORM Migration
- **Environment**: Docker, Docker Compose
- **API Testing**: Swagger UI
- **Code Quality**: ESLint, TypeScript Strict Mode

## 🚀 주요 기능

### 1. 퀴즈 난이도 시스템
- **전체 정답률 기반 조정**: 각 퀴즈의 전체 정답률에 따라 A~D 난이도 자동 조정
- **중복 방지 시스템**: 이미 푼 퀴즈는 재출제하지 않고 히스토리에서 관리
- **카테고리 세분화**: 13개 대분류에서 40+ 세부 카테고리로 전문화된 퀴즈 제공

### 2. 효율적인 랭킹 시스템
- **배치 기반 집계**: 매일 새벽 2시 cron job으로 전날 데이터 집계
- **다층 랭킹 구조**: 일간/주간/월간 랭킹 시스템
- **성능 최적화**: 별도의 랭킹 집계 테이블로 빠른 조회 성능 확보
- **개인 성취 추적**: 개인별 통계 및 성장 기록 관리

### 3. 뱃지 시스템
- **업적 기반 보상**: 다양한 조건의 뱃지 시스템으로 사용자 참여 유도
- **자동 검증**: 백엔드에서 조건 달성 시 자동 뱃지 지급

### 4. 사용자 경험 최적화
- **소셜 로그인**: Google 로그인을 통한 간편한 회원가입/로그인
- **푸시 알림**: 개인 맞춤형 퀴즈 알림 시스템
- **반응형 UI**: 다양한 디바이스 크기 지원
- **햅틱 피드백**: 사용자 인터랙션에 대한 촉각적 피드백

## 🏗 시스템 아키텍처

### Database 설계
```
사용자(User) ←→ 퀴즈응답(Answer) ←→ 퀴즈(Quiz)
              ↓                    ↓
       랭킹집계(RankingScore)   카테고리(Category)
              ↓                    ↑
           뱃지(Badge) ←------------┘
```

### 모듈별 구조 (MVC 패턴)
- **Auth Module**: JWT 기반 인증, Firebase 연동
- **Quiz Module**: 퀴즈 생성, 조회, 난이도 조정 로직
- **User Module**: 사용자 관리, 프로필, 통계
- **Ranking Module**: 배치 기반 랭킹 집계 및 조회
- **Badge Module**: 업적 시스템, 자동 뱃지 지급
- **Category Module**: 계층형 카테고리 관리

### 성능 최적화
- **배치 처리**: node-cron을 활용한 일일 랭킹 집계로 DB 부하 분산
- **Database Index**: 효율적인 쿼리를 위한 복합 인덱스 설계
- **React Query**: API 응답 캐싱 및 상태 관리
- **별도 집계 테이블**: 랭킹 조회 성능 향상을 위한 RankingScore 테이블 활용

## 💡 핵심 구현 사항

### 1. 퀴즈 난이도 자동 조정 시스템
- 각 퀴즈의 전체 정답률을 실시간으로 분석하여 A~D 난이도 자동 조정
- 정답률 30% 이하 (A), 30-60% (B), 60-90% (C), 90% 이상 (D)로 분류
- 사용자에게 적절한 도전 수준의 퀴즈 제공

### 2. 배치 기반 랭킹 시스템
- node-cron을 활용한 매일 새벽 2시 자동 랭킹 집계
- 일간/주간/월간 별도 집계 테이블에 UPSERT 방식으로 데이터 누적
- 실시간 집계 대비 DB 부하 최소화 및 조회 성능 향상

### 3. 타입 안전성 보장
- TypeScript + Zod 스키마를 활용한 런타임 검증
- 프론트엔드부터 백엔드까지 완전한 타입 안전성 구현
- API 요청/응답 데이터의 무결성 보장

## 📈 성과 및 학습

### 기술적 성과
- **타입 안전성**: TypeScript + Zod로 프론트엔드부터 백엔드까지 완전한 타입 안전성 구현
- **확장성**: 모듈형 아키텍처로 새로운 기능 추가 용이
- **성능**: 배치 기반 랭킹 집계로 DB 부하 최소화 및 조회 성능 향상
- **사용자 경험**: 직관적인 UI/UX와 개인 맞춤형 서비스 제공

### 학습한 핵심 기술
1. **풀스택 개발**: React Native와 Node.js를 활용한 모바일 앱 전체 개발 경험
2. **데이터베이스 설계**: 복잡한 관계형 데이터베이스 설계 및 최적화
3. **배치 처리 시스템**: node-cron을 활용한 대용량 데이터 집계 시스템 구현
4. **인증/보안**: JWT와 Firebase를 결합한 보안 인증 시스템
5. **DevOps**: Docker를 활용한 컨테이너화 및 배포 자동화
6. **API 설계**: RESTful API 설계 및 OpenAPI 문서화

### 문제 해결 사례
- **대용량 데이터 처리**: 수만 개의 퀴즈 데이터 효율적 관리를 위한 복합 인덱스 및 배치 처리 전략 수립
- **랭킹 시스템 성능**: 실시간 집계의 DB 부하 문제를 배치 기반 집계 테이블로 해결
- **사용자 경험**: 퀴즈 난이도 자동 조정 시스템으로 사용자별 적절한 도전 수준 제공

## 🔗 프로젝트 링크
- **Repository**: [GitHub Repository](링크 추가 예정)
- **Demo Video**: [시연 영상](링크 추가 예정)

## 📱 스크린샷
*(스크린샷 이미지들 추가 예정)*

---
*이 프로젝트를 통해 모바일 앱 개발부터 백엔드 서버, 데이터베이스 설계까지 풀스택 개발 역량을 종합적으로 발전시킬 수 있었습니다.*
