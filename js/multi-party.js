/* global red5prosdk, config */

window.addEventListener("load", function () {

    var get_params = function (stream_name) {
        var protocol = window.location.protocol;
        var isSecure = protocol.charAt(protocol.length - 2);

        return {
            protocol: isSecure ? "wss" : "ws",
            host: config.host || "localhost",
            port: isSecure ? 8083 : 8081,
            app: config.app || "live",
            streamName: stream_name || "stream-" + Date.now(), // Randomly generate stream names if not given
            iceServers: [{urls: "stun:stun2.l.google.com:19302"}]
        };
    };

    var subscribe = function (stream_name) {
        var subscriber = new red5prosdk.RTCSubscriber();
        var subscriber_view = new red5prosdk.Red5ProPlaybackView();
        subscriber_view.attachSubscriber(subscriber);

        subscriber.init(get_params(stream_name))
            .then(function () {
                subscriber.play();
            })
            .then(function () {
                console.log("Playing!");
            })
            .catch(function (err) {
                console.log("Something happened. " + err);
            });
    };

    var publish = function () {
        // Create publisher
        var publisher = new red5prosdk.RTCPublisher();
        var publisher_view = new red5prosdk.PublisherView("publisher-view");
        publisher_view.attachPublisher(publisher);

        // Using Chrome/Google TURN/STUN servers.
        var iceServers = [{urls: "stun:stun2.l.google.com:19302"}];

        // Initialize
        publisher
            .init(get_params())
            .then(function() {
                // Invoke the publish action
                return publisher.publish();
            })
            .catch(function(error) {
                // A fault occurred while trying to initialize and publish the stream.
                console.error(error);
            });
    };

    var init = function () {
        // Access user media.
        navigator.getUserMedia({
            audio: true,
            video: true
        }, function(media) {

            // Upon access of user media,
            // 1. Attach the stream to the publisher.
            // 2. Show the stream as preview in view instance.
            publisher.attachStream(media);
            publisher_view.preview(media);

            // Try publishing
            publish();
        }, function(error) {
            console.error(error);
        });
    };

    // Start
    init();

});
