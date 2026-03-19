### useTransition과 Debounce/Throttle 의 차이

#### 공통점
- 잦은 업데이트로 인한 성능 저하를 막기

#### 처아좀
- 시간 중심(Time-based) 제어 vs 우선순위 중심(Priority-based) 제어

| 구분 | Debounce / Throttle | useTransition (React 18+) |
| --- | --- | --- |
| 제어 대상 | 이벤트 발생 횟수 (함수 실행 자체) | 상태 업데이트 우선순위 (렌더링) |
| 기다리는 것 | 개발자가 설정한 고정 시간 (예: 300ms) | 브라우저의 가용 자원 (CPU 여유) |
| 주요 목적 | 서버 부하 감소, 무거운 연산 횟수 줄이기 | UI 반응성 유지, 화면 버벅임(Jank) 방지 |
| 중단 가능성 | 불가 (한 번 실행되면 끝까지 수행) | 가능 (더 급한 입력 오면 기존 렌더링 취소) |
| 사용 케이스 | 이벤트 횟수 제한: API 호출 낭비 방지, 스크롤 이벤트 최적화 | UI 반응성 유지: 무거운 화면 전환이나 필터링 시 입력 버벅임 방지 |


- React 공식 문서 - useTransition: https://react.dev/reference/react/useTransition
- React 공식 문서 - useDeferredValue: https://react.dev/reference/react/useDeferredValue
