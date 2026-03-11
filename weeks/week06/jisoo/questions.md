## Q1. React가 이미 Virtual DOM diff를 하는데 왜 memo가 필요했을까? 
| VDOM diff  | memo           |
| ---------- | -------------- |
| DOM 변경 최소화 | 컴포넌트 실행 자체 최소화 |


### Virtual DOM이란
- “DOM 변경을 최소화”하는 기술
- “렌더 호출 자체를 막는 기술”이 X

#### 동작 진행 순서
1. 부모가 렌더됨
2. 자식 컴포넌트 함수가 다시 실행됨
3. 새로운 Virtual DOM 생성
4. 이전 VDOM과 diff
5. DOM 변경 여부 판단 <br/>
→→ 즉, 함수 실행은 이미 일어남

### React.memo
- 자식 컴포넌트 함수 실행 자체를 스킵하는 장치



## Q2. React Compiler가 보편화되면 프론트엔드 개발자의 “성능 최적화 역량”은 덜 중요해질까? 
→ “최적화 기술”은 덜 중요해지고 “아키텍처 설계 능력”은 더 중요해질 것 같다

#### React Compiler가 해주는 것
- 자동 메모이제이션
- 자동 dependency 분석
- 자동 추적

#### 우리가 키워야하는 능력
- 상태를 어디에 둘지 결정
- 전역 상태 범위 설계
  - ex. zustand에서 selector의 범위를 잘게 쪼개자
- Server vs Client 경계
- Suspense 경계 설계
- 데이터 fetching 전략
- 캐싱 전략



## Q3. Compiler가 외부 상태 라이브러리(Zustand 등)까지 완벽히 최적화할 수 있을까?
→ 불가능
- Compiler는 React 컴포넌트 내부 코드만 분석 가능
- Zustand 는 React 바깥에 있음 + store.subscribe 기반 + 외부 mutable 상태
  - React 밖에서 mutation 발생 → React는 “결과”만 받음