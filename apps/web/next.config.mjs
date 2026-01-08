const isMobileBuild = process.env.MOBILE_BUILD === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui-react"],
  reactStrictMode: true,

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  devIndicators: {
    buildActivity: false,
    buildActivityPosition: 'bottom-right',
  },

  ...(isMobileBuild && {
    output: 'export',
    images: {
      unoptimized: true,
    },
  }),
}

export default nextConfig
