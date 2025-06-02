import BookList from '../../components/books/BookList';
import { useState, useEffect } from 'react';


function Books() {
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(null)

    useEffect(() => {
        fetch('http://127.0.0.1:5009/books')
        .then(res => res.json())
        .then(data => setBooks(data))
        .finally(() => setLoading(false))
    }, []);

  return (
    <>
      <div>
        <BookList books={books}/>
      </div>
    </>
  )
}

export default Books
