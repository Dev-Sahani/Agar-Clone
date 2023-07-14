var socket;
function init(){
    socket = io("https://agar-clone-gumc.onrender.com");
    socket.emit("init", { playerName : player.name, playerColor: player.color, room: player.room});

    let tick;
    socket.on("initReturn", (data)=>{
        orbs = data.orbs;
        player.uid = data.uid;
        player.room = data.room;
        player.alive = true;
        document.querySelector(".player-room").innerText = `${player.room}`;
        tick = setInterval(()=>{
            socket.emit("tick", {
                xVector: player.xVector,
                yVector: player.yVector,
            })
            // console.log(player);
        }, 33)
        
    })
    
        socket.on("tock", (data)=>{
            players = data.players;
            
            if(player.uid){
                const isInPlayers = players.find((p)=>{
                    return (p.uid === player.uid);
                })
                if(player.alive && !isInPlayers) {
                    console.log(data);
                    player.alive = false;
                    $("#spawnModal").modal("show");
                    $("#welcome-msg").html("Game Over!");
                    clearInterval(tick);
                    
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


    socket.on("serverError", ()=>{
        document.querySelector("#game-message").innerHTML = "Something went wrong! Server Error\n Please refresh or try again later.";
        $("#game-message").css({
            "background-color": "#00e6e6",
            "opacity": 1,
        });
        $("#game-message").show();
        setTimeout(()=>{$("#game-message").fadeOut()},5000);
        

        socket.disconnect();
    })

    draw();
} 

