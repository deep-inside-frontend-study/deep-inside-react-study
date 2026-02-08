# 6 ~ 9장

## 7장

### 자동 런타임 jsx

- 17버전 이전에는 수동으로 import를 써줘야했지만
- 이후 버전에서 자동 런타임에 불러오도록해서 개발 dx와 번들 크기 감소에 도움이 됐다.
  - 근데 어차피 번들링에서 트리쉐이킹 되니깐 번들크기랑은 상관없지않나?
- jsx 변환은 babel, swc, esbuild,
- js()x와 jsxs()

### createElement 생성

- plain object 생성
- type, key, ref, props 등이 담겨잇는 객체
- 이후 render phase에서 fiber로 변환

### 템플릿 리터럴

- ecma 2015 (es6)에서 도입, 사용법은 다 아는거

### 태그드 템플릿 리터럴

- 문자열과 동적값을 분리
- styled component, emotion에서 사용하는 방법

### 합성 이벤트

- 리액트에서 대부분 이벤트 리스너는 최상위 레벨에 하나의 이벤트 리스너 부착 (이벤트 위임)
  - 16이전은 document 객체, 이후는 render()가 호출되는 컨테이너
- **풀링**
  - 버블링되어 올라온 이벤트를 감지, 합성 이벤트 객체로 저장
    - SyntheticEvent 객체
  - 이것을 pool 에 저장
  - 이벤트 호출 이후 null 초기화
  - 비동기 함수 안에서 이벤트 접근시 이미 null로 초기화되는 문제점이 있었음
  - event.persist()를 이용해서 풀링되지 않도록 설정

## 8장 재조정, 키 프롭스

### 렌더링

- 트리거
  - 최초 root.render()
  - 이후 useState, useEffect 등
- 렌더 페이즈
  - ui 컴포넌트들을 만드는 단계 (리액트 내부에서)
  - 가상 dom 연산 (반영X)
  - reconciliation
- 커밋 페이즈
  - 실제 dom에 반영

### reconciliation

- 타입이 다른 엘리먼트는 서로 다른 트리
  - 실제 element.type
- 키 프롭스를 통해 어떤 엘리먼트가 유지되어야하는지 표시해줄수있음
- beginWork ->
- updateFunctionComponent ->
  - 함수 컴포넌트 렌더 시작
- prepareToReadContext
  - 내부의 useContext 사전 준비
- renderWithHooks
  - hook dispatcher, hook 연결
- Component 호출, nextWithChildren 반환 ->
- reconcileChildren
  - **diff 알고리즘 시작**
    - key비교
    - type 비교
    - 재사용, 생성 결정

#### reconcileChildrenArray

- 이전 자식 맵핑
- 새로운 자식 순회
- 재사용, 생성, 이동
- 나머지 삭제

#### work-in progress tree

- 전체 트리를 순회후 완성된 파이버 트리

## 9장 렌더링 규칙

### 렌더링 조건

1. 최초
2. 상태변경
3. 부모 리렌더링
4. 컨텍스트 변경

### props.children

- props.children는 해당 컴포넌트가 리렌더링되도 영향받지않음
- 이는 생성되는 시점과 위치 때문

### 멱등성 유지

### 불변성 유지

- state/props 객체를 직접 수정하지 않고 새 객체를 생성해야 한다
