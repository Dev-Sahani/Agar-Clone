const { v4: uuidv4 } = require('uuid');
// console.log(uuidv4());

class PlayerData{
    constructor({playerName, settings, playerColor}){
        this.uid = uuidv4();
        this.name = playerName;
        this.locX = Math.floor(Math.random()*settings.worldWidth);
        this.locY = Math.floor(Math.random()*settings.worldHeight);
        this.radius = settings.defaultSize;
        this.color = playerColor || this.getRandomColor();
        this.score = 0;
        this.orbsAbsorbed = 0;
        this.alive = true;
    }
    getRandomColor(){
        const r = Math.floor(Math.random()*200 + 50);
        const g = Math.floor(Math.random()*200 + 50);
        const b = Math.floor(Math.random()*200 + 50);
        return `rgb(${r},${g},${b})`;
    }
}

module.exports = PlayerData;
