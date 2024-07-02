function saveToLocalStorage() {
	localStorage.setItem('inputHTML', document.getElementById('inputHTML').value);
	localStorage.setItem('finalText', document.getElementById('finalText').value);

	const originalChunks = Array.from(document.querySelectorAll('#column2 textarea')).map(textarea => textarea.value);
	localStorage.setItem('originalChunks', JSON.stringify(originalChunks));

	const translatedChunks = Array.from(document.querySelectorAll('#column3 textarea')).map(textarea => textarea.value);
	localStorage.setItem('translatedChunks', JSON.stringify(translatedChunks));
}

function loadFromLocalStorage() {
	const inputHTML = localStorage.getItem('inputHTML');
	const finalText = localStorage.getItem('finalText');
	const originalChunks = JSON.parse(localStorage.getItem('originalChunks')) || [];
	const translatedChunks = JSON.parse(localStorage.getItem('translatedChunks')) || [];
	
	if (inputHTML) document.getElementById('inputHTML').value = inputHTML;
	if (finalText) document.getElementById('finalText').value = finalText;

	const column2 = document.getElementById('column2');
	column2.innerHTML = '';
	originalChunks.forEach(text => {
			const container = document.createElement('div');
			container.classList.add('textarea-container');

			const textarea = document.createElement('textarea');
			textarea.value = text;
			container.appendChild(textarea);

			const copyButton = document.createElement('button');
			copyButton.textContent = 'Copiar';
			copyButton.classList.add('copy-button');
			copyButton.onclick = () => {
					textarea.select();
					document.execCommand('copy');
					copyButton.classList.add('copied');
					container.classList.add('copied');
			};
			container.appendChild(copyButton);

			column2.appendChild(container);
	});

	const column3 = document.getElementById('column3');
	column3.innerHTML = '';
	translatedChunks.forEach(text => {
			const textarea = document.createElement('textarea');
			textarea.value = text;
			textarea.addEventListener('input', updateFinalText);
			column3.appendChild(textarea);
	});
}

window.onload = loadFromLocalStorage;

function processHTML() {
	const inputHTML = document.getElementById('inputHTML').value;
	const maxCharacters = 5000;
	let currentChunk = '';
	let chunks = [];

	const parser = new DOMParser();
	const doc = parser.parseFromString(inputHTML, 'text/html');
	const allNodes = doc.body.childNodes;

	allNodes.forEach(node => {
			const nodeHTML = node.outerHTML || node.textContent;
			if ((currentChunk.length + nodeHTML.length) > maxCharacters) {
					if (currentChunk.trim() !== '') {
							chunks.push(currentChunk);
							currentChunk = '';
					}
			}
			currentChunk += nodeHTML;
	});

	if (currentChunk.trim() !== '') {
			chunks.push(currentChunk);
	}

	const outputColumn = document.getElementById('column2');
	const translatedColumn = document.getElementById('column3');
	outputColumn.innerHTML = '';
	translatedColumn.innerHTML = '';

	chunks.forEach(chunk => {
			const container = document.createElement('div');
			container.classList.add('textarea-container');

			const textarea = document.createElement('textarea');
			textarea.value = chunk;
			container.appendChild(textarea);

			const copyButton = document.createElement('button');
			copyButton.textContent = 'Copiar';
			copyButton.classList.add('copy-button');
			copyButton.onclick = () => {
					textarea.select();
					document.execCommand('copy');
					copyButton.classList.add('copied');
					container.classList.add('copied');
			};
			container.appendChild(copyButton);

			outputColumn.appendChild(container);

			const translatedTextarea = document.createElement('textarea');
			translatedTextarea.addEventListener('input', updateFinalText);
			translatedColumn.appendChild(translatedTextarea);
	});

	saveToLocalStorage();
}

function updateFinalText() {
	const translatedTexts = Array.from(document.querySelectorAll('#column3 textarea')).map(textarea => textarea.value);
	document.getElementById('finalText').value = translatedTexts.join('\n');
	saveToLocalStorage();
}

function copyFinalText() {
	const finalText = document.getElementById('finalText');
	finalText.select();
	document.execCommand('copy');
}

function toggleColumn(columnId) {
	const column = document.getElementById(columnId);
	const button = document.getElementById('toggle' + columnId.charAt(0).toUpperCase() + columnId.slice(1));
	const isHidden = column.classList.toggle('hidden');
	button.style.backgroundColor = isHidden ? '#6c757d' : '#007BFF';
	adjustColumnWidths();
}

function adjustColumnWidths() {
	const visibleColumns = document.querySelectorAll('.column:not(.hidden)');
	const newWidth = 100 / visibleColumns.length;
	visibleColumns.forEach(column => {
			column.style.width = newWidth + '%';
	});
}

document.getElementById('inputHTML').addEventListener('input', saveToLocalStorage);
document.getElementById('finalText').addEventListener('input', saveToLocalStorage);
document.getElementById('column3').addEventListener('input', updateFinalText);
