class PlayerConfig{
    constructor(settings){
        this.xVector = 0;
        this.yVector = 0;
        this.speed = settings.defaultSpeed;
        this.zoom = settings.defaultZoom;

        this.extraSpeed = 0;        // speed gained by absorbing a power
        this.setTimeOutId = -1;

        this.setExtraSpeed = () => {
            clearTimeout(this.setTimeOutId);
            this.extraSpeed = 10;
            this.setTimeOutId = setTimeout(()=>{
                this.extraSpeed = 0;
            }, 4*1000);
        }
    }
}

module.exports = PlayerConfig;