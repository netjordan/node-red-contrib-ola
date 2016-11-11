# node-red-contrib-ola

node-red-contrib-ola lets you control DMX devices via [OpenLighting](https://www.openlighting.org/). You can change straight to a value, or fade to the specified values.

## Install

Run the following command in the root directory of your Node-RED install. Usually this is `~/.node-red`
```
npm install node-red-contrib-ola
```

## Using

You can either set a single channel like the following example:

```
msg.payload={
    "channel": 1,
    "value": 255
}

return msg;
```

Or you can set multiple channels at once:

```
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
```

You can also fade to values, either for a single channel or multiple channels. You must specify the 'transition' and also a 'time' in milliseconds:

```
msg.payload={
    "transition": "fade",
    "time": 5000,
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
```
