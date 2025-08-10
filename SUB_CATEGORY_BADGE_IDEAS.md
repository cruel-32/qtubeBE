# 서브카테고리 기반 배지 시스템 설계 아이디어

이 문서는 `Answer` 엔티티 데이터를 활용하여 각 **서브카테고리별**로 최소 10개 이상의 다양한 배지(칭호)를 부여하는 시스템을 설계하기 위한 아이디어를 정리합니다.

## 1. 핵심 컨셉

-   **데이터 소스**: 사용자의 모든 정답/오답 기록은 `Answer` 엔티티에 저장됩니다. 이 기록은 배지 획득 조건 판별의 핵심 데이터 소스가 됩니다.
-   **판별 단위**: 모든 배지 획득 조건은 **개별 서브카테고리 ID**를 기준으로 판별됩니다.
-   **트리거**: 사용자가 퀴즈에 대한 답을 제출하여 `Answer` 레코드가 생성될 때마다, 해당 퀴즈의 서브카테고리와 연관된 배지들의 획득 조건을 체크하는 로직을 실행할 수 있습니다.

## 2. 배지 획득 로직 흐름 (Answer 제출 시)

1.  사용자가 답을 제출합니다.
2.  시스템은 `Answer` 엔티티에 `userId`, `quizId`, `isCorrect` 등의 정보를 저장합니다.
3.  저장된 `quizId`를 통해 해당 퀴즈의 `subCategoryId`를 조회합니다.
4.  해당 `subCategoryId`를 조건으로 가진 모든 `Badge` 목록을 가져옵니다.
5.  각 배지의 `condition`(JSON)을 파싱하여, 해당 `userId`와 `subCategoryId`를 기준으로 `Answer` 테이블을 분석, 조건 충족 여부를 판별합니다.
6.  **(중요)** 사용자가 아직 획득하지 않은 배지 중에서 조건이 충족된 것이 있다면, `UserBadge` 테이블에 새로운 레코드를 추가하여 배지를 부여합니다.

## 3. 서브카테고리별 배지 아이디어 (최소 10종)

모든 서브카테고리에 공통적으로 적용할 수 있는 배지 유형 템플릿입니다. `categoryId`에는 실제 서브카테고리의 ID가 들어가게 됩니다.

아래 표는 하나의 서브카테고리(예: '한국사')에 대해 어떻게 10개 이상의 배지를 생성할 수 있는지 보여줍니다.

| No. | 배지 유형 | 획득 조건 (Condition) | JSON 조건 예시 (`condition` 필드) | 배지 이름 예시 (서브카테고리: '한국사') | 등급 |
| :-- | :--- | :--- | :--- | :--- | :--- |
| 1 | **첫 정답** | 해당 서브카테고리에서 첫 번째 정답을 맞혔을 때 | `{"type": "TOTAL_CORRECT_ANSWERS", "categoryId": 18, "value": 1, "operator": "EQ"}` | 역사학도 | Common |
| 2 | **퀴즈 풀이 (Bronze)** | 퀴즈 10개 풀이 | `{"type": "TOTAL_QUIZZES_SOLVED", "categoryId": 18, "value": 10, "operator": "GTE"}` | 사료 탐색가 | Common |
| 3 | **퀴즈 풀이 (Silver)** | 퀴즈 50개 풀이 | `{"type": "TOTAL_QUIZZES_SOLVED", "categoryId": 18, "value": 50, "operator": "GTE"}` | 조선왕조실록 애독자 | Rare |
| 4 | **퀴즈 풀이 (Gold)** | 퀴즈 100개 풀이 | `{"type": "TOTAL_QUIZZES_SOLVED", "categoryId": 18, "value": 100, "operator": "GTE"}` | 한국사 전문가 | Epic |
| 5 | **정답 누적 (Bronze)** | 정답 10개 맞춤 | `{"type": "TOTAL_CORRECT_ANSWERS", "categoryId": 18, "value": 10, "operator": "GTE"}` | 어린이 위인 | Common |
| 6 | **정답 누적 (Silver)** | 정답 50개 맞춤 | `{"type": "TOTAL_CORRECT_ANSWERS", "categoryId": 18, "value": 50, "operator": "GTE"}` | 장원 급제 | Rare |
| 7 | **정답 누적 (Gold)** | 정답 100개 맞춤 | `{"type": "TOTAL_CORRECT_ANSWERS", "categoryId": 18, "value": 100, "operator": "GTE"}` | 살아있는 역사책 | Epic |
| 8 | **연속 정답 (Bronze)** | 5문제 연속 정답 | `{"type": "CONSECUTIVE_CORRECT_ANSWERS", "categoryId": 18, "value": 5, "operator": "GTE"}` | 떠오르는 신진사대부 | Rare |
| 9 | **연속 정답 (Silver)** | 10문제 연속 정답 | `{"type": "CONSECUTIVE_CORRECT_ANSWERS", "categoryId": 18, "value": 10, "operator": "GTE"}` | 암행어사 | Epic |
| 10 | **연속 정답 (Gold)** | 20문제 연속 정답 | `{"type": "CONSECUTIVE_CORRECT_ANSWERS", "categoryId": 18, "value": 20, "operator": "GTE"}` | 세종대왕의 후예 | Legendary |
| 11 | **정답률 마스터** | 퀴즈 50개 이상 풀고, 정답률 95% 이상 | `{"logicalOperator": "AND", "conditions": [{"type": "TOTAL_QUIZZES_SOLVED", "categoryId": 18, "value": 50, "operator": "GTE"}, {"type": "CORRECT_ANSWER_RATE", "categoryId": 18, "value": 95, "operator": "GTE"}]}` | 집현전 학자 | Legendary |
| 12 | **정복자** | 해당 서브카테고리의 모든 퀴즈를 풀었을 때 | (별도 로직 필요) | 한국사 정복자 | Epic |

## 4. 추가 고려사항

-   **성능**: 사용자가 답을 제출할 때마다 모든 배지 조건을 확인하는 것은 부하를 유발할 수 있습니다. 초기에는 실시간으로 처리하되, 사용자가 많아지면 비동기 큐(Queue)나 스케줄링된 배치(Batch) 작업으로 전환하는 것을 고려해야 합니다.
-   **확장성**: `BADGE_CONDITIONS.md`에 정의된 `type` 외에 새로운 조건 유형(예: '가장 빨리 푼 문제', '가장 어려운 문제 정답')이 필요해지면, 해당 유형을 처리할 수 있는 분석 로직을 추가 개발해야 합니다.
