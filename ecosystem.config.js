module.exports = {
  apps: [
    {
      name: 'qtube-be',
      script: 'dist/index.js',
      node_args: '-r module-alias/register',
      instances: 2,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
