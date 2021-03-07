const path = require('path')

module.exports = {
  images: {
    domains: ['source.unsplash.com']
  },
  env: {
    MONGODB_URI: `mongodb://ashutosh:ashutosh@cluster0-shard-00-00.pxs2w.mongodb.net:27017,cluster0-shard-00-01.pxs2w.mongodb.net:27017,cluster0-shard-00-02.pxs2w.mongodb.net:27017/blog-app?ssl=true&replicaSet=atlas-14nipb-shard-0&authSource=admin&retryWrites=true&w=majority`,
    JWT_SECRET: '3%@45ZBIa274$(&i3jMxZZJ0xN4v%@$&&VNX8246pYD'
  }
}