const INCOMPLETE_BOOK = "incompleteBookshelfList";
const COMPLETE_BOOK = "completeBookshelfList";

function addBook() {
    const idBook = +new Date();
    const inputBookTitle = document.getElementById("inputBookTitle").value;
    const inputBookAuthor = document.getElementById("inputBookAuthor").value;
    const inputBookYear = document.getElementById("inputBookYear").value;
    const inputBookIsComplete = document.getElementById("inputBookIsComplete").checked;

    const book = createBook(idBook, inputBookTitle, inputBookAuthor, inputBookYear, inputBookIsComplete);
    const bookObject = composeBookObject(idBook, inputBookTitle, inputBookAuthor, inputBookYear, inputBookIsComplete);

    books.push(bookObject);

    if (inputBookIsComplete) {
        document.getElementById(COMPLETE_BOOK).append(book);
    } else {
        document.getElementById(INCOMPLETE_BOOK).append(book);
    }

    updateJson();
}

function createBook(idBook, inputBookTitle, inputBookAuthor, inputBookYear, inputBookIsComplete) {
    const book = document.createElement("div");
    book.setAttribute("id", idBook)
    book.classList.add("card", "shadow", "mb-5", "card-left");

    const tr = document.createElement("tr");

    const bookTitle = document.createElement("td");
    bookTitle.innerHTML = "<i class='fa fa-angle-right'></i> <span class='titleBook'>" + inputBookTitle + "</span> (<span>" + inputBookYear +"</span>) </b>" + "<br>Penulis : <span>" + inputBookAuthor + "</span>";

    const br = document.createElement("br");

    const cardContainer = document.createElement("div");
    cardContainer.classList.add("card-body");

    const cardContent = document.createElement("table");
    cardContent.classList.add("bookshelf");

    const cardAction = addAction(inputBookIsComplete, idBook);

    cardContent.append(tr);
    tr.append(bookTitle, cardAction);
    cardContainer.append(cardContent);
    book.append(cardContainer);

    return book;
}

function addAction(inputBookIsComplete, idBook) {
    const cardActions = document.createElement("td");
    cardActions.classList.add("text-right");

    const actionDelete = createActionDelete(idBook);
    const actionRead = createActionRead(idBook);
    const actionUndo = createActionUndo(idBook);

    cardActions.append(actionDelete);

    if (inputBookIsComplete) {
        cardActions.append(actionUndo);
    } else {
        cardActions.append(actionRead);
    }

    return cardActions;
}

function createActionDelete(idBook) {
    const actionDelete = document.createElement("button");
    actionDelete.classList.add("btn-delete");
    actionDelete.innerHTML = '<i class="fa fa-times-circle"></i>';

    actionDelete.addEventListener("click", function () {
        let confirmation = confirm("Apakah anda yakin ingin menghapus buku?");

        if (confirmation) {
            const cardParent = document.getElementById(idBook);
            cardParent.addEventListener("eventDelete", function (event) {
                event.target.remove();
            });
            cardParent.dispatchEvent(new Event("eventDelete"));

            deleteBookFromJson(idBook);
            updateJson();
        }
    });

    return actionDelete;
}

function createActionRead(idBook) {
    const action = document.createElement("button");
    action.classList.add("btn-check");
    action.innerHTML = '<i class="fa fa-check-circle"></i>';

    action.addEventListener("click", function () {
        const cardParent = document.getElementById(idBook);
        const bookTitle = cardParent.querySelectorAll("td > span")[0].innerText;
        const bookYear = cardParent.querySelectorAll("td > span")[1].innerText;
        const bookAuthor = cardParent.querySelectorAll("td > span")[2].innerText;

        cardParent.remove();

        const book = createBook(idBook, bookTitle, bookAuthor, bookYear, true);
        document.getElementById(COMPLETE_BOOK).append(book);

        deleteBookFromJson(idBook);
        const bookObject = composeBookObject(idBook, bookTitle, bookAuthor, bookYear, true);

        books.push(bookObject);
        updateJson();
    })

    return action;
}

function createActionUndo(idBook) {
    const action = document.createElement("button");
    action.classList.add("btn-undo");
    action.innerHTML = '<i class="fa fa-undo"></i>';

    action.addEventListener("click", function () {
        const cardParent = document.getElementById(idBook);
        const bookTitle = cardParent.querySelectorAll("td > span")[0].innerText;
        const bookYear = cardParent.querySelectorAll("td > span")[1].innerText;
        const bookAuthor = cardParent.querySelectorAll("td > span")[2].innerText;

        cardParent.remove();

        const book = createBook(idBook, bookTitle, bookAuthor, bookYear, false);
        document.getElementById(INCOMPLETE_BOOK).append(book);

        deleteBookFromJson(idBook);
        const bookObject = composeBookObject(idBook, bookTitle, bookAuthor, bookYear, false);

        books.push(bookObject);
        updateJson();
    })

    return action;
}

function bookSearch(keyword) {
    const filter = keyword.toUpperCase();
    const titles = document.getElementsByClassName("titleBook");

    for (let i = 0; i < titles.length; i++) {
        const titlesText = titles[i].textContent || titles[i].innerText;

        if (titlesText.toUpperCase().indexOf(filter) > -1) {
            titles[i].closest(".card").style.display = "";
        } else {
            titles[i].closest(".card").style.display = "none";
        }
    }
}
