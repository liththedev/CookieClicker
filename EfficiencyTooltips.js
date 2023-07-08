console.log('EfficiencyTooltips says hello!')
Game.registerMod('EfficiencyTooltips', {

    init: function() {
        // Buildings
        console.log('EfficiencyTooltips init')
        console.log(Game.ObjectsById)
        for (let i in Game.ObjectsById) {
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
        for (let i in Game.UpgradesById) {
            let me = Game.UpgradesById[i]
            if (me.pool == 'cookie') {
                let oldDescFunc = me.descFunc
                me.descFunc = function() {
                    let oldDesc = me.ddesc
                    if (oldDescFunc) {
                        oldDesc = oldDescFunc.apply(me)
                    }
                    let additionalCps = Game.cookiesPs * me.power / 100
                    let seconds = me.getPrice() / additionalCps
                    let time = Game.sayTime(seconds, -1)
                    let extraDisc = '<div>Time this upgrade to pay for itself: ' + time + '</div>'
                    return oldDesc + extraDisc
                }
            }
        }
    },
});