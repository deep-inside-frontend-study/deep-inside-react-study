## performUnitOfWork 심층 분석

### 전체 구조

`performUnitOfWork`는 Fiber 작업 루프에서 **하나의 Fiber 노드를 처리하는 함수**다.

```js
function performUnitOfWork(unitOfWork) {
  const next = beginWork(current, unitOfWork, renderLanes);
  unitOfWork.memoizedProps = unitOfWork.pendingProps;

  if (next !== null) {
    workInProgress = next; // 자식이 있으면 → 자식으로 이동
  } else {
    completeUnitOfWork(unitOfWork); // 자식이 없으면 → 완료 처리
  }
}
```

### 1단계: beginWork (내려가기)

현재 Fiber 노드를 실행하는 단계다.

- 함수 컴포넌트 → 함수 실행 (hooks 포함)
- 클래스 컴포넌트 → `render()` 호출
- Host 컴포넌트(`div` 등) → props diff
- 반환값(JSX)을 기반으로 자식 Fiber를 생성/갱신 (`reconcileChildren`)
- 첫 번째 자식 Fiber를 반환

### 2단계: completeUnitOfWork (올라가기)

자식이 더 이상 없을 때 호출된다.

```js
function completeUnitOfWork(unitOfWork) {
  let completedWork = unitOfWork;
  do {
    completeWork(current, completedWork, renderLanes); // DOM 노드 생성, flags 수집

    const siblingFiber = completedWork.sibling;
    if (siblingFiber !== null) {
      workInProgress = siblingFiber; // 형제가 있으면 → 형제로 이동
      return;
    }
    completedWork = completedWork.return; // 형제도 없으면 → 부모로 올라감
    workInProgress = completedWork;
  } while (completedWork !== null);
}
```

### 순회 예시

```
        App
       /
    Header → Main
              /
           List → Footer

실행 순서:
beginWork(App)       → 자식 Header 반환
beginWork(Header)    → 자식 없음
completeWork(Header) → 형제 Main으로 이동
beginWork(Main)      → 자식 List 반환
beginWork(List)      → 자식 없음
completeWork(List)   → 형제 Footer로 이동
beginWork(Footer)    → 자식 없음
completeWork(Footer) → 형제 없음, 부모 Main으로
completeWork(Main)   → 형제 없음, 부모 App으로
completeWork(App)    → 루트 도달, 종료
```

### 동시성과의 관계

매 `performUnitOfWork` 호출마다 노드 하나만 처리하므로, `workLoopConcurrent`의 while 루프에서 `shouldYield()`를 통해 5ms마다 중단할 수 있다. 콜 스택은 중단하면 정보가 사라지지만, Fiber는 작업 상태를 힙 메모리의 객체에 저장하므로 `workInProgress` 포인터만 기억하면 언제든 이어서 처리할 수 있다.
