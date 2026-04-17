module.exports = {
  apps: [
    {
      name: "betvip-web",
      script: "node_modules/.bin/next",
      args: "start",
      cwd: "/var/www/bahisYeni",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
    {
      name: "betvip-bot",
      script: "node_modules/.bin/tsx",
      args: "src/bot/index.ts",
      cwd: "/var/www/bahisYeni",
      env: {
        NODE_ENV: "production",
      },
      restart_delay: 5000,
      max_restarts: 10,
    },
  ],
};
