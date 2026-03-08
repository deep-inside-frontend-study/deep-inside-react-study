"use client";

import { useEffect, useState } from "react";
import { BASE_PATH } from "@/constants/config";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

type NavigatorWithStandalone = Navigator & {
  standalone?: boolean;
};

const IOS_INSTALL_GUIDE = "Safari 공유 버튼에서 '홈 화면에 추가'를 선택하세요.";

function isStandaloneMode() {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    Boolean((window.navigator as NavigatorWithStandalone).standalone)
  );
}

function isIosDevice() {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    /iphone|ipad|ipod/i.test(window.navigator.userAgent) ||
    (window.navigator.platform === "MacIntel" &&
      window.navigator.maxTouchPoints > 1)
  );
}

export function PwaQuickActions() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(() => isStandaloneMode());
  const [isIos] = useState(() => isIosDevice());
  const [isFabExpanded, setIsFabExpanded] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    "홈 화면에 추가하면 이 아카이브를 모바일에서 앱처럼 바로 열 수 있습니다.",
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const updateStandaloneState = () => {
      setIsStandalone(isStandaloneMode());
    };

    const handleBeforeInstallPrompt = (event: Event) => {
      const promptEvent = event as BeforeInstallPromptEvent;
      promptEvent.preventDefault();
      setDeferredPrompt(promptEvent);
    };

    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    updateStandaloneState();

    mediaQuery.addEventListener?.("change", updateStandaloneState);
    mediaQuery.addListener?.(updateStandaloneState);
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", updateStandaloneState);

    return () => {
      mediaQuery.removeEventListener?.("change", updateStandaloneState);
      mediaQuery.removeListener?.(updateStandaloneState);
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", updateStandaloneState);
    };
  }, []);

  async function handleInstallClick() {
    setIsFabExpanded(true);

    if (!deferredPrompt) {
      setStatusMessage(
        isIos
          ? IOS_INSTALL_GUIDE
          : "브라우저 메뉴에서 '앱 설치' 또는 '홈 화면에 추가' 항목을 확인하세요.",
      );
      return;
    }

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    setDeferredPrompt(null);
    setStatusMessage(
      outcome === "accepted"
        ? "설치 요청을 보냈습니다. 홈 화면에서 앱을 확인하세요."
        : "설치를 취소했습니다. 필요할 때 다시 설치할 수 있습니다.",
    );
  }

  async function handleOpenApp() {
    if (typeof window === "undefined") {
      return;
    }

    window.location.href = `${BASE_PATH}/`;
  }

  function toggleFab() {
    setIsFabExpanded((current) => !current);
  }

  const installLabel = isStandalone
    ? "앱으로 사용 중"
    : deferredPrompt
      ? "홈 화면에 추가"
      : isIos
        ? "설치 안내 보기"
        : "설치 가능 여부 확인";

  return (
    <>
      <section className="hidden lg:block glass-card fade-in-up p-6 sm:p-8 mb-10">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-2xl">
            <span className="badge badge-part2 mb-3">PWA</span>
            <h2 className="text-2xl font-bold mb-3">모바일 바로가기</h2>
            <p className="text-slate-400 leading-relaxed">
              홈 화면에 추가하면 이 아카이브를 브라우저 탭 대신 앱처럼 바로 열
              수 있습니다. 모바일에선 우측 하단 FAB로 설치 동선을 바로
              노출했습니다.
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span
                className={isStandalone ? "badge badge-part1" : "badge badge-part2"}
              >
                {isStandalone ? "앱 모드" : "브라우저 모드"}
              </span>
              <span
                className={
                  deferredPrompt || isIos ? "badge badge-part1" : "badge badge-part3"
                }
              >
                {deferredPrompt || isIos ? "설치 안내 가능" : "브라우저 메뉴 사용"}
              </span>
            </div>
          </div>

          <div className="w-full xl:max-w-sm flex flex-col gap-3">
            <button
              type="button"
              onClick={handleInstallClick}
              disabled={isStandalone}
              className="rounded-xl border border-[rgba(99,120,255,0.35)] bg-[rgba(99,120,255,0.16)] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[rgba(99,120,255,0.24)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {installLabel}
            </button>
            <button
              type="button"
              onClick={handleOpenApp}
              disabled={!isStandalone}
              className="rounded-xl border border-[rgba(56,189,248,0.32)] bg-[rgba(56,189,248,0.12)] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[rgba(56,189,248,0.2)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              홈에서 바로 열기
            </button>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-4 leading-relaxed">
          {statusMessage}
        </p>
      </section>

      <div
        className="lg:hidden fixed right-4 z-50 flex flex-col items-end gap-3"
        style={{ bottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
      >
        {isFabExpanded ? (
          <div className="w-[min(20rem,calc(100vw-2rem))] rounded-[1.4rem] border border-[rgba(99,120,255,0.18)] bg-[rgba(8,12,24,0.92)] p-4 shadow-[0_18px_60px_rgba(7,12,24,0.55)] backdrop-blur-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-white">
                  홈 화면 바로가기
                </div>
                <div className="text-[0.75rem] text-slate-500 mt-1">
                  {isIos ? "iPhone / Safari" : "Android / Browser"}
                </div>
              </div>
              <button
                type="button"
                onClick={toggleFab}
                className="text-slate-500 text-sm px-2 py-1"
                aria-label="설치 패널 닫기"
              >
                닫기
              </button>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mt-3">
              {statusMessage}
            </p>

            <div className="mt-4 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleInstallClick}
                disabled={isStandalone}
                className="rounded-xl border border-[rgba(99,120,255,0.35)] bg-[rgba(99,120,255,0.16)] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[rgba(99,120,255,0.24)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {installLabel}
              </button>
              <button
                type="button"
                onClick={handleOpenApp}
                disabled={!isStandalone}
                className="rounded-xl border border-[rgba(56,189,248,0.32)] bg-[rgba(56,189,248,0.12)] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[rgba(56,189,248,0.2)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                홈에서 바로 열기
              </button>
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={toggleFab}
          className="pwa-fab rounded-full px-5 py-4 text-sm font-semibold text-white shadow-[0_18px_48px_rgba(99,120,255,0.35)]"
          aria-expanded={isFabExpanded}
          aria-label="홈 화면 바로가기 열기"
        >
          <span className="flex items-center gap-2">
            <span className="text-base leading-none">+</span>
            <span>{isStandalone ? "앱 열기" : "홈에 추가"}</span>
          </span>
        </button>
      </div>
    </>
  );
}
