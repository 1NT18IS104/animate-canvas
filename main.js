/*first get the canvas element and then get that element's context—
the thing onto which the drawing will be rendered.*/
let c=document.getElementById("canvas");
let ctx=c.getContext("2d");

//setting background
let backgroundImg = document.createElement("img");
backgroundImg.onload = () => {
  ctx.drawImage(backgroundImg, 0, 0, 1525, 600);
};
backgroundImg.src = "images/background.jpg";

let loadImage=(src,callback) =>{
    let img= document.createElement("img"); //creating an image object
    //the image must be loaded first and can then only be drawn onto the canvas 
    img.onload= () => callback(img);
    img.src=src;
};

//loads an ordered number of images
let imagePath= (frameNumber, animation) =>{
    return "images/" + animation +"/" + frameNumber + ".png"
};

let frames= {
    idle: [1,2,3,4,5,6,7,8],
    kick: [1,2,3,4,5,6,7],
    punch: [1,2,3,4,5,6,7],
    backward: [1,2,3,4,5,6],
    forward: [1,2,3,4,5,6],
    block: [1,2,3,4,5,6,7,8,9]
};

//calls back all the images that are loaded
let loadImages= (callback) => {
    
    
    let images= { idle: [], kick: [], punch: [], backward: [], forward: [], block: []};//contains all the loaded images
    let imagesToload= 0; //keeps track such that all the images are loaded below

    //calling each image
    ["idle", "kick", "punch", "backward", "forward", "block"].forEach((animation) => {
        let animationFrames= frames[animation];
        imagesToload+=animationFrames.length;

        animationFrames.forEach((frameNumber) => {
            let path= imagePath(frameNumber, animation);  

            //loading each image and then calling the callback func of loadImage
            loadImage(path, (image) => {
                images[animation][frameNumber-1]= image;
                imagesToload-=1;
                if(imagesToload===0) {
                    //call the callback func of loadImages once all the images are loaded
                    callback(images);
                }
            });   
        });
           
    });
};


let animate= (ctx, images, animation, callback) => {

  
    //iterate through each image of the images array
    images[animation].forEach((image, index) => {
        setTimeout(() => {

            //clear the canvas so the previous images does not overlap with the next one while animating 
            ctx.clearRect(0, 0, 500, 500); 

            //draw background
            ctx.drawImage(backgroundImg, 0, 0, 1525, 600);

            /*(img, x, y, width, height)-- notice that width & height is same as canvas. 
            index*100 ensures there is ample delay while each loading images*/
            ctx.drawImage(image, 0, 0, 600, 600); 
        }, index*100);  
    });

    //this timeout is to call the callback function of animate after the animation is done
    setTimeout(callback, images[animation].length*100);
};

//the callback function of loadImages is called after all the images are loaded
loadImages((images) => {

    //we create a queue of requested animations
    let queuedAnimations= []
    let aux= () => {
        let selectedAnimation;

        //once all the animations are executed, go back to idle 
        if(queuedAnimations.length===0)
        selectedAnimation="idle";

        else
        //shift out each executed animation once it has been executed
        selectedAnimation= queuedAnimations.shift();

        animate(ctx, images, selectedAnimation, aux)
    }
    //note that aux is a recurring function
    aux();

    document.getElementById("kick").onclick = () => {
        queuedAnimations.push("kick");
    };

    document.getElementById("punch").onclick = () => {
        queuedAnimations.push("punch");
    };

    document.getElementById("backward").onclick = () => {
        queuedAnimations.push("backward");
    };

    document.getElementById("forward").onclick = () => {
        queuedAnimations.push("forward");
    };

    document.getElementById("block").onclick = () => {
        queuedAnimations.push("block");
    };

    document.addEventListener('keyup', (event => {
        const key= event.key;
        if(key==="ArrowLeft"){
            queuedAnimations.push("backward");
            //ctx.translate(-30, 0);;
        }
        else if (key==="ArrowRight"){
            queuedAnimations.push("forward")
            //ctx.translate(30, 0);
        }
        if(key==="ArrowUp"){
            queuedAnimations.push("punch");
        }
        else if (key==="ArrowDown"){
            queuedAnimations.push("kick");
        }
        else if (event.code === 'Space'){
            queuedAnimations.push("block");
        }
    }));
});

//attempt to animate background
// let c=document.getElementById("canvasBg");
// let ctx=c.getContext("2d");

// //set a background 
// var bg= new Image();
// bg.src= "images/background.jpg";


// function Background (){
//     this.x=0, this.y=0, this.w=bg.width, this.h=bg.height;
//     this.render= () => {
//         ctx.drawImage(bg, this.x-=7, 0, 3000, 700);
//         if(this.x <= -1499) this.x=0;
//     };
// };
// var background= new Background();

// function animate(callback) {
//     ctx.save();
//     ctx.clearRect(0,0,1500,700);
//     background.render();
//     ctx.drawImage(canvasGame, 0, 0)
//     ctx.restore();
// }

// //var animateInterval = setInterval(animate, 30);
// window.addEventListener('load', function(event) {
//     animate();
// });