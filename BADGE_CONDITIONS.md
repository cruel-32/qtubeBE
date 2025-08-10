# 배지 획득 조건 정의 (`BADGE_CONDITIONS.md`)

이 문서는 '큐튜브(qtube)' 앱에서 사용되는 배지(칭호) 획득 조건을 시스템이 인지하고 처리할 수 있도록 명확하게 정의하는 것을 목적으로 합니다.

획득 조건은 JSON 형식의 텍스트로 `Badge` 엔티티의 `condition` 컬럼에 저장됩니다. 시스템은 이 JSON을 파싱하여 사용자의 활동 데이터와 비교하고, 조건 충족 시 배지를 부여합니다.

## 1. 조건의 기본 구조

하나의 조건은 다음의 JSON 객체로 표현됩니다.

```json
{
  "type": "CONDITION_TYPE",
  "categoryId": 1,
  "value": 10,
  "operator": "GTE"
}
```

-   **`type`**: (String) 조건의 종류를 나타내는 식별자입니다. (아래 '2. 조건 유형 상세 정의' 참고)
-   **`categoryId`**: (Number | "ALL") 조건이 적용될 카테고리의 ID입니다. `"ALL"`은 전체 카테고리를 의미합니다.
-   **`value`**: (Number) 조건 충족을 위해 달성해야 하는 값입니다. (예: 10회, 50개, 90%)
-   **`operator`**: (String) 사용자의 데이터와 `value`를 비교할 연산자입니다.
    -   `GTE`: Greater Than or Equal (크거나 같음)
    -   `LTE`: Less Than or Equal (작거나 같음)
    -   `EQ`: Equal (같음)

## 2. 복합 조건 구조

두 가지 이상의 조건을 조합해야 할 경우, 논리 연산자를 포함한 상위 구조를 사용합니다.

```json
{
  "logicalOperator": "AND",
  "conditions": [
    { "type": "TOTAL_QUIZZES_SOLVED", "categoryId": 3, "value": 100, "operator": "GTE" },
    { "type": "CORRECT_ANSWER_RATE", "categoryId": 3, "value": 90, "operator": "GTE" }
  ]
}
```

-   **`logicalOperator`**: (String) `conditions` 배열 안의 조건들을 결합할 논리 연산자입니다.
    -   `AND`: 모든 조건을 충족해야 함
    -   `OR`: 조건 중 하나라도 충족하면 됨
-   **`conditions`**: (Array) 여러 개의 기본 조건 객체들을 담는 배열입니다.

## 3. 조건 유형 (`type`) 상세 정의

-   **`CONSECUTIVE_CORRECT_ANSWERS`**: 특정 카테고리에서 연속으로 정답을 맞춘 횟수.
-   **`TOTAL_QUIZZES_SOLVED`**: 특정 카테고리에서 푼 총 퀴즈 수.
-   **`TOTAL_CORRECT_ANSWERS`**: 특정 카테고리에서 맞춘 총 정답 수.
-   **`CORRECT_ANSWER_RATE`**: 특정 카테고리의 정답률 (%). `value`는 0에서 100 사이의 숫자입니다.
-   **`TOTAL_SCORE_EARNED`**: 특정 카테고리 또는 전체에서 획득한 총 점수.
-   **`ACCOUNT_AGE_DAYS`**: 계정 생성 후 경과 일수.

## 4. 실제 예시

### 예시 1: 역사 카테고리 퀴즈 10회 연속 정답
-   **Badge Name**: 역사의 산 증인
-   **Condition JSON**:
    ```json
    {
      "type": "CONSECUTIVE_CORRECT_ANSWERS",
      "categoryId": 1,
      "value": 10,
      "operator": "GTE"
    }
    ```

### 예시 2: 과학 카테고리 퀴즈 50개 이상 풀이
-   **Badge Name**: 과학 탐구자
-   **Condition JSON**:
    ```json
    {
      "type": "TOTAL_QUIZZES_SOLVED",
      "categoryId": 2,
      "value": 50,
      "operator": "GTE"
    }
    ```

### 예시 3: 상식 카테고리 퀴즈를 100개 이상 풀고, 정답률 90% 이상 달성
-   **Badge Name**: 상식의 제왕
-   **Condition JSON**:
    ```json
    {
      "logicalOperator": "AND",
      "conditions": [
        { "type": "TOTAL_QUIZZES_SOLVED", "categoryId": 3, "value": 100, "operator": "GTE" },
        { "type": "CORRECT_ANSWER_RATE", "categoryId": 3, "value": 90, "operator": "GTE" }
      ]
    }
    ```

## 5. 기술적 고려사항

- **성능**: 사용자의 활동(예: 퀴즈 제출)이 발생할 때마다 모든 배지 조건을 검사하는 것은 비효율적일 수 있습니다. 따라서, 관련 있는 조건만 트리거하거나, 특정 시점(예: 하루에 한 번)에 배치(batch) 작업을 통해 검사하는 방식을 고려해야 합니다.
- **확장성**: 새로운 유형의 배지 조건이 추가될 때, 시스템이 유연하게 대응할 수 있도록 `type`에 따른 조건 검사 로직을 모듈화하여 관리해야 합니다.
- **동시성**: 뱃지는 한정된 자원이 아니며, 여러 사용자가 조건을 충족하면 동시에 획득할 수 있으므로 동시성 제어(Concurrency Control)는 특별히 고려하지 않아도 됩니다. 조건만 충족되면 언제든지 뱃지를 발급할 수 있습니다.
