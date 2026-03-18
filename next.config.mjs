import { withSentryConfig } from "@sentry/nextjs";
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  productionBrowserSourceMaps: true,
  
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Content Security Policy for Plaid
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self';",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.plaid.com https://*.plaid.com http://localhost:3000;",
              "worker-src 'self' blob:;",
              "child-src 'self' blob:;",
              "connect-src 'self' https://*.plaid.com https://plaid.com http://localhost:3000;",
              "frame-src 'self' https://cdn.plaid.com;",
              "img-src 'self' data: https://*.plaid.com;",
              "style-src 'self' 'unsafe-inline';",
              "font-src 'self' data:;"
            ].join(' ')
          }
        ]
      }
    ];
  },
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  
  // Bundle analyzer in development
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      }
    }
    return config
  },
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "narvindeveloper",

  project: "banking_app",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Keep sourceMappingURL comments so sentry-cli can associate bundles with maps
  hideSourceMaps: false,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  webpackTreeshake: {
    removeDebugLogging: true,
  },

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  webpack: {
    automaticVercelMonitors: true,
  },
}, {
  // Next.js only emits sourceMappingURL comments for the browser bundles, so
  // disable auto-linking to avoid "could not determine a source map reference" warnings
  // (see https://github.com/getsentry/sentry-webpack-plugin#usage).
  sourceMapReference: false,
});