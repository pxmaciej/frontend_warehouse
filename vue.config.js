module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    proxy: {
      '/api': {
        target: 'https://magazyn.000.pe',
        changeOrigin: true,
        pathRewrite: { '^/api': '/api' }
      }
    }
  }
}
