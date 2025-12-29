const isMobileBuild = process.env.MOBILE_BUILD === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui-react"],
  
  ...(isMobileBuild && {
    output: 'export',
    images: {
      unoptimized: true,
    },
  }),
}

export default nextConfig
