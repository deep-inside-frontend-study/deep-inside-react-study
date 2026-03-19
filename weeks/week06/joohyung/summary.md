# 16 ~ 17 장

## 16장 리액트 컨텍스트와 에러바운더리, 서스펜스

### 에러바운더리

- 하위 컴포넌트에서 발생하는 에러를 포착, fallback

#### 에러 전파

- 에러가 발생하면 ErrorBoundary를 만나기 전까지 상위로 전파
- 다음과 같은 상황에서는 캡쳐 못함
  - 이벤트 핸들러 내
  - 서버사이드 렌더링
  - 비동기함수
  - ErrorBoundary에서 스스로 다시 throw하는 경우

### context api

- props drilling 문제 해결
- 근데 Provider의 value가 바뀌면 해당 context 사용하는 모든 컴포넌트가 리렌더링
  - 해결방법
    - 관심사에 따라 함수 분리하기
    - 셀렉터 패턴 사용하기

### Suspense

- 16.6에서 처음 도입
- 처음에는 분할된 컴포넌트가 로딩될 때 까지 fallback ui를 보여주기 위함
  - 이를 통해 초기 번들 크기 개선

### 서스펜스 내부 구현과 동작 원리

- Promise를 throw하는 원리
- Suspense는 Promise 기반 제어 흐름을 사용
- 컴포넌트 렌더링 중 Promise가 throw되면
- React는 해당 컴포넌트 렌더링을 일시 중단(Suspend)

1. 컴포넌트 렌더링 중 Promise 발생

2. React가 Promise를 catch (실제로 catch로잡음)

3. Suspense의 fallback UI 렌더링

   - wip트리 만듬
   - current Tree의 child를 fallback으로 교체
   - 기존 자식은 삭제하지 않고 유지
   - 커밋

4. Promise resolve

   - 폴링으로 확인하지 않고 resolve되면 스케줄러에게 전달

5. 다시 커밋
   - 다시 새로운 wip 트리 생성
   - 유지해놓았던 원래 자식 복원

### use

#### 컨텍스트와 프로미스 읽기

use는 Context와 Promise 둘 다 읽을 수 있음

```
const data = use(fetchData())
const theme = use(ThemeContext)
```

Promise라면 resolve될 때까지 Suspense가 fallback 렌더

Context라면 현재 Provider의 value 반환

#### 프로미스 결과 풀어내기

- 기존 문제점
  - 워터폴
  - 복잡한 상태관리
  - race condition -> cleanup 함수 필요
- 근데 사실 이건 tanstack query가 애초에 다 해결해주고있었음

#### 조건문안에서 사용 가능한 이유?

- use는 Hook 상태를 내부적으로 저장하지 않음 (memoizedState와 독립적)

- React의 Hook 호출 순서 규칙에 의존하지 않음

- 단순히 Promise나 Context 값을 읽는 함수처럼 동작

## 17장 리액트 동시성과 심화 훅

### useLayoutEffect, useInsertionEffect

#### useLayoutEffect

- 페인트 전에 실행
- dom 측정과 시각적 불일치 해결

#### useInsertionEffect

- useLayoutEffect 보다 더 전에 실행
- 브라우저가 Dom 변경사항 커밋 전에 작동
- css-in-js에서 useLayoutEffect 이전에 스타일이 주입되어야하는데, 이를 해결할수있음

### useImperativeHandle

- 단방향인 흐름을 역전
- 부모에게 받은 ref를 직접 제어할수있음
