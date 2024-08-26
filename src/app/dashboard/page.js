'use client';

import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/auth';
import { toast } from 'react-hot-toast';
import AdminDash from '@/components/AdminDas/AdminDash';
import { useRouter } from "next/navigation";
import withProtectedRoute from '@/components/Wrapper/protectedroute';


const Dashboard = () => {
// export default function Dashboard() {
  const { token, user, loading } = useContext(AuthContext);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [returningBook, setReturningBook] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [currentBookId, setCurrentBookId] = useState(null);
  const [refresh,setRefresh] = useState(false); 
  const [bookToDelete, setBookToDelete] = useState(null);

  //  const router = useRouter();

  useEffect(() => {
    if (!token) return;

    const fetchProfileData = async () => {
      if (!user) return;
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
        setProfileData(data);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    async function fetchBorrowedBooks() {
      try {
        const response = await fetch('https://library-system-server-nine.vercel.app/borrow_list/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setBorrowedBooks(data);
        } else {
          toast.error('Failed to fetch borrowed books');
        }
      } catch (error) {
        console.error('Error fetching borrowed books:', error);
      }
    }

    async function fetchWishlist() {
      try {
        const response = await fetch('https://library-system-server-nine.vercel.app/wishlist/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setWishlist(data);
        } else {
          toast.error('Failed to fetch wishlist');
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      }
    }

    fetchBorrowedBooks();
    fetchWishlist();
    setIsLoading(false);
    fetchProfileData();
  }, [user, token,refresh]);

  const handleReturnBook = (bookId,bookd) => {
    console.log(bookd);
    
    setReturningBook(bookId);
    setCurrentBookId(bookd); 
    setShowConfirmModal(true);
  };

  const confirmReturnBook = async () => {
    try {
      const response = await fetch(`https://library-system-server-nine.vercel.app/borrow_list/${returningBook}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to return book');
      }

      setBorrowedBooks(borrowedBooks.filter((book) => book.id !== returningBook));
      toast.success('Book returned successfully!');
      setShowConfirmModal(false);
      setShowReviewModal(true);
    } catch (error) {
      console.error('Error returning book:', error);
      toast.error('Failed to return book.');
    }
  };

  const submitReview = async () => {
    try {
      const response = await fetch('https://library-system-server-nine.vercel.app/reviews/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          book: currentBookId, 
          review_text: review,
          rating: rating,
          user: user 
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to submit review:', errorData);
        throw new Error('Failed to submit review');
      }
  
      toast.success('Review submitted successfully!');
      setShowReviewModal(false);
      setReview('');
      setRating(0);
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review.');
    }
  };

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

  const handleDeleteFromWishlist = async (id) => {
    // console.log('bookToDelete', id);
    // return;
    
    try {
      const response = await fetch(`https://library-system-server-nine.vercel.app/wishlist/${id}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete wishlist item');
      }

      setWishlist(wishlist.filter((item) => item.book !== id));
      toast.success('Wishlist item deleted successfully!');
      setBookToDelete(null);
      setRefresh(!refresh);
    } catch (error) {
      console.error('Error deleting wishlist item:', error);
      toast.error('Failed to delete wishlist item.');
    }
  };

  

  if (loading || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      {
        profileData?.role === 'admin' ? (
          <>
            <AdminDash />
          </>
        ) : (
          <>
            <h1 className="text-center text-3xl font-bold mb-6">Welcome, {profileData?.username}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white shadow-lg p-6 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">Borrowed Books</h2>
                {borrowedBooks.length === 0 ? (
                  <p className="text-gray-500">You havent borrowed any books yet.</p>
                ) : (
                  borrowedBooks.map((book) => (
                    <div key={book.id} className="border-b py-4 flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-semibold">{book.book_name}</h3>
                        <p className="text-sm text-gray-600">Borrowed On: {new Date(book.borrowDate).toLocaleDateString()}</p>
                      </div>
                      <button
                        onClick={() => handleReturnBook(book.id,book.book)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg"
                      >
                        Return
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="bg-white shadow-lg p-6 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">Your Wishlist</h2>
                {wishlist.length === 0 ? (
                  <p className="text-gray-500">Your wishlist is empty.</p>
                ) : (
                  wishlist.map((item) => (
                    <div key={item.id} className="border-b py-4 flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-semibold">{item.book_name}</h3>
                      <p className="text-sm text-gray-600">Added On: {new Date(item.wishlistDate).toLocaleDateString()}</p>
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleBorrow(item.id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                      >
                        Borrow
                      </button>
                      <button
                        onClick={() => {
                          setBookToDelete(item.id);
                          handleDeleteFromWishlist(item.id);
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  ))
                )}
              </div>
            </div>
          </>
        )
      }

      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Are you sure you want to return this book?</h2>
            <div className="flex justify-end">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded-lg mr-4"
              >
                No
              </button>
              <button
                onClick={confirmReturnBook}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Yes, Return
              </button>
            </div>
          </div>
        </div>
      )}

      {showReviewModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Leave a Review for the Book</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Rating (1-5)</label>
              <input
                type="number"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                min="1"
                max="5"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Review</label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowReviewModal(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded-lg mr-4"
              >
                Cancel
              </button>
              <button
                onClick={submitReview}
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default withProtectedRoute(Dashboard);