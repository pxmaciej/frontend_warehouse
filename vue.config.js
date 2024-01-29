module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    proxy: {
      '/api': {
        target: 'https://magazyn.000.pe/', // Adres URL serwera Laravel
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    }
  }
}
