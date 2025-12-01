import React, { useState, useEffect } from 'react';
import { Search, Home, Film, Book, Heart, User, Star, ChevronLeft, ChevronRight, Loader, Clock, FileText, ChevronDown, ChevronUp, Send, Shield, LogOut } from 'lucide-react';
import { fetchMovies, fetchBooks, fetchMovieReviews, fetchBookReviews, addMovieReview, addBookReview, login } from './lib/supabase';
import { AdminPanel } from './components/AdminPanel';

const BottomNav = ({ currentPage, setCurrentPage, userRole, onAdminClick, onLogout }) => {
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
        
        {userRole === 'admin' ? (
          <button
            onClick={onAdminClick}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              currentPage === 'admin' ? 'text-red-500' : 'text-gray-400'
            }`}
          >
            <Shield size={24} />
            <span className="text-xs mt-1">Admin</span>
          </button>
        ) : (
          <button
            onClick={onLogout}
            className="flex flex-col items-center justify-center flex-1 h-full transition-colors text-gray-400 hover:text-red-500"
          >
            <LogOut size={24} />
            <span className="text-xs mt-1">Logout</span>
          </button>
        )}
      </div>
    </nav>
  );
};

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

const DetailModal = ({ item, type, onClose, reviews, onReviewAdded }) => {
  if (!item) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-gray-900 rounded-lg max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-64 md:h-96">
          <img 
            src={item.image_url || 'https://via.placeholder.com/300x450?text=No+Image'} 
            alt={item.title}
            className="w-full h-full object-cover rounded-t-lg"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors font-semibold shadow-lg z-10"
          >
            ✕ Tutup
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
                <span className="text-gray-400">/{type === 'movie' ? '10' : '5'}</span>
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
            <div className="bg-gray-800 p-4 rounded-lg mb-6">
              <h3 className="text-white font-semibold text-lg mb-2">Deskripsi</h3>
              <p className="text-gray-300 leading-relaxed">{item.description}</p>
            </div>
          )}

          <div className="bg-gray-800 p-4 rounded-lg mb-4">
            <h3 className="text-white font-semibold text-lg mb-4">
              User Reviews ({reviews.length})
            </h3>
            
            <ReviewForm 
              itemId={item.id} 
              type={type} 
              onReviewAdded={onReviewAdded}
            />

            <div className="mt-4 space-y-3 max-h-96 overflow-y-auto">
              {reviews.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Belum ada review. Jadilah yang pertama!</p>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="bg-gray-700 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-semibold text-sm">{review.user_name}</span>
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                        <span className="text-yellow-500 font-semibold text-sm">
                          {review.rating}/{type === 'movie' ? '10' : '5'}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{review.review_text}</p>
                    <p className="text-gray-500 text-xs mt-2">
                      {new Date(review.created_at).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <Loader className="animate-spin text-blue-500" size={48} />
  </div>
);

const LoginScreen = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await login(username, password);
    
    if (result.success) {
      onLogin(result.user, result.role);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-4">
            <Book size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">MediaShelf Archive</h1>
          <p className="text-gray-400">Jelajahi koleksi film dan buku favorit Anda</p>
        </div>

        <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-800">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Login</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none transition-colors"
                required
                autoFocus
              />
            </div>
            
            <div>
              <label className="block text-gray-400 text-sm mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none transition-colors"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-3 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Loading...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="text-gray-500 text-xs mb-3 text-center">Demo Credentials:</p>
            <div className="space-y-2 text-xs">
              <div className="bg-gray-800/50 p-3 rounded-lg">
                <p className="text-gray-400 mb-1">👑 <span className="font-semibold text-yellow-500">Admin:</span></p>
                <p className="text-gray-300">Username: <code className="bg-gray-950 px-2 py-1 rounded">admin</code></p>
                <p className="text-gray-300">Password: <code className="bg-gray-950 px-2 py-1 rounded">admin123</code></p>
              </div>
              <div className="bg-gray-800/50 p-3 rounded-lg">
                <p className="text-gray-400 mb-1">👤 <span className="font-semibold text-blue-500">User:</span></p>
                <p className="text-gray-300">Username: <code className="bg-gray-950 px-2 py-1 rounded">ariqirawan</code></p>
                <p className="text-gray-300">Password: <code className="bg-gray-950 px-2 py-1 rounded">user123</code></p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          © 2024 MediaShelf Archive. All rights reserved.
        </p>
      </div>
    </div>
  );
};

const ReviewForm = ({ itemId, type, onReviewAdded }) => {
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const maxRating = type === 'movie' ? 10 : 5;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const reviewData = {
      [`${type}_id`]: itemId,
      user_name: userName,
      rating: parseFloat(rating),
      review_text: reviewText
    };

    const result = type === 'movie'
      ? await addMovieReview(reviewData)
      : await addBookReview(reviewData);

    if (result.success) {
      setUserName('');
      setRating('');
      setReviewText('');
      onReviewAdded();
      alert('Review berhasil ditambahkan!');
    } else {
      alert('Error: ' + result.error);
    }

    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-white font-semibold mb-3">Tulis Review Anda</h3>
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Nama Anda"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
          required
        />
        <input
          type="number"
          step="0.1"
          min="0"
          max={maxRating}
          placeholder={`Rating (0-${maxRating})`}
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
          required
        />
        <textarea
          placeholder="Tulis review Anda..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows="3"
          className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
          required
        />
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <Send size={16} />
          {submitting ? 'Mengirim...' : 'Kirim Review'}
        </button>
      </div>
    </form>
  );
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); 
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [movies, setMovies] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('mediashelf_favorites');
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log('✅ Favorites loaded from localStorage:', parsed);
        return parsed;
      }
    } catch (error) {
      console.error('❌ Error loading favorites:', error);
    }
    console.log('ℹ️ No saved favorites, using default');
    return { movies: [], books: [] };
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [currentMoviePage, setCurrentMoviePage] = useState(1);
  const [currentBookPage, setCurrentBookPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const itemsPerPage = 3;

  useEffect(() => {
    if (isAuthenticated) {
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
    }
  }, [isAuthenticated]);

  useEffect(() => {
    try {
      localStorage.setItem('mediashelf_favorites', JSON.stringify(favorites));
      console.log('💾 Favorites saved to localStorage:', favorites);
    } catch (error) {
      console.error('❌ Error saving favorites:', error);
    }
  }, [favorites]);

  const toggleFavorite = (id, type) => {
    console.log('🔄 Toggling favorite:', { id, type });
    
    setFavorites(prev => {
      const key = type === 'movie' ? 'movies' : 'books';
      const isFavorite = prev[key].includes(id);
      
      const newFavorites = {
        ...prev,
        [key]: isFavorite 
          ? prev[key].filter(fId => fId !== id)
          : [...prev[key], id]
      };
      
      console.log('📝 New favorites state:', newFavorites);
      return newFavorites;
    });
  };

  const loadReviews = async (itemId, type) => {
    const data = type === 'movie'
      ? await fetchMovieReviews(itemId)
      : await fetchBookReviews(itemId);
    setReviews(data);
  };

  const handleItemClick = async (item, type) => {
    setSelectedItem(item);
    setSelectedType(type);
    await loadReviews(item.id, type);
  };

  const handleReviewAdded = async () => {
    if (selectedItem && selectedType) {
      await loadReviews(selectedItem.id, selectedType);
    }
  };

  const handleLogin = async (user, role) => {
    setCurrentUser(user);
    setUserRole(role);
    setIsAuthenticated(true);
    setIsAdmin(role === 'admin');
    
    await refreshData();
    
    console.log(`✅ Login successful as ${role}:`, user.username);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setCurrentUser(null);
    setIsAdmin(false);
    setCurrentPage('home');
    console.log('👋 Logged out');
  };

  const handleAdminClick = () => {
    setCurrentPage('admin');
  };

  const refreshData = async () => {
    setLoading(true);
    const [moviesData, booksData] = await Promise.all([
      fetchMovies(),
      fetchBooks()
    ]);
    setMovies(moviesData);
    setBooks(booksData);
    setLoading(false);
    
    if (selectedItem && selectedType) {
      const updatedItem = selectedType === 'movie' 
        ? moviesData.find(m => m.id === selectedItem.id)
        : booksData.find(b => b.id === selectedItem.id);
      
      if (updatedItem) {
        setSelectedItem(updatedItem);
      }
    }
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
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-lg mb-8">
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
                  onClick={() => handleItemClick(movie, 'movie')}
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
                  onClick={() => handleItemClick(book, 'book')}
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
                  onClick={() => handleItemClick(item, type)}
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

          <div className="mt-6 border border-gray-700 rounded-lg overflow-hidden">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full bg-gray-900 hover:bg-gray-800 p-4 flex items-center justify-between transition-colors"
            >
              <span className="text-white font-semibold">🔧 Advanced</span>
              {showAdvanced ? (
                <ChevronUp className="text-gray-400" size={20} />
              ) : (
                <ChevronDown className="text-gray-400" size={20} />
              )}
            </button>
            
            {showAdvanced && (
              <div className="p-4 bg-blue-900/20 border-t border-gray-700">
                <h3 className="text-blue-300 font-semibold mb-3 text-sm">Debug Information</h3>
                <div className="space-y-2 text-sm">
                  <button
                    onClick={() => {
                      const saved = localStorage.getItem('mediashelf_favorites');
                      console.log('📦 LocalStorage raw data:', saved);
                      console.log('📦 Parsed data:', saved ? JSON.parse(saved) : null);
                      alert('Check browser console (F12) for localStorage data');
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors text-sm"
                  >
                    Check localStorage
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem('mediashelf_favorites');
                      setFavorites({ movies: [], books: [] });
                      console.log('🗑️ Favorites cleared from localStorage');
                      alert('All favorites cleared! Refresh page to see effect.');
                    }}
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors text-sm"
                  >
                    Clear All Favorites
                  </button>
                  <div className="bg-gray-900 p-3 rounded text-gray-300 font-mono text-xs overflow-x-auto">
                    <p className="text-gray-500 mb-1">Current State:</p>
                    <pre>{JSON.stringify(favorites, null, 2)}</pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {!isAuthenticated ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <div className="min-h-screen bg-gray-950 text-white">
          <div className="max-w-7xl mx-auto px-4 py-6">
            {currentPage === 'home' && renderHome()}
            {currentPage === 'movies' && renderCatalog(movies, 'movie', currentMoviePage, setCurrentMoviePage)}
            {currentPage === 'books' && renderCatalog(books, 'book', currentBookPage, setCurrentBookPage)}
            {currentPage === 'favorites' && renderFavorites()}
            {currentPage === 'profile' && renderProfile()}
            {currentPage === 'admin' && isAdmin && (
              <AdminPanel 
                movies={movies}
                books={books}
                onUpdate={refreshData}
                onLogout={handleLogout}
              />
            )}
          </div>

          <BottomNav 
            currentPage={currentPage} 
            setCurrentPage={setCurrentPage}
            userRole={userRole}
            onAdminClick={handleAdminClick}
            onLogout={handleLogout}
          />
          
          {selectedItem && (
            <DetailModal
              item={selectedItem}
              type={selectedType}
              reviews={reviews}
              onReviewAdded={handleReviewAdded}
              onClose={() => {
                setSelectedItem(null);
                setSelectedType(null);
                setReviews([]);
              }}
            />
          )}
        </div>
      )}
    </>
  );
}