module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    proxy: {
      '/api': {
        target: 'https://magazyn.000.pe', // adres URL serwera API
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    }
  }
}
