
function draw(){

    context.setTransform(1,0,0,1,0,0); 
    context.clearRect(0, 0, canvas.width, canvas.height);    

    if(player.alive? player.alive:true){
        const camX = -player.locX + canvas.width/2;
        const camY = -player.locY + canvas.height/2;
        context.translate(camX, camY);
    }

    // context.beginPath();
    // context.fillStyle = "rgb(255,0,0)"; // red Color;
    // context.arc(player.locX, player.locY, 10, 0, Math.PI*2);
    // // context.arc(300, 300, 10, 0, Math.PI*2); 
    // context.fill();
    // context.lineWidth = 3;
    // context.strokeStyle = "rgb(200, 150, 0)";
    // context.stroke();

    players.forEach((p)=>{
        context.beginPath();
        context.fillStyle = p.color;
        context.arc(p.locX, p.locY, p.radius, 0, Math.PI*2);
        context.fill();
        context.lineWidth = 3;
        context.strokeStyle = "rgb(200, 150, 0)";
        context.stroke();
    })

    orbs.forEach((orb)=>{
        context.beginPath();
        context.fillStyle = orb.color;
        context.arc(orb.locX, orb.locY, orb.radius, 0, Math.PI*2);
        context.fill();
    })

    requestAnimationFrame(draw);
}

canvas.addEventListener("mousemove", (event)=>{
    const x = event.clientX;
    const y = event.clientY;

    const angleDeg = Math.atan2(y - canvas.height/2, x - canvas.width/2)*(180/Math.PI);
    if(angleDeg >= 0 && angleDeg < 90){
        // console.log("In lower Right");
        xVector = 1 - (angleDeg/90);
        yVector = -(angleDeg/90); 
    } 
    else if(angleDeg >=90 && angleDeg < 180){
        // console.log("In lower Left");
        xVector = -(angleDeg-90)/90;
        yVector = (angleDeg-90)/90 - 1;
    }
    else if(angleDeg >= -180 && angleDeg < -90){
        // console.log("In upper Left");
        xVector = (angleDeg+90)/90;
        yVector = 1 + (angleDeg+90)/90;
    }
    else if(angleDeg <0 && angleDeg >= -90){
        // console.log("In upper Right");
        xVector = (angleDeg+90)/90;
        yVector = 1-(angleDeg+90)/90
    }

    // console.log(xVector, yVector);
    player.xVector = xVector?xVector:0;
    player.yVector = yVector?yVector:0;

}) 