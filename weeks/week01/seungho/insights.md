## 1. Web Component 라이프사이클 메서드

Web Component(Custom Elements)에는 브라우저가 제공하는 4개의 내장 라이프사이클 메서드가 있다. 이 메서드들은 개발자가 정의만 해두면, 브라우저가 해당 시점에 자동으로 호출한다.

- `constructor()`: 엘리먼트 생성 시
- `connectedCallback()`: DOM에 추가될 때
- `disconnectedCallback()`: DOM에서 제거될 때
- `attributeChangedCallback()`: 감시 중인 속성 변경 시

### attributeChangedCallback 사용 조건

`attributeChangedCallback`을 사용하려면 반드시 `observedAttributes`에 감시할 속성을 등록해야 한다.

```js
static get observedAttributes() {
  return ["src", "alt"]; // 이 속성들만 감지
}

attributeChangedCallback(name, oldValue, newValue) {
  // name: 변경된 속성 이름
  // oldValue: 이전 값 (처음 설정시 null)
  // newValue: 새로운 값
}
```

### 주의사항

- `attributeChangedCallback`은 `connectedCallback`보다 **먼저 호출될 수 있음** (shadowRoot가 없을 수 있음)
- 따라서 `this.shadowRoot?.querySelector`처럼 안전하게 접근해야 함
- 동적으로 속성을 변경할 일이 없다면 `attributeChangedCallback`은 생략 가능

### React와 비교

| Web Component                | React                      |
| ---------------------------- | -------------------------- |
| `constructor()`              | 함수 컴포넌트 본문         |
| `connectedCallback()`        | `useEffect(() => {}, [])`  |
| `disconnectedCallback()`     | `useEffect`의 cleanup 함수 |
| `attributeChangedCallback()` | props 변경 시 리렌더링     |

## 2. attachShadow 사용법

`attachShadow`는 요소에 Shadow DOM을 연결하는 메서드이다. Shadow DOM은 컴포넌트의 내부 구조와 스타일을 외부로부터 캡슐화한다.

### 기본 사용법

```js
const shadow = this.attachShadow({ mode: "open" });
```

### mode 옵션

| mode       | 설명                                                       |
| ---------- | ---------------------------------------------------------- |
| `"open"`   | 외부 JS에서 `element.shadowRoot`로 접근 가능               |
| `"closed"` | 외부 JS에서 접근 불가 (`element.shadowRoot`가 `null` 반환) |

```js
// open 모드
const el = document.querySelector("my-component");
el.shadowRoot; // ShadowRoot 객체 반환

// closed 모드
el.shadowRoot; // null
```

### 주의사항

- `attachShadow`는 `constructor()`에서 호출해야 함
- **CSS 캡슐화는 mode와 무관하게 항상 적용됨** (open이든 closed든 스타일 격리됨)
- mode는 오직 **JS 접근 가능 여부**만 결정함
- 대부분의 경우 `"open"` 사용 (디버깅, 테스트 용이)

### Shadow DOM 내부에 콘텐츠 추가

```js
// 방법 1: innerHTML (간단하지만 파싱 비용 있음)
shadow.innerHTML = `<style>...</style><div>...</div>`;

// 방법 2: createElement (안전하고 요소 참조 가능)
const style = document.createElement("style");
const div = document.createElement("div");
shadow.appendChild(style);
shadow.appendChild(div);
```
