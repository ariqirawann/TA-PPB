import React, { useState } from 'react';
import { Plus, Edit, Trash2, X, Save } from 'lucide-react';
import { addMovie, updateMovie, deleteMovie, addBook, updateBook, deleteBook } from '../lib/supabase';

export const MovieForm = ({ movie, onSave, onCancel }) => {
  const [formData, setFormData] = useState(movie || {
    title: '',
    director: '',
    genre: '',
    rating: '',
    release_year: '',
    duration: '',
    image_url: '',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const processedData = {
      ...formData,
      rating: formData.rating ? parseFloat(formData.rating) : null,
      release_year: formData.release_year ? parseInt(formData.release_year) : null,
      duration: formData.duration ? parseInt(formData.duration) : null
    };
    
    const result = movie 
      ? await updateMovie(movie.id, processedData)
      : await addMovie(processedData);
    
    if (result.success) {
      onSave(result.data);
    } else {
      alert('Error: ' + result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Judul Film *"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          required
        />
        <input
          type="text"
          placeholder="Sutradara"
          value={formData.director}
          onChange={(e) => setFormData({...formData, director: e.target.value})}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Genre"
          value={formData.genre}
          onChange={(e) => setFormData({...formData, genre: e.target.value})}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
        />
        <input
          type="number"
          step="0.1"
          placeholder="Rating (0-10)"
          value={formData.rating}
          onChange={(e) => setFormData({...formData, rating: e.target.value})}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
        />
        <input
          type="number"
          placeholder="Tahun Rilis"
          value={formData.release_year}
          onChange={(e) => setFormData({...formData, release_year: e.target.value})}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
        />
        <input
          type="number"
          placeholder="Durasi (menit)"
          value={formData.duration}
          onChange={(e) => setFormData({...formData, duration: e.target.value})}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
        />
      </div>
      <input
        type="url"
        placeholder="URL Poster"
        value={formData.image_url}
        onChange={(e) => setFormData({...formData, image_url: e.target.value})}
        className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
      />
      <textarea
        placeholder="Deskripsi"
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
        rows="4"
        className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Save size={20} />
          {movie ? 'Update' : 'Tambah'} Film
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Batal
        </button>
      </div>
    </form>
  );
};

export const BookForm = ({ book, onSave, onCancel }) => {
  const [formData, setFormData] = useState(book || {
    title: '',
    author: '',
    genre: '',
    rating: '',
    release_year: '',
    pages: '',
    image_url: '',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const processedData = {
      ...formData,
      rating: formData.rating ? parseFloat(formData.rating) : null,
      release_year: formData.release_year ? parseInt(formData.release_year) : null,
      pages: formData.pages ? parseInt(formData.pages) : null
    };
    
    const result = book 
      ? await updateBook(book.id, processedData)
      : await addBook(processedData);
    
    if (result.success) {
      onSave(result.data);
    } else {
      alert('Error: ' + result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Judul Buku *"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          required
        />
        <input
          type="text"
          placeholder="Penulis"
          value={formData.author}
          onChange={(e) => setFormData({...formData, author: e.target.value})}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Genre"
          value={formData.genre}
          onChange={(e) => setFormData({...formData, genre: e.target.value})}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
        />
        <input
          type="number"
          step="0.1"
          placeholder="Rating (0-5)"
          value={formData.rating}
          onChange={(e) => setFormData({...formData, rating: e.target.value})}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
        />
        <input
          type="number"
          placeholder="Tahun Terbit"
          value={formData.release_year}
          onChange={(e) => setFormData({...formData, release_year: e.target.value})}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
        />
        <input
          type="number"
          placeholder="Jumlah Halaman"
          value={formData.pages}
          onChange={(e) => setFormData({...formData, pages: e.target.value})}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
        />
      </div>
      <input
        type="url"
        placeholder="URL Cover"
        value={formData.image_url}
        onChange={(e) => setFormData({...formData, image_url: e.target.value})}
        className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
      />
      <textarea
        placeholder="Deskripsi"
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
        rows="4"
        className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Save size={20} />
          {book ? 'Update' : 'Tambah'} Buku
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Batal
        </button>
      </div>
    </form>
  );
};

export const AdminPanel = ({ movies, books, onUpdate, onLogout }) => {
  const [activeTab, setActiveTab] = useState('movies');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleDelete = async (id, type) => {
    if (!confirm('Yakin ingin menghapus item ini?')) return;
    
    const result = type === 'movie' 
      ? await deleteMovie(id)
      : await deleteBook(id);
    
    if (result.success) {
      await onUpdate(); 
      alert('Berhasil dihapus!');
    } else {
      alert('Error: ' + result.error);
    }
  };

  const handleSave = async () => {
    setShowForm(false);
    setEditingItem(null);
    await onUpdate(); 
    alert('Berhasil disimpan!');
  };

  return (
    <div className="pb-20">
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
          <button
            onClick={onLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('movies')}
          className={`flex-1 px-4 py-3 rounded-lg transition-colors ${
            activeTab === 'movies'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          Kelola Film ({movies.length})
        </button>
        <button
          onClick={() => setActiveTab('books')}
          className={`flex-1 px-4 py-3 rounded-lg transition-colors ${
            activeTab === 'books'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          Kelola Buku ({books.length})
        </button>
      </div>

      {!showForm && (
        <button
          onClick={() => {
            setShowForm(true);
            setEditingItem(null);
          }}
          className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mb-6"
        >
          <Plus size={20} />
          Tambah {activeTab === 'movies' ? 'Film' : 'Buku'} Baru
        </button>
      )}

      {showForm && (
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">
            {editingItem ? 'Edit' : 'Tambah'} {activeTab === 'movies' ? 'Film' : 'Buku'}
          </h2>
          {activeTab === 'movies' ? (
            <MovieForm
              movie={editingItem}
              onSave={handleSave}
              onCancel={() => {
                setShowForm(false);
                setEditingItem(null);
              }}
            />
          ) : (
            <BookForm
              book={editingItem}
              onSave={handleSave}
              onCancel={() => {
                setShowForm(false);
                setEditingItem(null);
              }}
            />
          )}
        </div>
      )}

      <div className="space-y-4">
        {(activeTab === 'movies' ? movies : books).map((item) => (
          <div key={item.id} className="bg-gray-800 rounded-lg p-4 flex gap-4">
            <img
              src={item.image_url || 'https://via.placeholder.com/100x150?text=No+Image'}
              alt={item.title}
              className="w-24 h-36 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="text-white font-bold text-lg mb-1">{item.title}</h3>
              <p className="text-gray-400 text-sm mb-2">
                {activeTab === 'movies' ? item.director : item.author}
              </p>
              <div className="flex gap-2 text-sm">
                <span className="bg-blue-600 text-white px-2 py-1 rounded">{item.genre}</span>
                <span className="bg-yellow-600 text-white px-2 py-1 rounded">⭐ {item.rating}</span>
                <span className="bg-gray-700 text-white px-2 py-1 rounded">{item.release_year}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setEditingItem(item);
                  setShowForm(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition-colors"
              >
                <Edit size={20} />
              </button>
              <button
                onClick={() => handleDelete(item.id, activeTab === 'movies' ? 'movie' : 'book')}
                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};