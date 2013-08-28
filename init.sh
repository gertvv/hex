mkdir -p lib/jasmine
wget -O lib/require.js "http://requirejs.org/docs/release/2.1.8/comments/require.js"
wget -O lib/raphael.js "https://raw.github.com/DmitryBaranovskiy/raphael/v2.1.1/raphael.js"
wget -O jasmine.zip https://github.com/downloads/pivotal/jasmine/jasmine-standalone-1.3.1.zip
unzip -d lib/jasmine -j jasmine.zip lib/jasmine-1.3.1/jasmine.css lib/jasmine-1.3.1/jasmine.js lib/jasmine-1.3.1/jasmine-html.js
