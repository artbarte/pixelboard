export default {
    build: {
        minify: false,
        sourcemap: true,
        target: 'esnext'

    },
    optimizeDeps: {
        esbuildOptions: {
          target: 'esnext'
        }
      },
  }