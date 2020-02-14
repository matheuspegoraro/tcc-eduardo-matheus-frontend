module.exports = {
    apps : [{
      name: "frontend",
      script: "react-scripts start",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      }
    }]
  }