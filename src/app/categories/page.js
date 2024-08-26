import React from "react";
import Link from "next/link";
import categories from "../../components/CateData/CateData";

function Categories() {
  return (
    <div>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-center text-4xl font-bold mb-8 text-indigo-600">
          All Categories
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {categories.map((category) => (
            <Link key={category.slug}  href={`/books?category=${category.id}`}>
              <h2 className="block p-4 border rounded-lg shadow-lg hover:bg-gray-200 hover:text-black transition-transform transform hover:scale-105">
                <p className="text-xl font-semibold mb-2">{category.title}</p>
                <ul className="text-gray-700 text-sm">
                  {category.subcategories.map((subcat) => (
                    // {category.subcategories.slice(0, 3).map((subcat) => (
                    <li key={subcat}>{subcat}</li>
                  ))}
                </ul>
              </h2>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Categories;
