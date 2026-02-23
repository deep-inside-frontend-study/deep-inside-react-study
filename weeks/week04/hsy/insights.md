### Fiber Tree와 Context Dependency
- Fiber Tree와 Context Dependency
    - 관련 문서: https://jser.dev/react/2021/07/28/how-does-context-work/
    - React Context는 Fiber 트리 상에서 Context dependency를 관리하고, Provider의 value가 바뀌었을 때 필요한 Fiber만 리렌더링함
        - React v18은 모든 컴포넌트를 Fiber라는 단위로 관리한다.
        - 각 Fiber는 어떤 Context를 구독하고 있는지를 기억한다.
        - Provider가 새로운 value를 제공하면:
            1. 해당 Provider 하위에 있는 Fiber들을 스캔
            2. **context dependency**를 가지고 있는 Fiber만 골라서 리렌더 예약
                1. 이 때 dependency는 Object.is(prevValue, nextValue)를 사용해 파악한다.
                2. 다른 참조값일 경우, dependency를 가진 Fiber를 찾아 리렌더 예약
            3. dependency가 없는 Fiber는 건너뛴다
