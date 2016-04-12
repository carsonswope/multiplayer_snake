thanks to https://ejosh.co/de/2015/01/node-js-socket-io-and-redis-intermediate-tutorial-server-side/
for the intro to node-js, socket-io and redis


set up back end:
-accepts incoming socket requests
-closes socket sessions

-every x MS transmits information to subscribed users

set up front end:
-load static page
-start socket connection with server
-log every time the server says something
-along with what it says 
