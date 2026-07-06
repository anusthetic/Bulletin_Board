import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { checkAuth } from './authSlice'; 
import Header from './components/Header';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NoticeDetailPage from './pages/NoticeDetailPage';
import EventDetailPage from './pages/EventDetailPage';
import CreateNoticePage from './pages/CreateNoticePage';
import CreateEventPage from './pages/CreateEventPage';


export default function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading,user } = useSelector((state) => state.auth);

  // On first load, ask Redux to verify the stored token / session.
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if(loading){
    return <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }

  return (
    <>
      <Header />
      <Routes>
        {/* Entry point: authenticated users land on the feed, everyone else on signup */}
        <Route path="/" element={isAuthenticated? <HomePage/>: <Navigate to="/signup" replace/>}></Route>

        <Route path="/login" element={isAuthenticated? <Navigate to="/" replace/>: <Login></Login>}></Route>
        <Route path="/signup" element={isAuthenticated? <Navigate to="/" replace/>: <Signup></Signup>}></Route>

        <Route path="/notice/:id" element={isAuthenticated? <NoticeDetailPage/>: <Navigate to="/signup" replace />}></Route>
        <Route path="/event/:id" element={isAuthenticated? <EventDetailPage/>: <Navigate to="/signup" replace />}></Route>

        <Route 
          path="/notice/new"
          element={
            isAuthenticated && user?.role === 'admin'?
              <CreateNoticePage/> :
              <Navigate to="/" replace/>
          }
        />
        <Route
          path="/event/new"
          element={
            isAuthenticated && user?.role === 'admin'?
              <CreateEventPage/> :
              <Navigate to="/" replace/>
          }
        />

      </Routes>
    </>
  );
}