# 왜 React hook 상태를 배열로 관리하지 않고 링크드리스트로 관리한걸까?
# 왜 React는 Hook을 key 기반이 아니라 “호출 순서 기반”으로 설계했을까?
- 관련 레퍼런스: https://overreacted.io/why-do-hooks-rely-on-call-order/#flaw-2-name-clashes
- React는 Hook 상태를 key나 이름으로 매칭하지 않고, 호출 순서로 매칭함
- React 개발자가 블로그로 아래와 같은 이유 때문에 그렇게 했다고 설명함
  1. 이름 충돌 문제: 사용자 정의 or 라이브러리에서 만든 key 이름이 충돌할 수 있음
  2. custom hook 재사용 어려움
     - 만약 Hook이 key 기반이라면 각 Hook 내부에서 key를 관리해야 함
     - 컴포넌트에서 해당 hook을 여러 곳에서 사용하면, React 입장에서는 두 상태가 같은 key가 됨
     - 예시로 아래 코드를 실행한다고 했을 때, React 입장에서는 어떤 width state인지 구분하기 힘듦
       ```tsx
        function App() {
          useWindowWidth()
          useNetworkStatus()
        }
       ```
  3. 성능 비용이 증가
    - key 기반 시스템이면 React는 상태를 찾기 위해 key lookup 이 필요 -> 성능 조회 비용 증가
    - 반면 현재 링크드 리스트 방식은 단순히 pointer 이동만 하면 되기 때문에 O(1)
