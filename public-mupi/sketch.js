const NGROK = `${window.location.hostname}`;
//const NGROK = `https://${window.location.hostname}`;
//let socket = io(`${window.location.hostname}:5050`, { path: '/real-time' }); 
let socket = io(NGROK, { path: '/real-time' });
console.log('Server IP: ', NGROK);

let controllerX, controllerY = 20;
let deviceWidth, deviceHeight = 0;
let mupiWidth, mupiHeight = 0;
let x, y; 
let xspeed, yspeed; 
let diameter = 40; 
let rectX = 100, rectY = 200; 
let rectWidth = 120, rectHeight = 40; 


function setup() {
    frameRate(60);
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.style('z-index', '-1');
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('right', '0');
    controllerX = windowWidth / 2;
    controllerY = windowHeight / 2;
    mupiWidth = windowWidth;
    mupiHeight = windowHeight;
    background(0);
    x = width/2;
    y = height/2;
    xspeed = 5;
    yspeed = 2;
}

function draw() {
    background(0, 5);
    newCursor(pmouseX, pmouseY);
    fill(255);
    rect(controllerX, controllerY, rectWidth,rectHeight);

    fill(152)
    circle(x, y, diameter);
    x += xspeed;
    y += yspeed;
    if (collideRectCircle(controllerX,controllerY, rectWidth, rectHeight, x, y, diameter)) {
        xspeed = -xspeed;
        yspeed = -yspeed;
      }
      if (x + diameter/2 > width || x - diameter/2 < 0) {
        xspeed = -xspeed;
      }
      if (y + diameter/2 > height || y - diameter/2 < 0) {
        yspeed = -yspeed;
      }
}


function mouseDragged() {
    socket.emit('positions', { controlX: pmouseX, controlY: pmouseY });
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function newCursor(x, y) {
    noStroke();
    fill(255);
    ellipse(x, y, 10, 10);
}

socket.on('mupi-instructions', instructions => {
    console.log('ID: ' + socket.id);

    let { interactions } = instructions;
    switch (interactions) {
        case 0:
            let { pmouseX, pmouseY } = instructions;
            controllerX = (pmouseX * mupiWidth) / deviceWidth;
            controllerY = (pmouseY * mupiHeight) / deviceHeight;
            console.log({ controllerX, controllerY });
            break;
        case 1:
            let { pAccelerationX, pAccelerationY, pAccelerationZ } = instructions;
            ballSize = pAccelerationY < 0 ? pAccelerationY * -2 : pAccelerationY * 2;
            break;
        case 2:
            let { rotationX, rotationY, rotationZ } = instructions;
            controllerY = 500;
            controllerX = (rotationY * mupiWidth) / 90;
            break;
    }


});

socket.on('mupi-size', deviceSize => {
    let { deviceType, windowWidth, windowHeight } = deviceSize;
    deviceWidth = windowWidth;
    deviceHeight = windowHeight;
    console.log(`User is using an ${deviceType} smartphone size of ${deviceWidth} and ${deviceHeight}`);
});