'use client'

import React, { useState, useEffect, useContext } from "react";
import { notFound } from "next/navigation";
import { AuthContext } from "../context/auth";
import { toast } from "react-hot-toast";
import categories from "@/components/CateData/CateData";

async function fetchBooks(category, title) {
  let apiUrl = "https://library-system-server-nine.vercel.app/books/";

  if (category) {
    apiUrl += `?category=${category}`;
  }

  if (title) {
    const searchQuery = category ? `&title=${title}` : `?title=${title}`;
    apiUrl += searchQuery;
  }

  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error("Failed to fetch books");
  }
  return response.json();
}

export default function Books({ searchParams }) {
  const category = searchParams?.category || null;
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); 
  const { token, user } = useContext(AuthContext);
  const [selectedBook, setSelectedBook] = useState(null); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;

      const token = localStorage.getItem("elite_token");

      try {
        const response = await fetch(
          `https://library-system-server-nine.vercel.app/account/profile/?user=${user}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          console.error("Failed to fetch profile data");
          return;
        }

        const data = await response.json();
        // setProfileData(data);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    fetchProfileData();
  }, [user]);

  useEffect(() => {
    async function loadBooks() {
      setLoading(true); 
      try {
        const fetchedBooks = await fetchBooks(category, searchQuery);
        if (fetchedBooks.length === 0 && category) {
          notFound();
        } else {
          setBooks(fetchedBooks);
          setSelectedBook(fetchedBooks[0]); 
        }
      } catch (error) {
        console.error("Error loading books:", error);
      }
      setLoading(false);  
    }
    loadBooks();
  }, [category, searchQuery]);
  

  const handleBorrow = async (bookId) => {
    if(!token) {
      toast.error('You need to be logged in to borrow a book');
      return;
    }
    const data = {
      book: bookId,
      name: user,
    };
    try {
      const response = await fetch('https://library-system-server-nine.vercel.app/borrow_list/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to confirm booking');
      }

      toast.success('Booking confirmed successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleAddToWishlist = async (bookId) => {
    try {
      if (!token) {
        toast.error("You need to be logged in to add a book to your wishlist.");
        return;
      }
      const data = {
        book: bookId,
        name: user,
      };

      const response = await fetch(`https://library-system-server-nine.vercel.app/wishlist/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Book added to wishlist successfully!");
      } else {
        if (response.status === 401) {
          toast.success("You are not authorized. Please log in first.");
        } else if (response.status === 400) {
          const errorData = await response.json();
          toast.success(`Failed to add book to wishlist: ${errorData.error}`);
        } else {
          toast.success("Failed to add book to wishlist.");
        }
      }
    } catch (error) {
      console.error("Error adding book to wishlist:", error);
      toast.success("Error adding book to wishlist.");
    }
  };

  // Handle search input changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleTitleClick = (book) => {
    setSelectedBook(book); 
  };
  console.log(books);

  return (
    <div className="container mx-auto">
      <h1 className="text-center text-4xl font-bold mb-8">
        {category ? `Books in ${categories[category - 1].title}` : "All Books"}
      </h1>
      {
      loading ? (
      <div className="text-center">
        <div className="loader">Loading books...</div> 
      </div>
    ) : (
      <>
        {books.length === 0 && (
          <div className="text-center text-lg font-semibold">
            No books found.
          </div>
        )}
      </>
    )}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search for books by title"
          className="p-2 border border-gray-300 rounded-lg w-1/2"
        />
      </div>
      <div className="grid lg:grid-cols-4 grid-cols-1 gap-10 justify-center">
      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 justify-center items-center lg:col-span-2">
        {books.map((book) => (
          <div
            key={book.id}
            className="border border-gray-400 bg-white rounded-lg flex flex-col text-center leading-snug p-2 max-w-[15rem]"
          >
            <img
              src={book?.image}
              className="w-full h-[15rem] mb-2 rounded-lg"
              alt={book.title}
            />
            <h2  onClick={() => handleTitleClick(book)} className="text-gray-900 font-semibold text-sm mb-1 hover:text-indigo-600 cursor-pointer">{book.title.length >10 ? book.title.substring(0,10):book.title }</h2>
            <p className="text-xs">Writen by <font className="font-bold">{book.author}</font> </p>
            <div>
            <div className="flex gap-5">
              {book.availability_status ? (
                <button
                  onClick={() => handleBorrow(book.id)}
                  className="bg-blue-500 text-white text-xs px-4 py-1.5 rounded-lg mt-4"
                >
                  Borrow
                </button>
              ) : (
                <button
                  disabled={true}
                  className="bg-blue-500 text-white text-xs px-4 py-1.5 rounded-lg mt-4"
                >
                  Borrow
                </button>
              )}
              <button
                onClick={() => handleAddToWishlist(book.id)}
                className="bg-blue-500 text-white px-4 text-xs rounded-lg mt-4"
              >
                Add To Wishlist
              </button>
              </div> 
            </div>
          </div>
        ))}
      </div>
      <div className="lg:col-span-2">
      {selectedBook && (
            <div className="border border-gray-300 bg-white p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">{selectedBook.title}</h2>
              <p><strong>Author:</strong> {selectedBook?.author}</p>
              <p><strong>ISBN:</strong> {selectedBook?.ISBN}</p>
              <p><strong>Published:</strong> {selectedBook?.publication_date}</p>
              <p><strong>Available:</strong> {selectedBook?.availability_status ? 'Yes' : 'No'}</p>
              <p><strong>Quantity:</strong> {selectedBook?.quantity}</p>
              <p><strong>Average Rating:</strong> {selectedBook?.average_rating || 'No rating available'}</p>
              <p><strong>Description:</strong> {selectedBook?.description || 'No description available.'}</p>

              {/* Display reviews if they exist */}
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-2">Reviews</h3>
                {selectedBook?.reviews && selectedBook?.reviews.length > 0 ? (
                  <ul className="space-y-4">
                    {selectedBook?.reviews.map((review, index) => (
                      <li key={index} className="border p-4 rounded-lg bg-gray-50">
                        <p><strong>Reviewer:</strong> {review?.user_name}</p>
                        <p><strong>Review:</strong> {review?.review_text}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No reviews available.</p>
                )}
              </div>
            </div>
          )}

      </div>
      </div>

    </div>
  );
}