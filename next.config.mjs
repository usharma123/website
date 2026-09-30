/** @type {import('next').NextConfig} */
const nextConfig = {
  // The dev badge sits on top of the taskbar's start button.
  devIndicators: false,
  async redirects() {
    return [
      {
        source: '/blackjack',
        destination: '/games/blackjack',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
