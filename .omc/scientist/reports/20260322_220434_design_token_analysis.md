# CONTACTO Design Token Analysis Report
Generated: 2026-03-22 22:04:34

---

## [OBJECTIVE]
Home section (FRAME/INSTANCE/RECTANGLE 797개) + Chat section (TEXT 343개) Figma 스캔 데이터에서 디자인 토큰 패턴 추출

---

## [DATA]

| 파일 | 노드 수 | 타입 |
|------|---------|------|
| File1 (Home section) | 797개 | FRAME: 283, INSTANCE: 202, RECTANGLE: 308, COMPONENT: 4 |
| File2 (Chat section) | 343개 | TEXT 전용 |

**주의**: scan_nodes_by_types 결과에는 cornerRadius, paddingTop/Bottom/Left/Right, itemSpacing, layoutMode가 포함되지 않음. bbox(x, y, width, height)만 포함됨.

---

## [FINDING 1] 화면 레이아웃 기준 폭

**주요 컨테이너 폭**: 376px (97회), 344px (43회), 360px (24회), 168px (28회)

- 376px ≈ iPhone SE/모바일 전체 폭 → 풀 블리드 컨테이너
- 344px = 376 − 32 → 양쪽 16px 패딩 적용 콘텐츠 폭
- 360px = Android 기준 폭
- 168px ≈ 344/2 → 2컬럼 그리드 단위

[STAT:n] n=797 (File1 nodes)
[STAT:effect_size] 376px 컨테이너 전체 대비 점유율: 97/797 = 12.2%

---

## [FINDING 2] 컴포넌트 높이 스케일 (spacing scale 추론)

height 분포에서 4px 배수 중심의 spacing scale 확인:

| 값 | 빈도 | 의미 추정 |
|----|------|-----------|
| 4px | 134회 | Divider / hairline |
| 8px | 52회 | XS gap |
| 16px | 90회 | SM — 아이콘 높이 / 텍스트 행 |
| 20px | 53회 | MD (아이콘, 라벨) |
| 28px | 52회 | SM button / chip height |
| 32px | 89회 | MD button / row height |
| 36px | 41회 | LG icon frame |
| 40px | 40회 | LG button |
| 44px | 21회 | iOS tap target 최소 |
| 52px | 62회 | List item / card row |
| 104px | 29회 | 프로필 카드 (88×104) |

[STAT:n] n=797 (all nodes)
[STAT:effect_size] 4px-grid 배수 값이 전체 height 분포 상위 12위 중 11개 차지

---

## [FINDING 3] 반복 컴포넌트 크기 패턴

**프로필/아바타**: RECTANGLE 52×52 (26회) — 아바타 원형  
**아이콘 컨테이너**: FRAME 36×32, 36×36, 40×40, 44×36 (각 16회) — 아이콘 hit area  
**버튼/CTA**: INSTANCE 344×52 (24회) — 풀 폭 버튼  
**탭바 아이템**: FRAME 88×104 (22회) × 4 = iPhone 탭바 영역 (376/4 ≈ 94, 근사치)  
**헤더/컨트롤 바**: INSTANCE 376×32 (26회), 376×44 (18회)  
**리스트 셀**: FRAME 168×28 (20회) — 2컬럼 레이아웃 항목  

[STAT:n] INSTANCE n=202, FRAME n=283
[STAT:effect_size] 상위 10개 크기 조합이 FRAME 전체의 약 53% 차지

---

## [FINDING 4] Typography — Font Family

| Font | Count | 점유율 | 역할 추정 |
|------|-------|--------|-----------|
| FK Raster Roman Compact Trial | 169 | 49.3% | Display / 브랜딩 헤드라인 |
| ABC Diatype Unlicensed Trial | 67 | 19.5% | UI Label / 보조 텍스트 |
| SF Pro Text | 62 | 18.1% | iOS 시스템 UI / 콘텐츠 본문 |
| Pretendard | 28 | 8.2% | 한국어 본문 |
| SUIT | 12 | 3.5% | 한국어 헤딩 |
| SF Pro | 5 | 1.5% | SF 시스템 서브픽셀 |

[STAT:n] n=343 (text nodes)
[STAT:effect_size] 상위 3개 폰트가 전체의 86.9% 차지

---

## [FINDING 5] Typography — Font Size Scale

주요 fontSize 값:

| size | count | 역할 추정 |
|------|-------|-----------|
| 16px | 170 (49.6%) | Body / Default UI text |
| 22.5px | 54 (15.7%) | SF Pro iOS title style |
| 13px | 31 (9.0%) | Caption / Secondary |
| 10px | 29 (8.5%) | Micro label / badge |
| 15.16px | 23 (6.7%) | FK Raster 특수 크기 (display) |
| 20px | 8 (2.3%) | Subheading |
| 32px | 5 (1.5%) | Section title (SUIT) |
| 26px | 3 (0.9%) | SUIT Bold 헤딩 |

비정상 값: 15.1578…px, 10.136…px → FK Raster Blended 폰트의 스케일 보정값으로 추정

[STAT:n] n=343
[STAT:effect_size] 16px 단일 값이 전체의 49.6% 차지 — 강한 기본 크기 수렴

---

## [FINDING 6] Typography — Line Height 배율

height/fontSize 비율로 추정한 line-height:

| 배율 | 빈도 | CSS 환산 |
|------|------|----------|
| 1.44 | 73회 | ~144% — Body standard |
| 1.2 | 54회 | 120% — SF Pro 기본 |
| 1.38 | 37회 | ~138% |
| 2.0 | 30회 | 200% — spacious heading |
| 1.0 | 24회 | 100% — tight/display |
| 1.39 | 23회 | ~140% |
| 1.31 | 19회 | ~130% |
| 2.75 | 12회 | 275% — SUIT/ABC 대형 타이틀 |

[STAT:n] n=343 (단일라인 추정 가능한 노드)
[STAT:effect_size] 1.44배가 가장 빈도 높은 line-height — Body text 기준값

---

## [FINDING 7] Font Style 분포

| Style | Count | 비율 |
|-------|-------|------|
| Blended | 169 | 49.3% | FK Raster 전용 스타일 |
| Regular | 149 | 43.4% | ABC Diatype / SF Pro / Pretendard |
| Black | 12 | 3.5% | ABC Diatype 강조 |
| SemiBold | 6 | 1.7% | SUIT heading |
| Bold | 4 | 1.2% | SUIT title |
| Semibold | 3 | 0.9% | SF Pro (대소문자 혼용 주의) |

[STAT:n] n=343
[LIMITATION] SemiBold vs Semibold — 동일 weight의 폰트 패밀리별 표기 불일치. 토큰 정의 시 통일 필요.

---

## [LIMITATION]

1. **cornerRadius / padding / itemSpacing / layoutMode 데이터 부재**: scan_nodes_by_types 스캔 결과에 해당 속성이 포함되지 않음. bbox(x, y, width, height)만 반환됨. 실제 spacing 토큰을 위해서는 get_node_info 또는 read_my_design으로 개별 노드 상세 조회 필요.
2. **fills/color 데이터 부재**: text node에 fills 필드 없음. 색상 토큰은 별도 스캔 필요.
3. **letterSpacing 데이터 부재**: scan_text_nodes 결과에 포함되지 않음.
4. **비정상 fontSize**: 15.1578…px, 10.136…px 등 부동소수점 값이 존재 — 실제 토큰 값인지 auto-resize 결과인지 확인 필요.
5. **Chat section 한정**: File2는 Chat section만 스캔. Home/Onboarding 등 다른 섹션 포함 시 분포 달라질 수 있음.
6. **미인가 폰트**: FK Raster Roman Compact Trial, ABC Diatype Unlicensed Trial — 프로덕션 배포 전 라이선스 검토 필요.

---

## 토큰 초안 요약 (추출된 값 기반)

```
// Spacing scale (bbox height 분포 기반)
spacing-1: 4px
spacing-2: 8px
spacing-4: 16px
spacing-5: 20px
spacing-7: 28px
spacing-8: 32px
spacing-9: 36px
spacing-10: 40px
spacing-11: 44px
spacing-13: 52px

// Container widths
container-full: 376px
container-content: 344px   (full - 2×16 padding)
container-half: 168px      (2-column unit)

// Typography — font sizes
text-micro: 10px
text-caption: 13px
text-body: 16px
text-subhead: 20px
text-title-ios: 22.5px
text-title: 26px
text-heading: 32px

// Line heights (추정)
leading-tight: 1.2
leading-normal: 1.38~1.44
leading-relaxed: 2.0

// Component heights
component-divider: 4px
component-icon-sm: 16px
component-icon-md: 20px
component-chip: 28px
component-row: 32px
component-button: 40~44px
component-list-item: 52px
component-card: 104px
```
