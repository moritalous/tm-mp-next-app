const webpack =require("webpack")

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: { esmExternals: "loose"},
    webpack: (config, { isServer, nextRuntime }) => {
        
        config.module.rules.push({
            test: /\.hdr$/,
            loader: "url-loader",
        })
        config.module.rules.push({
            test: /\.min$/,
            loader: "next-swc-loader",
        })

        // Avoid AWS SDK Node.js require issue
        if (isServer && nextRuntime === "nodejs")
        config.plugins.push(
            new webpack.IgnorePlugin({ resourceRegExp: /^aws-crt$/ })
        )

        return config
    }
}

module.exports = nextConfig
