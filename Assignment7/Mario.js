
class Sprite
{
	constructor(x, y, image_url, update_method, id, width, height, sprites, index)
	{
		this.x = x;
		this.y = y;
		this.image = new Image();
		this.image.src = image_url;
		this.update = update_method;
		this.id=id;
		this.width=width;
		this.height=height;
		this.sprites=sprites;
		this.index=index;
		this.moveAmount=0;
		this.onCurrentTube=false;
		this.hitCurrentTube=false;
		this.hitRightSide=false;
		this.hitLeftSide=false;
		this.vert_vel=0;
		this.frameCounter=0;
		this.goombaHit=false;

	}



	sit_still()
	{
	}

    goombaUpdate()
    {
		if (this.moveAmount==0)
		{
			this.moveAmount=3;
		}
		for(let x = 0; x < this.sprites.length; x++)
		{
			if (this.sprites[x].id=="tube")
			{
				if (this.x+this.width>this.sprites[x].x && (this.x+this.width+2)<(this.sprites[x].x+this.sprites[x].width+60))
				{

					this.moveAmount=-3;
				}
				else if (this.sprites[x].x+2<this.x && this.sprites[x].x+this.sprites[x].width+2>this.x)
				{
					this.moveAmount=+3;
				}
			}
		}

		if ((this.goombaHit && this.frameCounter==0) || this.frameCounter>0)
		{
			console.log("adding to frame counter");
			this.frameCounter++;
		}

    }

	tubeUpdate()
	{

		var mario=this.sprites[0];



		if (mario.x-mario.scrollPos+mario.width>this.x && (mario.x+mario.width+2-mario.scrollPos)<(this.x+this.width+60))
		{
			if (mario.y>this.y)
			{
				mario.hittingRightSide=true;
				this.hitCurrentTube=true;
				this.hitRightSide=true;
			}
			else
			{
				mario.hittingRightSide=false;
				if(this.y-mario.y<=40 && mario.x+mario.width-mario.scrollPos>this.x+5 && mario.frameCounter==0)
				{
					mario.onTube=true;
					mario.onGround=true;
					this.onCurrentTube=true;
				}
			}
		}
		else if (this.x+2<=mario.x-mario.scrollPos && this.x+this.width+2>mario.x-mario.scrollPos) //this two also helps us with clipping
		{
			if (mario.y>this.y)
			{
				mario.hittingLeftSide=true;
				this.hitCurrentTube=true;
				this.hitLeftSide=true;
			}

		}



		if (this.hitRightSide && !(mario.x-mario.scrollPos+mario.width>this.x && (mario.x+mario.width+2-mario.scrollPos)<(this.x+this.width+60)))
		{
			mario.hittingRightSide=false;
			this.hitCurrentTube=false;
			this.hitRightSide=false;
		}
		if (this.hitLeftSide && ((mario.y<this.y) || (mario.x-mario.scrollPos>this.x+this.width)))
		{
			mario.hittingLeftSide=false;
			this.hitCurrentTube=false;
			this.hitLeftSide=false;
		}




		if (mario.onTube && (mario.x-mario.scrollPos+35<this.x || mario.x-mario.scrollPos>this.x+this.width+3) && this.onCurrentTube)
		{
			this.onCurrentTube=false;
			mario.onTube=false;
		}

	}

	fireballUpdate()
	{
		if (this.frameCounter>5)
		{
			this.frameCounter=0;
		}

		if (this.y>315)
		{
			this.y=315;
		}

		if (this.y<290 && this.frameCounter==0)
		{
			this.vert_vel+=.4;
			this.y+=this.vert_vel;
		}
		else if (this.y>280 || this.frameCounter>0)
		{
			this.frameCounter++;
			this.vert_vel-=.3;
			this.y+=this.vert_vel;
		}
		this.x+=4;

		for (let x = 0; x < this.sprites.length; x++)
		{
			if (this.sprites[x].id=="goomba")
			{
				var goomba=this.sprites[x]
				if (this.x+this.width>goomba.x && this.x+this.width<goomba.x+goomba.width && !goomba.goombaHit)
				{
					if (this.y>goomba.y)
					{
						goomba.image.src="goomba_fire.png";
						goomba.goombaHit=true;
						this.goombaHit=true;
					}

				}
			}
		}


	}



}

class Mario extends Sprite
{



    constructor(x, y, image1,image2,image3,image4,image5, update_method, marioIndex, marioArray, id, width, height)
    {
		super(x,y,image1,update_method,id,width, height);

		this.marioIndex=marioIndex;
        this.marioArray=marioArray;


        this.marioArray[0]=new Image();
        this.marioArray[0].src=image1;

        this.marioArray[1]=new Image();
        this.marioArray[1].src=image2;

        this.marioArray[2]=new Image();
        this.marioArray[2].src=image3;

        this.marioArray[3]=new Image();
        this.marioArray[3].src=image4;

        this.marioArray[4]=new Image();
        this.marioArray[4].src=image5;

		this.vert_vel=0;
		this.frameCounter=0;
		this.onTube=false;
		this.onGround=false;
		this.scrollPos=0;
		this.hittingRightSide=false;
		this.hittingLeftSide=false;

    }

    marioWalk()
    {
		if (this.marioIndex>3)
        {
            this.marioIndex=0;
        }
        else
        {
            this.marioIndex++;
        }

		this.image=this.marioArray[this.marioIndex];
    }

	marioJump()
	{
		if (this.frameCounter>0 && this.frameCounter<9)
		{
			this.vert_vel-=2.5;
			this.y+=this.vert_vel;
			this.frameCounter++;
			this.onTube=false;
			this.onGround=false;
		}
		else if(this.y >= 255)
		{
			this.vert_vel = 0.0;
			this.y = 255; // snap back to the ground
			this.frameCounter=0;
			this.onTube=false;
			this.onGround=true;
		}
		else if (this.onTube)
		{
			this.vert_vel=0;
			this.onGround=true;
		}
		else
		{
			this.vert_vel += .9;
			this.y += this.vert_vel;
		}
	}

}






class Model
{
	constructor()
	{
		this.sprites = [];
        this.sprites.push(new Mario(75,255,"mario1.png","mario2.png","mario3.png","mario4.png","mario5.png",Mario.prototype.marioJump, 0,[],"mario",60,95))
        this.sprites.push(new Sprite(200,100, "tube.png",  Sprite.prototype.tubeUpdate,"tube",55,400,this.sprites))
        this.sprites.push(new Sprite(600,200, "tube.png",  Sprite.prototype.tubeUpdate,"tube",55,400,this.sprites))
        this.sprites.push(new Sprite(300,240, "goomba.png", Sprite.prototype.goombaUpdate,"goomba",100,200,this.sprites))
	}

	update()
	{
		for(let i = 0; i < this.sprites.length; i++)
		{
			this.sprites[i].update();
			if (this.sprites[i].id=="goomba" && this.sprites[i].frameCounter==50)
			{
				this.sprites.splice(i,1);
				i--;
			}
			else if (this.sprites[i].id=="fireball" && this.sprites[i].goombaHit)
			{
				this.sprites.splice(i,1);
				i--;
			}
		}


	}


}




class View
{
	constructor(model)
	{
		this.model = model;
		this.canvas = document.getElementById("myCanvas");
		this.scrollPos=0;
	}

	update()
	{
		let ctx = this.canvas.getContext("2d");
        ctx.clearRect(0, 0, 1000, 500);
		ctx.fillStyle="#99ccff";
		ctx.fillRect(0,0,1000,500);
        ctx.fillStyle = "green";


		for(let i = 0; i < this.model.sprites.length; i++)
		{
			let sprite = this.model.sprites[i];
			if (sprite.id=="mario")
			{
				ctx.drawImage(sprite.image, sprite.x, sprite.y);

			}
			else if (sprite.id=="goomba")
			{
				ctx.drawImage(sprite.image, sprite.x+this.scrollPos, sprite.y);
				sprite.x+=sprite.moveAmount;
			}
			else
			{
				ctx.drawImage(sprite.image, sprite.x+this.scrollPos, sprite.y);
			}

		}

        ctx.fillRect(0, 350, 1000, 150);

	}

}







class Controller
{
	constructor(model, view)
	{
		this.model = model;
		this.view = view;
		this.key_right = false;
		this.key_left = false;
		this.key_space=false;
		this.key_control=false;
		let self = this;
		document.addEventListener('keydown', function(event) { self.keyDown(event); }, false);
		document.addEventListener('keyup', function(event) { self.keyUp(event); }, false);
	}



	keyDown(event)
	{
		if(event.keyCode == 39)
		{
			this.key_right = true;
			this.model.sprites[0].marioWalk();
			if (!this.model.sprites[0].hittingRightSide)
			{

				this.view.scrollPos-=5;
				this.model.sprites[0].scrollPos-=5;
			}
		}
		else if(event.keyCode == 37)
		{
			this.key_left = true;
			this.model.sprites[0].marioWalk();
			if (!this.model.sprites[0].hittingLeftSide)
			{
				this.view.scrollPos+=5;
				this.model.sprites[0].scrollPos+=5;
			}
		}
		else if(event.keyCode==32){ this.key_space=true; ;if (this.model.sprites[0].onGround) {this.model.sprites[0].frameCounter++;}}
		else if(event.keyCode==17)
		{
			this.key_enter=false;
			this.model.sprites.push(new Sprite(this.model.sprites[0].x-this.model.sprites[0].scrollPos+40,this.model.sprites[0].y+25,"fireball.png",Sprite.prototype.fireballUpdate,"fireball",50,50,this.model.sprites));
		}
	}

	keyUp(event)
	{
		if(event.keyCode == 39) this.key_right = false;
		else if(event.keyCode == 37) this.key_left = false;
		else if(event.keyCode==32){ this.key_space=false; this.model.sprites[0].frameCounter=0;}
	}

	update()
	{

	}
}





class Game
{
	constructor()
	{
		this.model = new Model();
		this.view = new View(this.model);
		this.controller = new Controller(this.model, this.view);
	}

	onTimer()
	{
		this.controller.update();
		this.model.update();
		this.view.update();
	}
}


let game = new Game();
let timer = setInterval(function() { game.onTimer(); }, 40);
