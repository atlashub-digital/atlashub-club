import type { ClubEvent } from "@/lib/content";
import { StatusTag } from "../ui/primitives";

/** Cartão de evento (board secção 10). Workshops B2B identificados como AtlasHub.SI, não Club. */
export default function EventCard({ event }: { event: ClubEvent }) {
  return (
    <article className={`ca-card ca-event ca-event--${event.kind}`}>
      <div className="ca-event__date" aria-hidden="true">
        <span>{event.day}</span>
        <small>{event.month}</small>
      </div>
      <div className="ca-event__body">
        <div className="ca-event__tags">
          <StatusTag status={event.status}>
            {event.kind === "b2b" ? "Workshop AtlasHub.SI" : event.state.charAt(0) + event.state.slice(1).toLowerCase()}
          </StatusTag>
          <span className="ca-tag">{event.format.charAt(0) + event.format.slice(1).toLowerCase()}</span>
        </div>
        <h3>
          <span className="ca-sr-only">{event.date}: </span>
          {event.title}
        </h3>
        <p>{event.detail}</p>
      </div>
    </article>
  );
}
