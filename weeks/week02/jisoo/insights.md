## dangerouslySetInnerHtml 의 역할과 위험성
- p. 179에서 dangerouslySetInnerHTML에 대해서 소개하는데, 사용에 주의해야하는 이유가 미흡했다고 생각함

### 역할
- 문자열을 그대로 HTML로 해석해서 DOM에 주입시키는 방식

### 위험성
- 유저 입력을 해당 방식으로 렌더링하면 XSS 공격에 취약해질 수 있음
  - **왜?** : 유저다 악성 스크립트/이벤트를 심어서 다른 사람의 브라우저에서 실행시키는 공격이 가능해짐
- https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html


## derived state(파생 상태) 처리
- **파생 상태** : 다른 상태로부터 바로 계산 가능한 값
- 파생 상태는 굳이 저장하지 않고 **계산**하는 것이 나은 경우가 많음
  - effect를 남발하여 사용하지 말자 
  - https://react.dev/learn/you-might-not-need-an-effect

```tsx
// Case 1. 안 좋은 예시
const [items, setItems] = useState([]);
const [filter, setFilter] = useState("all");

const [filteredItems, setFilteredItems] = useState([]);

useEffect(() => {
  setFilteredItems(
    items.filter(item => filter === "all" ? true : item.type === filter)
  );
}, [items, filter]);

// Case 2. 좋은 패턴 (항상 최신 값이 렌더에서 바로 계산됨)
const [items, setItems] = useState([]);
const [filter, setFilter] = useState("all");

const filteredItems = items.filter(item =>
  filter === "all" ? true : item.type === filter
);

```
