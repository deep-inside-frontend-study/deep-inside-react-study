### 16이전 합성 이벤트 과정

1. 이벤트 발생
2. pool에서 객체 꺼냄
3. handler 실행
4. 속성 null 초기화
5. pool로 다시 넣음

### reconciliation에서 element.type을 비교하는게 아니라 fiber.type - element.type비교함

- https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactChildFiber.js#L1708

```jsx
if (
  child.elementType === elementType ||
  // Keep this check inline so it only runs on the false path:
  (__DEV__
    ? isCompatibleFamilyForHotReloading(child, element)
    : false) ||
  // Lazy types should reconcile their resolved type.
  // We need to do this after the Hot Reloading check above,
  // because hot reloading has different semantics than prod because
  // it doesn't resuspend. So we can't let the call below suspend.
  (typeof elementType === 'object' &&
    elementType !== null &&
    elementType.$$typeof === REACT_LAZY_TYPE &&
    resolveLazy(elementType) === child.type)
) {
```

#### reconciliation 시작

- https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberBeginWork.js

#### reconciliation 과정에 관한 아티클

https://www.mo4tech.com/react-diff-algorithm-5.html

### reconcileChildrenArray

- https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactChildFiber.js#L1171
- 순차 키 비교
  - https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactChildFiber.js#L1201
- Map 생성
  - https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactChildFiber.js#L1303C1-L1304C1
