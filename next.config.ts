import type { NextConfig } from 'next'
import { withContentCollections } from '@content-collections/next'

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'gen915tyxw.ufs.sh',
        port: '',
      },
    ],
  },
} satisfies NextConfig

export default withContentCollections(nextConfig)
