import React, { useState, useEffect } from 'react';
import { Search, Home, Film, Book, Heart, User, Star, ChevronLeft, ChevronRight, Loader, Clock, FileText } from 'lucide-react';
import { fetchMovies, fetchBooks } from './lib/supabase';

// Komponen Bottom Navigation
const BottomNav = ({ currentPage, setCurrentPage }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Beranda' },
    { id: 'movies', icon: Film, label: 'Film' },
    { id: 'books', icon: Book, label: 'Buku' },
    { id: 'favorites', icon: Heart, label: 'Favorit' },
    { id: 'profile', icon: User, label: 'Profil' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50 safe-bottom">
      <div className="max-w-7xl mx-auto flex justify-around items-center h-16">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                currentPage === item.id ? 'text-blue-500' : 'text-gray-400'
              }`}
            >
              <Icon size={24} />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

// Komponen Card untuk Film/Buku
const MediaCard = ({ item, type, onToggleFavorite, isFavorite, onClick }) => {
  return (
    <div 
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-64 bg-gray-700">
        <img 
          src={item.image_url || 'https://via.placeholder.com/300x450?text=No+Image'} 
          alt={item.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(item.id, type);
          }}
          className="absolute top-2 right-2 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
        >
          <Heart 
            size={20} 
            className={isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}
          />
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">{item.title}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
          <Star size={16} className="text-yellow-500 fill-yellow-500" />
          <span>{item.rating || 'N/A'}</span>
        </div>
        <p className="text-gray-400 text-sm line-clamp-1">{type === 'movie' ? item.director : item.author}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs rounded-full">
            {item.genre}
          </span>
          <span className="text-gray-400 text-xs">{item.release_year}</span>
        </div>
      </div>
    </div>
  );
};

// Komponen Pagination
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center justify-center gap-4 my-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 bg-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      <span className="text-white">
        Halaman {currentPage} dari {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 bg-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

// Komponen Detail Modal
const DetailModal = ({ item, type, onClose }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gray-900 rounded-lg max-w-4xl w-full my-8">
        <div className="relative h-96">
          <img 
            src={item.image_url || 'https://via.placeholder.com/300x450?text=No+Image'} 
            alt={item.title}
            className="w-full h-full object-cover rounded-t-lg"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 text-white px-4 py-2 rounded-lg hover:bg-black/70 transition-colors"
          >
            Tutup
          </button>
        </div>
        <div className="p-6">
          <h2 className="text-3xl font-bold text-white mb-4">{item.title}</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Rating</p>
              <div className="flex items-center gap-2">
                <Star size={20} className="text-yellow-500 fill-yellow-500" />
                <span className="text-white text-2xl font-bold">{item.rating || 'N/A'}</span>
                <span className="text-gray-400">/10</span>
              </div>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Tahun Rilis</p>
              <p className="text-white text-2xl font-bold">{item.release_year || 'N/A'}</p>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Genre</p>
              <p className="text-white text-lg font-semibold">{item.genre}</p>
            </div>
            
            {type === 'movie' && item.duration && (
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Durasi</p>
                <div className="flex items-center gap-2">
                  <Clock size={20} className="text-blue-500" />
                  <span className="text-white text-lg font-semibold">{item.duration} menit</span>
                </div>
              </div>
            )}
            
            {type === 'book' && item.pages && (
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Jumlah Halaman</p>
                <div className="flex items-center gap-2">
                  <FileText size={20} className="text-blue-500" />
                  <span className="text-white text-lg font-semibold">{item.pages} hal</span>
                </div>
              </div>
            )}
            
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">{type === 'movie' ? 'Sutradara' : 'Penulis'}</p>
              <p className="text-white text-lg font-semibold">{type === 'movie' ? item.director : item.author}</p>
            </div>
          </div>
          
          {item.description && (
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-white font-semibold text-lg mb-2">Deskripsi</h3>
              <p className="text-gray-300 leading-relaxed">{item.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Loading Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <Loader className="animate-spin text-blue-500" size={48} />
  </div>
);

// Main App Component
export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [movies, setMovies] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState({ movies: [], books: [] });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [currentMoviePage, setCurrentMoviePage] = useState(1);
  const [currentBookPage, setCurrentBookPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const itemsPerPage = 3;

  // Load data dari Supabase
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [moviesData, booksData] = await Promise.all([
        fetchMovies(),
        fetchBooks()
      ]);
      setMovies(moviesData);
      setBooks(booksData);
      setLoading(false);
    };

    loadData();

    // Load favorites dari localStorage
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites ke localStorage
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id, type) => {
    setFavorites(prev => {
      const key = type === 'movie' ? 'movies' : 'books';
      const isFavorite = prev[key].includes(id);
      
      return {
        ...prev,
        [key]: isFavorite 
          ? prev[key].filter(fId => fId !== id)
          : [...prev[key], id]
      };
    });
  };

  const filterItems = (items, type) => {
    return items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (type === 'movie' ? item.director : item.author).toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = selectedGenre === 'all' || item.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    });
  };

  const paginateItems = (items, page) => {
    const start = (page - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  };

  const getGenres = (items) => {
    return ['all', ...new Set(items.map(item => item.genre))];
  };

  const renderHome = () => (
    <div className="pb-20">
      <div className="bg-linear-to-r from-blue-600 to-purple-600 p-8 rounded-lg mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">MediaShelf Archive</h1>
        <p className="text-white/90">Jelajahi koleksi film dan buku favorit Anda</p>
      </div>
      
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Film Populer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {movies.slice(0, 3).map(movie => (
                <MediaCard
                  key={movie.id}
                  item={movie}
                  type="movie"
                  onToggleFavorite={toggleFavorite}
                  isFavorite={favorites.movies.includes(movie.id)}
                  onClick={() => {
                    setSelectedItem(movie);
                    setSelectedType('movie');
                  }}
                />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Buku Populer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.slice(0, 3).map(book => (
                <MediaCard
                  key={book.id}
                  item={book}
                  type="book"
                  onToggleFavorite={toggleFavorite}
                  isFavorite={favorites.books.includes(book.id)}
                  onClick={() => {
                    setSelectedItem(book);
                    setSelectedType('book');
                  }}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );

  const renderCatalog = (items, type, currentPage, setPage) => {
    const filteredItems = filterItems(items, type);
    const paginatedItems = paginateItems(filteredItems, currentPage);
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const genres = getGenres(items);

    return (
      <div className="pb-20">
        <h1 className="text-3xl font-bold text-white mb-6">
          Katalog {type === 'movie' ? 'Film' : 'Buku'}
        </h1>
        
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari judul atau penulis/sutradara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {genres.map(genre => (
              <button
                key={genre}
                onClick={() => {
                  setSelectedGenre(genre);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedGenre === genre
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {genre === 'all' ? 'Semua Genre' : genre}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedItems.map(item => (
                <MediaCard
                  key={item.id}
                  item={item}
                  type={type}
                  onToggleFavorite={toggleFavorite}
                  isFavorite={type === 'movie' ? favorites.movies.includes(item.id) : favorites.books.includes(item.id)}
                  onClick={() => {
                    setSelectedItem(item);
                    setSelectedType(type);
                  }}
                />
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">Tidak ada hasil ditemukan</p>
              </div>
            )}

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </div>
    );
  };

  const renderFavorites = () => {
    const favoriteMovies = movies.filter(m => favorites.movies.includes(m.id));
    const favoriteBooks = books.filter(b => favorites.books.includes(b.id));

    return (
      <div className="pb-20">
        <h1 className="text-3xl font-bold text-white mb-6">Favorit Saya</h1>
        
        {favoriteMovies.length === 0 && favoriteBooks.length === 0 ? (
          <div className="text-center py-12">
            <Heart size={64} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg">Belum ada favorit</p>
            <p className="text-gray-500 mt-2">Tambahkan film atau buku ke favorit Anda!</p>
          </div>
        ) : (
          <>
            {favoriteMovies.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Film Favorit</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteMovies.map(movie => (
                    <MediaCard
                      key={movie.id}
                      item={movie}
                      type="movie"
                      onToggleFavorite={toggleFavorite}
                      isFavorite={true}
                      onClick={() => {
                        setSelectedItem(movie);
                        setSelectedType('movie');
                      }}
                    />
                  ))}
                </div>
              </section>
            )}

            {favoriteBooks.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">Buku Favorit</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteBooks.map(book => (
                    <MediaCard
                      key={book.id}
                      item={book}
                      type="book"
                      onToggleFavorite={toggleFavorite}
                      isFavorite={true}
                      onClick={() => {
                        setSelectedItem(book);
                        setSelectedType('book');
                      }}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    );
  };

  const renderProfile = () => (
    <div className="pb-20">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <div className="mb-6">
            <img
              src="https://ui-avatars.com/api/?name=Ariq+Fariz&size=200&background=2563eb&color=fff"
              alt="Profil"
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-blue-600"
            />
            <h1 className="text-3xl font-bold text-white mb-2">Ariq Fariz Fakhri Irawan</h1>
            <p className="text-gray-400 text-lg">NIM: 21120123130095</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-gray-900 p-4 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Total Film Favorit</p>
              <p className="text-white text-2xl font-bold">{favorites.movies.length}</p>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Total Buku Favorit</p>
              <p className="text-white text-2xl font-bold">{favorites.books.length}</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-900 rounded-lg text-left">
            <h3 className="text-white font-semibold mb-2">Tentang MediaShelf Archive</h3>
            <p className="text-gray-400 text-sm">
              MediaShelf Archive adalah aplikasi web progresif untuk menjelajahi dan mengelola koleksi film dan buku favorit Anda dengan fitur lengkap.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {currentPage === 'home' && renderHome()}
        {currentPage === 'movies' && renderCatalog(movies, 'movie', currentMoviePage, setCurrentMoviePage)}
        {currentPage === 'books' && renderCatalog(books, 'book', currentBookPage, setCurrentBookPage)}
        {currentPage === 'favorites' && renderFavorites()}
        {currentPage === 'profile' && renderProfile()}
      </div>

      <BottomNav currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      {selectedItem && (
        <DetailModal
          item={selectedItem}
          type={selectedType}
          onClose={() => {
            setSelectedItem(null);
            setSelectedType(null);
          }}
        />
      )}
    </div>
  );
}