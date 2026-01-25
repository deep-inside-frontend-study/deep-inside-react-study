### 1. 선언형과 명령형 (what vs how)

#### 명령형 팝업(모달)예시

```tsx
export default function ExampleComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>팝업 열기</button>
      {isOpen && <PopupComponent onClose={() => setIsOpen(false)} />}
    </>
  );
}
```

#### 선언형 팝업 예시

```tsx
export default function ExampleComponent() {
const { openPopup, closePopup } = usePopupStore(state => state);

const handleOpenPopup = () => {
  openPopup(ExamplePopup, {
    ...popupProps
  })
}

return {
  <button onClick={handleOpenPopup}>content</button>
}
```

#### TanstackQuery

```tsx
// 선언적
const { mutate } = useMutation({
  onError: {},
  onMutate: {},
  onSuccess: {},
});

// 명령적
const { mutateAsync } = useMutation({
  ...mutateFn,
});

const handleMutation = async () => {
  try {
    await mutateAsync({ ...props });
  } catch {
    // handleError
  }
};
```

고수준(UI단계)에는 선언형, 로우레벨 (비지니스 로직, 외부 i/o)로 갈수록 명령형으로 가는 것을 지향하고 있습니다.

### 2. spa, mpa, csr, ssr

- 하드라우팅 / 소프트라우팅
- 초기 로딩 성능 개선
- 하이드레이션

### 3. 추상화 캡슐화

이 책에서는 코드에 관한 추상화와 캡슐화만 설명하는데, 컴포넌트에서 폴더구조/아키텍처까지 이어지고 있다고 생각합니다.

예를 들어 React Query나 Zustand 같은 상태 관리 라이브러리는
UI가 데이터의 “어떻게 가져오는지”를 알 필요 없도록 추상화하고.
UI는 그저 “상태를 사용”할 뿐입니다.

폴더구조 아키텍처같은 경우 UI와 비지니스 로직의 분리가 대표적인 예시인것 같은데,

React에서 화면을 담당하는 컴포넌트는 오직 표현에만 집중하고,
데이터 조회나 상태 변화와 같은 비즈니스 로직은 Custom Hook이나 Service 계층으로 분리됩니다.

+fsd / ddd / 클린아키텍처 / hexagonal 등

즉, 코드레벨 -> 컴포넌트 설계 -> 프론트엔드 아키텍처로 이어지는것 같습니다.
