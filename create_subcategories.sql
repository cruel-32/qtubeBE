-- 하위 카테고리 생성 스크립트
-- 상위 카테고리들의 ID를 확인한 후 parentId를 적절히 수정해주세요

-- 먼저 현재 카테고리 확인
-- SELECT * FROM category ORDER BY id;

-- 과학 하위 카테고리 (parentId = 과학 카테고리의 ID)
INSERT INTO category (name, "parentId") VALUES
('물리학', (SELECT id FROM category WHERE name = '과학' AND "parentId" IS NULL)),
('화학', (SELECT id FROM category WHERE name = '과학' AND "parentId" IS NULL)),
('생물학', (SELECT id FROM category WHERE name = '과학' AND "parentId" IS NULL)),
('지구과학', (SELECT id FROM category WHERE name = '과학' AND "parentId" IS NULL)),
('천문학', (SELECT id FROM category WHERE name = '과학' AND "parentId" IS NULL)),
('의학', (SELECT id FROM category WHERE name = '과학' AND "parentId" IS NULL)),
('수학', (SELECT id FROM category WHERE name = '과학' AND "parentId" IS NULL));

-- 역사 하위 카테고리
INSERT INTO category (name, "parentId") VALUES
('한국사', (SELECT id FROM category WHERE name = '역사' AND "parentId" IS NULL)),
('세계사', (SELECT id FROM category WHERE name = '역사' AND "parentId" IS NULL)),
('고대사', (SELECT id FROM category WHERE name = '역사' AND "parentId" IS NULL)),
('근현대사', (SELECT id FROM category WHERE name = '역사' AND "parentId" IS NULL)),
('전쟁사', (SELECT id FROM category WHERE name = '역사' AND "parentId" IS NULL)),
('문화사', (SELECT id FROM category WHERE name = '역사' AND "parentId" IS NULL));

-- 사회 하위 카테고리
INSERT INTO category (name, "parentId") VALUES
('정치', (SELECT id FROM category WHERE name = '사회' AND "parentId" IS NULL)),
('법률', (SELECT id FROM category WHERE name = '사회' AND "parentId" IS NULL)),
('교육', (SELECT id FROM category WHERE name = '사회' AND "parentId" IS NULL)),
('사회제도', (SELECT id FROM category WHERE name = '사회' AND "parentId" IS NULL)),
('인권', (SELECT id FROM category WHERE name = '사회' AND "parentId" IS NULL)),
('환경', (SELECT id FROM category WHERE name = '사회' AND "parentId" IS NULL)),
('지리', (SELECT id FROM category WHERE name = '사회' AND "parentId" IS NULL));

-- 경제 하위 카테고리
INSERT INTO category (name, "parentId") VALUES
('경제이론', (SELECT id FROM category WHERE name = '경제' AND "parentId" IS NULL)),
('금융', (SELECT id FROM category WHERE name = '경제' AND "parentId" IS NULL)),
('기업경영', (SELECT id FROM category WHERE name = '경제' AND "parentId" IS NULL)),
('국제무역', (SELECT id FROM category WHERE name = '경제' AND "parentId" IS NULL)),
('부동산', (SELECT id FROM category WHERE name = '경제' AND "parentId" IS NULL)),
('암호화폐', (SELECT id FROM category WHERE name = '경제' AND "parentId" IS NULL));

-- 연예 하위 카테고리
INSERT INTO category (name, "parentId") VALUES
('K-POP', (SELECT id FROM category WHERE name = '연예' AND "parentId" IS NULL)),
('아이돌', (SELECT id FROM category WHERE name = '연예' AND "parentId" IS NULL)),
('배우', (SELECT id FROM category WHERE name = '연예' AND "parentId" IS NULL)),
('예능', (SELECT id FROM category WHERE name = '연예' AND "parentId" IS NULL)),
('음악', (SELECT id FROM category WHERE name = '연예' AND "parentId" IS NULL)),
('해외연예', (SELECT id FROM category WHERE name = '연예' AND "parentId" IS NULL));

-- 게임 하위 카테고리
INSERT INTO category (name, "parentId") VALUES
('PC게임', (SELECT id FROM category WHERE name = '게임' AND "parentId" IS NULL)),
('모바일게임', (SELECT id FROM category WHERE name = '게임' AND "parentId" IS NULL)),
('콘솔게임', (SELECT id FROM category WHERE name = '게임' AND "parentId" IS NULL)),
('e스포츠', (SELECT id FROM category WHERE name = '게임' AND "parentId" IS NULL)),
('게임역사', (SELECT id FROM category WHERE name = '게임' AND "parentId" IS NULL)),
('인디게임', (SELECT id FROM category WHERE name = '게임' AND "parentId" IS NULL));

-- 영화 하위 카테고리
INSERT INTO category (name, "parentId") VALUES
('한국영화', (SELECT id FROM category WHERE name = '영화' AND "parentId" IS NULL)),
('할리우드', (SELECT id FROM category WHERE name = '영화' AND "parentId" IS NULL)),
('아시아영화', (SELECT id FROM category WHERE name = '영화' AND "parentId" IS NULL)),
('유럽영화', (SELECT id FROM category WHERE name = '영화' AND "parentId" IS NULL)),
('장르별', (SELECT id FROM category WHERE name = '영화' AND "parentId" IS NULL)),
('영화제', (SELECT id FROM category WHERE name = '영화' AND "parentId" IS NULL));

-- 애니 하위 카테고리
INSERT INTO category (name, "parentId") VALUES
('일본애니', (SELECT id FROM category WHERE name = '애니' AND "parentId" IS NULL)),
('한국애니', (SELECT id FROM category WHERE name = '애니' AND "parentId" IS NULL)),
('서양애니', (SELECT id FROM category WHERE name = '애니' AND "parentId" IS NULL)),
('극장판', (SELECT id FROM category WHERE name = '애니' AND "parentId" IS NULL)),
('TV시리즈', (SELECT id FROM category WHERE name = '애니' AND "parentId" IS NULL)),
('웹툰원작', (SELECT id FROM category WHERE name = '애니' AND "parentId" IS NULL));

-- 스포츠 하위 카테고리
INSERT INTO category (name, "parentId") VALUES
('축구', (SELECT id FROM category WHERE name = '스포츠' AND "parentId" IS NULL)),
('야구', (SELECT id FROM category WHERE name = '스포츠' AND "parentId" IS NULL)),
('농구', (SELECT id FROM category WHERE name = '스포츠' AND "parentId" IS NULL)),
('배구', (SELECT id FROM category WHERE name = '스포츠' AND "parentId" IS NULL)),
('올림픽', (SELECT id FROM category WHERE name = '스포츠' AND "parentId" IS NULL)),
('e스포츠', (SELECT id FROM category WHERE name = '스포츠' AND "parentId" IS NULL)),
('극한스포츠', (SELECT id FROM category WHERE name = '스포츠' AND "parentId" IS NULL));

-- 외국어 하위 카테고리
INSERT INTO category (name, "parentId") VALUES
('영어', (SELECT id FROM category WHERE name = '외국어' AND "parentId" IS NULL)),
('일본어', (SELECT id FROM category WHERE name = '외국어' AND "parentId" IS NULL)),
('중국어', (SELECT id FROM category WHERE name = '외국어' AND "parentId" IS NULL)),
('프랑스어', (SELECT id FROM category WHERE name = '외국어' AND "parentId" IS NULL)),
('독일어', (SELECT id FROM category WHERE name = '외국어' AND "parentId" IS NULL)),
('스페인어', (SELECT id FROM category WHERE name = '외국어' AND "parentId" IS NULL)),
('기타언어', (SELECT id FROM category WHERE name = '외국어' AND "parentId" IS NULL));