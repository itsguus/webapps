# Internet of Things Minor 

This is the code that is used for the my individual project during the Internet of Things minor. 

# User guide

1. Install the CloudCase system in your van. 
2. Put NFC tags on the correct positions on the tools you would like to track. The light will turn green if the NFC tag is in the right spot. 
3. Install the app on your phone. 
4. You're done. Plug & play. If you start your car, you will recieve a notification on the app if your toolset is incomplete.

### Light strip

- If the light is **orange**, no NFC tag is scanned by the device.
- If the light is **red**, an unknown NFC tag is scanned by the device.
- If the light is **green**, one of your tools is scanned by the device.

# Admin guide

1. Put the device in the correct places in the designated tool locations. 
2. Tag every tool with an NFC tag in a corresponding place. Scan the ID of this NFC tag and add it to the "ids" database. Make sure to enter the "tool_type" with the name of the piece of equipment. 
3. Run [this PHP code](https://github.com/itsguus/webapps) on a server. Make sure to change the IP addresses used in the code to correspond with your server.

# Wiring

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/f80515fc-5cfb-4518-a23a-a58fa58c533b/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/f80515fc-5cfb-4518-a23a-a58fa58c533b/Untitled.png)

