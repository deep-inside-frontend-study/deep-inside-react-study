## React는 함수 컴포넌트의 Hook 상태를 “단일 연결 리스트(singly linked list)”로 관리
- react 코드 링크: [packages/react-reconciler/src/ReactFiberHooks.js](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L992)

### 1. Hook 객체 구조
- React는 Hook 객체들을 단일 연결 리스트(singly linked list) 형태로 만들어 Fiber에 연결하여 상태를 관리
  ```tsx
  type Hook = {
    memoizedState: any, // 현재 Hook의 상태 값 (useState, useReducer 등)
    baseState: any, // 업데이트 계산의 기준이 되는 상태
    baseQueue: Update<any, any> | null, // 처리되지 않은 업데이트 queue
    queue: any, // state 업데이트를 저장하는 queue
    next: Hook | null, // 다음 Hook을 가리키는 포인터
  };
  ```
  - 위 next 필드로 Hook들은 단일 연결 리스트 구조로 연결됨
### 2. Hook 리스트는 Fiber에 저장된다
- React는 각 함수 컴포넌트를 Fiber 객체로 표현됨
- Hook 리스트의 head는 Fiber의 memoizedState 필드에 저장됨  `currentlyRenderingFiber.memoizedState = workInProgressHook = hook;`
  ```tsx
  Fiber (FunctionComponent)
  │
  └ memoizedState
       │
       ▼
     Hook1 → Hook2 → Hook3
  ```
  - 위와 같이 하나의 함수 컴포넌트는 Hook 연결 리스트 하나를 가진다
 
### 3. Hook 생성 과정 (mount)
- 컴포넌트가 처음 렌더링될 때 React는 Hook을 생성하여 리스트에 추가
- 해당 동작은 mountWorkInProgressHook 함수에서 수행
  ```tsx
  function mountWorkInProgressHook(): Hook {
    const hook: Hook = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null,
    };
  
    if (workInProgressHook === null) {
      // 첫 번째 Hook
      currentlyRenderingFiber.memoizedState = workInProgressHook = hook;
    } else {
      // 리스트 끝에 추가
      workInProgressHook = workInProgressHook.next = hook;
    }
  
    return workInProgressHook;
  }
  ```
- 이 함수의 핵심 동작은 아래 3가지
  - 새로운 Hook 객체 생성
  - 현재 Fiber의 Hook 리스트에 연결
  - 리스트 끝에 append
- 위와 같이 append를 함으로써 렌더링 순서대로 실행된 hook이 리스트에 추가되게 됨

### 4. Hook 업데이트 과정
- 컴포넌트가 다시 렌더링되면 React는 기존 Hook 리스트를 순회하면서 상태를 가져옴
- 해당 동작은 [updateWorkInProgressHook](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L1000) 함수에서 수행
  ```tsx
  function updateWorkInProgressHook(): Hook {
    let nextCurrentHook;
  
    if (currentHook === null) {
      const current = currentlyRenderingFiber.alternate;
      nextCurrentHook = current !== null ? current.memoizedState : null;
    } else {
      nextCurrentHook = currentHook.next;
    }
  
    currentHook = nextCurrentHook;
  }
  ```
- 업데이트 과정에서 `currentHook = currentHook.next` 이렇게 hook을 읽는 것임
- 위와 같이 React는 연결 리스트를 순서대로 이동하면서 Hook 상태를 읽음

### 5. Hook 규칙이 존재하는 이유
- React Hook에는 아래 2개의 규칙이 있음
  - Hook은 항상 같은 순서로 호출되어야 한다
  - 조건문이나 반복문 안에서 Hook을 호출하면 안 된다
- 이 규칙의 이유는 바로 Hook이 연결 리스트 순서로 관리되기 때문이다.
- 예를 들어 다음 코드가 있다고 하자.
  ```tsx
  if (flag) {
    useEffect(...)
  }
  ```
- 이 경우 렌더링마다 Hook 호출 순서가 달라질 수 있다.
  ```
  렌더1 - flag true
  Hook1 → Hook2 → Hook3
  
  렌더2 - flag false
  Hook1 → Hook3
  ```
- 그러면 React는 기존 Hook 리스트와 새로운 Hook 호출 순서를 맞출 수 없게 됨
  -> 그래서 Hook은 반드시 항상 동일한 순서로 호출되게끔 규칙이 있는 것임

### 정리
- 리액트는 렌더링 시 React는 다음 과정을 수행한다.
  1. 컴포넌트 렌더 시작
  2. Hook 호출 시 Hook 노드 생성 또는 조회
  3. Hook을 링크드 리스트에 추가
  4. Fiber.memoizedState에 저장
  5. 다음 렌더링에서는 리스트를 순회하며 링크드 리스트에 저장된 상태를 가져옴
