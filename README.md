## ILCoinLIsten - ILC Transaction Visualizer ##

Project forked from Bitcoin visualiser [**bistlisten.com**](http://bitlisten.com/)

Realtime ILC transaction visualizer written in HTML/Javascript. See and hear new transactions as they propagate through the ILC Network.

### Special Thanks ###
[Maximillian Laumeister] (Donate to Max with Bitcoin: 1istendqWJ1mKvrdRUQZDL2F3tVDDyKdj)

### Building ###

The project is built and ready-to-go. If you change any of the javascript, you will need to re-build the `bitlisten.min.js` file using Grunt. If you haven't used Grunt before, here is a short tutorial:

1. [Install Node.js](https://nodejs.org/download/).

2. Install grunt-cli using `sudo npm install -g grunt-cli`.

3. Cd into the project directory and run `npm install` to install the proper Grunt version and dependencies for this project.

4. Run `grunt` to build BitListen. Alternatively, run `grunt watch` to build BitListen, host it at http://localhost:8000, and watch for and rebuild changes in the source files.

The compiled/minified script will be output to `bitlisten.min.js`.

### APIs and Libraries ###

BitListen uses these libraries:

* [Howler.js](http://goldfirestudios.com/blog/104/howler.js-Modern-Web-Audio-Javascript-Library) by James Simpson
* [Reconnecting-Websocket](https://github.com/joewalnes/reconnecting-websocket) by Joe Walnes

EOSListen uses these APIs:

* [dfuse.io](https://dfuse.io/) WebSocket API (For Transactions)
* [coingecko.com](https://coingecko.com/) WebSocket API (For Price Ticker)

### License ###

This software is available under the MIT License, details in the included `LICENSE.md` file.
