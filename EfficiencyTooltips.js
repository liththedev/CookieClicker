const MOUSE_PERCENTAGE_UPGRADES = [
    'Plastic mouse',
    'Iron mouse',
    'Titanium mouse',
    'Adamantium mouse',
    'Unobtainium mouse',
    'Eludium mouse',
    'Wishalloy mouse',
    'Fantasteel mouse',
    'Nevercrack mouse',
    'Armythril mouse',
    'Technobsidian mouse',
    'Plasmarble mouse',
    'Miraculite mouse',
    'Aetherice mouse',
    'Omniplast mouse',]

const MISC_GLOBAL_MULTS = {
			'Specialized chocolate chips': 1.01,
			'Designer cocoa beans': 1.02,
			'Underworld ovens': 1.03,
			'Exotic nuts': 1.04,
			'Arcane sugar': 1.05,
			
			'Increased merriness': 1.15,
			'Improved jolliness': 1.15,
			'A lump of coal': 1.01,
			'An itchy sweater': 1.01,
			'Santa\'s dominion': 1.2,
			
			'Fortune #100': 1.01,
			'Fortune #101': 1.07,
			
			'Dragon scale': 1.03,
}

Game.registerMod('EfficiencyTooltips', {

    init: function() {
        // Buildings
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
        let missingEfficiencyInfo = []
        // Upgrades
        for (let i in Game.UpgradesById) {
            let me = Game.UpgradesById[i]
            // Cookies
            if (me.pool == 'cookie') {
                let oldDescFunc = me.descFunc
                me.descFunc = function() {
                    let oldDesc = me.ddesc
                    if (oldDescFunc) {
                        oldDesc = oldDescFunc.apply(me)
                    }
                    let additionalCps = Game.cookiesPs * me.power / 100
                    let seconds = me.getPrice() / additionalCps
                    let time = Game.sayTime(Game.fps*seconds, -1)
                    let extraDisc = '<div>Time for this upgrade to pay for itself: ' + time + '</div>'
                    return oldDesc + extraDisc
                }
            // Tiered Upgrade
            } else if (me.buildingTie1 && !me.buildingTie2) {
                let oldDescFunc = me.descFunc
                me.descFunc = function() {
                    let oldDesc = me.ddesc
                    if (oldDescFunc) {
                        oldDesc = oldDescFunc.apply(me)
                    }
                    let additionalCps = me.buildingTie1.storedTotalCps * Game.globalCpsMult
                    let seconds = me.getPrice() / additionalCps
                    let time = Game.sayTime(Game.fps*seconds, -1)
                    let extraDisc = '<div>Time for this upgrade to pay for itself: ' + time + '</div>'
                    return oldDesc + extraDisc
                }
            // Grandmas
            } else if (Game.GrandmaSynergies.includes(me.name)){
                let oldDescFunc = me.descFunc
                me.descFunc = function() {
                    let oldDesc = me.ddesc
                    if (oldDescFunc) {
                        oldDesc = oldDescFunc.apply(me)
                    }
                    let additionalCpsGrandmas = Game.Objects['Grandma'].storedTotalCps * Game.globalCpsMult
                    let synergyMult = Game.Objects['Grandma'].amount*0.01*(1/(me.buildingTie.id-1))
                    let additionalCpsSynergy = synergyMult * me.buildingTie.storedTotalCps * Game.globalCpsMult
                    let additionalCps = additionalCpsGrandmas + additionalCpsSynergy
                    let seconds = me.getPrice() / additionalCps
                    let time = Game.sayTime(Game.fps*seconds, -1)
                    let extraDisc = '<div>Time for this upgrade to pay for itself: ' + time + '</div>'
                    return oldDesc + extraDisc
                }
            // Mouse upgrades
            } else if (MOUSE_PERCENTAGE_UPGRADES.includes(me.name)){
                let oldDescFunc = me.descFunc
                me.descFunc = function() {
                    let oldDesc = me.ddesc
                    if (oldDescFunc) {
                        oldDesc = oldDescFunc.apply(me)
                    }
                    let extraCookiesPerClick = Game.cookiesPs / 100
                    let clicks = Math.ceil(me.getPrice() / extraCookiesPerClick)
                    let extraDisc = '<div>Number of clicks for this upgrade to pay for itself: ' + clicks + '</div>'
                    return oldDesc + extraDisc
                }
            } else if (me.name in MISC_GLOBAL_MULTS) {
                let oldDescFunc = me.descFunc
                me.descFunc = function() {
                    let oldDesc = me.ddesc
                    if (oldDescFunc) {
                        oldDesc = oldDescFunc.apply(me)
                    }
                    let additionalCps = Game.cookiesPs * (MISC_GLOBAL_MULTS[me.name] - 1)
                    let seconds = me.getPrice() / additionalCps
                    let time = Game.sayTime(Game.fps*seconds, -1)
                    let extraDisc = '<div>Time for this upgrade to pay for itself: ' + time + '</div>'
                    return oldDesc + extraDisc
                }
            } else {
                missingEfficiencyInfo.push(me)
            }
        }
        console.log('Missing efficiency logic for these upgrades', missingEfficiencyInfo)
    },
});