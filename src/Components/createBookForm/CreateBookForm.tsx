import { useState} from "react";
import './createbookform.css'
import FormComponent from "../formComponent/FormComponent";
import { BookStateProps } from "../../App";

const CreateBookForm: React.FC<BookStateProps> = ({booksState, setBooksState}) => {

  const [openForm, setOpenForm] = useState<boolean>(false)

  return (
    <div className="create-book-wrapper">
        <button className='create-book-btn' onClick={() => setOpenForm(!openForm)}>{openForm ? "Cancel" : "Create new book"}</button>
        {openForm && <>
          <FormComponent action="Create" booksState={booksState} setBooksState={setBooksState}/>
        </>}
    </div>
  )
}

export default CreateBookForm