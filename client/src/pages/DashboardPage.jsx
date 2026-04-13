import { useMemo, useState } from 'react';
import Sidebar from '../components/Sidebar';
import './DashboardPage.css';

function createWidget(index) {
  return {
    id: crypto.randomUUID(),
    title: `Widget ${index}`,
    width: 320,
    type: 'empty',
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
          <p className="deck-widget-eyebrow">EMPTY WIDGET</p>
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
        <div className="deck-widget-placeholder">
          <div className="deck-widget-plus">+</div>
          <p className="deck-widget-placeholder-title">Add content later</p>
          <p className="deck-widget-placeholder-text">
            This column is ready for a future widget like Instagram feed,
            Twitter notifications, Gmail inbox, or Spotify player.
          </p>
        </div>
      </div>
    </div>
  );
}

function DeckArea({ widgets, onAddWidget, onResizeWidget }) {
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
          onClick={onAddWidget}
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
              Start by adding a widget column. Later, each column can become an
              Instagram feed, DMs, Gmail inbox, Spotify player, or another service.
            </p>
            <button
              type="button"
              className="deck-primary-btn"
              onClick={onAddWidget}
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

  const nextWidgetNumber = useMemo(() => widgets.length + 1, [widgets.length]);

  function handleAddWidget() {
    setWidgets((prev) => [...prev, createWidget(prev.length + 1)]);
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
      <Sidebar onAddWidget={handleAddWidget} onLogout={onLogout} />

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
              <button type="button" className="deck-secondary-btn" onClick={onLogout}>
                Log out
              </button>
            )}
          </div>
        </header>

        <DeckArea
          widgets={widgets}
          onAddWidget={handleAddWidget}
          onResizeWidget={handleResizeWidget}
          nextWidgetNumber={nextWidgetNumber}
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
            description="Instagram, Twitter/X, notifications, DMs, and service-specific columns can plug into this same deck model."
            buttonText="Coming Soon"
          />
        </section>
      </main>
    </div>
  );
}