const serverConfig = {
    protocol: process.env.NODE_ENV === 'development' ? 'http' : 'https'
}

module.exports = {serverConfig}