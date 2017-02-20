var config = {
   entry: './main.js',
	
   output: {
      path:'./',
      filename: 'index.js'
   },
	
   devServer: {
      inline: true,
		hot: true,
		progress: true
    
   },
	
   module: {
      loaders: [ {
         test: /\.jsx?$/,
         exclude: /node_modules/,
         loader: 'babel',
			
         query: {
            presets: ['es2015', 'react']
         }
      },
         {
            test: /\.css$/,
            loader: 'style-loader!css-loader!autoprefixer-loader?{browsers:["last 2 version"]}'
         },


         {
            test: /\.(png|jpg|gif|woff|woff2|svg)$/,
            loader: 'url-loader?limit=8192'
         },
         {
            test: /\.(mp4|ogg|svg)$/,
            loader: 'file-loader'
         },
         {
            test:/\.json$/,
            loader:'json-loader'
         }
      ]
   }
	
}

module.exports = config;