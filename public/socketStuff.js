var socket;
function init(){
    socket = io("http://localhost:8080");
    socket.emit("init", { playerName : player.name});

    socket.on("initReturn", (data)=>{
        orbs = data.orbs;
        player.uid = data.uid;

        setInterval(()=>{
            socket.emit("tick", {
                xVector: player.xVector,
                yVector: player.yVector,
            })
            // console.log(player);
        }, 33)
        
    })
    
    socket.on("tock", (data)=>{
        // console.log(data.players);
        players = data.players;

        if(player.uid){
            const isInPlayers = players.find((p)=>{
                return (p.uid === player.uid);
            })
            if(!isInPlayers) {
                player.alive = false;
                $("#spawnModal").modal("show");
                
                socket.disconnect();
            }
        }
    })
    
    socket.on("tickTok", (data)=>{
        player.locX = data.playerX;
        player.locY = data.playerY;
    });
    
    socket.on("orbSwitch", (data)=>{
        // console.log(data);
        orbs.splice(data.orbIndex, 1, data.newOrb);
    })
    
    socket.on("updateLeaderboard", (data)=>{
        // console.log(data);
        const leaderBoard = document.querySelector(".leader-board");
        leaderBoard.innerHTML = "";
        data.forEach(currPlayer => {
            if(currPlayer.name === player.name) document.querySelector(".player-score").innerHTML = `${currPlayer.score}`;
            leaderBoard.innerHTML += `<li class="leaderboard-player">${currPlayer.name} - ${currPlayer.score}</li>`
        });
        
    })
    
    socket.on("playerDeath", (data)=>{
        console.log("Got Killed :", data.absorbed);
        console.log("Killed by :", data.absorbedBy);
    
        document.querySelector("#game-message").innerHTML = `${data.absorbed} absorbed by ${data.absorbedBy}`;
        $("#game-message").css({
            "background-color": "#00e6e6",
            "opacity": 1,
        });
        $("#game-message").show();
        setTimeout(()=>{$("#game-message").fadeOut()},5000);
    })

    draw();
} 

