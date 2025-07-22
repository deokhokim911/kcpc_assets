# 교회 자산 구매 현황 대시보드

교회의 자산 구매 현황을 시각적으로 분석하고 관리할 수 있는 안전한 대시보드입니다.

## 주요 기능

- 🔐 **보안 인증 시스템**: 사용자명과 비밀번호를 통한 접근 제어
- 📊 **종합적인 데이터 시각화**: 차트와 그래프를 통한 직관적인 데이터 분석
- 📈 **연도별 지출 추이**: 시간에 따른 지출 패턴 분석
- 🏢 **부서별 지출 분포**: 부서별 지출 현황 및 비교
- 📋 **카테고리별 분석**: 지출 카테고리별 상세 분석
- 📊 **실시간 통계**: 총 지출액, 거래 건수, 평균 금액 등 핵심 지표
- 📱 **반응형 디자인**: 모든 디바이스에서 최적화된 사용자 경험

## 인증 정보

기본 로그인 정보:
- **사용자명**: `admin`
- **비밀번호**: `church2024`

> ⚠️ **보안 주의사항**: 실제 운영 환경에서는 환경 변수나 더 안전한 방법을 사용하여 인증 정보를 관리해야 합니다.

## 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: TailwindCSS 4
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 설치 및 실행

1. 의존성 설치:
```bash
npm install
```

2. 개발 서버 실행:
```bash
npm run dev
```

3. 브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 루트 레이아웃 (인증 프로바이더 포함)
│   └── page.tsx           # 메인 대시보드 페이지
├── components/            # 재사용 가능한 컴포넌트
│   ├── charts/           # 차트 컴포넌트들
│   ├── Header.tsx        # 로그아웃 기능이 포함된 헤더
│   ├── LoginForm.tsx     # 로그인 폼
│   ├── ProtectedRoute.tsx # 인증 보호 라우트
│   ├── StatCard.tsx      # 통계 카드
│   └── DataTable.tsx     # 데이터 테이블
├── contexts/             # React Context
│   └── AuthContext.tsx   # 인증 상태 관리
├── config/               # 설정 파일
│   └── auth.ts          # 인증 설정
├── types/               # TypeScript 타입 정의
│   └── expenditure.ts   # 지출 데이터 타입
└── utils/               # 유틸리티 함수
    └── dataProcessor.ts # 데이터 처리 로직
```

## 데이터 형식

대시보드는 CSV 형식의 지출 데이터를 사용합니다. 데이터는 `public/consolidated_expenditure_data.csv` 파일에 위치해야 합니다.

필수 컬럼:
- `date`: 날짜 (YYYY-MM-DD 형식)
- `amount`: 금액 (숫자)
- `department`: 부서명
- `category`: 카테고리
- `description`: 설명

## 보안 기능

- **세션 관리**: 로컬 스토리지를 통한 로그인 상태 유지
- **접근 제어**: 인증되지 않은 사용자의 대시보드 접근 차단
- **로그아웃**: 안전한 세션 종료

## 커스터마이징

### 인증 정보 변경

`src/config/auth.ts` 파일에서 사용자명과 비밀번호를 수정할 수 있습니다:

```typescript
export const authConfig: AuthConfig = {
  username: 'your-username',
  password: 'your-password'
};
```

### 스타일링

TailwindCSS 클래스를 사용하여 모든 컴포넌트의 스타일을 커스터마이징할 수 있습니다.

## 배포

1. 프로덕션 빌드:
```bash
npm run build
```

2. 프로덕션 서버 실행:
```bash
npm start
```

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
