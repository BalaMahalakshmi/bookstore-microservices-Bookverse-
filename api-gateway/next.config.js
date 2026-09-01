/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/books/:path*',
        destination: 'http://book-service:8001/books/:path*',
      },
      {
        source: '/api/auth/:path*',
        // destination: 'http://user-service:8002/auth/:path*',
        destination: "http://localhost:8002/auth/:path*",
      },
      {
        source: '/api/users/:path*',
        destination: 'http://user-service:8002/users/:path*',
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
}

module.exports = nextConfig