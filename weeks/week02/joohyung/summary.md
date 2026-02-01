## 4 ~ 6 장

### 4. 상태와 반응성, 대표 디자인패턴

#### 상태와 반응성을 돌아봐야 하는 이유

- 어떤 데이터 상태를 만들 것인가
- 컴포넌트간 어떻게 상태를 공유하고 전달할 것인가?

#### 공통 구성

- UI, 인터렉션 담당 (view)
- 데티어를 담당하는 모델
- 중재자

---

- jsx에서는 경계가 모호해짐

|             | MVC               | MVP         | MVVM               |
| ----------- | ----------------- | ----------- | ------------------ |
| View의 역할 | Model을 직접 참조 | Model 모름  | ViewModel에 바인딩 |
| 중재자      | Controller        | Presenter   | ViewModel          |
| View 로직   | 있음              | 거의 없음   | 최소               |
| 결합도      | 비교적 높음       | 낮음        | 가장 낮음          |
| 대표 특징   | 전통적            | 테스트 용이 | 데이터 바인딩      |

### 5. 개발 환경

#### 이벤트루프 - 다 아는 이야기

#### 패키지 매니저

- npm
  - Nodejs에 기본 포함
  - 따로 설치할 필요 없음 -> CI호환 가장 좋음
  - 버전 다를 시 중복 설치 문제
- yarn
  - PnP의 경우 node Modules 없이 의존성 맵 역할(.pnp.cjs) + cache
  - 캐시 파일이 비대해지는 단점
- pnpm
  - 심볼릭 링크 방식
  - 실제 파일은 한곳에서만

#### 모노레포

- Nx
- Turborepo
- Lerna

#### 리액트 개발환경, 빌드도구

- create-react-app
  - webpack
  - babel
  - 개느림
- vite
  - ESM, ESBuild
- Rspack
  - rust기반
  - webpack 대체제
  - 빅테크에서 좀 쓰는듯
  - https://rspack.dev/

### 6. JSX 구성요소

- JSXElement
- JSXFragment
- JSXElementName
- JSXAttributes
- JSXChildren
