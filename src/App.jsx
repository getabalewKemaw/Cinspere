import React, { useState, useEffect, useRef, useCallback } from 'react';

import Search from './components/Search';
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import NavBar from './components/NavBar';
import Favorites from './pages/Favorites';
import Home from './pages/Home';

import Login from './components/Login';
import { AuthProvider } from './context/AuthContext';// New import
import { Routes, Route } from 'react-router-dom';



const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessages, setErrorMessages] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [movieList, setMovieList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoggedInOpen, setIsLoggedInOpen] = useState(false);

  const observer = useRef(null);
  const sentinelRef = useRef(null);
  const lastFetchTime = useRef(0);

  const fetchMovies = useCallback(async (currentPage, term = '') => {
    const isInitialLoad = currentPage === 1;
    if (isInitialLoad) {
      setIsLoading(true);
    } else {
      setIsFetchingMore(true);
    }
    setErrorMessages('');

    try {
      if (!API_KEY) {
        throw new Error('TMDB API key is missing. Please set VITE_TMDB_API_KEY in .env');
      }

      // Rate limiting: Ensure 200ms between requests
      const now = Date.now();
      if (now - lastFetchTime.current < 200) {
        await new Promise((resolve) => setTimeout(resolve, 200 - (now - lastFetchTime.current)));
      }
      lastFetchTime.current = Date.now();

      const endpoint = term
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(term)}&page=${currentPage}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${currentPage}`;
      const response = await fetch(endpoint, options);
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
        throw new Error(`TMDB API error: ${response.statusText} (${response.status})`);
      }
      const data = await response.json();
      if (data.success === false) {
        setErrorMessages(data.status_message || 'Failed to fetch movies');
        return;
      }
      setMovieList((prev) => (isInitialLoad ? data.results || [] : [...prev, ...(data.results || [])]));
      setTotalPages(data.total_pages || 0);
    } catch (error) {
      console.error(`Error fetching movies: ${error.message}`);
      setErrorMessages(error.message || 'Failed to connect to the movie database');
    } finally {
      if (isInitialLoad) {
        setIsLoading(false);
      }
      setIsFetchingMore(false);
    }
  }, []);
  const fetchTrendingMovie = async () => {
    setIsLoading(true);
    setErrorMessages("");
    try {
      const endpoint = `${API_BASE_URL}/trending/movie/day?language=en-US`;
      const response = await fetch(endpoint, options);
      if (!response.ok) {
        throw new Error("error fetching the trending movies plaease try againg later ")

      }
      const result = await response.json();
      setTrendingMovies(result.results || []);
      setIsLoading(false);
      setErrorMessages("");



    } catch (error) {
      console.error(`error fetching the movies ${error}`)
      setErrorMessages("Error fetching the trendong movies plaease try again");


    }

  }

  useEffect(() => {
    setMovieList([]);
    setPage(1);
    fetchMovies(1, searchTerm);
  }, [searchTerm, fetchMovies]);
  useEffect(() => {
    fetchTrendingMovie();
  }, [])


  useEffect(() => {
    if (page > 1) {
      fetchMovies(page, searchTerm);
    }
  }, [page, searchTerm, fetchMovies]);
  console.log(movieList.length);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingMore && page < totalPages && movieList.length > 0) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (sentinelRef.current) {
      observer.current.observe(sentinelRef.current);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [isFetchingMore, page, totalPages, movieList]);

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };



  return (
    <AuthProvider>
    <main>
     
      <div className="pattern" />
      <div className="wrapper">
        <header>
       <NavBar onLoginClick={() => setIsLoggedInOpen(true)} />
         
            <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>

          <img src="./hero.png" alt="hero banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> you enjoy without
            the hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        </header>

        {/*       {
          trendingMovies.length>0 &&(
            <section>
             <h1 className='text-white'> Trending movies 🌲🌲🌲</h1>
              <TrendingMovies movies={trendingMovies} onClick={(movie)=>setSelectedMovie(movie)}/>
            </section>
          )

        } */}
        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img
                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : '/no-movie.png'}
                    alt={movie.title}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}

   <section className="all-movies">
          <h2>{searchTerm ? 'Search Results' : 'All Movies'}</h2>
          {isLoading ? (
            <Spinner isFullScreen={true} />
          ) : errorMessages ? (
            <p className="text-red-500 text-center">{errorMessages}</p>
          ) : movieList.length === 0 && !isLoading ? (
            <p className="text-gray-100 text-center">No movies found</p>
          ) : (
            <>
              <ul>
                {movieList.map((movie) => (
                  <li key={movie.id}>
                    <MovieCard movie={movie} onClick={() => setSelectedMovie(movie)} />
                  </li>
                ))}
              </ul>
              <div ref={sentinelRef} className="h-10" />
              {isFetchingMore && <Spinner isFullScreen={false} />}
            </>
          )}
        </section>
      </div>

      {selectedMovie && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-dark-100 rounded-2xl shadow-inner shadow-light-100/10 max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 text-light-100 text-2xl hover:text-light-200"
              aria-label="Close modal"
            >
              &times;
            </button>
            <img
              src={
                selectedMovie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`
                  : '/no-movie.png'
              }
              alt={selectedMovie.title}
              className="rounded-lg h-auto w-full max-w-md mx-auto mb-4"
            />
            <h2 className="text-white text-2xl font-bold mb-2 line-clamp-2">{selectedMovie.title}</h2>
            <div className="content flex flex-row items-center flex-wrap gap-2 mb-4">
              <div className="rating flex flex-row items-center gap-1">
                <img src="star.svg" alt="Star Icon" className="size-4" />
                <p className="text-white font-bold">
                  {selectedMovie.vote_average?.toFixed(1) || 'N/A'}/10
                </p>
              </div>
              <span>•</span>
              <p className="lang capitalize text-gray-100 font-medium">
                {selectedMovie.original_language || 'N/A'}
              </p>
              <span>•</span>
              <p className="year text-gray-100 font-medium">
                {selectedMovie.release_date?.split('-')[0] || 'N/A'}
              </p>
            </div>
            <p className="text-gray-100 mb-4">
              <strong>Overview:</strong> {selectedMovie.overview || 'No description available.'}
            </p>
            <p className="text-gray-100 mb-4">
              <strong>Release Date:</strong> {selectedMovie.release_date || 'Unknown'}
            </p>
            {selectedMovie.genres && (
              <p className="text-gray-100 mb-4">
                <strong>Genres:</strong> {selectedMovie.genres.map((g) => g.name).join(', ') || 'N/A'}
              </p>
            )}
            <button
              onClick={handleCloseModal}
              className="bg-light-100/10 text-light-100 px-4 py-2 rounded-lg hover:bg-light-100/20 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {isLoggedInOpen && <Login onClose={() => setIsLoggedInOpen(false)} />}

    </main>
    </AuthProvider>
  );
};

export default App;

