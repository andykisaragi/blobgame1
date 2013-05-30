    		
			var can;
			var ctx;
			var canX;
			var canY;
			var mouseIsDown = 0;
		
			can = document.getElementById("canvas");
			ctx = can.getContext("2d");
		 
			can.addEventListener("mousedown", mouseDown, false);
			can.addEventListener("mousemove", mouseXY, false);
			can.addEventListener("touchstart", touchDown, false);
			can.addEventListener("touchmove", touchXY, true);
			can.addEventListener("touchend", touchUp, false);
		 
			document.body.addEventListener("mouseup", mouseUp, false);
			document.body.addEventListener("touchcancel", touchUp, false);
			
			 
			function mouseUp() {
				mouseIsDown = 0;
				mouseXY();
			}
			 
			function touchUp() {
				mouseIsDown = 0;
				// no touch to track, so just show state
				//showPos();
			}
			 
			function mouseDown() {
				mouseIsDown = 1;
				mouseXY();
			}
			 
			function touchDown() {
				mouseIsDown = 1;
				touchXY();
			}
			 
			function mouseXY(e) {
				if (!e) var e = event;
				canX = e.pageX - can.offsetLeft;
				canY = e.pageY - can.offsetTop;
				//showPos();
			}
			 
			function touchXY(e) {
				if (!e) var e = event;
				e.preventDefault();
				canX = e.targetTouches[0].pageX - can.offsetLeft;
				canY = e.targetTouches[0].pageY - can.offsetTop;
				//showPos();
			}

			function showPos() {
				// large, centered, bright green text
				ctx.font="24pt Helvetica";
				ctx.textAlign="center";
				ctx.textBaseline="middle";
				ctx.fillStyle="rgb(64,255,64)";
			
				// draw text at center, max length to fit on canvas
				ctx.fillText(score, 540, 600, 100);
				// plot cursor
				if (numBlobs < 1)
				{
					if (gameOver==false)
					{
					
						alert('Game Over... score: ' + score);
						window.location.reload();
						gameOver = true;
					}
				}
				
			}
			function init(){
				var world = [
				{
					x : 100,
					y : 100
				}
				];
				var score = 0;
				var life = 0;
				var current = 0;
				var dotSize = 50;
				var redC = 100;
				var redProb = 0.01;
				var bonusC = 10;
				var bonusProb = 0.005;
				var invaderC = 22;
				var xacc = 0;
				var yacc = 0;
				var yscroll = -5;
				var numBlobs = 0;
				var lines = [];
				var lineY = 500;
				var currentStage = 1;
				var resistance = 0.99;

			}
			var world = [
			{
				x : 100,
				y : 100
			}
			];
			var score = 0;
			var life = 0;
			var current = 0;
			var dotSize = 50;
			var redC = 100;
			var redProb = 0.01;
			var bonusC = 10;
			var bonusProb = 0.005;
			var invaderC = 22;
			var xacc = 0;
			var yacc = 0;
			var yscroll = -5;
			var numBlobs = 0;
			var lines = [];
			var lineY = 500;
			var currentStage = 1;
			var resistance = 0.99;
			var gameOver = false;
			
			function animate()
			{
				if (Math.random() <= redProb)
				{
					redProb+=0.001;
					bonusProb=redProb/4;
					if (redProb > 0.08 + currentStage / 100)
					{
						currentStage++;
						killAll('hole');
						redProb = 0.01 + currentStage / 100;
						addBonus(8+currentStage);
						alert("stage " + currentStage);
					}
					addRed(1);
					
				}
				bonusC--;
				if (Math.random() <= bonusProb)
				{
					addBonus(1);
					
				}
			
				
			}
			function addBonus(numBonus){
				var i=0;
				while(i < numBonus){

					var dx = Math.random() * 640;
					var dy = Math.random() * 640;
					bonusC = (Math.random() * 150) + 150;
					var k = 0;
			
					var p = {
						x : dx,
						y : 1200,
						s : 30,
						life : 120,
						t : 2,
						type : 'bonus',
						attraction : 2,
						kill : false,
						used : false,
						xspeed : 0,
						yspeed : (Math.random() * -10) + yscroll
					};
					world.push(p); 
					i++;
				}
			}
			function addRed(numRed)
			{
				var i=0;
				while(i < numRed){				
					var dx = Math.random() * 640;
					var size = (Math.random() * 20)+20;
					
					var p = {
						x : dx,
						y : 640+(size/2),
						s : size,
						life : 120,
						t : 1,
						type : 'hole',
						attraction : 1,
						kill : false,
						xspeed : 0,
						yspeed : (Math.random() * -5) + yscroll
					};
					world.push(p); 
					i++;
				}
			}
			function addBlob(numblobs)
			{
				var i = 0;
				while (i < numblobs)
				{
				
					var dx = 0;
					var ms = 0;

					var p = {
						x : Math.random() * 640,
						y : Math.random() * 640,
						xspeed: Math.random(),
						yspeed: Math.random(),
						slowness: (Math.random() * 500) + 250,
						s : (Math.random() * 10) + 5,
						independence: 1000 + (Math.random() * 2000),
						attraction: 1,
						//attraction: 1,
						life : 60, 
						t : 0,
						type : 'blob',
						kill : false,
						bounce : Math.random()
					};
					world.push(p); 
					numBlobs++;
					i++;
				}
			}			
			function render()
			{
				
				var i = 0;
				ctx.fillStyle = 'rgba(255,255,255,0.5)';
				ctx.fillRect(0,0,640, 640);
				ctx.fillStyle = '#000';
				var lt = 0;
				while (i < world.length)
				{
					if (world[i].t != lt)
					{
						if (world[i].t == 0)
						{
							ctx.fillStyle = '#000';
						}
						else if (world[i].t == 1)
						{
							red = Math.floor(255 - (Math.random() * 50));
							ctx.fillStyle = 'rgba(' + red + ',0,0,1)';
						}
						else if (world[i].t == 2)
						{
							ctx.fillStyle = '#0000FF';
						}
						lt = world[i].t;
					}
					ctx.beginPath();  
					size = world[i].s + ((Math.random() * 4) - 2);
					ctx.arc(world[i].x,world[i].y,size,0,Math.PI*2,true); 	
					ctx.fill();
					ctx.closePath();
					++i;
				}
				/*ctx.beginPath();
				// Start from the top-left point.
				ctx.moveTo(0, lineY); // give the (x,y) coordinates
				ctx.lineTo(640, lineY);
			
				ctx.stroke();
				ctx.closePath();*/
			}
			
			function move()
			{
				//lineY += yscroll;
				var i = 1;
				//alert (var_dump(world));
				while (i < world.length)
				{
				
					var p = world[i];
				
					if (p.type == 'blob')
					{	
						score += currentStage;
						var lc = p.life;
						var j=1;
						while (j < world.length){
						
							var q = world[j];
							if(j!=i)
							{
								
								if (q.type == 'hole'){
									p.xspeed += ((q.x - p.x) * q.attraction / p.independence) * (currentStage / 10);
									p.yspeed += ((q.y - p.y) * q.attraction / p.independence) * (currentStage / 10);
								}	
								if (q.type == 'blob'){
									p.xspeed += (q.x - p.x) * q.attraction / p.independence;
									p.yspeed += (q.y - p.y) * q.attraction / p.independence;
								}
								if (q.type != 'blob')
								{
									var xdist = p.x-q.x;
									var ydist = p.y-q.y;
									var dist = Math.sqrt((xdist * xdist) + (ydist * ydist));
									if (dist < q.s)
									{
										if (q.type=='hole')
										{
											p.kill = true;
											/*oldsize = q.s;
											q.s -= (p.s);
											if (q.s <= 0)
											{
												q.kill = true;
												p.s += q.s;
											}else{
												p.kill = true;
											}*/
										}else if (q.type=='bonus' && q.used == false)
										{
											addBlob(5);
											q.kill = true;
											q.used = true;
										}
										
									}
								}
							}
							j++;

						}
							
						if (mouseIsDown)
						{
						
							p.xspeed += (canX - p.x) / p.slowness;
							p.yspeed += (canY - p.y) / p.slowness;
						}

						p.xspeed += xacc;
						p.yspeed += yacc;

						p.xspeed *= resistance;
						p.yspeed *= resistance;



						p.x += p.xspeed;

						var oldY = p.y;
						p.y += p.yspeed;

						if ((oldY >= lineY && p.y <= lineY)||(oldY <= lineY && p.y >= lineY))
						{
						//	p.yspeed = -p.yspeed;
						//	p.y = lineY;
						}

						//p.y += yscroll;
		
						if (p.x < 0){
						  p.xspeed = -p.xspeed * p.bounce;
						  p.x=0;
						}else if(p.x > 640){
						
						  p.xspeed = -p.xspeed * p.bounce;
						  p.x=640;
						}
						if (p.y < 0){
						  p.yspeed = -p.yspeed * p.bounce;
						  p.y=0;
						}else if(p.y > 640){
						
						  p.yspeed = -p.yspeed * p.bounce;
						  p.y=640;
						}
						if (p.y < 0 || p.y > 640){
						  p.yspeed = -p.yspeed;
						}
						
					}else
					{
						p.y += p.yspeed;
						p.x += p.xspeed;
						if (p.y < -100)
						{
							p.kill = true;
						}
					}
					
					if (p.kill == true)
					{
						if (p.type=='blob')
						{
							numBlobs--;
						}
						world.splice(i, 1);
						i--;
					}
					/*
					{
						world.splice(i, 1);
						i--;
					}*/
					i++;
				}
			//	dotSize += (Math.random() - 0.5) * 0.1;
			}
			function killAll(killType){

				i = 1;
				while (i < world.length)
				{
					var p = world[i];
					if (p.type==killType)
					{
						p.kill = true;
					}
					i++;
				}

			}

			
			function run()
			{
				if (gameOver==false)
				{
					animate();
					move();
					render();
					showPos();
					setTimeout(run, 30);
				}
			}
			alert("stage 1");
			init();
			addBlob(5);
			run();
			
			
			function var_dump(obj) {
				 if(typeof obj == "object") {
						return "Type: "+typeof(obj)+((obj.constructor) ? "\nConstructor: "+obj.constructor : "")+"\nValue: " + obj;
				 } else {
						return "Type: "+typeof(obj)+"\nValue: "+obj;
				 }
			}//end function var_dump

			window.ondeviceorientation = function(event) {
								
				/*if (event.alpha < 180)
				{
					xacc = -event.alpha;
				}else{
					xacc = 360 -event.alpha;
				}

				xacc /= 75;*/

				xacc = event.gamma / 30;
				yacc = event.beta / 30;

				//yscroll = -event.beta / 10;

				// event.alpha

				// event.beta
				// event.gamma
			}