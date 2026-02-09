## 중첩 객체 관리
- **불변성 원칙**
  - React는 얇은 비교를 하기에 기존 데이터를 직접 수정 X
  - 스프레드 연산자 등을 이용해 완전히 새로운 주소를 가진 객체를 생성해야함
- **중첩 스프레드 연산자(Spread Hell)**
    - 유지보수 / 가독성이 안좋아짐

EX. 사용자의 도시 이름을 'Seoul'에서 'Busan'으로 변경하려는 상황

```tsx
const [user, setUser] = useState({
  id: 1,
  profile: {
    name: 'Gemini',
    contact: {
      email: 'test@test.com',
      address: {
        city: 'Seoul', // 이 부분을 바꾸고 싶음
        zipcode: '12345',
      },
    },
  },
});

// ❌ 중첩 스프레드로 업데이트 하기
setUser((prevUser) => ({
  ...prevUser,
  profile: {
    ...prevUser.profile,
    contact: {
      ...prevUser.profile.contact,
      address: {
        ...prevUser.profile.contact.address,
        city: 'Busan',
      },
    },
  },
}));
```

## 중첩 객체 관리 방법 3가지

### 1. 상태 평면화 (Flattening)

- 중첩된 객체를 독립된 상태로 분리하여 데이터의 깊이(Depth)를 물리적으로 낮추는 전략
- 업데이트 로직 단순
- 특정 상태 변경 시 관련 없는 데이터까지 리렌더링되는 범위를 줄여 성능 최적화에도 유리

```tsx
const [address, setAddress] = useState({ city: 'Seoul', zipcode: '12345' });

setAddress((prev) => ({ ...prev, city: 'Busan' }));
```



### 2. Immer로 가독성 극대화

- 불변성에 신경쓰지 않는 것처럼 코드를 작성하되 불변성 관리는 제대로 해주는 장점!
- produce 라는 함수는 두가지 파라미터를 받음
  - **첫 번째 파라미터** : 수정하고 싶은 상태 
  - **두 번째 파라미터** : 상태를 어떻게 업데이트할 지 정의하는 함수
  - 두 번째 파라미터로 전달되는 함수 내부에서 원하는 값을 변경하면, produce 함수가 불변성 유지를 대신 해주면서 새로운 상태를 생성
```tsx
import { produce } from 'immer';

setUser(
  produce((draft) => {
    draft.profile.contact.address.city = 'Busan';
  }),
);
```

- [Immer.js - Update patterns](https://immerjs.github.io/immer/update-patterns)
- [react-immer-로-쉽게-불변성-유지하기](https://velog.io/@a9120a/react-immer-%EB%A1%9C-%EC%89%BD%EA%B2%8C-%EB%B6%88%EB%B3%80%EC%84%B1-%EC%9C%A0%EC%A7%80%ED%95%98%EA%B8%B0)


### 3. useReducer로 로직 분리
- 상태 업데이트 로직을 컴포넌트 외부로 분리 / 내부에서는 어떤 행동을 할지만 명시
  - 컴포넌트(홀)는 dispatch만 하고, 상태 변경주방은 외부(reducer)에서 처리
- state hooks로 useState와 useReducer가 있지만, 단독으로는 잘 사용 X
  - Redux 이용한 store 상태관리 할때 자주 사용

```tsx
// 1. 매뉴얼 (Reducer): 주문서대로 요리법이 적힌 책
function reducer(state, action) {
  switch (action.type) {
    case '도시변경':
      return { ...state, city: action.payload }; // 새 접시에 담아 내놓기
    default:
      return state;
  }
}

// 2. 주방 가동
const [state, dispatch] = useReducer(reducer, { city: 'Seoul' });

// 3. 주문 넣기 (Dispatch)
dispatch({ type: '도시변경', payload: 'Busan' });
```

- 주문서(Dispatch)
  - "손님이 '도시변경' 요청 && 내용은 **'Busan'**이야!"라고 주방에 알리는 호출기
- 매뉴얼(Reducer)
  - "도시변경 요청이 오면 기존 재료는 그대로 두고 도시 이름만 새로 써서 새 접시에 담아라"라고 적힌 지침서.
- 결과(State)
  - 지침대로 새로 만든 요리가 손님(화면) 앞에 놓임.

- [useReducer 사용법](https://ko.react.dev/reference/react/useReducer)