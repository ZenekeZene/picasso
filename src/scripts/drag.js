function setPosition(target, x, y) {
	// translate the element
	target.style.webkitTransform = target.style.transform = `translate(${x}px, ${y}px)`;
	// update the position attributes
	target.setAttribute('data-x', x);
	target.setAttribute('data-y', y);
}

function dragMoveHandler(event) {
	let target = event.target;
	
	let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
	let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

	setPosition(target, x, y);
}

export default {
	setPosition,
	dragMoveHandler,
};