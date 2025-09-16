import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

function Education() {
  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fullScreenVideo, setFullScreenVideo] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const refreshIntervalRef = useRef(null);

  const API_KEY = "AIzaSyCC_75r3ZBmgc9XaTzxRaMyWNSG6WYfA7s"; // Replace with your YouTube Data API key

  const financeQueries = [
    "finance tips shorts",
    "investing basics shorts",
    "money management shorts",
    "stock market shorts",
    "cryptocurrency shorts",
    "personal finance shorts",
    "trading tips shorts",
    "financial education shorts",
    "budgeting tips shorts",
    "passive income shorts",
  ];

  const getRandomFinanceQuery = () => {
    const randomIndex = Math.floor(Math.random() * financeQueries.length);
    return financeQueries[randomIndex];
  };

  const fetchFinanceShorts = async (query = null, showLoader = true) => {
    if (showLoader) setLoading(true);

    try {
      const searchQuery = query || getRandomFinanceQuery();
      const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
        params: {
          part: "snippet",
          maxResults: 20,
          q: searchQuery,
          type: "video",
          videoDuration: "short",
          order: "relevance",
          publishedAfter: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          key: API_KEY,
        },
      });

      const videos = response.data.items
        .filter((item) => item.id.videoId && item.snippet.thumbnails?.medium?.url)
        .map((item) => ({
          id: item.id.videoId,
          title: item.snippet.title || "Untitled",
          thumbnail: item.snippet.thumbnails.medium.url,
          channelTitle: item.snippet.channelTitle || "Unknown Channel",
          publishedAt: item.snippet.publishedAt || new Date().toISOString(),
        }));

      setShorts(videos);
    } catch (error) {
      console.error("Error fetching Finance Shorts:", error);
      alert("Failed to fetch videos. Please check your API key and internet connection.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFinanceShorts();
  }, []);

  useEffect(() => {
    refreshIntervalRef.current = setInterval(() => {
      fetchFinanceShorts(null, false);
    }, 10 * 60 * 1000);

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchFinanceShorts();
  }, []);

  const openFullScreen = (video, index) => {
    setFullScreenVideo(video);
    setCurrentIndex(index);
  };

  const closeFullScreen = () => {
    setFullScreenVideo(null);
    setCurrentIndex(0);
  };

  const onVideoEnd = () => {
    if (currentIndex < shorts.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFullScreenVideo(shorts[currentIndex + 1]);
    } else {
      fetchFinanceShorts(null, false);
      closeFullScreen();
    }
  };

  const renderSmallItem = ({ item, index }) => (
    <div
      className="relative bg-emerald-50 rounded-xl overflow-hidden border border-emerald-200 cursor-pointer hover:shadow-lg transition-all duration-300 group hover:scale-105 hover:border-amber-300"
      onClick={() => openFullScreen(item, index)}
    >
      {/* Thumbnail container */}
      <div className="relative w-full h-48 overflow-hidden rounded-t-xl">
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {/* Play overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-amber-500 rounded-full p-3 shadow-lg">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
        {/* Gold accent line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      {/* Content */}
      <div className="p-4 bg-emerald-50">
        <h3 className="text-emerald-800 text-sm font-semibold line-clamp-2 mb-2 group-hover:text-emerald-900 transition-colors duration-300" title={item.title}>
          {item.title}
        </h3>
        <p className="text-amber-700 text-xs font-medium line-clamp-1" title={item.channelTitle}>
          {item.channelTitle}
        </p>
      </div>
    </div>
  );

  const renderFullScreen = () => {
    if (!fullScreenVideo) return null;

    return (
      <div className="fixed inset-0 bg-emerald-900 flex justify-center items-center z-50">
        <iframe
          src={`https://www.youtube.com/embed/${fullScreenVideo.id}?autoplay=1&rel=0&modestbranding=1&showinfo=0&playsinline=1&controls=1`}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onEnded={onVideoEnd}
        ></iframe>
        
        {/* Video info overlay */}
        <div className="absolute bottom-20 left-5 right-5 bg-emerald-800/90 backdrop-blur-sm p-6 rounded-xl border border-amber-300/30 shadow-xl">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-white text-lg font-bold line-clamp-2 mb-2" title={fullScreenVideo.title}>
                {fullScreenVideo.title}
              </h2>
              <p className="text-amber-300 text-base font-medium" title={fullScreenVideo.channelTitle}>
                {fullScreenVideo.channelTitle}
              </p>
            </div>
            <div className="bg-amber-500 px-3 py-1 rounded-full ml-4">
              <span className="text-emerald-900 text-sm font-bold">
                {currentIndex + 1} / {shorts.length}
              </span>
            </div>
          </div>
          <div className="w-full h-1 bg-emerald-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / shorts.length) * 100}%` }}
            />
          </div>
        </div>
        
        {/* Close button */}
        <button
          onClick={closeFullScreen}
          className="absolute top-10 right-10 bg-emerald-700/80 backdrop-blur-sm rounded-full p-3 text-amber-300 hover:bg-emerald-600 hover:text-white transition-all duration-300 shadow-lg"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    );
  };

  if (loading && shorts.length === 0) {
    return (
      <div className="min-h-screen bg-emerald-50 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-amber-500"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-b-amber-400 animate-pulse"></div>
        </div>
        <p className="text-emerald-800 mt-6 text-lg font-medium">Loading Finance Education...</p>
        <p className="text-amber-700 text-sm">Discovering the best financial content for you</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-100 to-emerald-200 border-b border-emerald-300 p-6 mb-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-amber-500 rounded-full p-3 mr-4 shadow-lg">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-emerald-800">
              Finance Education
            </h1>
          </div>
          <p className="text-emerald-700 text-lg font-medium">
            Expert financial insights in bite-sized videos
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full mx-auto mt-4"></div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6">
        {shorts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-emerald-100 rounded-full p-8 mb-6 border border-emerald-200">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-600">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12" y2="16"></line>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-emerald-800 mb-2">No Content Available</h3>
            <p className="text-amber-700 text-center mb-6">
              Unable to load financial education videos at the moment
            </p>
            <button
              onClick={handleRefresh}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Video Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
              {shorts.map((item, index) => (
                <div key={item.id}>
                  {renderSmallItem({ item, index })}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="text-center py-8 border-t border-emerald-200">
              <p className="text-emerald-700 font-medium mb-2">
                Showing {shorts.length} educational videos
              </p>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-emerald-700 hover:bg-emerald-800 text-amber-300 px-6 py-2 rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {refreshing ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-amber-300 border-t-transparent mr-2"></div>
                    Refreshing...
                  </div>
                ) : (
                  'Refresh Content'
                )}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Fullscreen Video */}
      {renderFullScreen()}

      {/* Refreshing Indicator */}
      {refreshing && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 flex items-center bg-emerald-800/90 backdrop-blur-sm px-6 py-3 rounded-full border border-amber-300/30 shadow-xl z-40">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-amber-300 border-t-transparent mr-3"></div>
          <p className="text-amber-300 font-medium">Getting fresh content...</p>
        </div>
      )}
    </div>
  );
}

export default Education;