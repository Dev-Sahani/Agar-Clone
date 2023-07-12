class Orb{
    constructor(settings){
        this.color = this.getRandomColor();
        this.locX = Math.floor(Math.random()*settings.worldWidth + 100);
        this.locY = Math.floor(Math.random()*settings.worldHeight + 100);
        this.radius = 5;
    } 
    getRandomColor(){
        const r = Math.floor(Math.random()*200 + 50);
        const g = Math.floor(Math.random()*200 + 50);
        const b = Math.floor(Math.random()*200 + 50);
        return `rgb(${r},${g},${b})`;
    }
}

module.exports = Orb;   