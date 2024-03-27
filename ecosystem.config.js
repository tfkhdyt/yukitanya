module.exports = {
  apps: [
    {
      name: 'yukitanya',
      script: './node_modules/.bin/next',
      args: 'start',
      exec_mode: 'cluster',
      instances: 'max',
      autorestart: true,
    },
  ],
};
