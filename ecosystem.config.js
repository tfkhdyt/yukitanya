module.exports = {
  apps: [
    {
      name: 'yukitanya',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3003',
      exec_mode: 'cluster',
      instances: 'max',
    },
  ],
};
