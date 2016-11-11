module.exports = function(RED) {
    var http = require('http');
    var querystring = require('querystring');

    function OLANode(config) {
        RED.nodes.createNode(this, config);

        this.host = config.host || "127.0.0.1";
        this.port = config.port || 9090;
        this.universe = config.universe || 1;
        this.size = config.size || 512;

        // initiate the dmx data array
        this.addresses = [];
        for (var i = 0; i < this.size; i++) this.addresses[i] = 0;

        var node = this;


        this.on('input', function(msg) {

            if (msg.payload.transition == 'change' || msg.payload.transition == null) {
                if (msg.payload.channel) {
                    node.addresses[msg.payload.channel - 1] = msg.payload.value;
                } else if (msg.payload.channels) {
                    msg.payload.channels.forEach(function(channel) {
                        node.addresses[channel.channel - 1] = channel.value;
                    });
                }

                sendDMX(node.addresses);

            } else if (msg.payload.transition == 'fade') {

                if (msg.payload.channel) { // single channel fade
                    fadeToValue(msg.payload.channel, msg.payload.value, msg.payload.time);
                } else if (msg.payload.channels) {
                    i = 0;
                    msg.payload.channels.forEach(function(channel) {
                        fadeToValue(channel.channel, channel.value, msg.payload.time);
                    });
                }
            }

        });

        function sendDMX(values) {
            var post_data = querystring.stringify({
                u: node.universe,
                d: values.join(',')
            });

            var post_options = {
                host: node.host,
                port: node.port,
                path: '/set_dmx',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(post_data)
                }
            };

            var post_req = http.request(post_options);
            post_req.write(post_data);
            post_req.end();
        }

        function fadeToValue(channel, new_value, transition_time) {
            var old_values = node.addresses;

            var steps = transition_time / 100;

            // calculate difference between new and old values
            diff = Math.abs(old_values[channel - 1] -  new_value);

            if (diff <= steps) { // cannot be completed in the amount of steps, so reduce to just one step
                steps = 1;
            }

            // should we fade up or down?
            if (new_value > old_values[channel - 1]) {
                var direction = true;
            } else {
                var direction = false;
            }

            var value_per_step = diff / steps;
            var time_per_step = transition_time / steps;

            for (i = 1; i < steps; i++) {
                // create time outs for each step
                setTimeout(function() {
                    if (direction === true) {
                        var value = Math.round(node.addresses[channel - 1] + value_per_step);
                    } else {
                        var value = Math.round(node.addresses[channel - 1] - value_per_step);
                    }

                    node.addresses[channel - 1] = value;
                    sendDMX(node.addresses);
                }, i * time_per_step);
            }

            setTimeout(function() {
                node.addresses[channel - 1] = new_value;
                sendDMX(node.addresses);
            }, transition_time);
        }
    }
    RED.nodes.registerType("ola", OLANode);
};
