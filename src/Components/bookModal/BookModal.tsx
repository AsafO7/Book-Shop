import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import { Book, BookStateProps } from '../../App';
import './bookmodal.css'
import FormComponent from '../formComponent/FormComponent';
import { saveBooks } from '../../Hooks/bookService';

type BookInfo = {
  bookInfo: Book | undefined
  setCurrentBook: React.Dispatch<React.SetStateAction<Book | undefined>>
}

type BookInfoProps = BookInfo & BookStateProps

type ModalProps = {
    isModalOpen: boolean
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    bookInfo: Book | undefined
    setCurrentBook: React.Dispatch<React.SetStateAction<Book | undefined>>
    modalType: string
};

type BookModalProps = ModalProps & BookStateProps

const boxStyle = {
    bgcolor: 'background.paper',
    p: 2,
}

const titleStyle = {
  fontWeight: 'bold',
  textAlign: 'center',
  fontSize: '1.8rem'
}


  const BookInfo: React.FC<BookInfoProps> = ({bookInfo, setCurrentBook, booksState, setBooksState}) => {
    
    async function updateRate(sign: string) {
      const newBooks:Array<Book> | undefined = [...booksState]
      const bookToUpdateIndex:number = newBooks.findIndex((item) => item.id === bookInfo?.id)
      const rate: number | undefined = sign === "+" ? Number(newBooks[bookToUpdateIndex].rate) + 1 : Number(newBooks[bookToUpdateIndex].rate) - 1
      if(rate > 9 || rate < 0) return
      
      if(bookInfo !== undefined) {
        const completeBook: Book = {id: bookInfo.id, title: bookInfo.title, price: bookInfo.price, imgUrl: bookInfo.imgUrl, rate: rate, desc: bookInfo.desc}
        newBooks[bookToUpdateIndex] = completeBook
        
        await saveBooks(newBooks)
        setBooksState(newBooks)
        setCurrentBook(completeBook)
      }
    }

    function updateRateWrapper(sign: string) {
      updateRate(sign).catch((err) => console.error(err))
    }

    return <article className='book-info'>
      <div className='book-info-prop'><b><label>Title: </label></b><span>{bookInfo?.title}</span></div>
      <div className='book-info-prop'><b><label>Price: </label></b><span>{bookInfo?.price}$</span></div>
      <div className='book-info-prop'><b><label style={{textAlign: "center"}}>Img: </label></b><img src={bookInfo?.imgUrl} alt='book image' className='book-img'></img></div>
      <div className='book-info-prop'><b><label>Rate: </label></b>
        <button className='dec-btn' onClick={() => updateRateWrapper("-")}>-</button>
        <span className='rate-span'>{bookInfo?.rate}</span>
        <button className='inc-btn' onClick={() => updateRateWrapper("+")}>+</button>
      </div>
      <div className='book-info-prop'><b><label>Description: </label></b><span>{bookInfo?.desc}</span></div>
    </article>
  }

  const BookModal: React.FC<BookModalProps> = ({isModalOpen, setIsModalOpen, bookInfo, setCurrentBook, modalType, booksState, setBooksState}) => {

    function handleClose() {
      setIsModalOpen(false)
    }

    return(
      <div>
        <Modal
          open={isModalOpen}
          onClose={handleClose}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          // sx={modalStyle}
          className='modal-main'
        >
          <Box sx={boxStyle} className={modalType === "Read" ? "box-style-read" : "box-style-update"}>
            <Typography variant="h6" id="modal-title" sx={titleStyle}>
              {bookInfo?.title}
            </Typography>
            <Typography component={'span'} variant="body1" id="modal-description">
              {modalType === "Read" ? 
                <BookInfo bookInfo={bookInfo} setCurrentBook={setCurrentBook} booksState={booksState} setBooksState={setBooksState}/>
              : <FormComponent bookInfo={bookInfo} action="Update" booksState={booksState} setBooksState={setBooksState}/>}
            </Typography>
            <Button sx={{display: "block", margin: "auto"}} variant="contained" onClick={handleClose}>
              Close
            </Button>
          </Box>
        </Modal>
      </div>
    )
  }

export default BookModal;