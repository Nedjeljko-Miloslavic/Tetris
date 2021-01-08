var canvas = document.querySelector("canvas");
const X = 300;
const Y = 500;
var game = true;

canvas.height = Y;
canvas.width = X;
canvas.style.background = "black";

const c = canvas.getContext("2d");
c.fillStyle = "white";

class Shape {
	constructor(x,y,arr){
		this.x = x;
		this.y = y;
		this.arr = arr;
	}
	
	draw(){
		for(let i=0; i<this.arr.length; i++){
			for(let j=0; j<this.arr[i].length; j++){
				if(this.arr[i][j]==1){
					c.beginPath();
					c.fillRect(this.x+50*j, this.y+50*i, 50,50);
					c.fill();
				}
			}
		}
	}
	
	check(){
		let check_left = "ok";
		let check_right = "ok";
		let check_down = "ok";
		let check_collision = "ok";
		for(let i=0; i<this.arr.length; i++){
			for(let j=0; j<this.arr[i].length; j++){
				let x = this.arr[i][j];
				if(x==1){
					if(container[i+this.y/50][j+this.x/50+1]==1){
						check_collision = "block";
					}
					
					if(container[i+this.y/50][j+this.x/50+2]==1){
						check_right = "block";
					}
					
					if(container[i+this.y/50][j+this.x/50]==1){
						check_left = "block";
					}
					
					if(container[i+this.y/50+1][j+this.x/50+1]==1){
						check_down = "block";
					}
				}
			}
		}
		return {right:check_right, left:check_left, down:check_down, collision:check_collision};
	}
}

function container_construct(X,Y){
	let frame = [1];
	for(let i=0; i<X/50; i++){
		frame.push(0);
	}
	frame.push(1);
	var container = [];
	
	for(let i=0; i<Y/50; i++){
		container.push(frame);
	}
	
	var arr = [];
	for(let i=0; i<X/50+2; i++){
		arr.push(1);
	}
	
	container.push(arr);
	
	return {container:container, arr:arr, frame:frame};
}

let container = [];
for(let i=0; i<Y/50; i++){
	container.push(container_construct(X,Y).frame);
}

container.push(container_construct(X,Y).arr);









var shape1 = new Shape(0,0, shapes[Math.floor(Math.random()*7)][0]);



//------------EVENT LISTENERS

document.addEventListener("keydown", (event)=>{
	if(event.key=="ArrowRight" && shape1.check().right == "ok"){
		shape1.x += 50;
	}else if(event.key=="ArrowLeft" && shape1.check().left == "ok"){
		shape1.x -= 50;
	}
	
});

document.addEventListener("keydown", (event)=>{
	let largest;
	let index_i;
	let index_j;
	if(event.key == "m"){
		for(let i=0; i<shapes.length; i++){
			for(let j=0; j<shapes[i].length; j++){
				if(shape1.arr == shapes[i][j]){
					index_i = i;
					index_j = j;
					let largest_index = shapes[i].length-1;
					if(shape1.arr == shapes[i][largest_index]){
						largest = true;
					}else{
						largest = false;
					}
				}
			}
		}
		
		flip(index_i, index_j, largest);
	}
});

function flip(index_i, index_j, largest){
	let current_shape_arr = shape1.arr;
	let next_shape_arr;
	
	if(largest){
		next_shape_arr = shapes[index_i][0];		
	}else{
		next_shape_arr = shapes[index_i][index_j+1];
	}

	let diff = current_shape_arr.length - next_shape_arr.length;
	let shape_test_1 = new Shape(shape1.x, shape1.y+diff*50, next_shape_arr);
	let shape_test_2 = new Shape(shape1.x-50, shape1.y+diff*50, next_shape_arr);
	let shape_test_3 = new Shape(shape1.x-50*2, shape1.y+diff*50, next_shape_arr);
	let shape_test_4 = new Shape(shape1.x-50*3, shape1.y+diff*50, next_shape_arr);
		
	if(shape_test_1.check().collision == "ok"){
		shape1 = shape_test_1;
	}else if(shape_test_2.check().collision == "ok"){
		shape1 = shape_test_2;
	}else if(shape_test_3.check().collision == "ok"){
		shape1 = shape_test_3;
	}else if(shape_test_4.check().collision == "ok"){
		shape1 = shape_test_4;
	}
}


function animate_fall(){
	setTimeout(function(){
		if(game){
			requestAnimationFrame(animate_fall);
		}else{
			console.log("game over");
		}
		
		if(shape1.check().down=="ok"){
			shape1.y += 50;
		}
		if(shape1.check().down=="block"){
			setTimeout(function(){
				let arr = shape1.arr;
				let shape = shape1;
				
				if(shape1.check().down=="block"){
					for(let i=0; i<arr.length; i++){
						for(let j=0; j<arr[i].length; j++){
							if(arr[i][j]==1){
								container[i+shape.y/50][j+shape.x/50+1] = 1;							
							}
						}
					}
				}
				
				shape1 = new Shape(0,0, shapes[Math.floor(Math.random()*7)][0]);
				if(shape1.check().collision == "block"){
					game = false;
				}
			}, 1000);
			
		}
		
	},1000);
}



function animate_draw(){
	requestAnimationFrame(animate_draw);
	c.clearRect(0,0,X,Y);
	shape1.draw();
	
	
	for(let i=0; i<container.length; i++){
		for(let j=0; j<container[i].length; j++){
			if(container[i][j]==1){
				c.beginPath();
				c.fillRect(j*50-50,i*50,50,50);
				c.fill();
			}
			
		}
	}
}

function score(){
	requestAnimationFrame(score);
	let counter = 0;
	for(let i=0; i<container.length-1; i++){
		let test = true;
		for(let j=1; j<container[i].length-1; j++){
			if(container[i][j]==0){
				test=false;
			}
		}
		if(test==true){
			for(let k=i; k>1; k--){
				container[k] = container[k-1];
			}
			container[0] = container_construct(X,Y).frame;
		}
	}
}


animate_fall();
animate_draw();
score();
