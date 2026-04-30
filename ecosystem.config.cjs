module.exports = {
  apps: [
    {
      name: "openguard",
      script: "index.ts",
      interpreter: "bun",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
}
