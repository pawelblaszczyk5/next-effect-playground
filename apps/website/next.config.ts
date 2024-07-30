import type { NextConfig } from "next";

const nextConfig = {
	eslint: {
		ignoreDuringBuilds: true,
	},
	experimental: {
		after: true,
		ppr: true,
		reactCompiler: true,
		taint: true,
	},
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
	typescript: {
		ignoreBuildErrors: true,
	},
} satisfies NextConfig;

export default nextConfig;
