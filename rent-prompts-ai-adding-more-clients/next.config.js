import { withPayload } from '@payloadcms/next/withPayload'

import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL /* 'https://example.com' */].map((item) => {
        const url = new URL(item)

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', ''),
        }
      }),
      {
        hostname: 'pub-9991e1a416ba46d0a4bef06e046435a1.r2.dev',
        protocol: 'https',
      },
      {
        hostname:'replicate.delivery',
        protocol: 'https',
      },
    ],
    minimumCacheTTL:1,
  },
  reactStrictMode: true,
  redirects,
  devIndicators: {
    appIsrStatus: false,
  },
}

export default withPayload(nextConfig)
