1. JSX -> React.createElement 호출 -> 리액트 엘리먼트 객체 생성이라는 과정을 거치고 이런 객체 변환을 위해 리액트는 UI를 선언적으로 랜더링하는데 그로 인해 야기되는 문제점은?

- "선언적"이라는 뜻은 어떻게(DOM을 어떤 순서로 조작할지)가 아니라 무엇(현재 상태에서 UI가 어떤 모습이어야 하는지)를 기술한다는 의미.. 따라서 컴포넌트는 `(props, state) -> ReactElement 트리`를 반환하는 "설명서"를 만든다. JSX/`React.createElement` 결과물인 리액트 엘리먼트는 불변에 가까운 데이터라서, 리액트는 이 트리를 보고 화면을 그린다. 상태가 바뀌면 개발자가 `document.querySelector(...)`로 직접 DOM을 고치는 대신, 같은 규칙으로 다시 한 번 UI 설명(엘리먼트 트리)을 만들기만 하면 된다.

2. 리액트 17부터 이벤트 시스템이 바뀌었다고 하는데, 어떻게 달라졌는가 왜 그전에는 이벤트 풀링이 있었는가 ?

- 이전(React 16 이하): 대부분의 이벤트 리스너를 `document`에 위임(delegate)해서 한 곳에서 받아 SyntheticEvent로 디스패치했다.
- React 17: 이벤트 리스너를 `document`가 아니라 각 리액트 "루트 컨테이너"(ReactDOM.render로 마운트한 container)에 붙인다.
  한 페이지에 여러 리액트 앱/서로 다른 리액트 버전이 공존하는 점진적 업그레이드(gradual upgrade)에서 이벤트가 서로 간섭하지 않게 하기 위함.
  `document.addEventListener(...)`로 달아둔 핸들러와 리액트 `onClick` 같은 핸들러의 실행 순서가 일부 케이스에서 달라질 수 있다(이제 루트 컨테이너에서 먼저 처리되고 document 단계 핸들러가 나중에 실행되는 쪽).
  SyntheticEvent의 이벤트 풀링(pooling)이 제거되어, 예전처럼 비동기에서 이벤트를 쓰기 위해 `event.persist()`를 호출할 필요가 거의 없어졌다.
