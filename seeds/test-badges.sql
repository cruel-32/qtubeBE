-- 테스트용 뱃지 데이터 생성 스크립트
--
-- 사용 전 확인사항:
-- 1. 아래 쿼리에서 `categoryId`에 해당하는 주석을 실제 DB의 카테고리 ID로 변경해야 합니다.
--    예: '''{"type": "TOTAL_QUIZZES_SOLVED", "categoryId": /* 1. 역사 */ 1, "value": 10, "operator": "GTE"}'''
-- 2. `imageUrl`은 예시 URL입니다. 필요에 따라 실제 이미지 주소로 변경하세요.
--
-- 카테고리 ID 확인용 쿼리:
-- SELECT id, name, "parentId" FROM category ORDER BY "parentId" NULLS FIRST, id;
--

INSERT INTO badges (name, description, "imageUrl", "type", "condition", grade) VALUES

-- =================================================================
-- 공통 뱃지 (모든 카테고리)
-- =================================================================
('첫걸음', '첫 퀴즈 정답', 'https://your-image-url.com/common/first_correct.png', 'TOTAL_CORRECT_ANSWERS', '''{"type": "TOTAL_CORRECT_ANSWERS", "value": 1, "operator": "GTE"}''', 'BRONZE'),
('퀴즈 애호가', '총 퀴즈 50개 해결', 'https://your-image-url.com/common/quiz_lover.png', 'TOTAL_QUIZZES_SOLVED', '''{"type": "TOTAL_QUIZZES_SOLVED", "value": 50, "operator": "GTE"}''', 'BRONZE'),
('퀴즈 중독자', '총 퀴즈 500개 해결', 'https://your-image-url.com/common/quiz_addict.png', 'TOTAL_QUIZZES_SOLVED', '''{"type": "TOTAL_QUIZZES_SOLVED", "value": 500, "operator": "GTE"}''', 'SILVER'),
('지식의 탐구자', '총 정답 500개 달성', 'https://your-image-url.com/common/knowledge_seeker.png', 'TOTAL_CORRECT_ANSWERS', '''{"type": "TOTAL_CORRECT_ANSWERS", "value": 500, "operator": "GTE"}''', 'GOLD'),
('완벽주의자', '총 정답률 95% 이상 달성 (100개 이상 해결)', 'https://your-image-url.com/common/perfectionist.png', 'CORRECT_ANSWER_RATE', '''{"logicalOperator": "AND", "conditions": [{"type": "TOTAL_QUIZZES_SOLVED", "value": 100, "operator": "GTE"}, {"type": "CORRECT_ANSWER_RATE", "value": 95, "operator": "GTE"}]}''', 'DIAMOND'),
('점수 수집가', '총 10,000점 획득', 'https://your-image-url.com/common/score_collector.png', 'TOTAL_SCORE_EARNED', '''{"type": "TOTAL_SCORE_EARNED", "value": 10000, "operator": "GTE"}''', 'SILVER'),
('고득점의 제왕', '총 100,000점 획득', 'https://your-image-url.com/common/score_king.png', 'TOTAL_SCORE_EARNED', '''{"type": "TOTAL_SCORE_EARNED", "value": 100000, "operator": "GTE"}''', 'PLATINUM'),
('성실한 새싹', '가입 후 7일 경과', 'https://your-image-url.com/common/diligent_sprout.png', 'ACCOUNT_AGE_DAYS', '''{"type": "ACCOUNT_AGE_DAYS", "value": 7, "operator": "GTE"}''', 'BRONZE'),
('큐튜브 토박이', '가입 후 30일 경과', 'https://your-image-url.com/common/qtube_native.png', 'ACCOUNT_AGE_DAYS', '''{"type": "ACCOUNT_AGE_DAYS", "value": 30, "operator": "GTE"}''', 'SILVER'),

-- =================================================================
-- 상위 카테고리 뱃지
-- =================================================================
-- 역사 (History)
('역사학도', '역사 퀴즈 10개 해결', 'https://your-image-url.com/history/bronze.png', 'TOTAL_QUIZZES_SOLVED', '''{"type": "TOTAL_QUIZZES_SOLVED", "categoryId": /* 1. 역사 */ 1, "value": 10, "operator": "GTE"}''', 'BRONZE'),
('사학자', '역사 퀴즈 50개 해결', 'https://your-image-url.com/history/silver.png', 'TOTAL_QUIZZES_SOLVED', '''{"type": "TOTAL_QUIZZES_SOLVED", "categoryId": /* 1. 역사 */ 1, "value": 50, "operator": "GTE"}''', 'SILVER'),
('살아있는 역사', '역사 퀴즈 100개 해결', 'https://your-image-url.com/history/gold.png', 'TOTAL_QUIZZES_SOLVED', '''{"type": "TOTAL_QUIZZES_SOLVED", "categoryId": /* 1. 역사 */ 1, "value": 100, "operator": "GTE"}''', 'GOLD'),
('연속 정답의 달인 (역사)', '역사 퀴즈 10개 연속 정답', 'https://your-image-url.com/history/streak.png', 'CONSECUTIVE_CORRECT_ANSWERS', '''{"type": "CONSECUTIVE_CORRECT_ANSWERS", "categoryId": /* 1. 역사 */ 1, "value": 10, "operator": "GTE"}''', 'GOLD'),

-- 과학 (Science)
('과학 꿈나무', '과학 퀴즈 10개 해결', 'https://your-image-url.com/science/bronze.png', 'TOTAL_QUIZZES_SOLVED', '''{"type": "TOTAL_QUIZZES_SOLVED", "categoryId": /* 2. 과학 */ 2, "value": 10, "operator": "GTE"}''', 'BRONZE'),
('과학 탐험가', '과학 퀴즈 50개 해결', 'https://your-image-url.com/science/silver.png', 'TOTAL_QUIZZES_SOLVED', '''{"type": "TOTAL_QUIZZES_SOLVED", "categoryId": /* 2. 과학 */ 2, "value": 50, "operator": "GTE"}''', 'SILVER'),
('정확한 과학자', '과학 퀴즈 정답률 90% 이상 달성 (50개 이상 해결)', 'https://your-image-url.com/science/platinum.png', 'CORRECT_ANSWER_RATE', '''{"logicalOperator": "AND", "conditions": [{"type": "TOTAL_QUIZZES_SOLVED", "categoryId": /* 2. 과학 */ 2, "value": 50, "operator": "GTE"}, {"type": "CORRECT_ANSWER_RATE", "categoryId": /* 2. 과학 */ 2, "value": 90, "operator": "GTE"}]}''', 'PLATINUM'),

-- =================================================================
-- 하위 카테고리 뱃지
-- =================================================================
-- 과학 > 물리학
('중력 감지자', '물리학 퀴즈 10개 해결', 'https://your-image-url.com/physics/bronze.png', 'TOTAL_QUIZZES_SOLVED', '''{"type": "TOTAL_QUIZZES_SOLVED", "categoryId": /* 11. 물리학 */ 11, "value": 10, "operator": "GTE"}''', 'BRONZE'),
('양자역학 마스터', '물리학 퀴즈 50개 해결', 'https://your-image-url.com/physics/gold.png', 'TOTAL_QUIZZES_SOLVED', '''{"type": "TOTAL_QUIZZES_SOLVED", "categoryId": /* 11. 물리학 */ 11, "value": 50, "operator": "GTE"}''', 'GOLD'),

-- 역사 > 한국사
('조선왕조실록 독파', '한국사 퀴즈 25개 해결', 'https://your-image-url.com/k-history/silver.png', 'TOTAL_QUIZZES_SOLVED', '''{"type": "TOTAL_QUIZZES_SOLVED", "categoryId": /* 18. 한국사 */ 18, "value": 25, "operator": "GTE"}''', 'SILVER'),

-- 연예 > K-POP
('아이돌 전문가', 'K-POP 퀴즈 30개 해결', 'https://your-image-url.com/kpop/silver.png', 'TOTAL_QUIZZES_SOLVED', '''{"type": "TOTAL_QUIZZES_SOLVED", "categoryId": /* 36. K-POP */ 36, "value": 30, "operator": "GTE"}''', 'SILVER');
