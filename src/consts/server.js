const serverConfig = {
    apiAddr: process.env.NODE_ENV === 'development' ? `http://0.0.0.0:8080` : `https://localhost:${process.env.PORT}`
}

module.exports = {serverConfig}