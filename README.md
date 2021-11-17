# frontend_warehouse

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Runn docker 
docker run -v ${PWD}:/app -v /app/node_modules -p 8081:8080 --rm front:prod