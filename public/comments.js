// Based off of HW 5 'public' script.js code

class Comment{
  constructor(mongodbElement) {
    this.commentator = mongodbElement.author;
	this.text = mongodbElement.text;
	this.id = mongodbElement._id;
	this.DOMelement = this._createCommentDOM();
  }
  
  _createCommentDOM(){
    const comment = document.createElement('div');
	comment.className = 'comment';
	
	const commentatorField = document.createElement('b');
	// commentatorField.textContent = author;
	commentatorField.textContent =  this.commentator + ': ';
	commentatorField.className = 'usr_name';
	
	const textP = document.createElement('div');
	textP.textContent =  this.text;
	
	comment.appendChild(commentatorField);
	comment.appendChild(textP);
	
	const deleteButton = document.createElement('img');
	deleteButton.setAttribute('src', 'images/trashCan.png');
	deleteButton.addEventListener('click', (event)=>{document.dispatchEvent(new CustomEvent('deleteComment', { 'detail': {id: this.id, domHandle: this.DOMelement} }));}); // will also need to include a reference to the object 
	
	comment.appendChild(deleteButton);
    return comment;
  }
}

class FlashcardScreen {
	constructor(commentator, text) {
		this.form = document.querySelector('form');
		this.onSubmit = this.onSubmit.bind(this);
		this.form.addEventListener('submit', this.onSubmit);

		this.commentsContainer = document.querySelector('#comments');
		this.deleteComment = this.deleteComment.bind(this);
		document.addEventListener('deleteComment', this.deleteComment);
		this._populateComments = this._populateComments.bind(this);
		this._populateComments().then(function(response){});
	}
	
	async deleteComment(event){
		const path = '/_id/' + event.detail.id;
		const query = {method: 'DELETE'};
		let response = await fetch(path, query);
		console.log(response);
		if(response.ok){
			console.log('managedToDelete');
			// event.detail.domHandle.innerHTML = '';
			event.detail.domHandle.classList.add('deleted');
			document.addEventListener("animationend", (event)=>{console.log('hellow'); event.currentTarget.innerHTML = '';}, false);
		}
		
	}
	
	async _populateComments(){
		this.commentsContainer.innerHTML = '';
		let response = await fetch('/getAllComments');
		let comments = await response.json();
		comments.reverse();
		for(let c of comments){
			let v = new Comment(c);
			this.commentsContainer.appendChild(v.DOMelement);
		}	
	}
	
	async onSubmit(event) {
		event.preventDefault();
		const commentatorField = document.querySelector('#commentator');
		const commentator = commentatorField.value;
		commentatorField.value = '';
		
		const commentField = document.querySelector('#comment');
		const comment = commentField.value;
		commentField.value = '';
		
		let message = {
		  method: 'POST'
		};
		message.body = 
			JSON.stringify({
			author:commentator,
			text: comment
			});
		message.headers = {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		};
		
		fetch('/api', message).then(this._populateComments).then(()=>{});
	}
}

screen = new FlashcardScreen();