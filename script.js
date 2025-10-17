window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('speedoCanvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth * 0.2;
        canvas.height = canvas.width;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function getHUDParams() {
        const size = canvas.width;
        return {
            cx: size/2,
            cy: size/2,
            speedRadius: size*0.45,
            rpmRadius: size*0.32,
            fontSizeSpeed: size*0.12,
            fontSizeSmall: size*0.06,
            indicatorOffset: size*0.35
        };
    }

    let speed=0, targetSpeed=0;
    let rpm=0, targetRpm=0;
    let fuel=100, health=100;
    let gear='N';
    let indicators = { left:false, right:false, headlight:false, engine:true };
    let blinkOn = true;

    // Timer blinking
    setInterval(() => { blinkOn = !blinkOn; }, 500);

    function drawHUD() {
        const p = getHUDParams();
        ctx.clearRect(0,0,canvas.width,canvas.height);

        // Background semi-transparent
        ctx.beginPath();
        ctx.arc(p.cx,p.cy,p.speedRadius+10,0,Math.PI,true);
        ctx.fillStyle='rgba(0,0,0,0.3)';
        ctx.fill();

        // Speedometer dial
        ctx.beginPath();
        ctx.arc(p.cx,p.cy,p.speedRadius,Math.PI,0,false);
        ctx.lineWidth = 0.08*canvas.width;
        ctx.strokeStyle='rgba(0,255,255,0.4)';
        ctx.shadowColor='rgba(0,255,255,0.5)';
        ctx.shadowBlur=10;
        ctx.stroke();
        ctx.shadowBlur=0;

        // Tick marks & numbers
        for(let i=0;i<=20;i++){
            const angle = Math.PI + i*(Math.PI/20);
            const x1 = p.cx + Math.cos(angle)*(p.speedRadius-0.08*canvas.width);
            const y1 = p.cy + Math.sin(angle)*(p.speedRadius-0.08*canvas.width);
            const x2 = p.cx + Math.cos(angle)*p.speedRadius;
            const y2 = p.cy + Math.sin(angle)*p.speedRadius;
            ctx.beginPath();
            ctx.moveTo(x1,y1);
            ctx.lineTo(x2,y2);
            ctx.lineWidth=2;
            ctx.strokeStyle='#0ff';
            ctx.stroke();

            if(i%2===0){
                const numX = p.cx + Math.cos(angle)*(p.speedRadius-0.2*canvas.width);
                const numY = p.cy + Math.sin(angle)*(p.speedRadius-0.2*canvas.width);
                ctx.font = `${p.fontSizeSmall}px Arial`;
                ctx.fillStyle='#0ff';
                ctx.textAlign='center';
                ctx.textBaseline='middle';
                ctx.fillText(i*10,numX,numY);
            }
        }

        // Jarum speed
        speed += (targetSpeed-speed)*0.05;
        const speedAngle = Math.PI + (speed/200)*Math.PI;
        const sx = p.cx + Math.cos(speedAngle)*p.speedRadius*0.9;
        const sy = p.cy + Math.sin(speedAngle)*p.speedRadius*0.9;
        ctx.beginPath();
        ctx.moveTo(p.cx,p.cy);
        ctx.lineTo(sx,sy);
        ctx.lineWidth=0.013*canvas.width;
        ctx.strokeStyle='red';
        ctx.shadowColor='red';
        ctx.shadowBlur=8;
        ctx.stroke();
        ctx.shadowBlur=0;

        // Jarum RPM
        rpm += (targetRpm-rpm)*0.05;
        const rpmAngle = Math.PI + (rpm/8000)*Math.PI;
        const rx = p.cx + Math.cos(rpmAngle)*p.rpmRadius*0.9;
        const ry = p.cy + Math.sin(rpmAngle)*p.rpmRadius*0.9;
        ctx.beginPath();
        ctx.moveTo(p.cx,p.cy);

        // Warna jarum RPM merah di red zone 7000-8000
        ctx.lineTo(rx,ry);
        ctx.lineWidth=0.01*canvas.width;
        if(rpm>=7000) ctx.strokeStyle='red';
        else ctx.strokeStyle='orange';
        ctx.shadowColor=ctx.strokeStyle;
        ctx.shadowBlur=6;
        ctx.stroke();
        ctx.shadowBlur=0;

        // Titik pusat
        ctx.beginPath();
        ctx.arc(p.cx,p.cy,0.017*canvas.width,0,Math.PI*2);
        ctx.fillStyle='white';
        ctx.fill();

        // Speed text
        ctx.font=`${p.fontSizeSpeed}px Arial`;
        ctx.fillStyle='#0ff';
        ctx.textAlign='center';
        ctx.fillText(Math.round(speed)+' km/h', p.cx, p.cy+0.2*canvas.width);

        // RPM text
        ctx.font=`${p.fontSizeSmall}px Arial`;
        ctx.fillStyle='orange';
        ctx.fillText('RPM: '+Math.round(rpm), p.cx, p.cy+0.3*canvas.width);

        // Gear, fuel, health
        ctx.font=`${p.fontSizeSmall}px Arial`;
        ctx.fillStyle='#fff';
        ctx.fillText('Gear: '+gear, p.cx-0.25*canvas.width, p.cy-0.05*canvas.width);
        ctx.fillText('Fuel: '+Math.round(fuel)+'%', p.cx+0.25*canvas.width, p.cy-0.05*canvas.width);
        ctx.fillText('HP: '+Math.round(health)+'%', p.cx, p.cy-0.25*canvas.width);

        // Indicators blinking
        ctx.font=`${p.fontSizeSmall}px Arial`;
        ctx.fillStyle = (indicators.left && blinkOn)?'yellow':'rgba(255,255,0,0.3)';
        ctx.fillText('◀', p.cx-p.indicatorOffset, p.cy-0.15*canvas.width);
        ctx.fillStyle = (indicators.right && blinkOn)?'yellow':'rgba(255,255,0,0.3)';
        ctx.fillText('▶', p.cx+p.indicatorOffset, p.cy-0.15*canvas.width);
        ctx.fillStyle = indicators.headlight?'#0ff':'rgba(0,255,255,0.3)';
        ctx.fillText('💡', p.cx-p.indicatorOffset, p.cy+0.3*canvas.width);
        ctx.fillStyle = indicators.engine?'#f00':'rgba(255,0,0,0.3)';
        ctx.fillText('⚡', p.cx+p.indicatorOffset, p.cy+0.3*canvas.width);
    }

    // Update HUD dari RageMP
    mp.events.add("render", () => {
        const veh = mp.players.local.vehicle;
        if(veh){
            targetSpeed = veh.getSpeed()*3.6;
            targetRpm = veh.getRPM ? veh.getRPM():3000;
            gear = veh.getCurrentGear ? veh.getCurrentGear().toString():'N';
            fuel = veh.getFuelLevel ? veh.getFuelLevel():100;
            health = veh.getHealth ? veh.getHealth():100;
            indicators.left = veh.isIndicatorLeftOn ? veh.isIndicatorLeftOn():false;
            indicators.right = veh.isIndicatorRightOn ? veh.isIndicatorRightOn():false;
            indicators.headlight = veh.isHeadlightOn ? veh.isHeadlightOn():false;
            indicators.engine = veh.isEngineOn ? veh.isEngineOn():true;
        } else {
            targetSpeed=0; targetRpm=0; gear='N'; fuel=100; health=100;
            indicators = {left:false,right:false,headlight:false,engine:true};
        }
        drawHUD();
    });
});
