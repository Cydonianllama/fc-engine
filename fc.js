// const FC_MODE_DEV = 'FC_MODE_DEV';
// const FC_MODE_PROD = 'FC_MODE_PROD';

// const CLASS_FC_ELEMENT = 'fc-block';
const ID_FC_CANVAS = 'canvas';
// const CLASS_FC_TRIGGER_REARRANGE = 'fc-rearrange';

function hasParentClass(element, classname) {
	if (element.className) {
		if (element.className.split(' ').indexOf(classname) >= 0) return true;
	}
	return element.parentNode && hasParentClass(element.parentNode, classname);
}

const CLASS_FC_BLOCK_OUT = 'fc-block-out';
const CLASS_FC_BLOCK_IN = 'fc-block';
const CLASS_FC_BLOCK_DRAGGING = 'fc-block-draging';
const CLASS_FC_BLOCK_DESACTIVED = 'fc-block-desactived';

var canvas = document.querySelector("."+ID_FC_CANVAS);

var active = false;
var dragging = false;
var relocating = false;

var tempBlocks = [];
var blocks = [];

var drag;
var relocate;
var mouseX;
var mouseY;
var prevBlock;
var padx = 100;
var pady = 100;

//STATE
const stateDragging = () => {
	active = true;
	dragging = true;
}
const statePasive = () => {
	active = false;
	dragging = false;
}
const stateAcive = () => {
	active = true;
}
const stateRelocating = () => {
	active = true;
	dragging = false;
	relocating = true;
}

//RELOCATE UTILS
const setRelocateElement = (element) => {
	relocate = element;
}

// Mouse Events
const udpateMouseLocation = (event) => {
	mouseX = event.clientX;
	mouseY = event.clientY;
}

// BLOCKS
const getLenghtBlocks = () => {
	return blocks.length;
}
const addBlock = (data) => {
	blocks.push(data);
}

// DRAG UTILS
const setDrag = (element) => {
	drag = element;
}
const desactivateBlockoutElementDropped = () => {
	drag.classList.remove(CLASS_FC_BLOCK_OUT);
}
const removeCurrentDrag = () =>{
	drag.remove();
}

const updateLocationRelocateElement = (element) => {
	// need a draggin element in absolute positioning
	const {
		x,
		y,
	} = canvas.getBoundingClientRect();
	var top_ = mouseY + window.scrollY - y ;
	var left_ = mouseX + window.screenX - x;
	element.style.left = left_.toString() + "px";
	element.style.top = top_.toString() + "px";
}
const updateLocationDragElement = () => {
	// need to center the drag element in movement
	// need a draggin element in absolute positioning
	var top_ = mouseY + window.scrollY - pady;
	var left_ = mouseX + window.screenX - padx;
	drag.style.left = left_.toString()+"px";
	drag.style.top = top_.toString()+"px";
}
const clearDrag = () => {
	drag = null;
}

//SOME VALIDATORS
const existDragElement = () => {
	let bool = drag ? true : false;
	return bool;
}
const existRelocateElement = () => {
	let bool = relocate ? true : false;
	return bool;
}

document.addEventListener('mousedown', (event) => {
	const currentSelected = event.target;
	const postProcessBlockout = (element) => {
		element.innerHTML += '<small>in clonation</small>';
	}
	const insertClonedInDom = (element) => {
		document.body.appendChild(element)
	}
	const prepareElementCloned = (element) => {
		element.classList.add(CLASS_FC_BLOCK_DRAGGING);
	}
	const cloneElementDragged = (element) => {
		let clone = element.cloneNode(true);
		return clone;
	}
	const processClonation = (element) => {
		prepareElementCloned(element);
		insertClonedInDom(element);
	}
	const verifyBlockoutClicked = (currentSelected) => {
		return hasParentClass(currentSelected, CLASS_FC_BLOCK_OUT);
	}
	const verifyBlockinClicked = (currentSelected) => {
		return hasParentClass(currentSelected , CLASS_FC_BLOCK_IN);
	}

	if (verifyBlockoutClicked(currentSelected)) {
		stateAcive();
		let blockOut = currentSelected.closest('.'+ CLASS_FC_BLOCK_OUT);
		let elementCloned = cloneElementDragged(blockOut);
		processClonation(elementCloned);
		postProcessBlockout(blockOut);
		setDrag(elementCloned);
	}
	if (verifyBlockinClicked(currentSelected)){
		let blockIn = currentSelected.closest('.' + CLASS_FC_BLOCK_IN);
		stateRelocating();
		setRelocateElement(blockIn);
	}

});

document.addEventListener('mousemove', (event) => {
	const disableCurrentBlock = () => {
		// ui format disabled
	}
	const alertBlockInAttachementZone = () => {
		for(let i = 0 ; i < blocks.length ; i++){
			var tempBlock = document.querySelector(`.fc-block[id="${i}"]`);
		}
	}

	udpateMouseLocation(event);
	if (active && existDragElement()) {
		stateDragging();
		disableCurrentBlock();
		updateLocationDragElement();
		alertBlockInAttachementZone();
	} 
	else if (active && existRelocateElement()) {
		updateLocationRelocateElement(relocate);
	}
})

document.addEventListener('mouseup', (event) => {
	const storeBlock = () => {

	}
	const activeCurrentBlock = () => {
		
	}
	const drawArrow = () => {
		console.log('drawing arrow');
	}
	const adjustBlockLocation = () => {
		var {
			y,
			height,
		} = prevBlock.getBoundingClientRect();
		var top_ = y + height + 50;
		drag.style.top = top_.toString() + "px"; 
	}
	const attachBlockInCanvas = () => {
		blockPrevAppendCanvas();
		canvas.append(drag);
		// use the next method because need to make position relative to the canvas
		relocateBlockInCanvas();
		// temporally i used the mouseX and mouseY variables but i need to refactor in another sprint
		addBlock({
			blockId: drag.id,
			x: mouseX,
			y: mouseY,
		});
	}
	const attachFirstBlockInCanvas = () => {
		blockPrevAppendCanvas();
		canvas.append(drag);
		// use the next method because need to make position relative to the canvas
		relocateBlockInCanvas();
		// temporally i used the mouseX and mouseY variables but i need to refactor in another sprint
		addBlock({
			blockId: drag.id,
			x: mouseX,
			y: mouseY,
		});
		console.log(blocks[0]);
	}
	const processFirstBlockInCanvas = () => {

	}
	const checkBlockoutOverBlockIn = () => {
		for(let i = 0 ; i < blocks.length ; i++){
			var tempBlock = document.querySelector(`.fc-block[id="${i}"]`);
			var {
				x,
				y,
				width,
				height,
			} = tempBlock.getBoundingClientRect()
			if (mouseY > y && mouseX > x && mouseY < y + height && mouseX < x + width){
				console.log(`block with id: ${i} is clossest`);
				// prevBlock is the block clossest to the current dragging block
				prevBlock = tempBlock;
				return true;
			}
		}
		return false;
	}
	const isBlockOverCanvas = () => {
		if(!canvas){
			console.error('need the selector of canvas element')
		}
		const {
			width,
			height,
			x,
			y,
		} = canvas.getBoundingClientRect();
		if (mouseY > y && mouseX > x && mouseY < y + height && mouseX < x + width){
			return true;
		}
		return false;
	}
	const relocateBlockInCanvas = () =>{
		const {
			x,
			y,
		} = canvas.getBoundingClientRect();
		var top_ = mouseY - y;
		var left_ = mouseX - x;
		drag.style.top = top_.toString() + "px";
		drag.style.left = left_.toString() + "px";
	}
	const blockPrevAppendCanvas = () =>{
		drag.classList.remove(CLASS_FC_BLOCK_OUT);
		drag.classList.add(CLASS_FC_BLOCK_IN);
		var newID;
		const assignID = () => {
			drag.id = blocks.length;
			newID = drag.id;
		}
		assignID();
		drag.innerHTML = `
			<h2>new element</h2>
			<button id = "block-rearrange-${newID}" >rearrange</button>
			<small> id : ${newID} </small>
			<input type = "hidden" class = "fc-block-type" name ="fc-block-type" value ="${newID}"/>
			<input type = "hidden" class = "fc-block-id" name = "fc-block-id" value ="${newID}"/>
			<p style = "color: red;">wanna join</p>	
			`;
	}

	if(active && dragging){
		if (isBlockOverCanvas()){
			if (blocks.length === 0) {
				attachFirstBlockInCanvas();
			}else{
				if ( checkBlockoutOverBlockIn() ) {
					attachBlockInCanvas();
					adjustBlockLocation();
					drawArrow();
				}else{
					removeCurrentDrag();
				}
			}
		}else{
			removeCurrentDrag();
		}
		clearDrag();
		statePasive();
	}
	if (relocating){
		statePasive();
		relocate=null;
		console.log('doing relocating');
	}
	
});

/*
	element.getBoundingClientRect();
	element.scrollTop
	element.scrollLeft
	
	event.clientX
	event.clientY

	event.OffsetTop

	window.scrollY
	window.scrollX
*/