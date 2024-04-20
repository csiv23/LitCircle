module.exports = {
    // Your other webpack configurations...
    resolve: {
      fallback: {
        os: require.resolve('os-browserify/browser'), // Uncomment this line if you need the polyfill
        // os: false, // Uncomment this line if you don't need the polyfill
      },
    },
  };