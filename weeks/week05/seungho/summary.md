## 이번 주 핵심 요약

# chapter 13. 리액트 훅의 사용 규칙 돌아보기

- 훅은 리액트의 함수형 컴포넌트에서 상태와 라이프사이클 기능을 사용할 수 있도록 하는 기능이다. 흐름 중간에 원하는 동작을 실행하는 뜻을 가지고있다.

- 클래스 컴포넌트에서 함수형 컴포넌트로 전환하면서 기존에 클래스 가지고 있던 문제점들을 해결할 수 있었는데, 클래스 컴포넌트에서 상태와 라이프사이클 기능을 사용할 때는, `this` 키워드를 사용하여 상태와 라이프사이클 메서드에 접근해야 했다. 두번째는 고차 컴포넌트 (Higher-Order Component)를 사용하여 컴포넌트를 래핑하는 방식으로 상태와 라이프사이클 기능을 사용할 때는, 컴포넌트 트리가 복잡해지고, props를 추적하기 용이하지 않았다.

- 훅은 최상위 레벨에서만 호출되어야 한다. 즉, 훅은 컴포넌트의 최상위 레벨에서만 호출되어야 하며, 조건문이나 반복문 내부에서 호출되어서는 안 된다. 이는 훅이 컴포넌트의 렌더링 과정에서 일관된 순서로 호출되어야 하기 때문이다. 상태는 단일 링크드 리스트로 관리되는데, 훅 노드를 생성하고 훅이 호출될 때마다 이 링크드 리스트에 새로운 노드를 추가하는 방식으로 상태를 관리한다. 조건문이나 반복문 내부에서 훅을 호출하면, 훅이 호출되는 순서가 달라질 수 있기 때문에, 상태 관리에 문제가 발생할 수 있다.

- 연결리스트를 만드는 에시

```js
let currentlyRenderingFiber = null; // 현재 렌더링 중인 컴포넌트
let workInProgressHook = null; // 현재 처리 중인 훅
let isMount = false; // 컴포넌트가 처음 렌더링되는지 여부를 나타내는 변수

function renderWithHooks(fiber) {
  currentlyRenderingFiber = fiber; // 현재 렌더링 중인 컴포넌트를 가져옴
  workInProgressHook = null; // 포인터 초기화
  isMount = currentlyRenderingFiber.memoizedState === null; // 처음 렌더링인지 여부 설정

  fiber.type(fiber.props);

  // 컴포넌트 렌더링 로직...
}
```

- 랜더링이 시작되고 각 훅이 순차적으로 실행될때 실행 되는 내부 함수들

```js
function useState(initialState) {
  let hook = mountWorkInProgressHook(); // 현재 처리 중인 훅을 가져옴
  hook.memoizedState = isMount ? initialState : hook.memoizedState; // 초기 상태 설정
  const setState = (action) => {
    const update = {
      action,
      next: null,
    };

    if (hook.updateQueue === null) {
      hook.updateQueue = {
        pending: null,
      };
      update.next = update; // 첫 번째 업데이트인 경우, 업데이트가 자기 자신을 가리키도록 설정 (circular linked list)
    } else {
      update.next = hook.updateQueue.pending.next; // 새로운 업데이트의 next를 현재 대기 중인 업데이트의 다음으로 설정
      hook.updateQueue.pending.next = update; // 현재 대기 중인 업데이트의 다음을 새로운 업데이트로 설정
    }

    hook.updateQueue.pending = update; // 대기 중인 업데이트를 새로운 업데이트로 설정
  };

  return [hook.memoizedState, setState]; // 현재 상태와 상태 업데이트 함수를 반환
}

function mountWorkInProgressHook() {
  const hook = {
    memoizedState: null, // 훅의 현재 상태
    updateQueue: null, // 상태 업데이트를 관리하는 큐
    next: null, // 다음 훅을 가리키는 포인터
  };

  if (workInProgressHook === null) {
    currentlyRenderingFiber.memoizedState = hook; // 첫 번째 훅인 경우, 컴포넌트의 memoizedState에 할당 (head of the linked list)
    workInProgressHook = hook; // 현재 처리 중인 훅을 설정
  } else {
    workInProgressHook.next = hook; // 이전 훅의 next 포인터를 현재 훅으로 설정
    workInProgressHook = hook; // 현재 처리 중인 훅을 설정
  }

  return workInProgressHook; // 현재 처리 중인 훅을 반환
}
```

- 훅이 호출되는 순서가 달라지면, `workInProgressHook`이 다음 훅을 가리키는 방식이 깨질 수 있기 때문이다. 예를 들어, 조건문 내부에서 훅을 호출하는 경우, 조건이 참일 때와 거짓일 때 훅이 호출되는 순서가 달라질 수 있다. 이로 인해 `workInProgressHook`이 next로 다음 훅을 가리키는 방식이 깨질 수 있다. 마찬가지로 반복문 내부에서 훅을 호출하는 경우, 반복이 실행되는 횟수에 따라 훅이 호출되는 순서가 달라질 수 있다. 이로 인해 `workInProgressHook`이 next로 다음 훅을 가리키는 방식이 깨질 수 있다.

- 오직 리액트 함수 내에서만 훅을 호출해야되는 이유는 어떤 컴포넌트를 랜더링하고 있는지 대한 정보인 랜더링 컨텍스트를 유지하기 위해서이다. 이 랜더링 컨텍스트는 훅이 호출되는 순서를 보장하기 위해서 필요하다.

- 훅의 의존성 배열이나 인자로 전달하는 객체·배열은 불변성을 유지해야 한다. React는 의존성 비교 시 얕은 비교(shallow comparison)를 사용하기 때문에, 원본을 직접 수정하면 참조가 바뀌지 않아 변경을 감지하지 못한다. 따라서 변경이 필요할 때는 원본을 수정하지 말고, 복사본을 만들어 변경 사항을 적용한 새로운 객체·배열을 반환해야 한다.

# chapter 14. 리액트 필수 훅 돌아보기

- useState(initialState)

  - 초기값으로 함수를 전달해서 lazy loading을 할 수 있다.
  - `setState`는 스케줄링된다. 당연히 다음 줄에 `console.log` 찍어도 업데이트 된 값이 반영되지 않는다. 왜냐하면 `setState`는 스케줄링이 되는데 그때 함수 변수 등 스코프를 스냅샷 형태로 저장하고 상태를 업데이트 하기때문이다. 단, 함수형 업데이트를 사용하면 상태를 업데이트 하기 전에 함수를 실행하고 그 결과를 상태로 업데이트 하기 때문에 업데이트 된 값이 반영된다. 따라서 이러한 패턴을 적절히 사용하는 것이 좋다.

- useEffect(callback, dependencies)

  - 생명주기 메서드 조합이라기 보다는 외부 시스템과 상태를 일치시키는 역할을 한다는 관점으로 이해하는것이 좋다.
  - 의존성 배열에 콜백함수에 있는 함수를 넣어주는 것이 좋다. 왜냐하면 외부 스코프에 있는 함수는 매번 새로운 객체로 생성되기 때문에 무한 실행 가능해질 수 있다. 따라서 함수를 `useCallback`으로 메모이제이션 해주는 것이 좋다.
  - 비동기 작업에서는 콜백 함수 내에서 조건부로 상태를 업데이트하는 패턴이 있다. 응답이 오기 전에 컴포넌트가 언마운트된 경우, 플래그를 이용해 컴포넌트가 더 이상 마운트되어 있지 않음을 감지하고, 그 시점에서는 상태 업데이트를 하지 않아 비동기 작업의 부작용을 방지하는 패턴이다.

- useRef(initialValue)

  - 렌더링과 무관하게 값을 보관한다. `.current` 값을 변경해도 리렌더링이 발생하지 않는다. useState와 달리 상태 변경 시 리렌더링이 필요하지 않은 값을 다룰 때 적합하다.
  - DOM 요소에 직접 접근할 때 사용한다. `ref` 속성에 ref 객체를 전달하면 해당 DOM 노드에 접근할 수 있어, 포커스 제어, 스크롤 위치, 애니메이션 등에 활용된다.
  - 컴포넌트가 리렌더링되어도 ref 객체는 동일한 참조를 유지한다. 따라서 타이머 ID, 이전 props/state 값, 인스턴스 변수처럼 컴포넌트 생명주기 동안 유지되어야 하는 값을 저장하는 데 사용할 수 있다.

- forwardRef(component)

  - 부모 컴포넌트에서 자식 컴포넌트의 DOM 노드나 인스턴스에 접근하기 위해 `ref`를 전달할 때 사용하는 HOC이다. 함수형 컴포넌트는 기본적으로 `ref`를 props로 받지 않기 때문에, React 18 이전에는 `forwardRef`로 감싸서 두 번째 인자로 `ref`를 받아야 했다.
  - React 19 변경 사항: `ref`가 일반 props처럼 전달되도록 변경되었다. `forwardRef` 없이도 함수형 컴포넌트에서 `ref`를 props로 직접 받을 수 있다. `forwardRef`는 하위 호환을 위해 동작하지만, 더 이상 필요하지 않다.
  - React 19 권장 패턴: `const MyInput = ({ ref, ...props }) => <input ref={ref} {...props} />` — `ref`를 props에서 구조 분해하여 받고, DOM 요소에 그대로 전달하면 된다.
  - 변경 배경 — 새로운 JSX 트랜스폼 `jsx()`, `jsxs()`: React 19는 `ref`를 일반 prop으로 전달하기 위해 새로운 JSX 트랜스폼을 필수로 요구한다. 기존 트랜스폼은 JSX를 `React.createElement(type, props, ...children)`로 변환했고, 이때 `ref`는 props에서 분리되어 별도로 처리되었다. 반면 새로운 트랜스폼은 `jsx()`(자식 1개 이하)와 `jsxs()`(자식 여러 개)를 사용하며, `ref`를 포함한 모든 속성을 하나의 props 객체로 전달한다. 이 구조 덕분에 `ref`가 일반 prop처럼 취급될 수 있고, `forwardRef` 없이도 ref 전달이 가능해졌다.

- useReducer(reducer, initialState)

  - 복잡한 상태 로직을 reducer 함수로 분리하여 관리하는 훅이다. `(state, action) => newState` 형태의 reducer와 초기값을 받으며, `[state, dispatch]`를 반환한다. 여러 하위 값이 서로 연관되어 있거나, 다음 state가 이전 state에 의존하는 경우 useState보다 적합하다.
  - dispatch로 action을 보내면 reducer가 새 state를 계산하고, 변경 시 리렌더링이 발생한다. useState의 함수형 업데이트와 유사하지만, 로직을 컴포넌트 밖으로 빼낼 수 있어 테스트와 재사용이 용이하다.

- React Portal
  - 자식 컴포넌트를 DOM 계층 구조상 부모가 아닌 다른 DOM 노드에 렌더링하는 기능이다. `createPortal(children, domNode)` 형태로 사용하며, 모달·툴팁·드롭다운처럼 DOM 상위 레벨에 렌더링해야 할 때 유용하다.
  - Portal로 렌더링된 자식도 React 트리의 일부이므로 이벤트 버블링, Context 등은 부모 기준으로 동작한다. 스타일·레이아웃 격리가 필요한 UI를 구현할 때 활용된다.

# chapter 15. 리액트 메모이제이션 돌아보기

- 메모이제이션은 이전 값을 기억하고 비교하는 데 메모리·연산 비용이 든다. 이 비용을 넘어서는 지점에서만 최적화 이점이 발생한다.

- 리액트 메모이제이션 내부 동작
  - Fiber 노드는 `memoizedProps`, `memoizedState`에 이전 렌더 결과를 저장한다. `pendingProps`는 다음 렌더에서 사용할 새 props다.
  - `beginWork` 단계에서 컴포넌트를 처리할 때, props가 바뀌지 않았는지 확인한다. `current.memoizedProps`와 `workInProgress.pendingProps`를 비교해 같으면 bailout하여 해당 노드와 하위 트리 렌더를 생략한다.
  - `memo`로 감싼 컴포넌트는 `REACT_MEMO_TYPE`으로 표시되며, `beginWork`에서 `shallowEqual`(또는 커스텀 compare)로 props를 비교한다. 같으면 자식으로 포인터를 내려가지 않고 이전 결과를 재사용한다.
  - `useMemo`, `useCallback`은 Hook의 `memoizedState`에 이전 값을 저장한다. 렌더 시 의존성 배열을 `Object.is`로 비교해, 바뀐 항목이 없으면 저장된 값을 그대로 반환한다.

- memo(Component)
  - 컴포넌트의 렌더링 결과를 메모이제이션한다. props가 이전과 동일하면 리렌더링을 건너뛰고 이전 결과를 재사용한다.
  - 기본적으로 `Object.is()`로 이전 props와 현재 props를 비교한다. 두 번째 인자로 커스텀 비교 함수를 넘겨 비교 로직을 바꿀 수 있다.
  - Fiber에서 bailout이 발생하면 자식으로 포인터가 내려가지 않아 하위 트리 렌더링이 생략된다. 계층이 깊은 리스트 아이템 등에서 효과적이다.
  - props로 매번 새로 생성되는 객체·함수를 넘기면 memo가 무력화된다. 이 경우 `useCallback`, `useMemo`로 props를 안정화해야 한다. 단순한 컴포넌트(breadcrumb 등)는 비교 비용이 더 커서 오히려 비효율적일 수 있다.
  - `children`으로 memo된 컴포넌트를 넘길 때, 부모가 리렌더링되면 `createElement()`가 매번 새 객체를 만들어 자식도 리렌더링된다. 이때 `children`을 `useMemo`로 감싸면 해결된다.

- useMemo(compute, dependencies)
  - 연산 결과를 메모이제이션한다. 의존성 배열의 값이 바뀔 때만 `compute`를 다시 실행한다.
  - 복잡한 계산, 파생 상태, 특정 상태 변경 시에만 재계산이 필요한 경우에 사용한다. 단순한 표현식(원시값 반환)은 `useMemo`로 감싸는 것보다 그냥 계산하는 편이 나을 수 있다.

- useCallback(fn, dependencies)
  - 함수를 메모이제이션한다. 의존성이 바뀔 때만 새 함수를 생성한다.
  - memo된 자식에 함수를 props로 넘길 때, `useCallback` 없이 넘기면 매 렌더마다 새 함수가 생성되어 memo가 깨진다. `useCallback`으로 참조를 고정해야 한다.
  - `useEffect` 의존성에 함수를 넣을 때도, `useCallback`으로 감싸지 않으면 매 렌더마다 effect가 재실행될 수 있다.

- 리액트 컴파일러 (React 19)
  - 개념: React Compiler(이전 React Forget)는 빌드 타임 최적화 컴파일러로, JavaScript 지식과 React 규칙을 이용해 컴포넌트·훅 내부의 값들을 자동으로 메모이제이션한다. AST를 자체 HIR(고수준 중간 표현)로 변환한 뒤, 여러 컴파일 패스를 통해 데이터 흐름과 가변성을 분석한다. 이를 바탕으로 렌더에 사용되는 값을 세분화해 메모이제이션 코드를 삽입하며, 조건부 반환 이후처럼 수동 `useMemo`/`useCallback`으로는 불가능한 구간까지 최적화할 수 있다. React 규칙을 인코딩한 검증 패스로 규칙 위반·잠재 버그를 진단하기도 한다.
  - 해결하는 문제: (1) 연쇄 리렌더 — 부모 리렌더 시 props가 안 바뀐 자식까지 리렌더되는 문제를 자동으로 스킵. (2) 불필요한 재계산 — 파라미터가 같음에도 매 렌더마다 무거운 계산이 실행되는 문제를 컴포넌트·훅 내부에서 자동 메모이제이션한다.
  - 등장 배경: 수동 메모이제이션(memo, useMemo, useCallback)은 코드 복잡도를 높이고, 의존성 배열·stale closure 등 실수하기 쉽다. 이 한계를 보완하기 위해 React Compiler가 도입되었다.
  - 역할: 빌드 타임에 코드를 분석하여 자동으로 메모이제이션을 적용한다. `useMemo`, `useCallback`, `memo` 없이 작성해도 컴파일러가 최적화된 코드를 생성한다. 함수·객체 참조를 안정화하고, props·JSX 트리의 세밀한 변경만 감지하는 fine-grained reactivity를 제공한다.
  - 적용 범위: 컴포넌트와 훅 내부의 연쇄 리렌더 스킵, 비용 큰 계산 메모이제이션. 컴포넌트·훅이 아닌 일반 함수는 메모이제이션 대상이 아니다.
  - "use memo" 지시어: `compilationMode: 'annotation'`일 때, 최적화할 컴포넌트·훅에 `"use memo"`를 명시한다. `infer`(기본)는 PascalCase 컴포넌트와 `use` 접두사 훅을 자동 감지하고, `all`은 전부 최적화한다.
  - 설치: `babel-plugin-react-compiler` 사용. Next.js 15.3.1+에서는 swc 기반 React Compiler를 지원한다. Babel, Vite, Metro 등에서 사용 가능하다.
  - 수동 메모이제이션: 컴파일러 사용 시에도 `useMemo`, `useCallback`은 escape hatch로 남아 있으며, effect 의존성 등 세밀한 제어가 필요할 때 사용할 수 있다. 기존 코드의 수동 메모이제이션은 제거 시 컴파일 결과가 달라질 수 있으므로 신중히 제거한다.
  - 상태: 안정화되었으며, Meta·Instagram 등에서 프로덕션에 사용 중이다.
