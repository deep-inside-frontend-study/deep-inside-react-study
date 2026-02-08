## 컴포넌트가 "단일 루트"를 반환해야 하는 이유 (Fiber 관점)

- 리액트는 각 컴포넌트 인스턴스를 `Fiber` 노드로 표현하고, 해당 Fiber는 렌더 결과의 시작점을 `child` 포인터 1개로 가진다.
- 여러 개의 형제 엘리먼트는 `child`(첫 자식) + `sibling`(형제 링크) 구조로 연결된다. 즉, 트리를 만들려면 "첫 시작점"이 1개 필요하다.
- 그래서 컴포넌트의 반환값이 루트 2개면(`A`와 `B`가 나란히 있음) 어떤 것을 `child`로 잡아야 하는지 시작점이 애매해지고, diff(이전 트리와 비교) 기준도 불명확해진다.
- `<div>` 래퍼는 실제 DOM 노드를 추가해서 시작점을 만들어주고, `<React.Fragment>`/`<>...</>`는 DOM 노드 없이도 Fiber 트리에서 부모 역할(시작점)을 만들어 형제들을 안정적으로 매달 수 있게 해준다.
- “jsxs 안에 jsxs가 들어갈 수 없다”는 설명은 오해다. `jsx/jsxs`는 자동 런타임에서 JSX를 함수 호출로 바꾸는 내부 헬퍼 이름이고, JSX 중첩은 정상적으로 중첩 호출로 컴파일된다.

### React 알고리즘 관점: 컴포넌트 반환값은 ReactNode 1개

- 자바스크립트 함수는 값 1개만 반환할 수 있고, 리액트는 그 반환값(`nextChildren`)을 입력으로 받아 자식 Fiber들을 만든다.
- 중요한 포인트는 "DOM 루트 1개"가 아니라 "리액트가 처리할 수 있는 ReactNode 1개"를 반환한다는 것.

### Fiber 구조에서 왜 시작점이 1개여야 할까?

- Fiber 트리는 "첫 자식(`child`) + 형제(`sibling`)" 링크드 구조로 연결된다.
- 한 컴포넌트(Fiber)는 자기 자식들의 시작점을 가리키는 `child` 포인터를 1개만 가진다.
- 형제가 10개여도 첫 자식을 `child`로 잡고, 나머지는 `sibling`으로 이어 붙이는 형태라 "첫 시작점"이 반드시 필요하다.

### 리컨실리에이션(reconcileChildren)에서 실제로 어떤 일이 벌어지나?

- 렌더 단계에서 리액트는 이전 트리(current)와 새 반환값(nextChildren)을 비교해서, 재사용할 Fiber는 재사용하고 필요한 Fiber만 새로 만든다.
- nextChildren 형태에 따라 다른 경로로 들어간다.
- 단일 엘리먼트면 type/key 비교로 1:1 매칭하기 쉽다.
- 배열/이터러블이면 리스트 리컨실리에이션을 수행한다.
- 이때 key가 없으면(또는 인덱스 기반이면) 중간 삽입/삭제에서 재사용 매칭이 흔들려서 불필요한 마운트/언마운트가 늘 수 있다.

```jsx
// 배열로 여러 형제 반환도 가능 (React 16+), key 필수
function Example() {
  return [<A key='a' />, <B key='b' />];
}
```

### Fragment는 "DOM 없는 래퍼"지만 Fiber에서는 부모 노드 역할을 함

- `<div>`로 감싸면 DOM 노드가 추가되어 레이아웃/CSS/접근성에 영향이 생길 수 있다.
- `Fragment`는 DOM을 추가하지 않지만, 리액트 내부 트리에서는 "묶음의 경계"가 생겨서 그 아래에 형제들을 안정적으로 달 수 있다.
- 그래서 "형제들을 한 덩어리로 반환"하면서도 DOM 구조를 오염시키지 않게 해준다.

### 왜 리액트가 자동으로 감싸주지 않나?

- `<div>` 자동 래핑은 DOM을 바꿔버려서 부작용이 너무 클것같다.
- `Fragment` 자동 래핑도 "어디에 경계를 만들지", "리스트 안에서 key를 어떻게 줄지" 같은 결정을 리액트가 임의로 해야 해서 예측 가능성이 떨어진다.
- 결국 "트리 모양(경계)은 개발자가 명시"하는 쪽이 디버깅/성능/의도 전달에 유리하다.

## useImperativeHandle로 ref에 노출할 값/메서드 커스터마이징하기

- `useImperativeHandle`은 Hooks가 도입된 **React 16.8+**부터 사용 가능하다.
- 이 훅은 부모가 `ref.current`로 접근할 때 "어떤 값(핸들)을 노출할지"를 컴포넌트 내부에서 명시적으로 정의하게 해준다.
- 보통 DOM 노드를 그대로 노출하는 대신, `focus()` 같은 제한된 API만 노출하고 싶을 때 쓴다.

### React 16.8 ~ 18: `forwardRef` + `useImperativeHandle`

```jsx
import React, { forwardRef, useImperativeHandle, useRef } from "react";

export const MyComponent = forwardRef(function MyComponent(props, ref) {
  const localRef = useRef(null);

  useImperativeHandle(
    ref,
    () => ({
      focus() {
        localRef.current?.focus();
      },
    }),
    [],
  );

  return <input {...props} ref={localRef} />;
});
```

### React 19: `ref`가 "prop"으로 전달됨 (그래서 `forwardRef` 없이도 가능)

```jsx
import React, { useImperativeHandle, useRef } from "react";

export function MyComponent(props) {
  const { ref, ...rest } = props;
  const localRef = useRef(null);

  useImperativeHandle(
    ref,
    () => ({
      focus() {
        localRef.current?.focus();
      },
    }),
    [],
  );

  return <input {...rest} ref={localRef} />;
}
```
