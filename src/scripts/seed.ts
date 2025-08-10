import { MigrationDataSource } from '../config/migration-data-source';

const allCategories = [
  // Main Categories
  { id: 1, name: '과학', parentId: null },
  { id: 2, name: '역사', parentId: null },
  { id: 3, name: '사회', parentId: null },
  { id: 4, name: '인문', parentId: null },
  { id: 5, name: '예술', parentId: null },
  { id: 6, name: '경제', parentId: null },
  { id: 7, name: '연예', parentId: null },
  { id: 8, name: '게임', parentId: null },
  { id: 9, name: '영화', parentId: null },
  { id: 10, name: '애니', parentId: null },
  { id: 11, name: '스포츠', parentId: null },
  { id: 12, name: '외국어', parentId: null },
  { id: 13, name: 'IT', parentId: null },

  // Sub Categories
  { id: 14, name: '물리학', parentId: 1 },
  { id: 15, name: '화학', parentId: 1 },
  { id: 16, name: '생물학', parentId: 1 },
  { id: 17, name: '지구과학', parentId: 1 },
  { id: 18, name: '천문학', parentId: 1 },
  { id: 19, name: '의학', parentId: 1 },
  { id: 20, name: '수학', parentId: 1 },
  { id: 21, name: '한국사', parentId: 2 },
  { id: 22, name: '세계사', parentId: 2 },
  { id: 23, name: '고대사', parentId: 2 },
  { id: 24, name: '근현대사', parentId: 2 },
  { id: 25, name: '정치', parentId: 3 },
  { id: 26, name: '법률', parentId: 3 },
  { id: 27, name: '사회제도', parentId: 3 },
  { id: 28, name: '인권', parentId: 3 },
  { id: 29, name: '환경', parentId: 3 },
  { id: 30, name: '지리', parentId: 3 },
  { id: 31, name: '철학', parentId: 4 },
  { id: 32, name: '문학', parentId: 4 },
  { id: 33, name: '미술', parentId: 5 },
  { id: 34, name: '음악', parentId: 5 },
  { id: 35, name: '경제이론', parentId: 6 },
  { id: 36, name: '금융', parentId: 6 },
  { id: 37, name: '기업경영', parentId: 6 },
  { id: 38, name: '국제무역', parentId: 6 },
  { id: 39, name: '투자', parentId: 6 },
  { id: 40, name: 'K-POP', parentId: 7 },
  { id: 41, name: '아이돌', parentId: 7 },
  { id: 42, name: '배우', parentId: 7 },
  { id: 43, name: '예능', parentId: 7 },
  { id: 44, name: '해외연예', parentId: 7 },
  { id: 45, name: 'PC게임', parentId: 8 },
  { id: 46, name: '모바일게임', parentId: 8 },
  { id: 47, name: '콘솔게임', parentId: 8 },
  { id: 48, name: 'e스포츠', parentId: 8 },
  { id: 49, name: '한국영화', parentId: 9 },
  { id: 50, name: '할리우드', parentId: 9 },
  { id: 51, name: '아시아영화', parentId: 9 },
  { id: 52, name: '해외영화', parentId: 9 },
  { id: 53, name: '일본애니', parentId: 10 },
  { id: 54, name: '한국애니', parentId: 10 },
  { id: 55, name: '서양애니', parentId: 10 },
  { id: 56, name: '웹툰', parentId: 10 },
  { id: 57, name: '축구', parentId: 11 },
  { id: 58, name: '야구', parentId: 11 },
  { id: 59, name: '농구', parentId: 11 },
  { id: 60, name: '배구', parentId: 11 },
  { id: 61, name: '영어', parentId: 12 },
  { id: 62, name: '일본어', parentId: 12 },
  { id: 63, name: '중국어', parentId: 12 },
  { id: 64, name: '웹 프론트엔드 개발', parentId: 13 },
  { id: 65, name: '웹 백엔드 개발', parentId: 13 },
  { id: 66, name: '모바일앱 개발', parentId: 13 },
  { id: 67, name: '게임개발', parentId: 13 },
];

async function seed() {
  try {
    console.log('Initializing data source...');
    await MigrationDataSource.initialize();
    console.log('Data source initialized.');

    const queryRunner = MigrationDataSource.createQueryRunner();

    console.log('Deleting existing categories...');
    await queryRunner.query('TRUNCATE TABLE category RESTART IDENTITY CASCADE;');
    console.log('Existing categories deleted.');

    console.log('Inserting new categories via raw query...');
    const values = allCategories.map(c => `(${c.id}, '${c.name.replace(/'/g, "''")}', ${c.parentId})`).join(',\n');
    const queryString = `INSERT INTO category (id, name, \"parentId\") VALUES ${values};`;
    
    await queryRunner.query(queryString);
    console.log(`Categories have been seeded successfully. Total: ${allCategories.length} categories`);

  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    if (MigrationDataSource.isInitialized) {
      await MigrationDataSource.destroy();
      console.log('Data source connection closed.');
    }
  }
}

seed();
