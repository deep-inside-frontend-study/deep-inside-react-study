### 1. setTimeout(cb, 0)을 사용해 **다음 이벤트 루프에서 콜백이 비동기적으로 실행**되도록 예약

종종 서비스 만들다 보면, 당장 실행하면 안 되고 그 다음 tick에 실행하게끔 지연시켜야 할 때가 있음
그럴 때 setTimeout(cb, 0)을 많이 쓰는 편

- `setTimeout(cb, 0)` 의미
  - 콜 스택에 쌓여있는 모든 작업이 완료된 후
  - 다음 이벤트 루프에서 콜백이 비동기적으로 실행되게끔 예약
  - https://velog.io/@edie_ko/javascript-eventloop
- 사용 예시
  - Select 박스 오픈 시 리스트박스에 포커스 이동
  - → Select 박스 DOM 렌더링 완료한 이후에 focus되게끔 강제하기 위해 setTimeout(cb, 0)
  ```tsx
  useEffect(() => {
    const timer = setTimeout(() => {
      listboxRef.current?.focus();
    }, 0);
    return () => clearTimeout(timer);
  }, []);
  ```

<br />

### 2. Webpack → Vite로 마이그레이션 하면서 팬텀디팬던시 이슈 경험

[https://medium.com/@hong009319/webpack-vite-스토리북의-번들러-마이그레이션-0100b3ab0725](https://medium.com/@hong009319/webpack-vite-%EC%8A%A4%ED%86%A0%EB%A6%AC%EB%B6%81%EC%9D%98-%EB%B2%88%EB%93%A4%EB%9F%AC-%EB%A7%88%EC%9D%B4%EA%B7%B8%EB%A0%88%EC%9D%B4%EC%85%98-0100b3ab0725)
