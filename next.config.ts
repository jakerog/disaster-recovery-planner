import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
});

const nextConfig = {
  experimental: {
    // This is sometimes needed in newer Next.js versions for proxying
    // but default dev server usually accepts all hosts.
  },
  // Ensure images from remote patterns if needed, but not requested.
};

export default withPWA(nextConfig);
