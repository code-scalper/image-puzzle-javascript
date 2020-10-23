const container = document.querySelector('.image-container');
const startButton = document.querySelector('.start-button');
const gameText = document.querySelector('.game-text');
const playTime = document.querySelector('.play-time');
const tileCount = 16;
const dragged = {
	el: null,
	class: null,
	index: null,
	dropIndex: null
};
let isPlaying = false;
let timeInterval;
let time = 0;

function setGame() {
	container.innerHTML = '';
	gameText.style.display = 'none';
	time = 0;
	tiles = createImageTiles();
	tiles.forEach((tile) => container.appendChild(tile));
	setTimeout(() => {
		container.innerHTML = '';
		appendTiles();
	}, 5000);
}

function appendTiles() {
	shuffle(tiles).forEach((tile) => container.appendChild(tile));
	gameStart();
}

function gameStart() {
	isPlaying = true;
	timeInterval = setInterval(() => {
		time++;
		playTime.innerText = time;
	}, 1000);
}

function checkStatus() {
	const currList = container.children;
	const unMatchedList = [];
	for (const [ key, value ] of Object.entries(currList)) {
		key !== value.getAttribute('data-index') ? unMatchedList.push(key) : null;
	}
	if (unMatchedList.length === 0) {
		gameText.style.display = 'block';
		isPlaying = false;
		clearInterval(timeInterval);
	}
}

function createImageTiles() {
	const tempArray = [];
	Array(tileCount).fill().forEach((_, n) => {
		const li = document.createElement('li');
		li.setAttribute('data-index', n);
		li.setAttribute('draggable', 'true');
		li.classList.add(`list${n}`);
		tempArray.push(li);
	});
	return tempArray;
}

function shuffle(array) {
	let index = array.length - 1;
	while (index > 0) {
		let randomIndex = Math.floor(Math.random() * (index + 1));
		[ array[index], array[randomIndex] ] = [ array[randomIndex], array[index] ];
		index--;
	}
	return array;
}

// event listeners
startButton.addEventListener('click', () => {
	setGame();
});

container.addEventListener('dragstart', ({ target }) => {
	if (!isPlaying) return;
	// console.log({ target });
	dragged.el = target;
	dragged.class = target.className;
	dragged.index = [ ...target.parentNode.children ].indexOf(target);
});

container.addEventListener('dragover', (event) => {
	event.preventDefault();
});

container.addEventListener('drop', (event) => {
	if (!isPlaying) return;
	if (event.target.className !== dragged.class) {
		let originPlace;
		let isLast = false;
		if (dragged.el.nextSibling) {
			originPlace = dragged.el.nextSibling;
		} else {
			originPlace = dragged.el.previousSibling;
			isLast = true;
		}
		dragged.dropIndex = [ ...event.target.parentNode.children ].indexOf(event.target);
		dragged.index > dragged.dropIndex ? event.target.before(dragged.el) : event.target.after(dragged.el);
		isLast ? originPlace.after(event.target) : originPlace.before(event.target);
	}
	checkStatus();
});
