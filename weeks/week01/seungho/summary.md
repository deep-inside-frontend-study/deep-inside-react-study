# 이번 주 핵심 요약

## Chapter 1. 프론트엔드 구성 요소와 발전 과정 돌아보기

### 1.1 프론트엔드의 구성 요소와 발전 과정을 졸아봐야 하는 이유

- **왜 중요한가**: 현대 프론트엔드 생태계는 라이브러리와 새로운 기술이 변화하고 있는데, 근본적으로 왜 나왔는지 이해해야 미래 기술을 변화를 예측할 수 있는 통찰력을 기를 수 있음.
  따라서, 해당 기술을 발전 과정을 알아보면서 문제를 해결할떄 적절한 기술을 사용하는것이 중요하다.

### 1.2 웹 개발과 프론트엔드가 차지하는 위상과 구성 요소

- **SSR vs CSR**: 서버사이드는 런타임 기반으로 외부 데이터(API, DB)를 가공해서
  HTML을 생성해 클라이언트에 전달하는 방식이고, 클라이언트사이드는
  HTML, CSS, JS를 클라이언트에서 실행하는 방식이다. 또는 UI와 유저 인터랙션을
  처리하는 역할을 한다.

### 1.3 초창기 웹 프론트엔드

- **정적 웹 페이지**: HTML 또는 추가로 CSS로 구성된 정적인 페이지로, 유저 인터랙션이 거의 없고, 서버에서 모든 처리를 담당.
- **동적 웹 페이지**: JavaScript로 DOM 조작하여 유저 인터랙션을 처리. AJAX로 서버와 비동기 통신 가능.

### 1.4 모듈 탄생과 한계

- **MPA**: 다수의 HTML 페이지로 구성된 애플리케이션. 페이지 간 전환 시 전체 페이지를 다시 로드.
- **모듈의 필요성**: 코드 재사용성과 유지보수성을 위해 모듈화가 필요. JS 모듈을 만들어서 코드 조작을 나누어
  쉽게 재사용 가능한 형태로 관리을 할 수 있게 됨.
- **JS 모듈의 한계**: 서비스 크기가 커질수록 모듈 서로간의 의존성 관리가 어려워짐. 예를들어 모듈 B가 모듈 A에 의존하고, 모듈 C가 모듈 B에 의존하는 경우, 모듈 A를 변경하면 모듈 B와 C에도 영향을 미칠 수 있음.

### 1.5 번들러의 탄생

- **그런트(grunt)**: 작업 자동화 도구로, 파일 압축, 테스트 실행 등을 자동화.
- **웹팩(webpack)**: 모듈 번들러로, 여러 개의JS 파일을 하나의 파일로 묶어줌. 코드 스플리팅, 트리 쉐이킹 등의 기능 제공.
- **롤업(rollup)**: ES6 모듈을 지원하는 번들러로, 트리 쉐이킹에 강점이 있음.
- **Vite**: 빠른 개발 서버와 빌드 도구로, ES6 모듈을 기반으로 동작함.
- **ESBuild**: 매우 빠른 번들러로, Go 언어로 작성되어 속도가 빠름.

### 1.6 패키지 매니저의 도입

하위 의존성을 자동으로 관리하고 설치하는 도구로, 프로젝트에 필요한 라이브러리와 프레임워크를 쉽게 추가하고 관리할 수 있게 해줌.

- **npm**: Node.js의 기본 패키지 매니저로, 전 세계에서 가장 큰 패키지 레지스트리를 보유.

### 1.7 템플릿 엔진의 도입

- **템플릿 엔진**: 서버에서 HTML 템플릿에 데이터를 삽입하여 완성된 HTML 문서를 생성한 뒤 클라이언트에 전달하는 도구. 또한 반복문, 조건문 등의 로직을 HTML 내에서 사용할 수 있게 해줌.
- **예시**: EJS, Handlebars, Pug 등이 있음.

### 1.8 명령형, 선언형 프로그래밍

- **명령형(Imperative) 프로그래밍**: 개발자가 컴퓨터에게 '어떻게' 작업을 수행할지 구체적인 명령을 내리는 방식 또는 단계별로 직접 지시하는 방식이다. 예를 들어, DOM 조작을 직접 수행하는 방식.
- **선언형(Declarative) 프로그래밍**: 개발자가 '무엇'을 원하는지 명시하는 방식. 예를 들어, UI 상태를 선언하고, 프레임워크가 이를 기반으로 UI를 업데이트하는 방식.

## Chapter 2. 싱글 페이지 애플리케이션 돌아보기

- 웹 서비스가 점점 복잡해지면서, 사용자 경험을 향상시키기 위해 싱글 페이지 애플리케이션(SPA)이 등장하게 되었다. SPA는 전체 페이지를 다시 로드하지 않고, 필요한 부분만 동적으로 업데이트하여 빠르고 부드러운 사용자 경험을 제공한다.
  그리고 index.html 파일 하나로 애플리케이션이 구성되며, 자바스크립트를 통해 동적으로 콘텐츠를 로드하고 렌더링한다.

### 2.1 싱글 페이지 애플리케이션의 장점을 돌아봐야 하는 이유

- SPA는 현대 웹 애플리케이션 개발에서 중요한 패러다임으로 자리잡았다. 현대 라이브러리 및 프레임워크는 모두 SPA 개발 기반으로 설계되었으며, 이를 통해 개발자는 더 나은 사용자 경험을 제공할 수 있다. 또한, 라우팅, 상태 관리, 컴포넌트 기반 아키텍처 등 SPA의 핵심 개념을 이해하는 것이 중요하다.

### 2.2 네트워크 호출 빈도

- MPA와 달리 SPA는 초기 로드 시 필요한 모든 자원을 한 번에 불러오므로, 이후에는 필요한 데이터만 서버에서 가져와 화면을 업데이트한다. 이를 통해 네트워크 호출 빈도를 줄이고, 사용자 경험을 향상시킨다.

### 2.3 성능 향상

- 하지만 SPA는 초기 로드 시 필요한 모든 자원을 한 번에 불러오므로, 이후에는 파일이 커질 수 있다. 이를 해결하기 위해 코드 스플리팅, 지연 로딩(Lazy Loading) 등의 기법을 사용하여 성능을 최적화할 수 있다.
- **Lazy Loading**: 필요한 시점에 자원을 불러오는 기법으로, 초기 로드 시간을 단축시킬 수 있고 또 받은 데이터를
  캐시를 작업을 추가하여 재사용할 수 있다.

### 2.4 생산성 향상

- SPA 등장 이전에는 백엔드/프론트엔드 애플리케이션이 구문이 모호해서 협업이 어려웠다. 하지만 SPA는 프론트엔드와 백엔드의 역할을 명확히 구분하여 개발 생산성을 향상시켰다. 또한, 컴포넌트 기반 아키텍처를 통해 코드 재사용성과 유지보수성을 높였다.

- **컴포넌트 기반 아키텍처**: 선언형 UI를 독립적인 컴포넌트 단위로 나누어 개발하는 방식이고 , 이를 통해 코드 재사용성과 side effect 관리를 용이하게 한다.

## Chapter 3. UI 컴포넌트의 위상 돌아보기

### 3.1 UI 컴포넌트의 위상을 돌아봐야 하는 이유

- UI 컴포넌트는 현대 프론트엔드 개발의 핵심 개념으로, 사용자 인터페이스를 구성하는 독립적인 단위이다. 컴포넌트를 통해 개발자는 복잡한 UI를 작은 단위로 나누어 관리할 수 있으며, 코드 재사용성과 유지보수성을 높일 수 있다. 또한, 컴포넌트 간의 상호작용과 상태 관리를 이해하는 것이 중요하다.
- 인터페이스 설계, 캡슐화를 명확하게 파악하고 설계하는것이 프레임워크에 벗어나서 UI 컴포넌트를 설계하는 본질이다.

### 3.2 프론트엔드 개발에서 UI 컴포넌트의 위상

- UI를 보고 도식화 하고, 컴포넌트 단위로 쪼개고, 재사용 가능한 컴포넌트를 설계하는 것이 중요하다. 컴포넌트는 독립적인 단위로, 다른 컴포넌트와 상호작용할 수 있어야 한다.

### 3.3 UI 컴포넌트의 추상화, 인터페이스, 캡슐화

- props를 통해 컴포넌트의 인터페이스를 설계한다. 그리고 state를 통해 컴포넌트를 독립적인 단위로 내부로직을 작성한다 이러한 과정으로 캡슐화 하여, 내부 구현을 숨기고 인터페이스를 통해 외부와의 상호작용을 선언적으로 정의한다.

### 3.4 바닐라 자바스크립트로 컴포넌트 만들기

```js
class LazyImageLoader {
  #loadingState = new WeakMap();

  constructor(props = {}) {
    this.props = {
      root: props.root || null,
      rootMargin: props.rootMargin || "0px",
      threshold: props.threshold || 0.1,
      onBlur: props.onBlur || false,
      onLoadingIndicator: props.onLoadingIndicator || null,
    };

    this.observer = new IntersectionObserver(this.#onIntersection.bind(this), {
      root: this.props.root,
      rootMargin: this.props.rootMargin,
      threshold: this.props.threshold,
    });
  }

  #onIntersection(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        this.#loadImage(img);
        this.observer.unobserve(img);
      }
    });
  }

  #loadImage(img) {
    const src = img.dataset.src;
    if (src) {
      img.src = src;
    }
  }

  observe(selector) {
    const images = document.querySelectorAll(selector);
    images.forEach((img) => this.observer.observe(img));
  }

  disconnect() {
    this.observer.disconnect();
  }
}
```

- 위 예시는 본인이 작성한 바닐라 자바스크립트로 작성된 LazyImageLoader 컴포넌트이다. observe 메서드를 통해 이미지 엘리먼트를 관찰하고, 교차점에 도달하면 이미지를 로드한다. 이 컴포넌트는 인터페이스(메서드와 속성)를 통해 외부와 상호작용하며, 내부 구현은 캡슐화되어 있다.

### 3.5 웹 컴포넌트 API를 사용해서 컴포넌트 만들기

- 바닐라 자바스크립트로 컴포넌트를 만드는 또 다른 방법은 웹 컴포넌트 API를 사용하는 것이다. 웹 컴포넌트 API는 showdow DOM, 커스텀 엘리먼트, HTML 템플릿 등을 포함하여 재사용 가능한 컴포넌트를 만들 수 있는 표준화된 방법을 제공한다.

- **Shadow DOM**: 웹 컴포넌트 내부에 캡슐화된 DOM 트리로, 외부 스타일이나 스크립트로부터 격리되어 독립적인 스타일과 동작을 가질 수 있다. 내부 CSS는 컴포넌트 외부에 영향을 주지 않고, 외부 CSS도 내부에 영향을 주지 않는다. 하지만 이러한 특성으로 인해 기존 CSS와 연동이 어렵고 브라우저 지원이 제한될 수 있다.

```js
class LazyImage extends HTMLElement {
  #observer = null;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });

    const style = document.createElement("style");
    style.textContent = `
      :host { display: block; }
      img { width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.3s ease; }
      img.loaded { opacity: 1; }
      .placeholder { background: #eee; width: 100%; height: 100%; }
    `;

    const placeholder = document.createElement("div");
    placeholder.className = "placeholder";

    this._image = document.createElement("img");
    this._image.alt = "";

    placeholder.appendChild(this._image);
    shadow.appendChild(style);
    shadow.appendChild(placeholder);
  }

  connectedCallback() {
    this._image.alt = this.getAttribute("alt") || "";

    this.#observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.#loadImage();
            this.#observer.unobserve(this);
          }
        });
      },
      {
        rootMargin: this.getAttribute("root-margin") || "100px",
        threshold: parseFloat(this.getAttribute("threshold")) || 0.1,
      },
    );

    this.#observer.observe(this);
  }

  disconnectedCallback() {
    this.#observer?.disconnect();
  }

  #loadImage() {
    const src = this.getAttribute("src");

    if (src) {
      this._image.onload = () => this._image.classList.add("loaded");
      this._image.src = src;
    }
  }

  static get observedAttributes() {
    return ["alt"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (!this._image) return;

    if (name === "alt") this._image.alt = newValue;
  }
}

customElements.define("lazy-image", LazyImage);
```

- 위 예시는 본인이 작성한 웹 컴포넌트 API를 사용하여 작성된 LazyImage 컴포넌트이다. 이 컴포넌트는 커스텀 엘리먼트로 정의되며, Shadow DOM을 사용하여 내부 구조와 스타일을 캡슐화한다. connectedCallback 메서드에서 Intersection Observer를 설정하여 이미지가 뷰포트에 들어올 때 이미지를 로드한다. attributeChangedCallback 메서드를 통해 속성 변경을 감지하고, 이에 따라 이미지의 alt 속성을 업데이트한다.

```HTML
<!DOCTYPE html>
<html>
<head>
  <script src="lazy-image.js"></script>
</head>
<body>
  <lazy-image src="photo1.jpg" alt="사진 1"></lazy-image>
  <lazy-image src="photo2.jpg" alt="사진 2"></lazy-image>
  <lazy-image
    src="photo3.jpg"
    alt="사진 3"
    root-margin="50px"
    threshold="0.2"
  ></lazy-image>
</body>
</html>

```

```js
const img = document.querySelector("lazy-image");
img.setAttribute("alt", "새로운 설명"); // 이때 attributeChangedCallback 호출
```

### 3.6 바닐라 자바스크립트 vs 웹 컴포넌트 API를 사용한 컴포넌트 비교

| 특징          | 바닐라 자바스크립트 컴포넌트 | 웹 컴포넌트 API 컴포넌트 |
| ------------- | ---------------------------- | ------------------------ |
| 캡슐화        | 제한적 (글로벌 CSS 영향)     | 우수함 (Shadow DOM 사용) |
| 브라우저 지원 | 모든 브라우저 지원           | 최신 브라우저에서만 지원 |
| 표준화        | 비표준화                     | 웹 표준                  |
| 성능          | 우수함                       | 약간의 오버헤드 발생     |
