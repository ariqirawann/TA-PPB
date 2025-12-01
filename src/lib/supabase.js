import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL dan Anon Key belum dikonfigurasi di file .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const fetchMovies = async () => {
  try {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .order('rating', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
};

export const fetchMovieById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching movie:', error);
    return null;
  }
};

export const addMovie = async (movieData) => {
  try {
    const { data, error } = await supabase
      .from('movies')
      .insert([movieData])
      .select();
    
    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error adding movie:', error);
    return { success: false, error: error.message };
  }
};

export const updateMovie = async (id, movieData) => {
  try {
    const { data, error } = await supabase
      .from('movies')
      .update(movieData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error updating movie:', error);
    return { success: false, error: error.message };
  }
};

export const deleteMovie = async (id) => {
  try {
    const { error } = await supabase
      .from('movies')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting movie:', error);
    return { success: false, error: error.message };
  }
};

export const fetchBooks = async () => {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('rating', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
};

export const fetchBookById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching book:', error);
    return null;
  }
};

export const addBook = async (bookData) => {
  try {
    const { data, error } = await supabase
      .from('books')
      .insert([bookData])
      .select();
    
    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error adding book:', error);
    return { success: false, error: error.message };
  }
};

export const updateBook = async (id, bookData) => {
  try {
    const { data, error } = await supabase
      .from('books')
      .update(bookData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error updating book:', error);
    return { success: false, error: error.message };
  }
};

export const deleteBook = async (id) => {
  try {
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting book:', error);
    return { success: false, error: error.message };
  }
};

export const fetchMovieReviews = async (movieId) => {
  try {
    const { data, error } = await supabase
      .from('movie_reviews')
      .select('*')
      .eq('movie_id', movieId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching movie reviews:', error);
    return [];
  }
};

export const fetchBookReviews = async (bookId) => {
  try {
    const { data, error } = await supabase
      .from('book_reviews')
      .select('*')
      .eq('book_id', bookId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching book reviews:', error);
    return [];
  }
};

export const addMovieReview = async (reviewData) => {
  try {
    const { data, error } = await supabase
      .from('movie_reviews')
      .insert([reviewData])
      .select();
    
    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error adding movie review:', error);
    return { success: false, error: error.message };
  }
};

export const addBookReview = async (reviewData) => {
  try {
    const { data, error } = await supabase
      .from('book_reviews')
      .insert([reviewData])
      .select();
    
    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error adding book review:', error);
    return { success: false, error: error.message };
  }
};

export const loginAdmin = async (username, password) => {
  try {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('username', username)
      .eq('password_hash', password)
      .single();
    
    if (error) throw error;
    return { success: true, user: data, role: 'admin' };
  } catch (error) {
    console.error('Error logging in admin:', error);
    return { success: false, error: 'Invalid username or password' };
  }
};

export const loginUser = async (username, password) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password_hash', password) 
      .single();
    
    if (error) throw error;
    return { success: true, user: data, role: 'user' };
  } catch (error) {
    console.error('Error logging in user:', error);
    return { success: false, error: 'Invalid username or password' };
  }
};

export const login = async (username, password) => {
  const adminResult = await loginAdmin(username, password);
  if (adminResult.success) {
    return adminResult;
  }
  
  const userResult = await loginUser(username, password);
  return userResult;
};