import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // OneDrive 配下では .next のファイル同期で readlink/ENOENT エラーが出やすいため、
  // 開発時の Webpack 永続キャッシュを無効化
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = { type: 'memory' }
    }
    return config
  },
}

export default nextConfig
