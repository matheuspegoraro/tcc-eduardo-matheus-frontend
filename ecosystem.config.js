module.exports = {
  apps : [
    {
      name: 'FRONTEND',
      script: 'npm',
      args: '-- start',
      watch: false,
      env: {
        NODE_ENV: "development",
      },
      env_production : {
        NODE_ENV: 'production'
      },
      error_file: 'err.log',
      out_file: 'out.log',
      log_file: 'combined.log',
    },
  ],
};