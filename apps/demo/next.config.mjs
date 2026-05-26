import { withTypedAssets } from "@typest/nextjs/plugin"

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@w3docs/ui"],
  images: {
    qualities: [100, 75],
  },
}

export default withTypedAssets({
  sources: [{ dir: "public" }],
})(nextConfig)
