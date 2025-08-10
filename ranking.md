# 랭킹 시스템 구현 계획 및 변경 내역

이 문서는 프로젝트에 새롭게 도입된 일간/주간/월간 랭킹 시스템의 아키텍처와 구현 내용, 그리고 관련된 파일 변경 내역을 정리합니다.

## 1. 랭킹 시스템 핵심 전략

실시간으로 모든 사용자의 답변을 조회하여 랭킹을 집계하는 방식은 서버에 큰 부하를 줄 수 있습니다. 이를 해결하기 위해 **기간별 랭킹 집계 테이블 (`RankingScore`)**을 도입하는 방식을 채택했습니다.

- **핵심 개념**: 매일 한 번, 전날의 데이터만 집계하여 별도의 랭킹 테이블에 누적(UPSERT)합니다. 랭킹 조회 시에는 이 집계 테이블만 사용하므로 매우 빠르고 효율적입니다.
- **데이터 리셋 불필요**: 일간/주간/월간 랭킹 기간이 끝나도 데이터를 초기화할 필요가 없습니다. 대신 `period`라는 식별자(예: `2025-07-24` (일간), `2025-W29` (주간), `2025-07` (월간))를 사용하여 각 기간의 랭킹을 독립적으로 저장하고 조회합니다.
- **과거 랭킹 보존**: `period`를 통해 과거의 랭킹 기록을 언제든지 조회할 수 있어, "명예의 전당"과 같은 기능 구현에 용이합니다.

### 집계되는 데이터

각 사용자의 일간/주간/월간 랭킹 데이터는 다음 지표들을 포함합니다.

- **총 점수 (`score`)**: 해당 기간 동안 획득한 누적 점수.
- **총 시도 횟수 (`totalAttempts`)**: 정답/오답을 포함하여 푼 문제의 총 수.
- **총 정답 수 (`correctAnswers`)**: 맞춘 문제의 수.
- **정답률 (`accuracy`)**: `correctAnswers / totalAttempts`로 계산되는 파생 데이터. (API 응답 시 동적으로 계산)

## 2. 구현 상세

### 가. 데이터베이스 (`RankingScore` 엔티티)

랭킹 데이터를 저장하기 위해 `ranking_scores` 테이블이 추가되었습니다.

- **파일**: `src/entities/RankingScore.ts`
- **주요 컬럼**:
  - `user`: 사용자 정보 (FK)
  - `score`, `totalAttempts`, `correctAnswers`: 랭킹 지표
  - `rankingType`: 랭킹 종류 (`DAILY`, `WEEKLY`, `MONTHLY`)
  - `period`: 기간 식별자 (예: `2025-07-24`, `2025-W29`)
- **인덱스**: `(rankingType, period, userId)`에 대한 복합 유니크 인덱스를 설정하여 조회 성능과 데이터 무결성을 보장합니다.

### 나. 일일 점수 집계 배치 서비스 (`RankingBatchService`)

**매일 새벽 2시 (02:00 AM)**에 자동으로 전날의 데이터를 집계하여 랭킹을 업데이트합니다.

- **파일**: `src/modules/Ranking/services/RankingBatchService.ts`
- **동작 방식**:
  1. `node-cron`을 사용하여 스케줄링됩니다. (`cron.schedule('0 2 * * *', ...)`)
  2. `Answer` 테이블에서 어제 하루 동안의 답변 기록을 사용자별로 집계합니다.
  3. 어제 날짜를 기준으로 일간/주간/월간 `period` 식별자를 생성합니다.
  4. 트랜잭션 내에서 각 사용자의 일일 집계 데이터를 `RankingScore` 테이블에 UPSERT(INSERT ... ON CONFLICT) 로직으로 누적 업데이트합니다.

### 다. 랭킹 조회 API

클라이언트(앱)에 랭킹 데이터를 제공하는 API 엔드포인트입니다.

- **파일**: `src/modules/Ranking/controllers/RankingController.ts`, `src/modules/Ranking/routes/RankingRoutes.ts`
- **엔드포인트**:
  - `GET /api/ranking/daily`: 어제의 일간 랭킹 Top 100 조회
  - `GET /api/ranking/weekly`: 현재 진행 중인 주간 랭킹 Top 100 조회
  - `GET /api/ranking/monthly`: 현재 진행 중인 월간 랭킹 Top 100 조회

#### API 호출 예시

JWT 토큰 인증이 필요합니다. `Authorization` 헤더에 `Bearer` 토큰을 포함하여 요청해야 합니다.

**1. 일간 랭킹 조회 (어제 기준)**
```bash
curl -X GET http://localhost:3000/api/ranking/daily \
-H "Authorization: Bearer {YOUR_JWT_TOKEN}"
```

**2. 주간 랭킹 조회**
```bash
curl -X GET http://localhost:3000/api/ranking/weekly \
-H "Authorization: Bearer {YOUR_JWT_TOKEN}"
```

**3. 월간 랭킹 조회**
```bash
curl -X GET http://localhost:3000/api/ranking/monthly \
-H "Authorization: Bearer {YOUR_JWT_TOKEN}"
```

#### 응답 데이터 예시
```json
[
  {
    "rank": 1,
    "user": {
      "id": "some-user-id",
      "nickName": "퀴즈왕",
      "picture": "user-profile-image-url"
    },
    "score": 150,
    "totalAttempts": 20,
    "correctAnswers": 15,
    "accuracy": 0.75
  },
  {
    "rank": 2,
    "user": {
      "id": "another-user-id",
      "nickName": "지식인",
      "picture": "another-user-image-url"
    },
    "score": 125,
    "totalAttempts": 18,
    "correctAnswers": 12,
    "accuracy": 0.6666666666666666
  }
]
```

## 3. 수정 및 생성된 파일 목록

- **`package.json`**: `date-fns` (날짜 계산), `node-cron` (배치 스케줄링) 라이브러리 추가.
- **`src/entities/RankingScore.ts`**: (생성) 랭킹 데이터 저장을 위한 엔티티 정의.
- **`src/entities/User.ts`**: (수정) `RankingScore`와의 관계(One-to-Many) 설정 추가.
- **`src/entities/index.ts`**: (수정) `RankingScore` 엔티티를 전역 엔티티 목록에 추가.
- **`src/config/database.ts`**: (수정) TypeORM 데이터 소스의 `entities` 배열에 `RankingScore` 추가.
- **`src/migrations/1752947867820-CreateRankingScoreTable.ts`**: (생성) `ranking_scores` 테이블을 생성하는 데이터베이스 마이그레이션 스크립트.
- **`src/modules/Ranking/services/RankingBatchService.ts`**: (생성) 일일 랭킹 집계 로직을 담고 있는 배치 서비스.
- **`src/modules/Ranking/controllers/RankingController.ts`**: (생성) 랭킹 조회 API의 비즈니스 로직 처리.
- **`src/modules/Ranking/routes/RankingRoutes.ts`**: (생성) 랭킹 API 엔드포인트 정의.
- **`src/modules/index.ts`**: (수정) 생성된 `RankingRoutes`를 API 서버의 메인 라우터에 등록.
- **`src/index.ts`**: (수정) 서버 시작 시 `RankingBatchService`가 자동으로 실행되도록 등록.
