### Q1. 자식 컴포넌트에 성능 최적화 작업 언제 하는게 효율적일까?
- 보통 어느 경우에 실무에서 memo, useCallback 를 작성하시는 지 궁금합니다.
- 저는 평소에 잘 고려를 하지 않는 것 같습니다,,,ㅠ

**생각해본 기준**
1. **자식 컴포넌트가 무거운 연산을 할 때**
   - Ex. 자식 컴포넌트 내에 대량의 리스트를 렌더링 하거나, 무거운 루프문이 있거나..?
2. **참조형 Props를 넘길 때**
   - React.memo(자식) + useCallback(부모 함수) 를 통해 부모에서 함수의 주소를 고정시킴
   ```tsx
   // 부모가 다시 그려질 때마다 handleClick의 '메모리 주소'가 바뀌어요!
   const handleClick = useCallback(() => {
     console.log("클릭");
   }, []); // ✅ useCallback으로 주소를 딱 고정!

   return <HeavyChild onClick={handleClick} />;
   ```
3. **useEffect의 무한 루프를 막아야할 때**
   - 함수를 useEffect의 감시 대상(의존성 배열)에 넣었는데, 함수 주소가 매번 바뀌면 useEffect가 멈추지 않고 계속 실행됩
   - 질문: 보통 useEffect 배열 안에 함수를 넣으시나요...?

   ```tsx
   const fetchData = useCallback(() => { ... }, []);

   useEffect(() => {
     fetchData();
   }, [fetchData]); // ✅ useCallback이 없으면 fetchData가 매번 바뀌어서 무한 루프!
   ```
---

### Q2. 만약 백엔드에서 ID를 안 준다면, 어떤 값으로 key를 지정하는지?
- 사실 코드를 돌아보니, 백엔드에서 key 값을 주지 않는다면 key를 Index로 사용한 경우가 많았습니다,,


| 구분 | index 써도 괜찮을 때 | index 쓰면 절대 안 될 때 |
| --- | --- | --- |
| 데이터 성격 | 정적인 리스트 (변화 없음) | 동적인 리스트 (추가, 삭제, 정렬) |
| 항목 내용 | 단순 텍스트 출력만 할 때 | input, checkbox 등 상태를 가질 때 |
| 컴포넌트 | 아주 가벼운 컴포넌트 | 복잡한 로직이나 애니메이션 포함 시 |

**React 문서에 나와있는 예시**
- **데이터의 값**을 키로 쓴 케이스
- 만약 데이터가 [1, 2, 2, 3] 처럼 중복된 숫자가 들어있다면, 에러가 발생할텐데,, Key로 준 예시가 다소 아쉽다
- https://ko.legacy.reactjs.org/docs/lists-and-keys.html
- https://react.dev/learn/rendering-lists#why-does-react-need-keys

**JSX에 map() 포함시키기**
위 예시에서 별도의 listItems 변수를 선언하고 이를 JSX에 포함했습니다.

```tsx
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <ListItem key={number.toString()}
              value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}
```