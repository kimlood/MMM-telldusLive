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
        animationSpeed: 2.5 * 1000
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
            var sensorTableWrapper = document.createElement("table");
            sensorTableWrapper.className = "small";

            for (var i = 0; i < this.status.sensors.length; i++) {
                var sensorTr = document.createElement("tr");
                sensorTr.className = "normal";

                var sensorNameCell = document.createElement("td");
                sensorNameCell.innerHTML = this.status.sensors[i].name;

                sensorTr.appendChild(sensorNameCell);
                sensorTableWrapper.appendChild(sensorTr);

                for(var x = 0; x < this.status.sensors[i].data.length; x++) {
                    var sensorDataTr = document.createElement("tr");
                    var sensorDataTd = document.createElement("td");
                    sensorDataTd.innerHTML = this.status.sensors[i].data[x].name + ": " + this.status.sensors[i].data[x].value + " " + this.status.sensors[i].data[x].unit;
                    sensorDataTr.appendChild(sensorDataTd);

                    sensorTableWrapper.appendChild(sensorDataTr);
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
    }
});
