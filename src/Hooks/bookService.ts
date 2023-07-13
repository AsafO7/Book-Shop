import { Book } from "../App"
import { v4 as uuidv4 } from 'uuid'

export const getBooks = (): Promise<Array<Book>> => {
  return new Promise((resolve) => {
    const jsonValue = localStorage.getItem('bookshop-');
    if (jsonValue != null) {
      resolve(JSON.parse(jsonValue) as Array<Book>);
    } else {
      const books: Book[] = [
        { id: uuidv4().slice(0, 10), title: "Learning Laravel", price: Number((18.90).toFixed(2)), 
        imgUrl: "https://images.pexels.com/photos/2465877/pexels-photo-2465877.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", rate: 3, desc: "Lorem ipsom" },
        { id: uuidv4().slice(0, 10), title: "Beginning with Laravel", price: Number((6.65).toFixed(2)),
        imgUrl: "https://images.pexels.com/photos/1730560/pexels-photo-1730560.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", rate: 4, desc: "Lorem ipsom" },
        { id: uuidv4().slice(0, 10), title: "Java for developers", price: Number((7.20).toFixed(2)),
        imgUrl: "https://images.pexels.com/photos/964547/pexels-photo-964547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", rate: 5, desc: "Lorem ipsom" },
        { id: uuidv4().slice(0, 10), title: "React for developers", price: Number((17.20).toFixed(2)),
        imgUrl: "https://images.pexels.com/photos/2846814/pexels-photo-2846814.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", rate: 7, desc: "Lorem ipsom" },
      ];
      localStorage.setItem('bookshop-', JSON.stringify(books));
      resolve(books);
    }
  });
};

export const saveBooks = (books: Array<Book>): Promise<void> => {
  return new Promise((resolve) => {
    localStorage.setItem('bookshop-', JSON.stringify(books));
    resolve();
  });
};

export const addGoogleBook = (googleBook: Book): Promise<void> => {
  return new Promise((resolve) => {
    let newBooks = []
    getBooks().then((res: Array<Book>) => {
      newBooks = [...res]
      newBooks.push(googleBook)
      saveBooks(newBooks).catch((err) => console.error(err))
      resolve()
    }).catch((err) => {
      console.log(err)
    })
  })
}