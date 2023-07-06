Game.registerMod('EfficienyTooltips', {

    init: function() {
        // Buildings
        for (let i in Game.ObjectsById)
        {
            let me = Game.ObjectsById[i];
            let originalTooltip = me.tooltip
            me.tooltip = function() {
                let originalOut = originalTooltip.apply(me).slice(0, -6) // slice out the last </div>
                let time = Game.sayTime(Game.fps*me.price/((me.storedTotalCps/me.amount)*Game.globalCpsMult), -1)
                let extraOut = '<div class="descriptionBlock">Time for 1 building to pay for itself: ' + time + '</div>'
                return originalOut + extraOut + '</div>' // add back the last div
            }
        }
        // Upgrades
        // TODO
    },
});