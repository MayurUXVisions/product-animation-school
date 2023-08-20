/**
 * For full API read: https://laravel-mix.com/docs/6.0/api
 */

 let mix = require('laravel-mix');
 require('laravel-mix-eslint');
 require('laravel-mix-polyfill');
 require('laravel-mix-clean');
 
 const StyleLintPlugin = require('stylelint-webpack-plugin');
 const WebpackVisualizerPlugin = require('webpack-visualizer-plugin2');
 
 const path = require('path');
 
 // Gets .env variables
 const dovent = require('dotenv');
 const env = dovent.config({ path: '.env' });
 
 /**
  * Assets paths
  *
  * Public path example (must start and end with slashes):
  * /app/themes/mm-theme/dist/
  *
  * localhost:8080 is the default hostname and port set by webpack, but can be changed
  * by editing mix config 'hmrOptions': {https, host, port}
  *
  * read more:
  * - https://stackoverflow.com/questions/28846814/what-does-publicpath-in-webpack-do
  */
 // Location in the filesystem, relative to project root
 const outputPath = path.join('web', 'app', 'themes', env.parsed.THEME_NAME, 'dist');
 // Browser path, relative to public folder
 const outputPublicPath = env.parsed.WEBPACK_HMR === 'on'
   ? 'http://localhost:8080' + env.parsed.PUBLIC_PATH_TO_ASSETS + '/'
   : env.parsed.PUBLIC_PATH_TO_ASSETS + '/'
 ;
 
 /**
  * Production build
  */
 if (mix.inProduction()) {
   mix.version();
   // Uses content hash when naming files (except code-split chunks)
   mix.then(() => {
     const convertToFileHash = require('laravel-mix-make-file-hash');
     convertToFileHash({
       publicPath: outputPath,
       manifestFilePath: outputPath + '/mix-manifest.json',
       debug: false
     });
   });
 
   // Sets content hash as a query string on chunk files (code-split)
   // Taken from: https://github.com/laravel-mix/laravel-mix/issues/2131#issuecomment-1031585812
   mix.override(webpackConfig => {
     const chunkFileName = webpackConfig.output.chunkFilename;
 
     webpackConfig.output.chunkFilename = (pathData, assetInfo) => {
       return `${chunkFileName(pathData, assetInfo)}?id=[chunkhash:8]`;
     };
   });
 }
 
 /**
  * Development build
  */
 else {
   // Adds plugin to visualize bundle size
   mix.webpackConfig({
     plugins: [
       // See stats about how big assets are (type in the url bar /stats.html)
       new WebpackVisualizerPlugin({
         filename: path.join('..', '..', '..', '..', 'stats.html')
       })
     ]
   });
 
   // Enables source maps
   mix
     .webpackConfig({
       devtool: 'source-map'
     })
     .sourceMaps()
   ;
 }
 
 /**
  * Plugins
  */
 mix.webpackConfig({
   plugins: [
     new StyleLintPlugin({
       context: './assets/',
       files: ['**/*.scss', '**/*.vue'],
       // Automatically fixes problems (edits source files)
       fix: true,
       options: {
         configFile: './assets/stylelint.config.js'
       }
     })
   ]
 });
 
 // BUG: vue-loader doesn't handle file-loader's default esModule:true setting properly causing
 // <img src="[object module]" /> to be output from vue templates.
 // WORKAROUND: Override mixs and turn off esModule support on images.
 // FIX: When vue-loader fixes their bug AND laravel-mix updates to the fixed version
 // this can be removed.
 //
 // Taken from: https://github.com/laravel-mix/laravel-mix/issues/2756
 mix.webpackConfig(webpack => {
   return {
     module: {
       rules: [{
         test: /(\.(png|jpe?g|gif|webp|avif)$|^((?!font).)*\.svg$)/,
         use: [{
           loader: require.resolve('file-loader'),
           options: {
             esModule: false
           }
         }]
       }]
     }
   };
 });
 
 mix
 
   .webpackConfig({
     // Sets browser path
     output: {
       publicPath: outputPublicPath
     },
   })
 
   /**
    * Confusing naming and usage of paths (enable debug() for hints on what is going on)
    *
    * 'Public Path' is actually the filesystem path.
    * 'Resource Root' is the browser path.
    */
   // Sets the local path
   .setPublicPath(outputPath)
   // Sets the browser path internally (for loaders)
   .setResourceRoot(outputPublicPath)
 
   // https://laravel-mix.com/docs/4.0/options
   .options({
     clearConsole: true,
     // https://laravel-mix.com/docs/6.0/url-rewriting
     processCssUrls: true,
     // https://github.com/laravel-mix/laravel-mix/issues/2090
     fileLoaderDirs: {
       images: 'img',
       fonts: 'fonts'
     }
   })
 
   .alias({
     '@': path.join(__dirname, 'assets'),
     '~scripts': path.join(__dirname, 'assets', 'scripts'),
     '~styles': path.join(__dirname, 'assets', 'styles'),
     '~img': path.join(__dirname, 'assets', 'img'),
     '~fonts': path.join(__dirname, 'assets', 'fonts'),
   })
 
   // Removes existing assets before build process
   // https://github.com/johnagan/clean-webpack-plugin/blob/master/README.md
   .clean({
     dry: false
   })
 
   // Copies all static assets
   .copy('./assets/static', outputPath + '/static')
 
   .eslint({
     fix: true,
     extensions: ['js', 'vue'],
     overrideConfigFile: './assets/.eslintrc.js',
   })
 
   // https://laravel-mix.com/extensions/polyfill
   .polyfill({
     enabled: true,
     useBuiltIns: "usage",
     targets: "defaults" // https://github.com/browserslist/browserslist
   })
 
   // Enables VueJS support
   .vue()
 
   // Extracts vendor packages from main js file into a separate vendor.js
   // https://laravel-mix.com/docs/6.0/extract
   .extract(['vue', 'axios'], 'vendor-vue.js')
   .extract(['vuex'], 'vendor-vuex.js')
   .extract()
 
   .js('assets/scripts/main.js', 'js')
   .js('assets/scripts/admin.js', 'js')
 
   .sass('assets/styles/style.scss', 'css')
   .sass('assets/styles/admin.scss', 'css')
 
   // Dumps webpack configuration to console (needs to be at the end)
   // .dump()
 ;
 