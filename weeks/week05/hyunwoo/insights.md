### 13장

- 이제 클래스형 컴포넌트는 놔줘도 되지 않을까 싶습니다.
- 다만 왜 bind 혹은 화살표 함수를 쓰지 않은경우 this 관련 undefined 에러가 뜰까 알아보니 리액트 내부에서 아래와 같은 동작을 거친다고 합니다.
- 기본적으로 this.함수명 을 명시하니 this의 맥락이 살아있을거라 생각하지만, 결국 호출 시에는 아래와 같은 로직이기 때문에 그렇다고 합니다.

```
const fn = instance.handleClick;
fn();  // 그냥 함수 호출
```

### 14장

- useState 지연 초기화는 굉장히 신박했습니다. 함수형 업데이트 내부 로직도 신기했습니다. 추가로 StrictMode의 동작 원리를 제대로 알게 되었습니다.
- useRef는 useEffectEvent가 생겨서 어느정도 파이를 뺏기지 않을까 생각해 봅니다.
- forwardRef 굉장히 불편했는데 React 19에서 사라져서 다행입니다. 이건 왜 특별한 props 취급 받았을지 궁금하네요.

### 15장

- https://cekrem.github.io/posts/react-memo-when-it-helps-when-it-hurts/
- 결론: 구조를 통해 리렌더링을 개선할 수 있는 방법도 있다!
