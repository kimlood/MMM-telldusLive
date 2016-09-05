var TelldusAPI = require("./telldus-live.js");

module.exports = NodeHelper.create({
	// Subclass start method.
	start: function() {
        this.config = {};
        this.fetcherRunning = false;
        var status = [];
		var cloud = ''; 
		var allDev = []; 
	},

	// Subclass socketNotificationReceived received.
	socketNotificationReceived: function(notification, payload) {
		if (notification === "CONFIG") {
            console.log("Telldus config received!");
			this.config = payload; 
			
            if (!this.fetcherRunning) {
              console.log("Telldus sent fetch"); 
			  this.fetchStatus();
            }
            
            if (this.status) {
				console.log("Sent socker notification"); 
                this.sendSocketNotification('STATUS', this.status);
            }
		}
	},

	/**
	 * fetchStatus
	 * 
	 */
    fetchStatus: function() {
		var self = this;
        this.fetcherRunning = true;
		
		cloud = TelldusAPI.TelldusAPI({ publicKey  : this.config.publicKey, privateKey : this.config.privateKey}); 
		cloud.login(this.config.token, this.config.tokenSecret, function(err, user) {
			if (!!err) {
				return console.log('login error: ' + err.message);
			}
   
			// Get list of all devices. Use async call to avoid blocking
		   cloud.getDevices(function(err, devices) {   
			if (!!err)  {
				return console.log('getDevices: ' + err.message);
			}
				allDev = []; 
				for (var i = 0; i < devices.length; i++) {
					allDev.push({id: devices[i].id, name: devices[i].name, status: devices[i].status}); 
				}
				 
				 self.sendSocketNotification('STATUS', allDev);
					

				setTimeout(function() {
					self.fetchStatus();
				}, self.config.updateInterval);
		  });
  }).on('error', function(err) {
    console.log('background error: ' + err.message);
  });

		
		
	
    }
});