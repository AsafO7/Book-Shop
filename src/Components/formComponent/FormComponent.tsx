import React, { useRef, FC } from "react";
import { v4 as uuidv4 } from 'uuid'
import { Book, BookStateProps } from "../../App";
import { saveBooks } from "../../Hooks/bookService";

type FormInfo = {
    bookInfo?: Book,
    setCurrentBook?: React.Dispatch<React.SetStateAction<Book | undefined>>,
    action: string
}

type FormProps = FormInfo & BookStateProps

type NoIdBook = {
    title: string | undefined,
    price: number,
    imgUrl: string | undefined,
    rate: number,
    desc: string | undefined,
}

const FormComponent: FC<FormProps> = ({bookInfo, setCurrentBook, action, booksState, setBooksState}) => {

  const titleInput = useRef<HTMLInputElement>(null)
  const priceInput = useRef<HTMLInputElement>(null)
  const imgURLInput = useRef<HTMLInputElement>(null)
  const rateInput = useRef<HTMLInputElement>(null)
  const descInput = useRef<HTMLInputElement>(null)

  //Creates a new book
  async function createBook(newBook: NoIdBook) {
    const newBooks:Array<Book> | undefined = [...booksState]
    const newId: string = uuidv4().slice(0, 10)

    newBooks?.push({ id: newId, ...newBook })
    await saveBooks(newBooks)
    setBooksState(newBooks)
  }

  //Updates a book
  async function updateBook(newBook: NoIdBook) {
    const newBooks:Array<Book> | undefined = [...booksState]
    const bookToUpdateIndex:number = newBooks.findIndex((item) => item.id === bookInfo?.id)

    const completeBook = {id: newBooks[bookToUpdateIndex].id, ...newBook}
    newBooks[bookToUpdateIndex] = {...completeBook}
    
    await saveBooks(newBooks)
    setBooksState(newBooks)
    if(setCurrentBook !== undefined)
      setCurrentBook(completeBook)
  }

  // To avoid Typescript error "Promise-returning function provided to attribute where a void return was expected."
  function handleSubmitWrapper() {
    const newBook = {
        title: (titleInput.current?.value)?.toString(),
        price: Number(Number(priceInput.current?.value).toFixed(2)),
        imgUrl: (imgURLInput.current?.value)?.toString(),
        rate: Number(rateInput.current?.value),
        desc: (descInput.current?.value)?.toString()}
    action === "Create" ? createBook(newBook).catch((err) => console.error(err)) : updateBook(newBook).catch((err) => console.error(err))
  }

  const isValidInput = () => {
    // Checks if the Price and Rate fields received valid inputs
    if(!isValidNumbers()) return

    handleSubmitWrapper()
  }

  function isValidNumbers() {
    if((priceInput.current?.value) && (Number.isNaN(priceInput.current?.value))
    || (rateInput.current?.value) && (Number.isNaN(rateInput.current?.value))
    && (rateInput.current?.value < "0" || rateInput.current?.value > "9")) {
      return false
    }
    return true
  }

  // To update every property, replace "value" with "defaultValue" and remove the "readOnly" attribute
  return (
    <form className={action === "Create" ? "book-form" : "update-book-form"}>
        <label>
        Title: {action === "Create" ? <input name="title" type="text" required ref={titleInput} /> :
            <input name="title" type="text" required ref={titleInput} value={bookInfo?.title} readOnly={true} /> }
        </label>
        <label>
        Price: {action === "Create" ? <input name="price" type="number" step="any" required ref={priceInput} /> :
            <input name="price" type="number" step="any" required ref={priceInput} defaultValue={bookInfo?.price} />}
        </label>
        <label>
        imgUrl: {action === "Create" ? <input name="imgurl" type="text" required ref={imgURLInput} /> :
            <input name="imgurl" type="text" required ref={imgURLInput} value={bookInfo?.imgUrl} readOnly={true}/>}
        </label>
        <label>
        Rate: {action === "Create" ? <input name="rate" type="number" min={0} max={9} required ref={rateInput} /> :
            <input name="rate" type="number" min={0} max={9} required ref={rateInput} defaultValue={bookInfo?.rate}/>}
        </label>
        <label>
        Desc: {action === "Create" ? <input name="desc" type="text" required maxLength={250} ref={descInput} /> :
            <input name="desc" type="text" required maxLength={250} ref={descInput} value={bookInfo?.desc} readOnly={true}/>}
        </label>
        <button className="submit-book-btn" onClick={isValidInput}>{ action === "Create" ? "Create" : "Update" }</button>
    </form> 
  )
}

export default FormComponent