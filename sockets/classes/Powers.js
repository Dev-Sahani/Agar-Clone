class Power {
    constructor({settings}) {
        this.radius = settings.defaultPowerSize;
        this.locX = Math.floor(Math.random()*settings.worldWidth);
        this.locY = Math.floor(Math.random()*settings.worldHeight);
        this.powerName = this.getRandomName();
    } 
    getRandomName() {
        const random = Math.round(Math.random()*3);
        let powerName;
        switch (random) {
            case 1:
                powerName = "invisiblePower";
                break;
            case 2:
                powerName = "speedPower";
                break;
            default :
                powerName = "shootPower";
                break;
        }
        return powerName;
    }
}

module.exports = Power;

// class Invisible extends Power{
//     constructor(settings) {
//         super(settings);
//         this.setPowerName("InvisiblePower");
//     }
// }

// class SpeedUp extends Power{
//     constructor(settings) {
//         super(settings);
//         this.setPowerName("SpeedPower");
//     }
// }

// class ShootPower extends Power {
//     constructor(settings) {
//         super(settings);
//         this.setPowerName("ShootPower");
//     }   
// }


// module.exports = getRandomPower();
// class Invisible{
//     constructor({settings}) {
//         this.powerName = "invisibility";
//         this.radius = settings.defaultPowerSize;
//         this.locX = Math.floor(Math.random()*settings.worldWidth);
//         this.locY = Math.floor(Math.random()*settings.worldHeight);
//         this.imagePath = "/images/InvisiblePower.svg";
//     }
// }

// class SpeedUp {
//     constructor(settings) {
//         this.powerName = "speedUp";
//         this.radius = settings.defaultPowerSize;
//         this.locX = Math.floor(Math.random()*settings.worldWidth);
//         this.locY = Math.floor(Math.random()*settings.worldHeight);
//         this.imagePath = "/images/SpeedPower.svg"; 
//     }
// }

// class ShootPower {
//     constructor(settings) {
//         this.powerName = "shootPower";
//         this.radius = settings.defaultPowerSize;
//         this.locX = Math.floor(Math.random()*settings.worldWidth);
//         this.locY = Math.floor(Math.random()*settings.worldHeight);
//         this.imagePath = "/images/ShootPower.svg"; 
//     }   
// }
