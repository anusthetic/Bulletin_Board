import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchNotices, fetchEvents } from '../api';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';
import {formatDateTime} from '../utils/formatDateTime';

const PAGE_SIZE = 8;
 
export default function HomePage() {

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [tab, setTab] = useState('notices');
  const [keywordInput, setKeywordInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);

  const [items, setItems] = useState([]);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const requestId = useRef(0);
  const sentinelRef = useRef(null);

  // Debounce: wait 400ms after typing stops before it actually triggers a search
  useEffect(() => {
    const timer = setTimeout(() => setKeyword(keywordInput), 400);
    return () => clearTimeout(timer);
  }, [keywordInput]);

  const fetchPage = useCallback(async (currentOffset, append) => {
    const thisRequestId = ++requestId.current;
    append ? setLoadingMore(true) : setLoading(true);
    setError(null);

    try {
      const fetchFn = tab === 'notices' ? fetchNotices : fetchEvents;
      const res = await fetchFn({ keyword, category, limit: PAGE_SIZE, offset: currentOffset });
      if (thisRequestId !== requestId.current) return;

      setItems((prev) => (append ? [...prev, ...res.data] : res.data));
      setTotal(res.total);
      setCategories((prev) => {
        const found = res.data.map((i) => i.category).filter(Boolean);
        return Array.from(new Set([...prev, ...found])).sort();
      });
    } catch (err) {
      if (thisRequestId !== requestId.current) return;
      setError(err.message);
    } finally {
      if (thisRequestId === requestId.current) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }, [tab, keyword, category]);

  // Reset to page 1 whenever tab/keyword/category changes
  useEffect(() => {
    setOffset(0);
    fetchPage(0, false);
  }, [tab, keyword, category]); 

  const hasMore = total !== null && items.length < total;

  // Infinite scroll: watch the sentinel div, load next page when it's visible
  useEffect(() => {
    if (!hasMore || loading || !sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore) {
          const nextOffset = offset + PAGE_SIZE;
          setOffset(nextOffset);
          fetchPage(nextOffset, true);
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, offset, fetchPage]);

  function handleTabChange(nextTab) {
    setTab(nextTab);
    setCategory('');
  }

  return (
    <div className="app-shell">
      <section className="hero">
        <h1 className="hero-title">What's happening this week</h1>
        {/* <p className="hero-subtitle">Campus notices and events, all in one board.</p> */}
      </section>

      {/* Tabs */}
      <div className="tabs" role="tablist">
        {['notices', 'events'].map((key) => (
          <button
            key={key}
            role="tab"
            aria-selected={tab === key}
            className={`tab ${tab === key ? 'tab-active' : ''}`}
            onClick={() => handleTabChange(key)}
          >
            {key === 'notices' ? 'Notices' : 'Events'}
          </button>
        ))}
      </div>

      {/* Search + category filter — work together */}
      <div className="filter-bar">
        <div className="search-field">
          <span className="search-icon" aria-hidden="true">⌕</span>
          <input
            type="text"
            placeholder="Search by keyword…"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            aria-label="Search"
          />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="category-select" aria-label="Filter by category">
          <option value="">All categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Feed */}
      <div className="feed">
        {loading && items.length === 0 && (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card skeleton-card" aria-hidden="true">
              <div className="skeleton-line skeleton-meta" />
              <div className="skeleton-line skeleton-title" />
              <div className="skeleton-line skeleton-text" />
            </div>
          ))
        )}

        {error && items.length === 0 && (
          <div className="state-block state-error">
            <p className="state-title">Couldn't load this.</p>
            <p className="state-message">{error}</p>
            <button className="btn-primary btn-small" onClick={() => fetchPage(0, false)}>Try again</button>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="state-block state-empty">
            <p className="state-title">Nothing here yet.</p>
            <p className="state-message">Try a different keyword or category.</p>
          </div>
        )}

        {items.map((item) =>
          tab === 'notices' ? (
            <Link key={item.id} to={`/notice/${item.id}`} state={{ item }} className="card card-notice">
              <span className="card-pin card-pin-notice" aria-hidden="true" />
              <div className="card-meta">
                <span className="card-category">{item.category || 'general'}</span>
                <span className="card-date">{formatDateTime(item.createdAt)}</span>
              </div>
              <h3 className="card-title">{item.title}</h3>
            </Link>
          ) : (
            <Link key={item.id} to={`/event/${item.id}`} state={{ item }} className="card card-event">
              <span className="card-pin card-pin-event" aria-hidden="true" />
              <div className="card-meta">
                <span className="card-category">{item.category || 'general'}</span>
                <span className="card-date">{formatDateTime(item.startTime)}</span>
              </div>
              <h3 className="card-title">{item.title}</h3>
              {item.venue && <p className="card-venue"> {item.venue}</p>}
            </Link>
          )
        )}

        {hasMore && <div ref={sentinelRef} className="scroll-sentinel" />}
        {loadingMore && <p className="loading-more">Loading more…</p>}
        {error && items.length > 0 && <p className="inline-error">Couldn't load more — {error}</p>}
      </div>
    </div>
  );
}