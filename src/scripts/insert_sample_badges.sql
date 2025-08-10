INSERT INTO badges (name, description, "imageUrl", type, condition, grade, "createdAt", "updatedAt") VALUES
('첫걸음', '첫 번째 퀴즈를 풀어보세요.', '/badges/first_step.png', 'QUIZ', '{"type":"TOTAL_QUIZZES_SOLVED","categoryId":"ALL","value":1,"operator":"GTE"}', 'BRONZE', NOW(), NOW()),
('역사학자', '역사 카테고리 퀴즈 10개를 풀어보세요.', '/badges/historian.png', 'QUIZ', '{"type":"TOTAL_QUIZZES_SOLVED","categoryId":1,"value":10,"operator":"GTE"}', 'SILVER', NOW(), NOW()),
('과학의 달인', '과학 카테고리에서 50문제 이상 풀고 정답률 80% 이상을 달성하세요.', '/badges/science_master.png', 'QUIZ', '{"logicalOperator":"AND","conditions":[{"type":"TOTAL_QUIZZES_SOLVED","categoryId":2,"value":50,"operator":"GTE"},{"type":"CORRECT_ANSWER_RATE","categoryId":2,"value":80,"operator":"GTE"}]}', 'GOLD', NOW(), NOW()),
('연속 정답의 귀재', '모든 카테고리에서 10문제 연속 정답을 달성하세요.', '/badges/consecutive_master.png', 'QUIZ', '{"type":"CONSECUTIVE_CORRECT_ANSWERS","categoryId":"ALL","value":10,"operator":"GTE"}', 'GOLD', NOW(), NOW()),
('꾸준함의 상징', '가입 후 30일 동안 꾸준히 활동하세요.', '/badges/consistency.png', 'ACCOUNT', '{"type":"ACCOUNT_AGE_DAYS","value":30,"operator":"GTE"}', 'SILVER', NOW(), NOW());
