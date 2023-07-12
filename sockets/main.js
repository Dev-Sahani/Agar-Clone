const io = require("../server").io;
const checkForOrbCollisions = require("./checkCollision").checkForOrbCollisions;
const checkForPlayerCollisions = require("./checkCollision").checkForPlayerCollisions;

//  ================ Classes =====================
const Orb = require("./classes/Orb");
const Player = require("./classes/Player");
const PlayerConfig = require("./classes/PlayerConfig");
const PlayerData = require("./classes/PlayerData");

let orbs = [];
let players = [];
let settings = {
    defaultOrbs: 3000,
    defaultSpeed: 8,
    defaultSize: 8,
    defaultZoom: 1.5,
    worldWidth: 3000,
    worldHeight: 3000,
}

initGame();

setInterval(()=>{
    if(players.length > 0){
        io.to("game").emit("tock", {
            players,
        });
    }
}, 33);

io.on("connect", (socket)=>{
    let player = {};
    socket.on("init", (data)=>{
        let playerConfig = new PlayerConfig(settings);
        let playerData = new PlayerData(socket.id, data.playerName, settings);
        player = new Player(socket.id, playerConfig, playerData);
        
        setInterval(()=>{
            socket.emit("tickTok", {
                playerX: player.playerData.locX,
                playerY: player.playerData.locY,
            });
        }, 33);

        socket.emit("initReturn", { orbs, uid: player.playerData.uid});
        players.push(playerData);
        socket.join("game");
    })

    socket.on("tick", (data)=>{
        try {
            let speed = player.playerConfig.speed;
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
    
            let capturedOrb = checkForOrbCollisions(player.playerData,player.playerConfig, orbs, settings);
            if(capturedOrb){
                // console.log("collision !!!");
                const newOrb = new Orb(settings);
                orbs.splice(capturedOrb, 1, newOrb);
                
                io.sockets.emit("updateLeaderboard", getLeaderBoard());
                io.sockets.emit("orbSwitch", {
                    orbIndex: capturedOrb, // capturedOrb contain index of removed orb,
                    newOrb,
                })
            }
    
            // Player collisions:
            let playerDeath = checkForPlayerCollisions(player.playerData, player.playerConfig, players, null, player.playerData.uid);
            // console.log(playerDeath);
            if(playerDeath){
                io.sockets.emit("updateLeaderboard", {
                    ...getLeaderBoard(),
                });
                io.sockets.emit("playerDeath", playerDeath);
            }
        }
        catch(err){
            socket.emit("serverError");
            // console.log("ERROR :inside socket.on('tick', ...)\n", err);
        }
    })

    socket.on("disconnect", (data)=>{
        if(player.playerData){
            players = players.filter((p)=>{
                return p.uid !== player.playerData.uid;
            })
            io.sockets.emit("updateLeaderboard", getLeaderBoard());
        }
    })
})

function getLeaderBoard(){
    players.sort((a,b)=>{
        return b.score - a.score ;
    })
    let leaderBoard = players.map((p)=>{
        return {
            name: p.name,
            score: p.score,
        }
    })

    return leaderBoard;
}

function initGame(){
    for(let i=0; i < settings.defaultOrbs; i++){
        orbs.push(new Orb(settings));
    }
}

module.exports = io;
