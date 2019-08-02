/* global Module */

/* Magic Mirror
 * Module: MMM-telldusLive
 *
 * By Kim Lood
 * MIT Licensed.
 */

Module.register("MMM-telldusLive", {

    // Default module config.
    defaults: {
        publicKey: '',
        privateKey: '',
        token: '',
        tokenSecret: '',
        updateInterval: 5000,
        animationSpeed: 2.5 * 1000,
        sensors: null
    },

    loading: true,

    // Subclass getStyles method.
    getStyles: function () {
        return ['font-awesome.css', 'MMM-telldusLive.css'];
    },
    start: function () {
        this.sendSocketNotification("CONFIG", this.config);
    },
    // Subclass socketNotificationReceived method.
    socketNotificationReceived: function (notification, payload) {

        if (notification === "STATUS") {
            this.status = {
                devices: payload[0], 
                sensors: payload[1]
            };
            this.loading = false;
            this.updateDom();
        }
    },
    // Override dom generator.
    getDom: function () {

        if (this.config.publicKey.length <= 0 || this.config.privateKey.length <= 0 || this.config.token.length <= 0 || this.config.tokenSecret.length <= 0) {
            var errorWrapper = document.createElement("div");
            errorWrapper.innerHTML = this.translate("CONFIG_MISSING");
            errorWrapper.className = "small dimmed light";
            return errorWrapper;
        }

        if (this.loading) {
            var loadingWrapper = document.createElement("div");
            loadingWrapper.innerHTML = this.translate("LOADING");
            loadingWrapper.className = "small dimmed light";
            return loadingWrapper;
        }
        console.log("Update mirror with telldus data");

        var container = document.createElement("div");

        // Devices
        var tableWrapper = document.createElement("table");
        tableWrapper.className = "small";

        for (var i = 0; i < this.status.devices.length; i++) {

            var tr = document.createElement("tr");
            tr.className = "normal";

            var lampCell = document.createElement("td");
            lampCell.className = "symbol light";

            var symbol = document.createElement("span");

            if (this.status.devices[i].status === "on") {
                symbol.className = "fa fa-toggle-on fa_with_bg";
            } else {
                symbol.className = "fa fa-toggle-off";
            }

            lampCell.appendChild(symbol);
            tr.appendChild(lampCell);

            var deviceCell = document.createElement("td");
            deviceCell.className = "title small light";
            deviceCell.innerHTML = this.status.devices[i].name;
            tr.appendChild(deviceCell);

            tableWrapper.appendChild(tr);
        }

        container.appendChild(tableWrapper);

        // Sensors
        if (this.status.sensors != null && this.status.sensors.length) {
            var hideDataIcons = this.config.sensors.hideDataIcons != null && this.config.sensors.hideDataIcons;
            var showDataFullNames = this.config.sensors.showDataFullNames != null && this.config.sensors.showDataFullNames;
            var sensorTableWrapper = document.createElement("table");
            sensorTableWrapper.className = "small tellduslive-sensors-table";

            for (var i = 0; i < this.status.sensors.length; i++) {
                var sensorTr = document.createElement("tr");
                sensorTr.className = "normal";

                var sensorTd = document.createElement("td");
                sensorTd.innerHTML = this.status.sensors[i].name;

                sensorTr.appendChild(sensorTd);
                sensorTableWrapper.appendChild(sensorTr);

                for(var x = 0; x < this.status.sensors[i].data.length; x++) {
                    var icon = "";
                        
                    // Config hide data icons
                    if (!hideDataIcons) {
                        icon = '<span class="icon-wrapper"><i class="fa ' + this.getDataIcon(this.status.sensors[i].data[x].name) + '"></i></span> ';
                    }
                    
                    // Config show data full name
                    if (showDataFullNames) {
                        this.status.sensors[i].data[x].name = this.getDataFullName(this.status.sensors[i].data[x].name);
                    }
                    
                    // Get wind direction cardinal point
                    if (this.status.sensors[i].data[x].name == "wdir" && Number(this.status.sensors[i].data[x].value)) {
                        this.status.sensors[i].data[x].value = this.getCardinal(this.status.sensors[i].data[x].value);
                    }
                    
                    // Config hide data names
                    var dataName = this.config.sensors.hideDataNames != null && this.config.sensors.hideDataNames ? "" : this.status.sensors[i].data[x].name + ": ";
                    
                    var dataValue = dataName + "<span class='light'>" + this.status.sensors[i].data[x].value + " " + this.status.sensors[i].data[x].unit + "</span>";
                    
                    // One row
                    if (this.config.sensors.oneRow) {
                        var dataSpan = document.createElement("span");
                        dataSpan.innerHTML = " - " + icon + dataValue;
                        sensorTd.appendChild(dataSpan);
                    } 
                    // Multi rows
                    else {
                        var sensorDataTr = document.createElement("tr");
                        var sensorDataTd = document.createElement("td");
                        
                        sensorDataTd.innerHTML = icon + dataValue;
                        sensorDataTr.appendChild(sensorDataTd);

                        sensorTableWrapper.appendChild(sensorDataTr);
                    }
                }

                var emptyLineTr = document.createElement("tr");
                var emptyLineTd = document.createElement("td");
                emptyLineTd.innerHTML = "&nbsp;";
                emptyLineTr.appendChild(emptyLineTd);
                sensorTableWrapper.appendChild(emptyLineTr);
            }

            container.appendChild(sensorTableWrapper);
        }

        return container;
    },
    getDataIcon: function (dataName) {
        switch(dataName) {
            case "dewp":
                return "fa-temperature-low";
            case "wdir":
                return "fa-compass";
            case "temp":
                return "fa-thermometer-half";
            case "barpress":
                return "fa-tachometer-alt";
            case "humidity":
                return "fa-tint";
            case "wavg":
                return "fa-wind";
            case "wgust":
                return "fa-wind";
            default:
                return "fa-satellite-dish";
        }  
    },
    getDataFullName: function (dataName) {
        switch(dataName) {
            case "dewp":
                return "Dew point";
            case "wdir":
                return "Wind direction";
            case "temp":
                return "Temperature";
            case "barpress":
                return "Atmospheric pressure";
            case "humidity":
                return "Humidity";
            case "wavg":
                return "Wind speed, avarage";
            case "wgust":
                return "Wind speed, gust";
            default:
                return "Other";
        }
    },
    // Get cardinal direction from angle (https://gist.github.com/basarat/4670200)
    getCardinal: function (angle) {
        var directions = 8;
        
        var degree = 360 / directions;
        angle = angle + degree/2;
        
        if (angle >= 0 * degree && angle < 1 * degree) {
            return "N";
        }
        
        if (angle >= 1 * degree && angle < 2 * degree) {
            return "NE";
        }
        
        if (angle >= 2 * degree && angle < 3 * degree) {
            return "E";
        }
        
        if (angle >= 3 * degree && angle < 4 * degree) {
            return "SE";
        }
        
        if (angle >= 4 * degree && angle < 5 * degree) {
            return "S";
        }
        
        if (angle >= 5 * degree && angle < 6 * degree) {
            return "SW";
        }
        
        if (angle >= 6 * degree && angle < 7 * degree) {
            return "W";
        }
        
        if (angle >= 7 * degree && angle < 8 * degree) {
            return "NW";
        }

        return "N";
    } 
});     
        
        
        
        
