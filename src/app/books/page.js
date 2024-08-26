'use client'

import React, { useState, useEffect, useContext } from "react";
import { notFound } from "next/navigation";
import { AuthContext } from "../context/auth";
import { toast } from "react-hot-toast";
import categories from "@/components/CateData/CateData";

// Fetch books by category and title search query
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

  // Fetch profile data on load
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

  // Fetch books based on category and search query
  useEffect(() => {
    async function loadBooks() {
      try {
        const fetchedBooks = await fetchBooks(category, searchQuery);
        if (fetchedBooks.length === 0 && category) {
          notFound();
        } else {
          setBooks(fetchedBooks);
        }
      } catch (error) {
        console.error("Error loading books:", error);
      }
    }
    loadBooks();
  }, [category, searchQuery]); // Added searchQuery to the dependency array

  const handleBorrow = async (bookId) => {
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
        alert("You need to be logged in to add a book to your wishlist.");
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

  return (
    <div className="container mx-auto">
      <h1 className="text-center text-4xl font-bold mb-8">
        {category ? `Books in ${categories[category - 1].title}` : "All Books"}
      </h1>

      {/* Search Box */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search for books by title"
          className="p-2 border border-gray-300 rounded-lg w-1/2"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 px-5">
        {books.map((book) => (
          <div key={book.id} className="border p-4 rounded-lg">
            {book.image && (
              <img
                src={book.image}
                alt={book.title}
                className="mt-2 w-60 h-60"
              />
            )}
            <h2 className="text-xl font-semibold">{book.title}</h2>
            <p className="text-sm">Author: {book.author}</p>
            <p className="text-sm">ISBN: {book.ISBN}</p>
            <p className="text-sm">Published on: {book.publication_date}</p>
            <p className="text-sm">
              Availability:{" "}
              {book.availability_status ? "Available" : "Not Available"}
            </p>
            <p className="text-sm">Quantity: {book.quantity}</p>
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
        ))}
      </div>
    </div>
  );
}
