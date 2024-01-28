module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    proxy: {
      '/https://magazyn.000.pe': {
        target: 'https://magazyn.000.pe',
        changeOrigin: true,
        pathRewrite: { '^/api': '/api' }
      }
    }
  }
}
