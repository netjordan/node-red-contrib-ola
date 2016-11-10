# node-red-contrib-ola

node-red-contrib-ola lets you control DMX devices via [OpenLighting](https://www.openlighting.org/). Currently it can only change the value immediately, but there are plans to implement fading, flashing etc.

## Install

Run the follwing command in the root directory of your Node-RED install.
Usually this is `~/.node-red` .
```
    npm install node-red-contrib-ola
```

## Using

You can either set a single channel like the following example:

      msg.payload={
        "channel": 1,
        "value": 255
      }
      
      return msg;

Or you can set multiple channels at once:


      msg.payload={
        "channels": [
            {
              "channel": 1,
              "value": 255
            },
            {
              "channel": 2,
              "value": 255
            },
            {
              "channel": 3,
              "value": 255
            }
          ]
      }
      
      return msg;
