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

    var subscribe_event_handler = function (event) {
        console.log("Subscriber event", event);
    };

    var subscribe = function (stream_name) {
        var subscribers_el = document.getElementById("subscribers");
        var vid = document.createElement("video");
        vid.id = "subscriber-" + stream_name;
        subscribers_el.appendChild(vid);

        var subscriber = new red5prosdk.RTCSubscriber();
        subscriber.on("*", subscribe_event_handler);

        var subscriber_view = new red5prosdk.PlaybackView("subscriber-" + stream_name);
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

    var publish_event_handler = function (event) {
        console.log("Publisher event", event);
    };

    var create_publisher = function () {
        // Create publisher
        var publisher = new red5prosdk.RTCPublisher();
        publisher.on("*", publish_event_handler);
        return publisher;
    };

    var create_publisher_view = function (publisher) {
        var publisher_view = new red5prosdk.PublisherView("publisher-view");
        publisher_view.attachPublisher(publisher);
        return publisher_view;
    };

    var publish = function (publisher, publisher_view) {
        // Using Chrome/Google TURN/STUN servers.
        var iceServers = [{urls: "stun:stun2.l.google.com:19302"}];
        var params = get_params();

        // Initialize
        publisher
            .init(params)
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

            var publisher = create_publisher();
            var publisher_view = create_publisher_view(publisher);

            // Upon access of user media,
            // 1. Attach the stream to the publisher.
            // 2. Show the stream as preview in view instance.
            publisher.attachStream(media);
            publisher_view.preview(media);

            // Try publishing
            publish(publisher, publisher_view);
            subscribe();
        }, function(error) {
            console.error(error);
        });
    };

    // Start
    init();

});
