import { useMemo, useState } from 'react';
import Sidebar from '../components/Sidebar';
import './DashboardPage.css';

function RedditLogo() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" fill="#FF4500" />
      <circle cx="9" cy="12" r="1.2" fill="white" />
      <circle cx="15" cy="12" r="1.2" fill="white" />
      <path
        d="M8.5 15c1 .9 2.1 1.3 3.5 1.3s2.5-.4 3.5-1.3"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="17.8" cy="8.2" r="1.4" fill="white" />
      <path
        d="M13 8.2l2.8.6"
        stroke="white"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M7.2 10.2c-1 0-1.8.8-1.8 1.8s.8 1.8 1.8 1.8"
        stroke="white"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M16.8 10.2c1 0 1.8.8 1.8 1.8s-.8 1.8-1.8 1.8"
        stroke="white"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function createWidget(type, index) {
  if (type === 'reddit') {
    return {
      id: crypto.randomUUID(),
      type: 'reddit',
      title: `Reddit ${index}`,
      width: 320,
    };
  }

  return {
    id: crypto.randomUUID(),
    type: 'empty',
    title: `Widget ${index}`,
    width: 320,
  };
}

function WidgetColumn({ widget, onResize }) {
  return (
    <div
      className="deck-widget-column"
      style={{ width: `${widget.width}px` }}
    >
      <div className="deck-widget-header">
        <div>
          <p className="deck-widget-eyebrow">
            {widget.type === 'reddit' ? 'REDDIT WIDGET' : 'EMPTY WIDGET'}
          </p>
          <h3 className="deck-widget-title">{widget.title}</h3>
        </div>

        <div className="deck-widget-actions">
          <button
            type="button"
            className="deck-widget-resize-btn"
            onClick={() => onResize(widget.id, -40)}
            aria-label={`Make ${widget.title} narrower`}
          >
            -
          </button>
          <button
            type="button"
            className="deck-widget-resize-btn"
            onClick={() => onResize(widget.id, 40)}
            aria-label={`Make ${widget.title} wider`}
          >
            +
          </button>
        </div>
      </div>

      <div className="deck-widget-body">
        {widget.type === 'reddit' ? (
          <div className="deck-widget-placeholder reddit-widget-placeholder">
            <div className="reddit-widget-badge">
              <RedditLogo />
            </div>
            <p className="deck-widget-placeholder-title">Reddit connected later</p>
            <p className="deck-widget-placeholder-text">
              This is a starter Reddit column. Later this can support subreddit
              feeds, saved posts, notifications, messages, or custom searches.
            </p>
          </div>
        ) : (
          <div className="deck-widget-placeholder">
            <div className="deck-widget-plus">+</div>
            <p className="deck-widget-placeholder-title">Add content later</p>
            <p className="deck-widget-placeholder-text">
              This column is ready for a future widget like Reddit, Instagram,
              Twitter/X, Gmail, or Spotify.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function AddWidgetModal({ isOpen, onClose, onSelectWidgetType }) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const services = [
    {
      id: 'reddit',
      name: 'Reddit',
      description: 'Feeds, subreddits, saved posts, notifications, and more later.',
    },
  ];

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="widget-modal-overlay" onClick={onClose}>
      <div
        className="widget-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-widget-title"
      >
        <div className="widget-modal-header">
          <div>
            <p className="widget-modal-eyebrow">ADD WIDGET</p>
            <h2 id="add-widget-title" className="widget-modal-title">
              Choose a service
            </h2>
            <p className="widget-modal-subtitle">
              Start with one available service for now.
            </p>
          </div>

          <button
            type="button"
            className="widget-modal-close"
            onClick={onClose}
            aria-label="Close add widget modal"
          >
            ×
          </button>
        </div>

        <div className="widget-modal-search-wrap">
          <input
            type="text"
            className="widget-modal-search"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="widget-service-list">
          {filteredServices.length === 0 ? (
            <div className="widget-service-empty">
              No services match that search yet.
            </div>
          ) : (
            filteredServices.map((service) => (
              <button
                key={service.id}
                type="button"
                className="widget-service-item"
                onClick={() => onSelectWidgetType(service.id)}
              >
                <div className="widget-service-icon">
                  {service.id === 'reddit' && <RedditLogo />}
                </div>

                <div className="widget-service-content">
                  <span className="widget-service-name">{service.name}</span>
                  <span className="widget-service-description">
                    {service.description}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function DeckArea({ widgets, onOpenWidgetPicker, onResizeWidget }) {
  return (
    <section className="deck-panel">
      <div className="deck-panel-header">
        <div>
          <p className="deck-panel-eyebrow">WORKSPACE</p>
          <h2 className="deck-panel-title">Deck 1</h2>
          <p className="deck-panel-subtitle">
            Build your workspace by adding widget columns.
          </p>
        </div>

        <button
          type="button"
          className="deck-primary-btn"
          onClick={onOpenWidgetPicker}
        >
          + Add Widget
        </button>
      </div>

      <div className="deck-panel-body">
        {widgets.length === 0 ? (
          <div className="deck-empty-state">
            <div className="deck-empty-icon">+</div>
            <h3 className="deck-empty-title">Your first deck is empty</h3>
            <p className="deck-empty-text">
              Start by adding a widget column. For now, we’ll support Reddit first.
            </p>
            <button
              type="button"
              className="deck-primary-btn"
              onClick={onOpenWidgetPicker}
            >
              Add your first widget
            </button>
          </div>
        ) : (
          <div className="deck-columns">
            {widgets.map((widget) => (
              <WidgetColumn
                key={widget.id}
                widget={widget}
                onResize={onResizeWidget}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ConnectionCard({ label, title, description, buttonText }) {
  return (
    <section className="deck-connection-card">
      <p className="deck-connection-label">{label}</p>
      <h3 className="deck-connection-title">{title}</h3>
      <p className="deck-connection-text">{description}</p>
      <button type="button" className="deck-secondary-btn">
        {buttonText}
      </button>
    </section>
  );
}

export default function DashboardPage({ onLogout }) {
  const [widgets, setWidgets] = useState([]);
  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false);

  const nextWidgetNumber = useMemo(() => widgets.length + 1, [widgets.length]);

  function openWidgetPicker() {
    setIsWidgetModalOpen(true);
  }

  function closeWidgetPicker() {
    setIsWidgetModalOpen(false);
  }

  function handleAddWidgetByType(type) {
    setWidgets((prev) => [...prev, createWidget(type, prev.length + 1)]);
    closeWidgetPicker();
  }

  function handleResizeWidget(widgetId, delta) {
    setWidgets((prev) =>
      prev.map((widget) =>
        widget.id === widgetId
          ? {
              ...widget,
              width: Math.max(260, Math.min(700, widget.width + delta)),
            }
          : widget
      )
    );
  }

  return (
    <div className="dashboard-shell">
      <Sidebar onAddWidget={openWidgetPicker} onLogout={onLogout} />

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div>
            <p className="dashboard-kicker">MAIN DECK</p>
            <h1 className="dashboard-title">Welcome to Canvas Deck</h1>
            <p className="dashboard-subtitle">
              New users start empty. Build the workspace you want.
            </p>
          </div>

          <div className="dashboard-topbar-actions">
            <span className="dashboard-widget-count">
              {widgets.length} widget{widgets.length === 1 ? '' : 's'}
            </span>

            {onLogout && (
              <button
                type="button"
                className="deck-secondary-btn"
                onClick={onLogout}
              >
                Log out
              </button>
            )}
          </div>
        </header>

        <DeckArea
          widgets={widgets}
          onOpenWidgetPicker={openWidgetPicker}
          onResizeWidget={handleResizeWidget}
        />

        <section className="dashboard-connections-grid">
          <ConnectionCard
            label="GMAIL"
            title="Connect Gmail"
            description="Link your Gmail account to show inbox widgets inside your deck."
            buttonText="Connect Gmail"
          />

          <ConnectionCard
            label="SPOTIFY"
            title="Connect Spotify"
            description="Sign in with Spotify to add player, feed, or playlist widgets later."
            buttonText="Connect Spotify"
          />

          <ConnectionCard
            label="MORE SERVICES"
            title="More widgets coming"
            description="Instagram, Twitter/X, notifications, DMs, and more can plug into this same deck model."
            buttonText="Coming Soon"
          />
        </section>
      </main>

      <AddWidgetModal
        isOpen={isWidgetModalOpen}
        onClose={closeWidgetPicker}
        onSelectWidgetType={handleAddWidgetByType}
      />
    </div>
  );
}