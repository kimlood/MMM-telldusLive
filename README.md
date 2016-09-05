# MMM-telldusLive
Magic Mirror Module for displaying device information from Telldus Lice account

### The module displays the device status from your Telldus Live account
For now, only the status of on or off i displayed. 

Before Starting
---------------
You will need a Telldus Live account and OAuth tokens:

- To get a Telldus Live account, go to [login.telldus.com](https://login.telldus.com)

- Once you have a Telldus Live account, go to [api.telldus.com](http://api.telldus.com/keys/index) and _Generate a private token for my user only_.


## Installation

In your terminal, go to your MagicMirror's Module folder:
````
cd ~/MagicMirror/modules
````

Clone this repository:
````
git clone https://github.com/kimlood/MMM-telldusLive.git
````

Configure the module in your `config/config.js` file.

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
			module: 'MMM-telldusLive',
			header: 'My Home',
			position: 'top_right', 
			config: {
				publicKey: '<public_key>', 
				privateKey: '<private_key>', 
				token: '<token>', 
				tokenSecret: '<token_secret>' 
			}
]
````
