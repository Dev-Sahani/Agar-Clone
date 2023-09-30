const io = require("../server").io;
const checkForOrbCollisions = require("./checkCollision").checkForOrbCollisions;
const checkForPlayerCollisions = require("./checkCollision").checkForPlayerCollisions;
const checkForPowerCollisions = require("./checkCollision").checkForPowerCollisions;
//  ================ Classes =====================
const Orb = require("./classes/Orb");
const Player = require("./classes/Player");
const PlayerConfig = require("./classes/PlayerConfig");
const PlayerData = require("./classes/PlayerData");
const Power = require("./classes/Powers");

let orbs = {}; // object = {room : [orbs...]}
let players = {}; // object = {room : [players...]}
let powers = {}; // powers = {room: [power...]}
let settings = {
    defaultOrbs: 1000,
    defaultSpeed: 8,
    defaultSize: 8,
    defaultZoom: 1.5,
    defaultPowerSize: 50,
    defaultNumberOfPowers: 6,
    worldWidth: 3000,
    worldHeight: 3000,
}


setInterval(()=>{
    for(let room in players){
        try{
            if(players[room].length > 0){
                io.to(room).emit("tock", {
                    players: players[room],
                });
            }
        } catch(err) {
            console.log("ERROR \n");
        }
    }
}, 33);

io.on("connect", (socket)=>{
    let player = {};
    socket.on("init", (data)=>{
        let playerConfig = new PlayerConfig(settings);
        // console.log("socket.id = ", socket.id);
        let playerData = new PlayerData({socketId: socket.id, playerColor: data.playerColor, playerName: data.playerName, settings, room: data.room,});
        player = new Player(socket.id, playerConfig, playerData);
        
        // players.push(playerData)
        if(player.playerData.room in players){
            players[player.playerData.room].push(playerData);
        } else {
            players[player.playerData.room] = [playerData];
        }

        socket.join(player.playerData.room);

        if(!(player.playerData.room in orbs)){
            createOrbs(player.playerData.room);
        }

        if(!(player.playerData.room in powers)) {
            createPowers(player.playerData.room);
        }

        socket.emit("initReturn", { 
            orbs: orbs[player.playerData.room], 
            uid: player.playerData.uid, 
            room: player.playerData.room,
            powers: powers[player.playerData.room],
        });
        // console.log(io.sockets.adapter.rooms);
        setInterval(()=>{   
            // socket.to(<room already joined by the player>).emit("tickTok", {..}) => not working
            io.to(socket.id).emit("tickTok", {
                playerX: player.playerData.locX,
                playerY: player.playerData.locY,
            });
        }, 33);    
    })
    
    socket.on("tick", (data)=>{
        try {
            let speed = player.playerConfig.speed + player.playerConfig.extraSpeed;
            if(!data.xVector || !data.yVector){
                data.xVector = 0;
                data.yVector = 0;
            }        
            xV = player.playerConfig.xVector = data.xVector;
            yV = player.playerConfig.yVector = data.yVector;
    
            player.playerData.locX += (speed * xV);
            player.playerData.locY -= (speed * yV);
    
            if(player.playerData.locX < 0){
                player.playerData.locX = 0;
            } else if(player.playerData.locX > settings.worldWidth){
                player.playerData.locX = settings.worldWidth;
            }
    
            if(player.playerData.locY < 0) {
                player.playerData.locY = 0;
            } else if( player.playerData.locY > settings.worldHeight){
                player.playerData.locY = settings.worldHeight;
            }
    
            let capturedOrb = checkForOrbCollisions(player.playerData,player.playerConfig, orbs[player.playerData.room], settings);
            if(capturedOrb || capturedOrb === 0){
                // console.log("collision !!!");
                const newOrb = new Orb(settings);
                orbs[player.playerData.room].splice(capturedOrb, 1, newOrb);
                
                io.sockets.in(player.playerData.room).emit("updateLeaderboard", getLeaderBoard(player.playerData.room));
                io.sockets.in(player.playerData.room).emit("orbSwitch", {
                    orbIndex: capturedOrb, // capturedOrb contain index of removed orb,
                    newOrb,
                })
            }
    
            const powerGained = checkForPowerCollisions({player, powers: powers[player.playerData.room]});
            if(powerGained || powerGained === 0) {
                const power = powers[player.playerData.room][powerGained];
                switch(power.powerName) {
                    case "speedPower":
                        player.playerConfig.setExtraSpeed();
                        break;
                    case "invisiblePower":
                        player.playerData.setInvisibility();
                        break;
                    default:
                        player.playerData.setExtraRadius();
                        break;
                }
                const newPower = new Power({settings});
                powers[player.playerData.room].splice(powerGained, 1, newPower);
                io.sockets.in(player.playerData.room).emit("powerAbsorbed", {powerGained, newPower});
            }
            // Player collisions:
            // let playerDeath = checkForPlayerCollisions(player.playerData, player.playerConfig, players, null, player.playerData.uid);
            let playerDeath = checkForPlayerCollisions(player.playerData, player.playerConfig, players[player.playerData.room], null, player.playerData.uid);
            // console.log(playerDeath);
            if(playerDeath){
                io.sockets.in(player.playerData.room).emit("updateLeaderboard", getLeaderBoard(player.playerData.room),);
                io.sockets.in(player.playerData.room).emit("playerDeath", playerDeath);
            }
        }
        catch(err){
            socket.emit("serverError"); 
            console.log("ERROR :inside socket.on('tick', ...)\n", err);
        }
    })

    socket.on("disconnect", (data)=>{
        // console.log("someone discconected !");
        if(player.playerData){
            players[player.playerData.room] = players[player.playerData.room].filter((p)=>{
                return p.uid !== player.playerData.uid;
            })
            io.sockets.in(player.playerData.room).emit("updateLeaderboard", getLeaderBoard(player.playerData.room));
        }
    })
})

function getLeaderBoard(room){
    players[room].sort((a,b)=>{
        return b.score - a.score ;
    })
    let leaderBoard = players[room].map((p)=>{
        return {
            name: p.name,
            score: p.score,
        }
    })

    return leaderBoard;
}

function createOrbs(room){
    if(!(room in orbs)){
        orbs[room] = [];
    }
    for(let i=0; i < settings.defaultOrbs; i++){
        orbs[room].push(new Orb(settings));
    }
}

function createPowers(room) {
    if(!(room in powers)) {
        powers[room] = [];
    }
    for(let i=0; i<settings.defaultNumberOfPowers; i++) {
        powers[room].push(new Power({settings}))
    }
}
module.exports = io;
