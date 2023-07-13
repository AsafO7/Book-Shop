import './app.css'
import CreateBookForm from './Components/createBookForm/CreateBookForm';
import BooksTable from './Components/booksTable/BooksTable';
import SearchedAPIBooks from './Components/searchedAPIBooks/SearchedAPIBooks';
import { useEffect, useState } from 'react';
import { getBooks } from './Hooks/bookService';

export interface Book {
  id: string;
  title: string | undefined;
  price: number | undefined;
  imgUrl: string | undefined;
  rate: number | undefined;
  desc: string | undefined;
}

export type BookStateProps = {
  booksState: Book[],
  setBooksState: React.Dispatch<React.SetStateAction<Book[]>>
}



function App() {

  const [booksState, setBooksState] = useState<Book[]>([])

  // Getting the books from localStorage
  useEffect(() => {
    getBooks()
      .then((res: Array<Book>) => {
        setBooksState(res)
      })
      .catch((error: unknown) => {
        console.log(error)
      });
  }, []); 

  return (
    <div className='app-wrapper'>
      <h1 className='main-h1'>Welcome to my bookshop</h1>
      <CreateBookForm booksState={booksState} setBooksState={setBooksState}/>
      <BooksTable booksState={booksState} setBooksState={setBooksState}/>
      <SearchedAPIBooks booksState={booksState} setBooksState={setBooksState}/>
    </div>
  );
}

export default App
