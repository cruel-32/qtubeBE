# BE2 - Fastify TypeScript Server

Fastify를 사용한 TypeScript 백엔드 서버입니다. PostgreSQL과 Redis가 연결되어 있습니다.

## 설치

```bash
npm install
```

## 환경 설정

`.env.development` 파일에서 데이터베이스 및 Redis 연결 정보를 설정할 수 있습니다.

## 실행

### 개발 모드
```bash
npm run dev
```

### 프로덕션 빌드
```bash
npm run build
npm start
```

## API 엔드포인트

- `GET /` - Hello World
- `GET /health` - 서버 및 데이터베이스 상태 확인
- `GET /test/postgres` - PostgreSQL 연결 테스트
- `GET /test/redis` - Redis 연결 테스트

## 기술 스택

- **Runtime**: Node.js
- **Framework**: Fastify
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Cache**: Redis
- **Development**: ts-node, nodemon
- **Validation**: Zod

## Docker 연결

docker-compose.yml의 PostgreSQL과 Redis 서비스와 연결됩니다:
- PostgreSQL: `localhost:5432` (qtube 데이터베이스)
- Redis: `localhost:6379`


과학

- 물리학
- 화학
- 생물학
- 지구과학
- 천문학
- 의학
- 수학

역사

- 한국사
- 세계사
- 고대사
- 근현대사
- 전쟁사
- 문화사

사회

정치
- 법률
- 교육
- 사회제도
- 인권
- 환경
- 지리

경제

- 경제이론
- 금융
- 기업경영
- 국제무역
- 부동산
- 암호화폐

연예

- K-POP
- 아이돌
- 배우
- 예능
- 음악
- 해외연예

게임

-PC게임
- 모바일게임
- 콘솔게임
- e스포츠
- 게임역사
- 인디게임

영화

- 한국영화
- 할리우드
- 아시아영화
- 유럽영화
- 장르별(액션, 드라마, 호러 등)
- 영화제

애니

- 일본애니
- 한국애니
- 서양애니
- 극장판
- TV시리즈
- 웹툰원작

스포츠

- 축구
- 야구
- 농구
- 배구
- 올림픽
- e스포츠
- 극한스포츠

외국어

- 영어
- 일본어
- 중국어
- 프랑스어
- 독일어
- 스페인어
- 기타언어


과학, 역사, 사회, 경제, 연예, 게임, 영화, 애니, 스포츠, 외국어, 
물리학, 화학, 생물학, 지구과학, 천문학, 의학, 수학, 한국사, 세계사, 고대사, 근현대사, 전쟁사, 문화사, 정치, 법률, 교육, 사회제도, 인권, 환경, 지리, 경제이론, 금융, 기업경영, 국제무역, 부동산, 암호화폐, K, 아이돌, 배우, 예능, 음악, 해외연예, PC게임, 모바일게임, 콘솔게임, e스포츠, 게임역사, 인디게임, 한국영화, 할리우드, 아시아영화, 유럽영화, 장르별, 영화제, 일본애니, 한국애니, 서양애니, 극장판, TV시리즈, 웹툰원작, 축구, 야구, 농구, 배구, 올림픽, e스포츠, 극한스포츠, 영어, 일본어, 중국어, 프랑스어, 독일어, 스페인어, 기타언어, 