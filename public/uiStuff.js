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

$(".start-game").on("click", (event)=>{
    $(".modal").modal("hide");
    $(".hiddenOnStart").removeAttr("hidden");
    init();
})

$("#join-team-btn").on("click", (event)=>{
    document.querySelector(".show-on-join-team").removeAttribute("hidden");
})