const io = require("../../server").io;
const { v4: uuidv4 } = require('uuid');
// console.log(uuidv4());

class PlayerData{
    constructor({socketId, playerName, settings, playerColor, room}){
        this.uid = uuidv4();
        this.name = playerName;
        this.room = (()=>{
            if(room){
                if(room === "createIt") return generateRoom();
                else return room;
            } else {
                return "global";
            }
        })();
        this.locX = Math.floor(Math.random()*settings.worldWidth);
        this.locY = Math.floor(Math.random()*settings.worldHeight);
        this.radius = settings.defaultSize;
        this.color = playerColor || getRandomColor();
        this.score = 0;
        this.orbsAbsorbed = 0;
        this.alive = true;
        this.invisible = false;
        this.setTimeOutID_extraRad = -1, this.setTimeOutID_invisibility = -1;
        this.setExtraRadius = ()=>{
            clearTimeout(this.setTimeOutID_extraRad);
            const originalRadius = this.radius;
            let factor;
            if(originalRadius >= 25) {
                factor = 1.25
            } else if(originalRadius >= 15) {
                factor = 1.5;
            } else {
                factor = 2;
            }
            this.radius *= factor;
            setTimeout(() => {
                this.radius -= (originalRadius*(factor-1));
            }, 4*1000);
        };
        this.setInvisibility = ()=>{
            clearTimeout(this.setTimeOutID_extraRad);
            this.invisible = true;
            setTimeout(() => {
                this.invisible = false;
            }, 4*1000);
        };
    }
}
function getRandomColor(){
    const r = Math.floor(Math.random()*200 + 50);
    const g = Math.floor(Math.random()*200 + 50);
    const b = Math.floor(Math.random()*200 + 50);
    return `rgb(${r},${g},${b})`;
}
function generateRoom(){
    let newRoom = (uuidv4().split("-")).pop();
    while((io.sockets.adapter.rooms).has(newRoom)){
        newRoom = (uuidv4().split("-")).pop();
    }
    return newRoom; 
}

module.exports = PlayerData;