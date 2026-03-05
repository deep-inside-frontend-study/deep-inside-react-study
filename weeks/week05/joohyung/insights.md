## bailout

React는 같은 React Element 객체가 유지되면 subtree 렌더링을 건너뜀  
즉 element가 유지되면 이미 만들어진 Fiber subtree를 재사용(bailout)

https://ted-projects.com/react19-internals-3

```

const heavyComponent = <HeavyComponent />

function Layout({ children }) {
  return <div>{children}</div>;
}

export function Component() {
  const [count, setCount] = useState(0);

  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>+</button>
      <Layout>
        {heavyComponent}
      </Layout>
    </>
  );
}
```
