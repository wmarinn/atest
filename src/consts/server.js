const serverConfig = {
    apiAddr: process.env.NODE_ENV === 'development' ? `http://0.0.0.0:8080` : `https://0.0.0.0:${process.env.PORT}`
}

module.exports = {serverConfig}