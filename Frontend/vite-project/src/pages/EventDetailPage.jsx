import { Link, useLocation, useParams } from "react-router-dom";
import { fetchEventById } from "../api";
import useItemLookup from "../utils/useItemLookup";
import { formatDateTime } from "../utils/formatDateTime";

export default function EventDetailPage() {
  const { id } = useParams();
  const location = useLocation();

  const {
    item: event,
    loading,
    error,
  } = useItemLookup(id, location.state?.item, fetchEventById(id));

  return ( 
      <div className="app-shell">
        <Link to="/" className="back-link">Back to board</Link>
        {loading && <p className="loading-text">Loading event…</p>}
        {error && <div className="state-block state-error"><p className="state-title">Couldn't load this.</p><p className="state-message">{error}</p></div>}
        {event && !loading && (
          <article className="detail-card detail-event">
            <div className="detail-meta">
              <span className="card-category">{event.category || 'general'}</span>
              <span className="card-date">{formatDateTime(event.startTime)}</span>
            </div>
            <h1 className="detail-title">{event.title}</h1>
            <dl className="detail-facts">
              {event.venue && <div className="fact"><dt>Venue</dt><dd>{event.venue}</dd></div>}
              {event.end_time && <div className="fact"><dt>Ends</dt><dd>{formatDateTime(event.end_time)}</dd></div>}
              {event.organizer && <div className="fact"><dt>Organizer</dt><dd>{event.organizer}</dd></div>}
            </dl>
            {event.description && <p className="detail-body">{event.description}</p>}
          </article>
        )}
      </div>
  );
}