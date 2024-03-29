class Book{

	constructor(title, author, isbn){
		this.title = title;
		this.author = author;
		this.isbn = isbn;
	}

}

class UI{

	static displayBooks(){

		const books = Store.getBooks();


		books.forEach((book)=> UI.addBookToList(book));
	}

	static addBookToList(book){

		const list = document.querySelector("#book-list");
		const row = document.createElement("tr");
		row.innerHTML = `
			<td>${book.title}</td>
			<td>${book.author}</td>
			<td>${book.isbn}</td>
			<td><a href="#" class="btn btn-danger btn-sm delete">X</td>
		`;

		list.appendChild(row);
	}

	static deleteBook(el){

		if(el.classList.contains('delete')){
			el.parentElement.parentElement.remove();
		}
		
	}

	static showAlert(message, className){

		const div = document.createElement('div');
		div.className = `alert alert-${className}`;
		div.appendChild(document.createTextNode(message));
		//add the div before the form
		const container = document.querySelector('.container');
		const form = document.querySelector('#book-form');
		container.insertBefore(div, form);

		//remove the alert
		setTimeout(() => document.querySelector('.alert').remove(), 2000);
	}
	

	static clearFields(){

		document.querySelector("#title").value = '';
		document.querySelector("#author").value = '';
		document.querySelector("#isbn").value = '';
		
	}

	

}


class Store{

	static getBooks(){
		let books;
		if(localStorage.getItem('books') === null){
			books = [];
		}else{
			books = JSON.parse(localStorage.getItem('books')); 
		}

		return books;
	}

	static addBook(book){

		const books = Store.getBooks();
		books.push(book);

		localStorage.setItem('books', JSON.stringify(books));

	}

	static removeBook(isbn){
		const books = Store.getBooks();

		books.forEach((book, index) => {
			if(book.isbn === isbn){
					books.splice(index, 1);
			}
		}); 
		localStorage.setItem('books', JSON.stringify(books));
	}
}




//event to display books

document.addEventListener("DOMContentLoaded", UI.displayBooks);

//event: add a book

document.querySelector("#book-form").addEventListener('submit', (e)=>{

	e.preventDefault();
	//get form values
	const title = document.querySelector("#title").value;
	const author = document.querySelector("#author").value;
	const isbn = document.querySelector("#isbn").value;

	if (title === '' || author === '' || isbn === ''){
		UI.showAlert('invalid credentials', 'danger');
	}else{

	const book = new Book(title, author, isbn);
	
	UI.addBookToList(book);
	//add book
	Store.addBook(book);
	UI.showAlert('book created successfully', 'success');
	//clear fields
	UI.clearFields();
	}
});


document.querySelector("#book-list").addEventListener("click", (e) => {
	//delete book from ui

	UI.deleteBook(e.target);

	//delete book from store
	Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
	UI.showAlert('book removed', 'info');

});