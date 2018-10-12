import './../node_modules/jquery/src/jquery';

function importAll(r) { r.keys().forEach(r); }

importAll(require.context('./plugins/', true, /^\.\/.*\.js$/));
importAll(require.context('./modules/', true, /^\.\/.*\.js$/));
importAll(require.context('./../src/', true, /^\.\/.*\.styl$/));
