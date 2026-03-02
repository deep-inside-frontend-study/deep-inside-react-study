
# debounce( ) 함수
### 경험
회사에서 아래와 같이 동작을 시키고 있는데, debounce를 사용하면 좋겠다라고 생각을 하였습니다.
- FAQ의 경우 입력과 동시에 API 호출
- Store 상품 검색의 경우, 엔터 동작 시 API 호출

자동완성을 제시해주는 경우에는 **debounce + 엔터 동작을 혼합**을 많이 사용 <br/>
- ex. google, youtube

### debounce와 엔터 동작 시 API 호출 비교
- 공통점 : 검색 호출을 줄인다는 목적
- 차이점 : **UX(사용 경험)** , 트래픽/비용, **의도(검색을 언제 확정하는가)**

### Debounce(입력 멈춤 후 자동 검색)
- 사용자가 타이핑하다 잠깐 멈추면(예: 300ms) 자동으로 검색 호출
- 장점: 빠르고 편함
- 단점: 사용자가 의도하지 않아도 호출이 생김(트래픽 증가), 느린 네트워크면 “검색 중”이 계속 바뀌어 산만할 수 있음
- ex. 자동완성 / 추천 검색어

### Enter(명시적 실행)
- 사용자가 **엔터(또는 검색 버튼)**로 “지금 검색”을 확정
- 장점: 호출이 정확히 1번, 의도가 명확(비용/레이트리밋에 안전), UI가 안정적
- 단점: 한 번 더 행동이 필요해서 번거롭고 느리게 느껴질 수 있음
- ex. 결과 페이지 <br/> <br/>

# react compiler의 점진적 도입
- 현재 코드에서 react 19로 업그레이드 하게 될때, react compiler를 어떻게 도입해야 올바를까?
-  https://ko.react.dev/learn/react-compiler/incremental-adoption

## 도입 방법
### 1. Babel Overrides (디렉터리 단위 적용)
- 특정 폴더에만 도입하기
#### 도입 선호 상황
  - 레거시 / 신규 코드 분리되어 있을 때
  - 모듈 단위로 실험하고 싶을 때
 ```tsx
// babel.config.js
overrides: [
  {
    test: './src/modern/**/*.{js,jsx,ts,tsx}',
    plugins: ['babel-plugin-react-compiler']
  }
]
 ```

### 2. "use memo" 어노테이션 방식
- compilationMode: 'annotation' 설정
 ```tsx
// babel.config.js
plugins: [
  ['babel-plugin-react-compiler', {
    compilationMode: 'annotation',
  }],
]
 ```
 - 지정하려는 컴포넌트 / 훅 등에 "use memo" 추가
  ```tsx
 function TodoList({ todos }) {
  "use memo"; // 이 컴포넌트를 컴파일 대상으로 선택

  const sortedTodos = todos.slice().sort();

  return (
    <ul>
      {sortedTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}

function useSortedData(data) {
  "use memo"; // 이 Hook을 컴파일 대상으로 선택

  return data.slice().sort();
}
 ```

####  도입 선호 상황
- 명시적으로 선택한 컴포넌트만 컴파일
- 가장 안전한 실험 방식

### 3. Gating (런타임 기능 플래그)
- React Compiler 최적화 코드를 런타임에서 켜고 끌 수 있게 만드는 것
- 컴파일은 해두되 실행은 조건부로 한다는 뜻
  - 최적화 버전 + 원본 버전 둘 다 만들어두고 런타임에서 선택

#### babel 설정
```tsx
// babel.config.js
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      gating: {
        source: 'ReactCompilerFeatureFlags',
        importSpecifierName: 'isCompilerEnabled',
      },
    }],
  ],
};
```

#### 기능 플래그 구현
```tsx
// ReactCompilerFeatureFlags.js
export function isCompilerEnabled() {
  // 기능 플래그 시스템 사용
  return getFeatureFlag('react-compiler-enabled');
}
```
- 플래그 true → 최적화 코드 실행
- 플래그 false → 기존 코드 실행

#### 도입 선호 상황
- A/B 테스트 하고 싶은 상황 (일부 사용자에게만 적용)