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
