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
            this.status = payload;
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

        var tableWrapper = document.createElement("table");
        tableWrapper.className = "small";

        for (var i = 0; i < this.status.length; i++) {

            var tr = document.createElement("tr");
            tr.className = "normal";

            var lampCell = document.createElement("td");
            lampCell.className = "symbol light";

            var symbol = document.createElement("span");

            if (this.status[i].status === "on") {
                symbol.className = "fa fa-toggle-on fa_with_bg";
            } else {
                symbol.className = "fa fa-toggle-off";
            }

            lampCell.appendChild(symbol);
            tr.appendChild(lampCell);

            var deviceCell = document.createElement("td");
            deviceCell.className = "title small light";
            deviceCell.innerHTML = this.status[i].name;
            tr.appendChild(deviceCell);

            tableWrapper.appendChild(tr);
        }

        return tableWrapper;
    }
});
