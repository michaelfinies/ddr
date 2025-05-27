"use client";
import { useState, useEffect, useRef } from "react";
import {
  Heart,
  BookOpen,
  Star,
  Search,
  ChevronLeft,
  ChevronRight,
  Download,
  X,
  Home,
  UploadCloud,
  Upload,
} from "lucide-react"; // Added Download, X icons
import "./dash.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const GUTENDEX_API_BASE = "https://gutendex.com/books/";

// Topics for shelves, inspired by the second file's categories
const TOPICS = [
  "fiction",
  "history",
  "science",
  "fantasy",
  "adventure",
  "mystery",
  "romance",
];

// Helper function from first file to get cover image
function getCoverImage(book) {
  if (book && book.formats && book.formats["image/jpeg"]) {
    return book.formats["image/jpeg"];
  }
  // Fallback if ISBN is available, similar to original, but adapt to Gutendex structure if needed
  // For now, Gutendex direct image is prioritized.
  // const isbn = book.volumeInfo?.industryIdentifiers?.find(id => id.type === "ISBN_13" || id.type === "ISBN_10")?.identifier;
  // if (isbn) return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`;
  return "/no-cover.png"; // Placeholder image
}

// Helper to get download link and type from first file
function getDownloadInfo(book) {
  if (!book || !book.formats) return { downloadUrl: null, downloadType: "" };
  const formats = book.formats;
  let downloadUrl = null;
  let downloadType = "";

  if (formats["application/epub+zip"]) {
    downloadUrl = formats["application/epub+zip"];
    downloadType = "EPUB";
  } else if (formats["application/pdf"]) {
    downloadUrl = formats["application/pdf"];
    downloadType = "PDF";
  } else if (formats["text/plain; charset=utf-8"]) {
    downloadUrl = formats["text/plain; charset=utf-8"];
    downloadType = "TXT";
  } else if (formats["text/html; charset=utf-8"] || formats["text/html"]) {
    downloadUrl = formats["text/html; charset=utf-8"] || formats["text/html"];
    downloadType = "HTML";
  }
  return { downloadUrl, downloadType };
}

export default function CombinedBookApp() {
  const [booksByTopic, setBooksByTopic] = useState({});
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [favorites, setFavorites] = useState([]);
  const [currentlyReading, setCurrentlyReading] = useState([]);
  const [activeShelf, setActiveShelf] = useState("home");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [loadingGlobal, setLoadingGlobal] = useState(true); // For initial load and search
  const [loadingTopics, setLoadingTopics] = useState(true); // Specifically for topic carousels

  const carouselRefs = useRef({});

  // Fetch books by topic
  useEffect(() => {
    const loadBooksByTopic = async () => {
      // setLoadingGlobal(true);
      // setLoadingTopics(true);
      const cached = localStorage.getItem("booksByTopic");
      if (cached) {
        setBooksByTopic(JSON.parse(cached));
        setLoadingTopics(false);
        setLoadingGlobal(false);
        return;
      }

      let allBooksByTopic = {};

      for (const element of TOPICS) {
        try {
          const res = await fetch(
            `${GUTENDEX_API_BASE}?topic=${element}&page=1&limit=5&mime_type=image%2Fjpeg`
          );

          if (!res.ok) throw new Error(`Failed to fetch ${element}`);
          const data = await res.json();
          const results = data.results || [];
          // Use functional update to avoid stale state issues
          setBooksByTopic((prev) => ({
            ...prev,
            [element]: results,
          }));
          allBooksByTopic[element] = results;
        } catch (error) {
          console.error(`Error fetching ${element}:`, error);
          setBooksByTopic((prev) => ({
            ...prev,
            [element]: [],
          }));
          allBooksByTopic[element] = [];
        }
        setLoadingTopics(false);
        setLoadingGlobal(false);
      }

      // Save to localStorage after all fetches are done
      localStorage.setItem("booksByTopic", JSON.stringify(allBooksByTopic));
    };
    loadBooksByTopic();
  }, []);

  useEffect(() => {
    console.log(booksByTopic);
  }, [booksByTopic]);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem("favs");
      if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
      const storedReading = localStorage.getItem("reading");
      if (storedReading) setCurrentlyReading(JSON.parse(storedReading));
    } catch (e) {
      console.error("Failed to parse from localStorage", e);
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem("favs", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("reading", JSON.stringify(currentlyReading));
  }, [currentlyReading]);

  // Shelf actions
  const toggleFavorite = (book) => {
    setFavorites((prev) =>
      prev.find((b) => b.id === book.id)
        ? prev.filter((b) => b.id !== book.id)
        : [book, ...prev]
    );
  };

  const toggleCurrentlyReading = (book) => {
    setCurrentlyReading((prev) =>
      prev.find((b) => b.id === book.id)
        ? prev.filter((b) => b.id !== book.id)
        : [book, ...prev]
    );
  };

  // Search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setActiveShelf("home");
      setSearchResults([]);
      return;
    }
    setLoadingGlobal(true);
    setActiveShelf("search");
    try {
      const res = await fetch(
        `${GUTENDEX_API_BASE}?search=${encodeURIComponent(
          searchTerm
        )}&mime_type=image%2Fjpeg`
      );
      if (!res.ok) throw new Error("Search request failed");
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error("Error searching books:", error);
      setSearchResults([]);
    }
    setLoadingGlobal(false);
  };

  const openModalWithBook = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Delay clearing selectedBook to allow for fade-out animation if any
    setTimeout(() => setSelectedBook(null), 300);
  };

  const shelvesNav = [
    { id: "home", name: "Home", icon: <Home className="w-5 h-5" /> },
    { id: "favorites", name: "Favorites", icon: <Heart className="w-5 h-5" /> },
    {
      id: "currently",
      name: "Reading",
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      id: "uploaded",
      name: "Uploaded",
      icon: <Upload className="w-5 h-5" />,
    },
  ];

  const scrollCarousel = (categoryKey, dir = 1) => {
    const ref = carouselRefs.current[categoryKey];
    if (ref) {
      const scrollAmount = ref.offsetWidth * 0.75; // Scroll by 75% of visible width
      ref.scrollBy({ left: dir * scrollAmount, behavior: "smooth" });
    }
  };

  const renderBookCard = (book, cardKey) => (
    <div
      key={cardKey}
      className="group m-2 relative cursor-pointer transition-transform transform hover:scale-105 w-44 sm:w-48 flex-shrink-0"
      onClick={() => openModalWithBook(book)}
      role="button"
      tabIndex={0}
      onKeyUp={(e) => e.key === "Enter" && openModalWithBook(book)}
    >
      <img
        src={getCoverImage(book)}
        alt={book.title ? `Cover of ${book.title}` : "Book cover"}
        className="w-full h-60 sm:h-64 object-cover text-white rounded-xl shadow-lg border-4 border-transparent group-hover:border-blue-500 transition-all duration-300"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/no-cover.png";
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-3 sm:p-4 rounded-b-xl">
        <h2 className="font-semibold text-base sm:text-lg truncate text-white group-hover:text-blue-300">
          {book.title || "Untitled"}
        </h2>
        <p className="text-xs sm:text-sm text-gray-300 truncate">
          {book.authors
            ?.map((a) => a.name.split(",").reverse().join(" ").trim())
            .join(", ") || "Unknown Author"}
        </p>
      </div>
    </div>
  );

  const renderBookCarousel = (books, categoryKey, title) => {
    if (!books || books.length === 0) {
      return (
        <section className="mb-10 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-black capitalize px-1 sm:px-2 mb-3 sm:mb-4">
            {title}
          </h2>
          <p className="text-gray-400 px-2">No books in this section yet.</p>
        </section>
      );
    }

    const showArrows = books.length > (window.innerWidth < 768 ? 2 : 4);

    return (
      <section className="mb-10 sm:mb-5">
        <div className="flex justify-between items-center mb-3 sm:mb-4 px-1 sm:px-2">
          <h2 className="text-xl sm:text-2xl font-bold text-black capitalize">
            {title}
          </h2>
          {showArrows && (
            <div className="flex space-x-2">
              <button
                onClick={() => scrollCarousel(categoryKey, -1)}
                className="p-1.5 sm:p-2 bg-black/40 rounded-full hover:bg-blue-600/70 transition text-white"
                aria-label={`Scroll ${title} left`}
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={() => scrollCarousel(categoryKey, 1)}
                className="p-1.5 sm:p-2 bg-black/40 rounded-full hover:bg-blue-600/70 transition text-white"
                aria-label={`Scroll ${title} right`}
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          )}
        </div>
        <div
          className="flex space-x-4 sm:space-x-6 overflow-x-auto pb-4 scrollbar-hide"
          ref={(el) => (carouselRefs.current[categoryKey] = el)}
        >
          {books.map((book, index) =>
            renderBookCard(book, `${categoryKey}-${book.id || index}`)
          )}
        </div>
      </section>
    );
  };

  let pageContent;
  if (loadingGlobal && activeShelf === "search") {
    pageContent = (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-400"></div>
      </div>
    );
  } else if (activeShelf === "favorites") {
    pageContent =
      favorites.length > 0 ? (
        renderBookCarousel(favorites, "favoritesShelf", "My Favorites")
      ) : (
        <p className="text-center text-gray-400 mt-10 text-lg">
          Your favorites shelf is empty.
        </p>
      );
  } else if (activeShelf === "currently") {
    pageContent =
      currentlyReading.length > 0 ? (
        renderBookCarousel(
          currentlyReading,
          "readingShelf",
          "Currently Reading"
        )
      ) : (
        <p className="text-center text-gray-400 mt-10 text-lg">
          Your reading list is empty.
        </p>
      );
  } else if (activeShelf === "search") {
    pageContent =
      searchResults.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {searchResults.map((book, index) =>
            renderBookCard(book, `search-${book.id || index}`)
          )}
        </div>
      ) : searchTerm ? (
        <p className="text-center text-gray-400 mt-10 text-lg">
          No results found for "{searchTerm}".
        </p>
      ) : (
        <p className="text-center text-gray-400 mt-10 text-lg">
          Enter a term above to search books.
        </p>
      );
  } else if (activeShelf === "uploaded") {
    pageContent =
      currentlyReading.length > 0 ? (
        renderBookCarousel(
          currentlyReading,
          "readingShelf",
          "Currently Reading"
        )
      ) : (
        <p className="text-center text-gray-400 mt-10 text-lg">
          No books uploaded by your school
        </p>
      );
  } else {
    // Home shelf
    if (loadingTopics) {
      pageContent = (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-400"></div>
        </div>
      );
    } else if (Object.keys(booksByTopic).length > 0) {
      pageContent = (
        <>
          {TOPICS.map(
            (topic) =>
              booksByTopic[topic] && booksByTopic[topic].length > 0 ? (
                <div key={topic}>
                  {renderBookCarousel(booksByTopic[topic], topic, topic)}
                </div>
              ) : null // Optionally render a "No books for this topic" message here too
          )}
        </>
      );
    } else {
      pageContent = (
        <p className="text-center text-gray-400 mt-10 text-lg">
          Could not load book categories. Please try again later.
        </p>
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br text-black font-sans">
      <div className="px-2 sm:px-4 md:px-5 py-3 sm:py-5 max-w-screen-xl mx-auto">
        <div className="p-5">
          <img className=" rounded-2xl" src="/backdropd2222.png" />
        </div>
      </div>

      <div className="w-full flex gap-3 items-center justify-center">
        <form
          onSubmit={handleSearch}
          className="flex gap-1 sm:gap-2 items-center"
        >
          <Input
            className="max-w-xs px-4 py-2 h-10 rounded-full w-86"
            type="search"
            placeholder="Search books, authors, topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            type="submit"
            variant="default"
            size="icon"
            aria-label="Search"
            className="flex h-10 w-10 items-center gap-2 justify-center px-4 py-2 rounded-full font-thin transition-all border-gray-400 border-2 sm:gap-1.5 px-2 sm:px-3 py-1.5"
          >
            <Search />
          </Button>
        </form>
        {shelvesNav.map((s) => (
          <button
            key={s.id}
            title={s.name}
            className={`flex border-2 border-gray-600 font-bold  h-10 w-10 items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm transition-all
                           ${
                             activeShelf === s.id
                               ? "bg-blue-400 text-white shadow-md"
                               : "text-gray-600 hover:bg-white/20 hover:text-blue-500"
                           }`}
            onClick={() => {
              setSearchTerm("");
              setSearchResults([]);
              setActiveShelf(s.id);
            }}
          >
            {s.icon}
          </button>
        ))}
      </div>
      <main className="p-2 sm:p-4 md:p-8 max-w-screen-xl mx-auto">
        {pageContent}
      </main>
      {isModalOpen && selectedBook && (
        <BookDetailModal
          book={selectedBook}
          onClose={closeModal}
          favorites={favorites}
          currentlyReading={currentlyReading}
          toggleFavorite={toggleFavorite}
          toggleCurrentlyReading={toggleCurrentlyReading}
        />
      )}
      <footer className="p-4 mt-8 text-center text-gray-500 text-xs sm:text-sm border-t border-gray-700/50">
        Please note that readify does not own these books.{" "}
        <br className="sm:hidden" /> But is completly legal thanks to{" "}
        <a className="text-blue-500 underline" href="https://gutenberg.org/">
          Project Gutenberg
        </a>
      </footer>
    </div>
  );
}

function BookDetailModal({
  book,
  onClose,
  favorites,
  currentlyReading,
  toggleFavorite,
  toggleCurrentlyReading,
}) {
  const [downloading, setDownloading] = useState(false);
  const { downloadUrl, downloadType } = getDownloadInfo(book);

  const handleDownload = (e) => {
    if (!downloadUrl) {
      e.preventDefault();
      return;
    }
    setDownloading(true);
    setTimeout(() => setDownloading(false), 1500);
  };

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  const isFavorite = favorites.find((b) => b.id === book.id);
  const isReading = currentlyReading.find((b) => b.id === book.id);

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-modal-title"
    >
      <div
        className="bg-gradient-to-br from-[#2a283e] via-[#1c1a29] to-[#16141A] text-black rounded-xl shadow-2xl p-5 sm:p-6 md:p-8 max-w-xl lg:max-w-2xl w-full relative animate-fadeIn custom-modal-scroll"
        onClick={(e) => e.stopPropagation()} // Prevent close on content click
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-3xl text-gray-400 hover:text-blue-400 transition-colors z-10 p-1"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
          <img
            src={getCoverImage(book)}
            alt={book.title ? `Cover of ${book.title}` : "Book cover"}
            className="w-36 h-52 sm:w-40 sm:h-60 md:w-48 md:h-72 object-cover rounded-lg shadow-md mx-auto md:mx-0 flex-shrink-0 border-2 border-gray-700/50"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/no-cover.png";
            }}
          />
          <div className="flex-1 flex flex-col min-w-0 text-center md:text-left">
            <h2
              id="book-modal-title"
              className="text-xl sm:text-2xl text-white md:text-3xl font-bold mb-1"
            >
              {book.title || "Untitled"}
            </h2>
            <p className="mb-2 text-sm sm:text-base text-gray-400">
              By:{" "}
              {book.authors
                ?.map((a) => a.name.split(",").reverse().join(" ").trim())
                .join(", ") || "Unknown Author"}
            </p>
            <div className="my-2 sm:my-3 text-xs sm:text-sm text-gray-300 h-20 sm:h-24 overflow-y-auto scrollbar-thin pr-1">
              <h4 className="font-semibold text-gray-200 mb-0.5 sm:mb-1">
                Subjects:
              </h4>
              {book.subjects?.length > 0
                ? book.subjects.slice(0, 10).join(", ")
                : "No subjects listed."}
              {book.subjects?.length > 10 && "..."}
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-2 my-2 sm:my-3">
              <button
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all
                            ${
                              isFavorite
                                ? "bg-pink-600 hover:bg-pink-700 text-white"
                                : "bg-gray-600/70 hover:bg-gray-500/70 text-gray-200"
                            }`}
                onClick={() => toggleFavorite(book)}
              >
                <Heart
                  className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`}
                />
                {isFavorite ? "Favorited" : "Favorite"}
              </button>
              <button
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all
                            ${
                              isReading
                                ? "bg-green-600 hover:bg-green-700 text-white"
                                : "bg-gray-600/70 hover:bg-gray-500/70 text-gray-200"
                            }`}
                onClick={() => toggleCurrentlyReading(book)}
              >
                <BookOpen className="w-4 h-4" />
                {isReading ? "Reading" : "Add to Reading"}
              </button>
            </div>

            {downloadUrl ? (
              <a
                href={downloadUrl}
                onClick={handleDownload} // For UX, actual download is href
                download // Suggests browser to download
                target="_blank" // Good fallback for some browsers/MIME types
                rel="noopener noreferrer"
                className={`w-full block bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-2 sm:py-2.5 rounded-lg text-center shadow-lg hover:from-blue-500 hover:to-indigo-500 transition-all mt-auto ${
                  downloading ? "opacity-70 pointer-events-none" : ""
                }`}
              >
                {downloading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin mr-2 h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V8H4v4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Preparing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Download size={18} /> Download ({downloadType})
                  </span>
                )}
              </a>
            ) : (
              <div className="text-red-400 mt-auto font-semibold py-2.5 text-center bg-black/20 rounded-lg text-sm">
                No downloadable formats available.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
