import { useState } from "react"
import { Book, BookStateProps } from "../../App"
import "./bookstable.css"
import { saveBooks } from '../../Hooks/bookService'
import BookModal from "../bookModal/BookModal"

const BooksTable: React.FC<BookStateProps> = ({booksState, setBooksState}) => {

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentBook, setCurrentBook] = useState<Book>()
  const [modalType, setModalType] = useState<string>("Read")

  function openModal(id: string, type: string) {
    const book = booksState.find((item) => item.id === id)
    setCurrentBook(book)
    setModalType(type)
    setIsModalOpen(true)
  }

  async function handleDelete(itemId: string) {
    try {
      const newBooks = booksState.filter((book) => book.id !== itemId)
      await saveBooks(newBooks)
      setBooksState(newBooks)
    } catch (error: unknown) {
      console.log(error)
    }
  }

  const handleDeleteWrapper = (itemId: string): void => {
    handleDelete(itemId).catch((err) => console.error(err))
  }

  return booksState.length === 0 ? <div>There are no books currently</div> :
   (
    <>
      <table className='books-table'>
          <thead>
          <tr>
              <th>Id</th>
              <th>Title</th>
              <th>Price</th>
              <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          {booksState.map((item, index) => (
              <tr key={item.id} className={(index + 1) % 2 === 0 ? 'even-row' : 'odd-row'}>
              <td>{item.id}</td>
              <td>
                <p className="table-book-title">{item.title}</p>
                <input className="expand-btn" type="checkbox" />
              </td>
              <td>{item.price}$</td>
              <td><button onClick={() => openModal(item.id, "Read")} className='read-btn'>Read</button></td>
              <td><button onClick={() => openModal(item.id, "Update")} className='update-btn'>Update</button></td>
              <td><button onClick={() => handleDeleteWrapper(item.id)} className='delete-btn'>Delete</button></td>
              </tr>
          ))}
          </tbody>
      </table>
      {isModalOpen && <BookModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} bookInfo={currentBook}
       setCurrentBook={setCurrentBook} modalType={modalType} booksState={booksState} setBooksState={setBooksState}/>}
    </>
  )
}

export default BooksTable