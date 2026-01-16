import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};
module.exports = {
    images: {
        remotePatterns: [new URL('https://image2url.com/r2/default/images/1768516867265-b86dbccf-3b9f-4e31-b362-e2f3f1e3b2c9.jpeg')],
        domains: ['image2url.com', "cdn.pixabay.com", "www.pinterest.com"]
    },
}

export default nextConfig;
