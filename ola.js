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

            if (msg.payload.function == 'change' || msg.payload.function == null) {
                if (msg.payload.address) {
                    node.addresses[msg.payload.address - 1] = msg.payload.value;
                } else if (msg.payload.channels) {
                    msg.payload.channels.forEach(function(channel) {
                        node.addresses[channel.address - 1] = channel.value;
                    });
                }

                sendDMX();
            }

        });

        function sendDMX() {
            var post_data = querystring.stringify({
                u: node.universe,
                d: node.addresses.join(',')
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
    }
    RED.nodes.registerType("ola", OLANode);
}