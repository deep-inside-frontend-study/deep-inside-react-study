"use client";

import { useEffect, useState } from "react";
import {
  BASE_PATH,
  WEB_PUSH_PUBLIC_KEY,
  WEB_PUSH_SUBSCRIBE_ENDPOINT,
} from "@/constants/config";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

type PushState =
  | "idle"
  | "unsupported"
  | "subscribed"
  | "backend-missing"
  | "permission-denied"
  | "error";

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

function toUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const normalized = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const binary = window.atob(normalized);

  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function syncPushSubscription(registration: ServiceWorkerRegistration) {
  if (!("PushManager" in window)) {
    return "unsupported" as const;
  }

  if (!WEB_PUSH_PUBLIC_KEY || !WEB_PUSH_SUBSCRIBE_ENDPOINT) {
    return "backend-missing" as const;
  }

  const existingSubscription = await registration.pushManager.getSubscription();
  const subscription =
    existingSubscription ??
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: toUint8Array(WEB_PUSH_PUBLIC_KEY),
    }));

  const response = await fetch(WEB_PUSH_SUBSCRIBE_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subscription,
      userAgent: window.navigator.userAgent,
      pathname: window.location.pathname,
      subscribedAt: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to sync push subscription.");
  }

  return "subscribed" as const;
}

function statusBadgeClass(permission: NotificationPermission | "unsupported") {
  if (permission === "granted") return "badge badge-part1";
  if (permission === "denied") return "badge badge-part4";
  return "badge badge-part2";
}

export function PwaQuickActions() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [permission, setPermission] = useState<
    NotificationPermission | "unsupported"
  >("unsupported");
  const [pushState, setPushState] = useState<PushState>("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    "홈 화면에 추가하면 모바일에서 앱처럼 바로 열 수 있습니다.",
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
    const nextIsIos = isIosDevice();

    setIsIos(nextIsIos);
    updateStandaloneState();
    setPermission(
      typeof Notification === "undefined"
        ? "unsupported"
        : Notification.permission,
    );
    if (!("PushManager" in window)) {
      setPushState("unsupported");
    }

    if ("serviceWorker" in navigator && "PushManager" in window) {
      void navigator.serviceWorker.ready.then(async (registration) => {
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          setPushState(
            WEB_PUSH_SUBSCRIBE_ENDPOINT ? "subscribed" : "backend-missing",
          );
        }
      });
    }

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
    if (!deferredPrompt) {
      setStatusMessage(
        isIos ? IOS_INSTALL_GUIDE : "브라우저 메뉴에서 앱 설치 항목을 확인하세요.",
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

  async function handleEnableNotifications() {
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      !("Notification" in window)
    ) {
      setPermission("unsupported");
      setPushState("unsupported");
      setStatusMessage("이 브라우저에서는 웹 알림을 사용할 수 없습니다.");
      return;
    }

    if (isIos && !isStandalone) {
      setStatusMessage(
        "iPhone과 iPad의 웹 푸시는 홈 화면에 추가된 웹앱에서만 사용할 수 있습니다.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const nextPermission = await Notification.requestPermission();
      setPermission(nextPermission);

      if (nextPermission !== "granted") {
        setPushState(
          nextPermission === "denied" ? "permission-denied" : "idle",
        );
        setStatusMessage(
          nextPermission === "denied"
            ? "알림 권한이 차단되었습니다. 브라우저 설정에서 다시 허용해야 합니다."
            : "알림 권한 요청이 취소되었습니다.",
        );
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const nextPushState = await syncPushSubscription(registration);

      setPushState(nextPushState);
      setStatusMessage(
        nextPushState === "subscribed"
          ? "원격 푸시 구독이 연결되었습니다."
          : "알림 권한은 켜졌습니다. 발송 서버를 연결하면 원격 푸시를 보낼 수 있습니다.",
      );

      await registration.showNotification("Inside React Study", {
        body:
          nextPushState === "subscribed"
            ? "휴대폰 푸시 준비가 끝났습니다."
            : "알림 권한이 활성화되었습니다. 추후 원격 푸시를 연결할 수 있습니다.",
        icon: `${BASE_PATH}/pwa-192x192.png`,
        badge: `${BASE_PATH}/pwa-badge.png`,
        tag: "study-pwa-ready",
        data: {
          url: window.location.href,
        },
      });
    } catch (error) {
      console.error(error);
      setPushState("error");
      setStatusMessage("알림 준비 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleTestNotification() {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification("Inside React Study", {
      body: "테스트 알림입니다. 서비스워커가 정상적으로 동작하고 있습니다.",
      icon: `${BASE_PATH}/pwa-192x192.png`,
      badge: `${BASE_PATH}/pwa-badge.png`,
      tag: "study-pwa-test",
      data: {
        url: window.location.href,
      },
    });
    setStatusMessage("테스트 알림을 보냈습니다.");
  }

  const installLabel = isStandalone
    ? "앱으로 사용 중"
    : deferredPrompt
      ? "홈 화면에 추가"
      : isIos
        ? "설치 안내 보기"
        : "설치 가능 여부 확인";

  return (
    <section className="glass-card fade-in-up p-6 sm:p-8 mb-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <span className="badge badge-part2 mb-3">PWA</span>
          <h2 className="text-2xl font-bold mb-3">모바일 바로가기와 알림 준비</h2>
          <p className="text-slate-400 leading-relaxed">
            홈 화면에 추가하면 이 아카이브를 앱처럼 열 수 있습니다. 알림
            권한까지 열어 두면 Web Push 발송 서버를 붙였을 때 휴대폰 푸시로 바로
            이어집니다.
          </p>

          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className={isStandalone ? "badge badge-part1" : "badge badge-part2"}>
              {isStandalone ? "앱 모드" : "브라우저 모드"}
            </span>
            <span className={statusBadgeClass(permission)}>
              {permission === "granted"
                ? "알림 허용"
                : permission === "denied"
                  ? "알림 차단"
                  : permission === "unsupported"
                    ? "알림 미지원"
                    : "알림 대기"}
            </span>
            {pushState === "subscribed" ? (
              <span className="badge badge-part1">원격 푸시 연결됨</span>
            ) : pushState === "backend-missing" ? (
              <span className="badge badge-part3">발송 서버 미연결</span>
            ) : null}
          </div>
        </div>

        <div className="w-full lg:max-w-sm flex flex-col gap-3">
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
            onClick={handleEnableNotifications}
            disabled={
              isSubmitting ||
              permission === "granted" ||
              permission === "unsupported"
            }
            className="rounded-xl border border-[rgba(56,189,248,0.32)] bg-[rgba(56,189,248,0.12)] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[rgba(56,189,248,0.2)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "준비 중..." : "알림 권한 켜기"}
          </button>
          <button
            type="button"
            onClick={handleTestNotification}
            disabled={permission !== "granted"}
            className="rounded-xl border border-[rgba(167,139,250,0.32)] bg-[rgba(167,139,250,0.12)] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[rgba(167,139,250,0.2)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            테스트 알림 보내기
          </button>
        </div>
      </div>

      <div className="grid gap-3 mt-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-[rgba(99,120,255,0.12)] bg-[rgba(99,120,255,0.06)] p-4">
          <div className="text-sm font-semibold text-slate-100 mb-1">
            Android / Chrome
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            설치 프롬프트가 뜨면 바로 홈 화면에 추가할 수 있습니다. 알림은
            권한 허용 후 서비스워커를 통해 동작합니다.
          </p>
        </div>
        <div className="rounded-2xl border border-[rgba(167,139,250,0.12)] bg-[rgba(167,139,250,0.06)] p-4">
          <div className="text-sm font-semibold text-slate-100 mb-1">
            iPhone / Safari
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            {isStandalone
              ? "홈 화면 앱으로 설치되어 있습니다. iOS 푸시는 설치된 웹앱에서만 동작합니다."
              : IOS_INSTALL_GUIDE}
          </p>
        </div>
      </div>

      <p className="text-xs text-slate-500 mt-4 leading-relaxed">
        {statusMessage}
        {pushState === "backend-missing"
          ? " 현재 GitHub Pages 정적 배포만으로는 구독 저장과 발송이 없어서 실제 원격 푸시는 아직 비활성 상태입니다."
          : ""}
      </p>
    </section>
  );
}
