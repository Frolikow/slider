import './../node_modules/jquery/src/jquery';
import './../node_modules/handlebars/lib/handlebars';

function importAll(r) { r.keys().forEach(r); }

importAll(require.context('./favicons/', true, /^\.\/.*\.js$/));
importAll(require.context('./plugins/', true, /^\.\/.*\.js$/));
importAll(require.context('./modules/', true, /^\.\/.*\.js$/));
importAll(require.context('./../src/', true, /^\.\/.*\.styl$/));
