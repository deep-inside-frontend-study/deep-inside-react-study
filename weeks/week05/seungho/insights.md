## useState updateQueue — React 실제 구현

책에는 없지만 summary에 추가한 **updateQueue(circular linked list)** 구조는 React 소스와 동일한 방식이다.  
**검증**: [ReactFiberHooks.js](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js) 및 [ReactFiberConcurrentUpdates.js](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberConcurrentUpdates.js)

---

### 1. Summary 예시 (단순화된 구현)

```js
const setState = (action) => {
  const update = {
    action,
    next: null,
  };

  if (hook.updateQueue === null) {
    hook.updateQueue = { pending: null };
    update.next = update; // 첫 업데이트: 자기 자신을 가리킴 (circular)
  } else {
    update.next = hook.updateQueue.pending.next; // 새 업데이트 → 기존 첫 번째
    hook.updateQueue.pending.next = update; // 기존 마지막 → 새 업데이트
  }

  hook.updateQueue.pending = update; // pending은 항상 "가장 최근에 추가된" 업데이트
};
```

---

### 2. React 소스 (enqueueRenderPhaseUpdate)

렌더 단계에서 `setState` 호출 시 사용. **동일한 circular list 로직** 사용.

```js
// ReactFiberHooks.js L3818-L3836
function enqueueRenderPhaseUpdate(queue, update) {
  const pending = queue.pending;
  if (pending === null) {
    update.next = update; // 첫 업데이트: circular list 생성
  } else {
    update.next = pending.next; // 새 업데이트가 기존 첫 번째를 가리킴
    pending.next = update; // 기존 마지막이 새 업데이트를 가리킴
  }
  queue.pending = update;
}
```

**참조**: [enqueueRenderPhaseUpdate (L3818-L3836)](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L3818-L3836)

---

### 3. 동시 업데이트 경로 (enqueueConcurrentHookUpdate)

이벤트 핸들러 등에서 `setState` 호출 시에는 `enqueueConcurrentHookUpdate` → `finishQueueingConcurrentUpdates`를 거친다.  
**동일한 circular list 로직**이 `finishQueueingConcurrentUpdates` 내부(L69-L78)에 있다.

**참조**: [finishQueueingConcurrentUpdates (L52-L84)](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberConcurrentUpdates.js#L52-L84)

---

### 4. Circular linked list 동작 예시

`setState(1)` → `setState(2)` → `setState(3)` 순으로 호출되면:

```
[첫 번째 setState(1)]
  pending → update1 (action: 1, next: update1)  // 자기 자신 참조

[두 번째 setState(2)]
  pending → update2 (action: 2, next: update1)
  update1.next → update2

[세 번째 setState(3)]
  pending → update3 (action: 3, next: update1)
  update2.next → update3
  update1.next → update2

// pending이 "가장 최근"을 가리키고, pending.next부터 순회하면 update1 → update2 → update3
```

처리 순서는 `rerenderReducer`(L1596-L1611)에서 `firstRenderPhaseUpdate = lastRenderPhaseUpdate.next`로 첫 업데이트를 얻은 뒤, `update.next`로 순회하며 확인할 수 있다.

**참조**: [rerenderReducer (L1596-L1611)](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L1596-L1611)

---

### 5. React Hook / UpdateQueue 타입

```js
// ReactFiberHooks.js L195-L201, L174-L180, L164-L172
type Hook = {
  memoizedState: any,
  baseState: any,
  baseQueue: Update | null, // 스킵된 업데이트 보관
  queue: UpdateQueue, // summary의 updateQueue에 해당
  next: Hook | null,
};

type UpdateQueue = {
  pending: Update | null, // circular linked list의 tail (가장 최근 업데이트)
  lanes: Lanes,
  dispatch: ((A) => mixed) | null,
  lastRenderedReducer: ((S, A) => S) | null,
  lastRenderedState: S | null,
};

type Update = {
  lane: Lane,
  action: A,
  next: Update,
  // ... hasEagerState, eagerState, gesture 등
};
```

**참조**:

- [Hook 타입 (L195-L201)](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L195-L201)
- [UpdateQueue 타입 (L174-L180)](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L174-L180)
- [Update 타입 (L164-L172)](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L164-L172)

---

- pending circular list 로직은 **렌더 단계**와 **동시 업데이트** 경로 모두에서 동일하게 사용된다.
