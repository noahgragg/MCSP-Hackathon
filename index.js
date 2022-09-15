
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;


var mConstraint;

var engine = Engine.create();
 
var render = Render.create({
                element: document.body,
                engine: engine,
                options: {
                    width: window.innerWidth,
                    height: window.innerHeight,
                    wireframes: false
                }
             });
              

var ground = Bodies.rectangle((window.innerWidth / 2), window.innerHeight, window.innerWidth, 60, { isStatic: true });

let ball = Bodies.circle(1000, 600, 20);
let sling = Matter.Constraint.create({
    pointA: {x: 1000, y: 600},
    bodyB: ball,
    stiffness: 0.05
})

let mouse = Matter.Mouse.create(render.canvas);
mConstraint = Matter.MouseConstraint.create(engine, {
    element: document.body,
    mouse: mouse,
    constraint: {
    render: {visible: false}
    }
});
render.mouse = mouse;


let firing = false;
Matter.Events.on(mConstraint, 'enddrag', function(e){
    if(e.body === ball) firing = true;
    console.log(firing)
});
Matter.Events.on(engine,'afterUpdate',function(){
    if(firing && Math.abs(ball.position.x-1000) < 20 && Math.abs(ball.position.y-600) < 20){
    ball = Bodies.circle(1000, 600, 20, {density: 2});
    World.add(engine.world, ball);
    sling.bodyB = ball;
    firing = false;
    }
});

let stack = Matter.Composites.stack(200,0,10,200, 0, 0, function(x,y){
    return Bodies.rectangle(x,y,30,30, {restitution: .01, density: .001});
})

World.add(engine.world, [stack, ground, mConstraint, ball, sling]);
 
Engine.run(engine);
Render.run(render);