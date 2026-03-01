import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const repoName = process.env.GITHUB_REPO_NAME ?? "";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "export",
  trailingSlash: true,
  // GitHub Pages 배포 시 레포 이름이 서브패스가 됨 (e.g. /deep-inside-react-study/)
  basePath: isProd && repoName ? `/${repoName}` : "",
  assetPrefix: isProd && repoName ? `/${repoName}/` : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
