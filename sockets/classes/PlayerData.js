const io = require("../../server").io;
const { v4: uuidv4 } = require('uuid');
// console.log(uuidv4());

class PlayerData{
    constructor({socketId, playerName, settings, playerColor, room}){
        this.uid = uuidv4();
        this.name = playerName;
        this.room = (()=>{
            if(room){
                if(room === "createIt") return this.generateRoom();
                else return room;
            } else {
                return "global";
            }
        })();
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
    generateRoom(){
        let newRoom = (uuidv4().split("-")).pop();
        while((io.sockets.adapter.rooms).has(newRoom)){
            newRoom = (uuidv4().split("-")).pop();
        }
        return newRoom; 
    }
}

module.exports = PlayerData;
