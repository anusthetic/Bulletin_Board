import { Link, useLocation, useParams } from "react-router-dom";
import { fetchNoticeById } from "../api";
import useItemLookup from "../utils/useItemLookup";
import { formatDateTime } from "../utils/formatDateTime";

export default function NoticeDetailPage() {
  const { id } = useParams();
  const location = useLocation();

  const {
    item: notice,
    loading,
    error,
  } = useItemLookup(id, location.state?.item,fetchNoticeById(id));

  return (
      <div className="app-shell">
        <Link to="/" className="back-link">Back to board</Link>
        {loading && <p className="loading-text">Loading notice…</p>}
        {error && <div className="state-block state-error"><p className="state-title">Couldn't load this.</p><p className="state-message">{error}</p></div>}
        {notice && !loading && (
          <article className="detail-card detail-notice">
            <div className="detail-meta">
              <span className="card-category">{notice.category || 'general'}</span>
              <span className="card-date">{formatDateTime(notice.createdAt)}</span>
            </div>
            <h1 className="detail-title">{notice.title}</h1>
            <p className="detail-body">{notice.content}</p>
          </article>
        )}
      </div>
    );
}
