
/**
 * DisplayObject 类
 * 可视对象（抽象）
 * 所有的可视对象均继承于此类
 * 定义了所有可视对象最基本得五项属性
 */
function DisplayObject() {
	this.x=0;//横坐标
	this.y=0;//纵坐标
	this.width=0;//宽度
	this.height=0;//高度
	this.stage=null;//对应的舞台对象（舞台对象对应的舞台对象为null）
};

/**
 * InteractiveObject 类
 * 交互对象（抽象）
 * 所有用来与用户交互的对象均继承于此类
 * 定义了相关的事件操作方法、属性
 */
function InteractiveObject() {
	DisplayObject.call(this);//继承
	this.eventListner=new Object();//事件侦听器列表
};

InteractiveObject.prototype.addEventListner= function(type,func) {//添加事件侦听器（同一类型的事件可有多个侦听器）
	if(this.eventListner[type]==null || this.eventListner[type]==undefined) {//如果为空或未定义
		this.eventListner[type]=new Array();//定义为数组对象
	}
	this.eventListner[type].push(func);//添加一个事件侦听器到该类型
};
InteractiveObject.prototype.removeEventListner= function(type,func) {//移除事件侦听器（同一类型事件的某一侦听器）
	if(this.eventListner[type]==null || this.eventListner[type]==undefined) {//如果本来就没有
		return;//返回
	}
	for (var i=0; i < this.eventListner[type].length; i++) {//有，就循环
		if(this.eventListner[type][i]==func) {//判断一下，哪一个是指定的侦听器函数
			delete this.eventListner[type][i];//删除它
			this.eventListner[type].splice(i,1);//在数组中移除他
		}
	};
	if(this.eventListner[type].length==0) {//如果该类型已经没有侦听器
		delete this.eventListner[type];//清除该类型的侦听器对象
	}
};
InteractiveObject.prototype.removeAllEventListner= function(type) {//移除某类型事件的所有侦听器
	if(this.eventListner[type]==null || this.eventListner[type]==undefined) {//本来为空，不理他
		return;
	}
	this.eventListner[type].splice();//移除
	delete this.eventListner[type];//删除
};
InteractiveObject.prototype.hasEventListner= function(type) {//是否有事件侦听器
	return (this.eventListner[type]!=null && this.eventListner[type]!=undefined && this.eventListner[type].length>0);
};

/**
 * DisplayObjectContainer 类
 * 可视对象容器（具体）
 * 所有可以拥有子可视对象的对象均继承于此类
 * 定义了操作子可视对象的属性、方法
 */
function DisplayObjectContainer(ctx) {
	InteractiveObject.call(this);//继承
	this.ctx=ctx;//具体类将涉及到canvas的上下文context，需要提供该参数并记录到属性中
	this.childs=new Array();//子对象数组
	this.maxWidth=0;//根据子对象宽高记录最大宽高
	this.maxHeight=0;
	this.moveChild=new Array();//当前鼠标悬停子成员数组（由于对象重叠关系，悬停子成员并非一个，所以用数组）。此属性在处理事件时起作用。
};

DisplayObjectContainer.prototype=new InteractiveObject();//继承交互对象的原型
DisplayObjectContainer.prototype.getContext= function() {//取上下文，完全可以直接操作属性
	return this.ctx;
};
DisplayObjectContainer.prototype.addChild= function(child) {//添加子对象
	if(this.maxWidth<child.x+child.width) {
		this.maxWidth=child.x+child.width;//自动处理最大宽高
	}
	if(this.maxHeight<child.y+child.height) {
		this.maxHegiht=child.y+child.height;
	}
	this.childs.push(child);//加入
	child.stage=this;//子对象的舞台stage属性自动赋值
};
DisplayObjectContainer.prototype.addChildAt= function(child,index) {//按照索引添加子对象
	if(this.maxWidth<child.x+child.width) {
		this.maxWidth=child.x+child.width;//自动处理最大宽高
	}
	if(this.maxHeight<child.y+child.height) {
		this.maxHegiht=child.y+child.height;
	}
	this.childs.splice(index,0,child);//在index索引处插入子对象
	child.stage=this;//子对象的舞台stage属性自动赋值
};
DisplayObjectContainer.prototype.removeChild= function(child) {//移除子对象
	this.childs.splice(this.getChildIndex(child),1);//移除
	if(this.maxWidth==child.x+child.width) {//处理最大宽高
		this.maxWidth=0;
		for (var i=0; i < this.childs.length; i++) {
			if(this.childs[i].x+this.childs[i].width>this.maxWidth) {
				this.maxWidth=this.childs[i].x+this.childs[i].width;
			}
		};
	}
	if(this.maxHeight==child.y+child.height) {
		this.maxHeight=0;
		for (var i=0; i < this.childs.length; i++) {
			if(this.childs[i].y+this.childs[i].height>this.maxHeight) {
				this.maxHeight=this.childs[i].y+this.childs[i].height;
			}
		};
	}
	child.stage=null;//已移除，故子对象舞台stage为空
};
DisplayObjectContainer.prototype.removeChildAt= function(index) {//根据索引移除子对象
	this.childs[index].stage=null;//已移除，故子对象舞台stage为空
	this.childs.splice(index,1);//移除
	if(this.maxWidth==child.x+child.width) {//处理最大宽高
		this.maxWidth=0;
		for (var i=0; i < this.childs.length; i++) {
			if(this.childs[i].x+this.childs[i].width>this.maxWidth) {
				this.maxWidth=this.childs[i].x+this.childs[i].width;
			}
		};
	}
	if(this.maxHeight==child.y+child.height) {
		this.maxHeight=0;
		for (var i=0; i < this.childs.length; i++) {
			if(this.childs[i].y+this.childs[i].height>this.maxHeight) {
				this.maxHeight=this.childs[i].y+this.childs[i].height;
			}
		};
	}
};
DisplayObjectContainer.prototype.getChildAt= function(index) {//根据索引取出子对象
	return this.childs[index];
};
DisplayObjectContainer.prototype.contains= function(child) {//判断某对象是否为该stage舞台的子对象
	return (this.getChildIndex(child)!=-1);
};
DisplayObjectContainer.prototype.getChildIndex= function(child) {//根据子对象取出索引
	for (var i=0; i < this.childs.length; i++) {
		if(this.childs[i]==child) {
			return i;
		}
	};
	return -1;
};
DisplayObjectContainer.prototype.setChildIndex= function(child,index) {//重设子对象索引（未测试）
	this.removeChild(child);
	this.addChildAt(child,index);
};
DisplayObjectContainer.prototype.swapChildren= function(child1,child2) {//交换子对象索引（未测试）
	this.setChildIndex(child1,this.getChildIndex(child2));
	this.setChildIndex(child2,this.getChildIndex(child1));
};
DisplayObjectContainer.prototype.dispatchMouseEvent= function(type,x,y) {//调度鼠标事件
	var mouseX=x;
	var mouseY=y;
	var newMoveChild=new Array();//当前鼠标悬浮子对象数组
	for (var i=0; i < this.childs.length; i++) {
		if(this.childs[i].dispatchMouseEvent!=null && this.childs[i].dispatchMouseEvent!=undefined) {
			this.childs[i].dispatchMouseEvent(type,mouseX-this.childs[i].x,mouseY-this.childs[i].y);//如果子对象仍有调度函数，也需调用
		}
		//↓ 与子对象相交
		if(mouseX>this.childs[i].x && mouseX<this.childs[i].x+this.childs[i].width && mouseY>this.childs[i].y && mouseY<this.childs[i].y+this.childs[i].height) {
			if(type=="onmousemove" ) {
				newMoveChild.push(this.childs[i]);//如果是鼠标移动事件，记录悬浮对象
			}
			if(this.childs[i].eventListner[type]==null || this.childs[i].eventListner[type]==undefined) {
				continue;//如果子对象没有相应事件侦听器，跳过
			}
			for (var j=0; j < this.childs[i].eventListner[type].length; j++) {
				this.childs[i].eventListner[type][j](mouseX-this.childs[i].x,mouseY-this.childs[i].y);//否则循环执行一遍侦听器
			}
		}
	};
	if(type!="onmousemove") {
		return;//如果不是鼠标移动事件，就无事了
	}
	for (var j=0; j < this.moveChild.length; j++) {//循环寻找 原先悬浮子对象中有，新悬浮子对象中没有的
		var has=false;
		for (var i=0; i < newMoveChild.length; i++) {
			if(this.moveChild[j]==newMoveChild[i]) {
				has=true;
			}
		};
		if(has==false) {//没有了
			if(this.moveChild[j].eventListner["onmouseout"]) {//即鼠标移出了它，为他处理onmouseout事件
				for (var i=0; i < this.moveChild[j].eventListner["onmouseout"].length; i++) {
					this.moveChild[j].eventListner["onmouseout"][i](mouseX-this.moveChild[j].x,mouseY-this.moveChild[j].y);
				}
			}
			delete this.moveChild[j];
			this.moveChild[j]=undefined;
		}
	};
	for (var i=0; i < newMoveChild.length; i++) {//循环寻找 新悬浮子对象中有，原悬浮子对象中没有的
		var has=false;
		for (var j=0; j < this.moveChild.length; j++) {
			if(this.moveChild[j]==newMoveChild[i]) {
				has=true;
			}
		};
		if(has==false) {//没有的
			this.moveChild.push(newMoveChild[i]);//即新被鼠标碰撞的，处理onmouseover事件
			if(newMoveChild[i].eventListner["onmouseover"]) {
				for (var j=0; j < newMoveChild[i].eventListner["onmouseover"].length; j++) {
					newMoveChild[i].eventListner["onmouseover"][j](mouseX-newMoveChild[i].x,mouseY-newMoveChild[i].y);
				}
			}
		}
	};
	this.cleanUpMoveChild();//清理悬浮对象数组
};
DisplayObjectContainer.prototype.cleanUpMoveChild= function() {
	var tempArr=new Array();//临时数组
	for(var i=0;i<this.moveChild.length;i++) {
		if(this.moveChild[i]!=null && this.moveChild[i]!=undefined) {//如果悬浮对象数组中当前元素非空非未定义
			tempArr.push(this.moveChild[i]);//加入到临时数组
		}
	}
	this.moveChild=tempArr;//临时数组赋值给悬浮对象数组
}


/**
 * Stage 类
 * 舞台（具体）
 * 任何一个Canvas只能对应且必须对应一个舞台对象。此类无子类。
 * 此类定义了对Canvas的封装的功能
 */
function Stage(canvas) {//传递一个canvas对象
	this.canvas=canvas;//记录canvas对象
	this.hasStart=false;//是否已经启动
	DisplayObjectContainer.call(this,this.canvas.getContext("2d"));//继承于可视对象容器类
	this.Interval=null;//时钟
	this.stage=null;//舞台的stage变量为null（前面说过）
	this.width=this.canvas.width;//宽高即canvas宽高
	this.height=this.canvas.height;
	//下面开始挂接事件
	//鼠标事件
	this.canvas.onmousemove= function(param) {
		return function(event) {//首先进行stage本身的事件处理
			if(param.eventListner["onmousemove"]!=null && param.eventListner["onmousemove"]!=undefined) {
				for (var i=0; i < param.eventListner["onmousemove"].length; i++) {
					param.eventListner["onmousemove"][i](event.clientX-param.canvas.offsetLeft,event.clientY-param.canvas.offsetTop);
				}
			}
			//然后调度鼠标事件到各个子对象
			param.dispatchMouseEvent("onmousemove",event.clientX-param.canvas.offsetLeft,event.clientY-param.canvas.offsetTop);
		};
	}(this);
	this.canvas.onclick= function(param) {
		return function(event) {//同理
			if(param.eventListner["onclick"]!=null && param.eventListner["onclick"]!=undefined) {
				for (var i=0; i < param.eventListner["onclick"].length; i++) {
					param.eventListner["onclick"][i](event.clientX-param.canvas.offsetLeft,event.clientY-param.canvas.offsetTop);
				}
			}
			param.dispatchMouseEvent("onclick",event.clientX-param.canvas.offsetLeft,event.clientY-param.canvas.offsetTop);
		};
	}(this);
	this.canvas.onmousedown= function(param) {
		return function(event) {
			if(param.eventListner["onmousedown"]!=null && param.eventListner["onmousedown"]!=undefined) {
				for (var i=0; i < param.eventListner["onmousedown"].length; i++) {
					param.eventListner["onmousedown"][i](event.clientX-param.canvas.offsetLeft,event.clientY-param.canvas.offsetTop);
				}
			}
			param.dispatchMouseEvent("onmousedown",event.clientX-param.canvas.offsetLeft,event.clientY-param.canvas.offsetTop);
		};
	}(this);
	this.canvas.onmouseup= function(param) {
		return function(event) {
			event.clientX-=param.canvas.offsetLeft;
			event.clientY-=param.canvas.offsetTop;
			if(param.eventListner["onmouseup"]!=null && param.eventListner["onmouseup"]!=undefined) {
				for (var i=0; i < param.eventListner["onmouseup"].length; i++) {
					param.eventListner["onmouseup"][i](event.clientX-param.canvas.offsetLeft,event.clientY-param.canvas.offsetTop);
				}
			}
			param.dispatchMouseEvent("onmouseup",event.clientX-param.canvas.offsetLeft,event.clientY-param.canvas.offsetTop);
		};
	}(this);
	this.canvas.onmouseover= function(param) {
		return function(event) {
			if(param.eventListner["onmouseover"]!=null && param.eventListner["onmouseover"]!=undefined) {
				for (var i=0; i < param.eventListner["onmouseover"].length; i++) {
					param.eventListner["onmouseover"][i](event.clientX-param.canvas.offsetLeft,event.clientY-param.canvas.offsetTop);
				}
			}
			param.dispatchMouseEvent("onmouseover",event.clientX-param.canvas.offsetLeft,event.clientY-param.canvas.offsetTop);
		};
	}(this);
	this.canvas.onmouseout= function(param) {
		return function(event) {
			if(param.eventListner["onmouseout"]!=null && param.eventListner["onmouseout"]!=undefined) {
				for (var i=0; i < param.eventListner["onmouseout"].length; i++) {
					param.eventListner["onmouseout"][i](event.clientX-param.canvas.offsetLeft,event.clientY-param.canvas.offsetTop);
				}
			}
			param.dispatchMouseEvent("onmouseout",event.clientX-param.canvas.offsetLeft,event.clientY-param.canvas.offsetTop);
		};
	}(this);
	//键盘事件，只有stage的事情
	document.onkeydown= function(param) {
		return function(event) {
			if(param.eventListner["onkeydown"]!=null && param.eventListner["onkeydown"]!=undefined) {
				for (var i=0; i < param.eventListner["onkeydown"].length; i++) {
					param.eventListner["onkeydown"][i](event);
				}
			}
		};
	}(this);
	document.onkeyup= function(param) {
		return function(event) {
			if(param.eventListner["onkeyup"]!=null && param.eventListner["onkeyup"]!=undefined) {
				for (var i=0; i < param.eventListner["onkeyup"].length; i++) {
					param.eventListner["onkeyup"][i](event);
				}
			}
		};
	}(this);
	document.onkeypress= function(param) {
		return function(event) {
			if(param.eventListner["onkeypress"]!=null && param.eventListner["onkeypress"]!=undefined) {
				for (var i=0; i < param.eventListner["onkeypress"].length; i++) {
					param.eventListner["onkeypress"][i](event);
				}
			}
		};
	}(this);
	this.draw= function() {//舞台自身的绘制函数
	};
	this.onEnterFrame= function() {//单独的舞台的刷新帧事件处理
	};
};

Stage.prototype=new DisplayObjectContainer();//继承
Stage.prototype.render= function() {//舞台的渲染函数（所有可视对象都应该有一个render函数）
	this.ctx.clearRect(0,0,this.width,this.height);//清空canvas
	this.draw();//画自己
	for (var i=0; i < this.childs.length; i++) {//循环绘制子对象
		this.ctx.translate(this.childs[i].x,this.childs[i].y);//根据子对象坐标，平移坐标系
		this.childs[i].render();
		this.ctx.translate(-this.childs[i].x,-this.childs[i].y);//再回来
	};
};
Stage.prototype.start= function() {//开始
	this.hasStart=true;
	this.Interval=setInterval((function(param) {
		return function() {
			param.render();
			param.onEnterFrame();
		}
	})(this),10);
};
Stage.prototype.stop= function() {//停止
	this.hasStart=false;
	clearInterval(this.Interval);
}

/**
 * Sprite 类
 * 精灵（具体）
 * 拥有一些对图形的操作方法（如拖放）
 */
function Sprite(ctx) {
	DisplayObjectContainer.call(this,ctx);//继承
	this.isDragging=false;//是否正在拖放
	this.dragX=null;//拖放时需要临时使用的坐标变量
	this.dragY=null;
	this.dragFunc=null;//拖放事件处理函数的记录，以便移除
	this.stopDragFunc=null;//停止拖放事件处理函数，以便移除
	this.draw= function() {//本身的绘制函数
	};
};

Sprite.prototype=new DisplayObjectContainer();//继承
Sprite.prototype.render= function() {//必有的渲染函数
	this.draw();//画自己
	//根据子对象最大宽高决定缩放程度
	this.ctx.scale(this.width<this.maxWidth?this.width/this.maxWidth:1,this.height<this.maxHeight?this.height/this.maxHeight:1);
	for (var i=0; i < this.childs.length; i++) {//循环绘制子对象
		this.ctx.translate(this.childs[i].x,this.childs[i].y);
		this.childs[i].render();
		this.ctx.translate(-this.childs[i].x,-this.childs[i].y);
	};
	this.ctx.scale(this.width<this.maxWidth?this.maxWidth/this.width:1,this.height<this.maxHeight?this.maxHeight/this.height:1);
};
Sprite.prototype.startDrag= function (startX,startY) {//开始拖放
	this.isDragging=true;
	this.dragX=startX+this.x;
	this.dragY=startY+this.y;
	this.dragFunc= function(param) {
		return function(x,y) {
			var offsetX=x-param.dragX;
			var offsetY=y-param.dragY;
			param.x+=offsetX;
			param.y+=offsetY;
			param.dragX=x;
			param.dragY=y;
		};
	}(this);
	this.stopDragFunc= function(param) {
		return function(x,y) {
			param.stopDrag();
		};
	}(this);
	this.stage.addEventListner("onmousemove",this.dragFunc);
	this.stage.addEventListner("onmouseout",this.stopDragFunc);
};
Sprite.prototype.stopDrag= function() {//停止拖放
	this.isDragging=false;
	this.dragY=this.dragX=null;
	this.stage.removeEventListner("onmousemove",this.dragFunc);
	delete this.dragFunc;
	this.stage.removeEventListner("onmouseout",this.stopDragFunc);
	delete this.stopDragFunc;
};
/**
 * Shape 类
 * 图形（具体）
 * 无任何交互功能
 */
function Shape(ctx) {
	DisplayObject.call(this);//继承
	this.ctx=ctx;
	this.draw= function() {//绘制函数
	};
}
Shape.prototype.render=function(){//渲染函数，即绘制自己
	this.draw();
};

/**
 * SimpleButton 类
 * 普通按钮（具体）
 * 根据三态图形形成按钮。
 */
function SimpleButton(ctx) {
	InteractiveObject.call(this);//继承
	this.upState=new Shape(ctx);//三态图形
	this.overState=new Shape(ctx);
	this.downState=new Shape(ctx);
	this.curState="up";//当前状态，可为“up” “over” “down”
	//根据不同事件改变当前状态
	this.addEventListner("onmouseover", function(param) {
		return function(x,y) {
			param.curState="over";
		}
	}(this));
	this.addEventListner("onmousedown", function(param) {
		return function(x,y) {
			param.curState="down";
		}
	}(this));
	this.addEventListner("onmouseup", function(param) {
		return function(x,y) {
			param.curState="up";
		}
	}(this));
	this.addEventListner("onmouseout", function(param) {
		return function(x,y) {
			param.curState="up";
		}
	}(this));
};

SimpleButton.prototype=new InteractiveObject();//继承
SimpleButton.prototype.render= function() {//渲染
	switch(this.curState) {//判断当前状态，进行不同图形绘制
		case "up":
			if(this.upState!=null && this.upState!=undefined) {
				this.upState.width=this.width;
				this.upState.height=this.height;
				this.upState.draw();
			}
			break;
		case "down":
			if(this.downState!=null && this.downState!=undefined) {
				this.downState.width=this.width;
				this.downState.height=this.height;
				this.downState.draw();
			}
			break;
		case "over":
			if(this.overState!=null && this.overState!=undefined) {
				this.overState.width=this.width;
				this.overState.height=this.height;
				this.overState.draw();
			}
			break;
	}
};
