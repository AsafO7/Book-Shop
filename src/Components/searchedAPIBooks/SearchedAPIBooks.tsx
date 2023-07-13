import React from 'react';
import { useCallback, useEffect, useState, FormEvent } from 'react';
import './searchedapibooks.css'
import { addGoogleBook } from '../../Hooks/bookService';
import { Book, BookStateProps } from '../../App';

type APIBook = {
    id: string,
    volumeInfo: {
        title: string,
        imageLinks?: {smallThumbnail: string},
        description: string
    }
  }

type SearchedBooks = {
    kind: string,
    totalItems: string,
    items: [],
}

const SearchedAPIBooks: React.FC<BookStateProps> = ({booksState, setBooksState}) => {

    const [apiBooks, setAPIBooks] = useState([])
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const searchValue = React.createRef<HTMLInputElement>()
  
    // Fetching the books from google's API
    const fetchBooks = useCallback(async () => {
      setLoading(true)
      try {
        const key = import.meta.env.VITE_API_KEY as string
        const books:SearchedBooks = await (await 
            fetch(`https://www.googleapis.com/books/v1/volumes?q=""+intitle:${searchTerm}&key=${key}`)).json() as SearchedBooks
        const { items } = books
        if(typeof items === 'object') {
            setAPIBooks(items)
        }
        setLoading(false)
      }
      catch(err) {
        console.log(err)
        setAPIBooks([])
        setLoading(false)
      }
    },[searchTerm])
    
    useEffect(() => {
      fetchBooks().catch((err) => console.error(err))
    },[fetchBooks, searchTerm])

    

    // Prevents a re-render when pressing the "Enter" key.
    function handleSubmit (e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
    }

    const searchBook = () => {
        if(typeof searchValue.current?.value === 'string' && searchValue.current?.value !== "")
            setSearchTerm(searchValue.current?.value)
    }

    async function addToDB(book: APIBook) {
        const duplicateBook = booksState.filter((item) => item.id === book.id)
        // Avoiding duplicate books
        if(duplicateBook.length > 0) return

        const googleBook: Book = {
            id: book.id,
            title: book.volumeInfo.title,
            price: 14.20,
            imgUrl: book.volumeInfo.imageLinks?.smallThumbnail,
            rate: 7,
            desc: book.volumeInfo.description
        }
        try {
            await addGoogleBook(googleBook)
            const newBooks:Array<Book> | undefined = [...booksState]
            newBooks.push(googleBook)
            setBooksState(newBooks)
        }
        catch(err) {
            console.error(err)
        }
    }

    function addToDBWrapper(book: APIBook) {
        addToDB(book).catch((err) => console.error(err))
    }

  return (
    <div className='searched-books-container'>
        <section className="search-container">
            <form action="" className="search-form" onSubmit={(e) => handleSubmit(e)}>
                <div className="form-container">
                    <label htmlFor="name">Search a book</label>
                    <input type="search" id="name" ref={searchValue} onChange={searchBook} />
                </div>
            </form>
        </section>
        { loading ? <div>Loading books...</div> :
        <article className='books-container'>
            <ul className='books-list'>
            {apiBooks.map((book: APIBook, index) => {
                return ( <li key={book.id + index.toString()} className='book-item'>
                    <div className='book-title-container'>
                        <span className='book-title'>{book.volumeInfo.title}</span>
                        <button onClick={() => addToDBWrapper(book)}>➕</button>
                    </div>
                </li>
                )
            })}
            </ul>
        </article>
        }
    </div>
  )
}

export default SearchedAPIBooks