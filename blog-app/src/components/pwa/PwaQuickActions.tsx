"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { BASE_PATH } from "@/constants/config";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

type NavigatorWithStandalone = Navigator & {
  standalone?: boolean;
};

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

function subscribeStandaloneMode(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const mediaQuery = window.matchMedia("(display-mode: standalone)");
  const handleChange = () => {
    onStoreChange();
  };

  mediaQuery.addEventListener?.("change", handleChange);
  mediaQuery.addListener?.(handleChange);
  window.addEventListener("appinstalled", handleChange);

  return () => {
    mediaQuery.removeEventListener?.("change", handleChange);
    mediaQuery.removeListener?.(handleChange);
    window.removeEventListener("appinstalled", handleChange);
  };
}

function subscribeNoop() {
  return () => {};
}

export function PwaQuickActions() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isFabExpanded, setIsFabExpanded] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    "홈 화면에 바로가기를 추가하면 이 아카이브를 앱처럼 바로 열 수 있습니다.",
  );
  const isStandalone = useSyncExternalStore(
    subscribeStandaloneMode,
    isStandaloneMode,
    () => false,
  );
  const isIos = useSyncExternalStore(subscribeNoop, isIosDevice, () => false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      const promptEvent = event as BeforeInstallPromptEvent;
      promptEvent.preventDefault();
      setDeferredPrompt(promptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  async function handleInstallClick() {
    setIsFabExpanded(true);

    if (!deferredPrompt) {
      setStatusMessage(
        isIos
          ? "Safari 공유 버튼에서 '홈 화면에 추가'를 선택해 바로가기를 만드세요."
          : "브라우저 메뉴에서 '앱 설치' 또는 '홈 화면에 추가' 항목으로 바로가기를 만드세요.",
      );
      return;
    }

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    setDeferredPrompt(null);
    setStatusMessage(
      outcome === "accepted"
        ? "바로가기 추가 요청을 보냈습니다. 홈 화면에서 확인하세요."
        : "바로가기 추가를 취소했습니다. 필요할 때 다시 열 수 있습니다.",
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
      ? "바로가기 추가"
      : isIos
        ? "바로가기 안내"
        : "바로가기 만들기";

  return (
    <div
      className="fixed right-4 z-50 flex flex-col items-end gap-3 md:right-6"
      style={{ bottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
    >
        {isFabExpanded ? (
          <div className="w-[min(22rem,calc(100vw-2rem))] rounded-[1.4rem] border border-[rgba(99,120,255,0.18)] bg-[rgba(8,12,24,0.92)] p-4 shadow-[0_18px_60px_rgba(7,12,24,0.55)] backdrop-blur-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-white">
                  홈 화면 바로가기
                </div>
                <div className="text-[0.75rem] text-slate-500 mt-1">
                  {isIos ? "iPhone / Safari" : "Chrome / Samsung Internet"}
                </div>
              </div>
              <button
                type="button"
                onClick={toggleFab}
                className="text-slate-500 text-sm px-2 py-1"
                aria-label="바로가기 패널 닫기"
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
                바로가기로 열기
              </button>
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={toggleFab}
          className="pwa-fab rounded-full px-5 py-4 text-sm font-semibold text-white shadow-[0_18px_48px_rgba(99,120,255,0.35)] md:px-4 md:py-3"
          aria-expanded={isFabExpanded}
          aria-label="홈 화면 바로가기 열기"
        >
          <span className="flex items-center gap-2">
            <span className="text-base leading-none">+</span>
            <span>{isStandalone ? "바로가기 열기" : "바로가기"}</span>
          </span>
        </button>
    </div>
  );
}
