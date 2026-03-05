# 13 ~ 15장

## 13장 훅 사용 규칙

- 훅은 최상위에서 호출
- 순서가 바뀌게 되면 링크드리스트 순서가깨짐

## 14장 리액트 필수 훅

### useState

- localStorage와 같은 지연 초기화 가능

### useEffect

- 예약된 함수는 컴포넌트가 언마운트되도 실행이 되며, cleanup에서 해결해주지 않으면 에러를 발생시킨다.

### useRef

- 컴포넌트 전체 생명주기에 걸쳐 유지
- 원래는 forwardRef로 부모가 자식에게 props로 넘겨야했는데, 19로 오면서 deprecated

### useReducer

- state와 dispatch 패턴

## 15장 메모이제이션

### React.memo

- 컴포넌트 props를 shallow 비교하여 렌더링을 건너뜀
- 캐시 대상: 이전 props 결과
- 조건: `prevProps === nextProps`

### useMemo

- 계산 결과를 캐시
- deps가 바뀌지 않으면 이전 값 재사용

### useCallback

- 함수 reference를 캐시
- deps가 같으면 같은 함수 반환

### 리액트 컴파일러

- 자동 메모이제이션
- 캐스케이딩 렌더링 방지
- 코드 가독성 향상

- 이번 주 주제들은 기본적인 것들만 있어서 내용이 짧네요
