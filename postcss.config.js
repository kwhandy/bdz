module.exports = {
    plugins: [
      require('postcss-import'),
      require('@tailwindcss/postcss'),
      require('autoprefixer'),
      require('postcss-nested'),
      require('postcss-flexbugs-fixes'),
      require('postcss-preset-env')({
        autoprefixer: {
          flexbox: 'no-2009',
        },
        stage: 3,
      }),
      require('cssnano')({  
        preset: 'default'  
      }) 
    ]
}