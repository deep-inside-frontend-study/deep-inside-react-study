export const REPO_URL =
  "https://github.com/deep-inside-frontend-study/deep-inside-react-study";

const rawBaseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
const pathname = new URL(rawBaseUrl).pathname.replace(/\/$/, "");

export const BASE_URL = rawBaseUrl;
export const BASE_PATH = pathname === "" ? "" : pathname;
