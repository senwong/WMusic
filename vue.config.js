const fs = require("fs")
const path = require('path')
const host = "localhost"
const port = 8085

module.exports =  {
  lintOnSave: false,
  baseUrl: "/",

  devServer: {
    port,
    host,
    hotOnly: true,
    disableHostCheck: true,
    clientLogLevel: "warning",
    inline: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    },
    https: {
      key: fs.readFileSync(path.resolve("./build/cert/server.key")),
      cert: fs.readFileSync(path.resolve("./build/cert/server.crt")),
    }
  }
}