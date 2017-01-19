# Red5 Pro WebRTC multi-party conference demo

**Status: Incomplete**

This is a demo written to test WebRTC-based, multi-party interactive broadcast capability of Red5 Pro streaming server and the Red5 Pro HTML5 SDK.

This demo does not use the failover support provided by Red5 Pro to focus only on its WebRTC capabilities.

To get a quick review of Red5 Pro's WebRTC capabilities, take a look at my [Red5 Pro WebRTC server quick review](https://kaustavdm.in/red5-pro-webrtc-server-review.html).

## Installation

- Install a Red5 Pro server and configure SSL for it.
- Copy `js/config.sample.js` to `js/config.js` and edit values.
- Start a HTTPS static server in this directory.
- Browse to the HTTP static server URL.
- Set the "Red5 Pro Host" and start call.

## License

This demo is available under the MIT license. The Red5 Streaming HTML5 SDK used in this demo and present in the `./lib` directory is bound by the license agreement of that SDK.
