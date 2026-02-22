# 11 ~ 13장

## 11장 리액트의 상태와 배칭 돌아보기

### 지역상태 파생상태

- 다 아는거
- 지역 상태 : 다른 컴포넌트에서 참조 못하는 상태, useState
- 파생 상태 : 다른 상태, props로 계산되어 파생된 값

### 스냅샷

- 콜백 함수는 생성 당시 스냅샷 기억
- 그래서 setTimeout 같은 경우 생성 당시 값 기억
  - setState로 바뀌면 메모리 값 자체가 바껴서 기존에 참조하고있는 변수는 그대로임
  - 새 변수는 바로 가비지컬렉팅

### 불변성 유지

- 불변성 안지키고 값 업데이트하면 감지 못해서 리렌더링 안됨
- immer 이용해도됨

### 상태 끌어올리기

- 여러 컴포넌트가 같은 state를 공유해야 할 때, 그 state를 가장 가까운 공통 부모로 이동시키는 것
- SSOT
  > For each unique piece of state, you will choose the component that “owns” it. This principle is also known as having a “single source of truth”.

### 배칭

- 여러개의 업데이트를 하나의 묶음으로 처리
  - 여기서 업데이트란 같은 hook instance
- 자세한건 insight에서

## 12장 리액트 구성하는 어쩌구 파이버

- 16 이전에는 스택 재조정자
  - 중단 불가
  - 메인 스레드 점거
- 파이버 아키택처
  - linked list 형태 tree
  - sibling : 자식, return 부모
  - 항상 2개 유지
    - current Fiber : 화면에 표시된 상태
    - workInProgress Fiber : 작업 중 상태
    - alternate통해 swap
- Lane

  - 우선순위를 grouping 해놓은 비트마스크
  - 여기에서 batching grouping (같은 레인이면)
  - 자세한건 insight에서

- 더블 버퍼링

  - fiber.alternate로 연결
  - current, work in progress tree

## 13장 훅 사용 규칙

- 훅은 최상위에서 호출
- 순서가 바뀌게 되면 링크드리스트 순서가깨짐
- 우선순위에 대한 insight
