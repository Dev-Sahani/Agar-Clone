let wHeight = $(window).height();
let wWidth = $(window).width();
let player = {};
let orbs = [];
let players = [];

let canvas = document.querySelector("#the-canvas");
let context = canvas.getContext("2d");
canvas.width = wWidth;
canvas.height = wHeight;

$(window).on("load", ()=>{
    $('#loginModal').modal('show')
});

$(".name-form").on("submit", (event)=>{
    event.preventDefault();
    player.name = document.querySelector("#name-input").value;
    player.color= document.querySelector("#color-drop-down").value;
    
    $("#loginModal").modal("hide");
    $("#spawnModal").modal("show");
})

$(".start-game").on("click", ()=>{
    player.room = "global";
    startGame();
})

$("#join-team-btn").on("click", (event)=>{
    document.querySelector(".show-on-join-team").removeAttribute("hidden");
})

$(".create-room-btn").on("click", (event)=>{
    player.room = "createIt";
    startGame();
})
$(".enter-room-btn").on("click", (event)=>{
    const roomId = document.querySelector("#room-id").value;
    console.log(roomId);
    if(!roomId || roomId === ""){
        console.log("inside blank room-id")
        document.querySelector("#room-id").value = "Please Enter a room-id";
    } else if(roomId === "global"){
        document.querySelector("#room-id").value = "Room id not available.";
    } else {
        player.room = roomId;
        startGame();
    }
})

function startGame(event){
    $(".modal").modal("hide");
    $(".hiddenOnStart").removeAttr("hidden");
    init();
}