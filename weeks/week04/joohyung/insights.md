## SSOT

- https://react.dev/learn/sharing-state-between-components#a-single-source-of-truth-for-each-state

## batching & scheduler

1. eagerState가 현재값과 같으면 스케쥴러 등록X

- https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L3663

2. queue batching

- linked list로 묶어 한 render에서 처리
- https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js#L3818

## Fiber Type

- https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactInternalTypes.js#L89
- key가 optimistic이라고 신기하게 되어있네요

## Flag

- https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberFlags.js
- 여기도 2진수로되어있네요
- Fiber.flag & Update 이런식으로 샤용

## Lane

- 우선순위를 정하는것 뿐만 아니라 lane끼리의 merging을 통해 전체 스케쥴링
  - 예: 다른 hook instance끼리
- 우선순위가 낮은 lane의 경우 어떻게 처리되나?
  - markStarvedLanesAsExpired() 통해 expirationTime 비교, 우선순위 높임
  - https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberLane.js#L541
  - syncLane 즉시
  - InputContinuousLane 250ms
  - DefaultLane 5000ms
  - TransitionLane 5000ms

## queue

- baseQueue : skip
- pendingQueue

## hook의 우선순위

- hook queue 는 순서만 보장
- queue 내부의 update객체에 우선순위 저장
- render에서 lane이 선택적으로 실행
