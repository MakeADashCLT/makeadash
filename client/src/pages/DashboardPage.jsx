import { useMemo, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'
import Sidebar from '../components/Sidebar';
import './DashboardPage.css';


function RedditLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#FF4500" />
      <circle cx="9" cy="12" r="1.2" fill="white" />
      <circle cx="15" cy="12" r="1.2" fill="white" />
      <path d="M8.5 15c1 .9 2.1 1.3 3.5 1.3s2.5-.4 3.5-1.3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="17.8" cy="8.2" r="1.4" fill="white" />
      <path d="M13 8.2l2.8.6" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M7.2 10.2c-1 0-1.8.8-1.8 1.8s.8 1.8 1.8 1.8" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M16.8 10.2c1 0 1.8.8 1.8 1.8s-.8 1.8-1.8 1.8" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function WeatherLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="5" fill="#FDB813" />
      <path d="M12 2.5V5" stroke="#FDB813" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 19V21.5" stroke="#FDB813" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M2.5 12H5" stroke="#FDB813" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M19 12H21.5" stroke="#FDB813" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M5.2 5.2L7 7" stroke="#FDB813" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M17 17L18.8 18.8" stroke="#FDB813" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M18.8 5.2L17 7" stroke="#FDB813" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7 17L5.2 18.8" stroke="#FDB813" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SteamLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#1b2838" />
      <circle cx="15.5" cy="8.5" r="2.3" stroke="white" strokeWidth="1.4" />
      <circle cx="9" cy="14.8" r="1.8" fill="white" />
      <path d="M10.4 13.9L13.8 10.9" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M7.2 13.8L5.2 13" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function AniListLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect width="24" height="24" rx="6" fill="#1f2a44" />
      <path d="M7 18L10.2 6H13.1L16.3 18H13.8L13.1 15.2H10.1L9.4 18H7ZM10.7 12.7H12.5L11.6 9L10.7 12.7Z" fill="#7AA2FF" />
      <rect x="17.5" y="6" width="2.5" height="12" rx="1.25" fill="#00C2FF" />
    </svg>
  );
}

function GitHubLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#24292e" />
      <path
        d="M12 6.5a5.5 5.5 0 0 0-1.74 10.72c.28.05.38-.12.38-.26v-.97c-1.54.33-1.86-.74-1.86-.74-.25-.64-.62-.81-.62-.81-.51-.34.04-.34.04-.34.56.04.86.58.86.58.5.85 1.3.6 1.62.46.05-.36.2-.6.36-.74-1.23-.14-2.52-.61-2.52-2.73 0-.6.22-1.1.58-1.49-.06-.14-.25-.7.05-1.46 0 0 .47-.15 1.55.58a5.4 5.4 0 0 1 2.82 0c1.07-.73 1.54-.58 1.54-.58.3.76.11 1.32.05 1.46.36.39.58.89.58 1.49 0 2.13-1.3 2.6-2.54 2.73.2.17.38.52.38 1.04v1.55c0 .15.1.32.39.26A5.5 5.5 0 0 0 12 6.5z"
        fill="white"
      />
    </svg>
  );
}


function createWidget(type, index) {
  if (type === 'reddit') return {
    id: crypto.randomUUID(), type: 'reddit', title: `Reddit ${index}`, width: 320,
  };
  if (type === 'weather') return {
    id: crypto.randomUUID(), type: 'weather', title: `Weather ${index}`,
    width: 360, city: 'Charlotte', loading: false, error: '', data: null,
  };
  if (type === 'steam') return {
    id: crypto.randomUUID(), type: 'steam', title: `Steam ${index}`,
    width: 480, query: '', loading: false, error: '', items: [],
  };
  if (type === 'anilist') return {
    id: crypto.randomUUID(), type: 'anilist', title: `AniList ${index}`,
    width: 430, mode: 'today', loading: false, error: '', items: [], seasonLabel: '',
  };
  if (type === 'github') return {
    id: crypto.randomUUID(), type: 'github', title: `GitHub ${index}`,
    width: 360, username: '', loading: false, error: '', data: null,
  };
  return {
    id: crypto.randomUUID(), type: 'empty', title: `Widget ${index}`, width: 320,
  };
}


function formatForecastDay(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { weekday: 'short' });
}

function formatAiringTime(unixSeconds) {
  if (!unixSeconds) return 'TBA';
  return new Date(unixSeconds * 1000).toLocaleString([], {
    weekday: 'short', hour: 'numeric', minute: '2-digit',
  });
}


function WidgetColumn({
  widget,
  onResize,
  onWeatherCityChange,
  onWeatherRefresh,
  onSteamQueryChange,
  onSteamSearch,
  onAniListModeChange,
  onGithubUsernameChange,
  onGithubSearch,
}) {
  return (
    <div
      className={`deck-widget-column ${
        widget.type === 'weather' ? 'deck-widget-column--weather' :
        widget.type === 'steam'   ? 'deck-widget-column--steam'   :
        widget.type === 'anilist' ? 'deck-widget-column--anilist' :
        widget.type === 'github'  ? 'deck-widget-column--github'  : ''
      }`}
      style={{ width: `${widget.width}px` }}
    >
      <div className="deck-widget-header">
        <div>
          <p className="deck-widget-eyebrow">
            {widget.type === 'reddit'  ? 'REDDIT WIDGET'  :
             widget.type === 'weather' ? 'WEATHER WIDGET' :
             widget.type === 'steam'   ? 'STEAM WIDGET'   :
             widget.type === 'anilist' ? 'ANILIST WIDGET' :
             widget.type === 'github'  ? 'GITHUB WIDGET'  : 'EMPTY WIDGET'}
          </p>
          <h3 className="deck-widget-title">{widget.title}</h3>
        </div>
        <div className="deck-widget-actions">
          <button type="button" className="deck-widget-resize-btn"
            onClick={() => onResize(widget.id, -40)}
            aria-label={`Make ${widget.title} narrower`}>-</button>
          <button type="button" className="deck-widget-resize-btn"
            onClick={() => onResize(widget.id, 40)}
            aria-label={`Make ${widget.title} wider`}>+</button>
        </div>
      </div>

      <div className="deck-widget-body">

        {/* ── Weather ── */}
        {widget.type === 'weather' && (
          <div className="weather-widget">
            <div className="weather-widget-controls">
              <input type="text" className="weather-widget-input"
                value={widget.city}
                onChange={(e) => onWeatherCityChange(widget.id, e.target.value)}
                placeholder="Enter city" />
              <button type="button" className="deck-primary-btn"
                onClick={() => onWeatherRefresh(widget.id)}>Refresh</button>
            </div>
            {widget.loading ? (
              <div className="weather-widget-status">Loading weather...</div>
            ) : widget.error ? (
              <div className="weather-widget-status weather-widget-status--error">{widget.error}</div>
            ) : widget.data ? (
              <div className="weather-widget-card">
                <div className="weather-widget-top">
                  <div>
                    <p className="weather-widget-location">
                      {widget.data.city}{widget.data.state ? `, ${widget.data.state}` : ''}
                    </p>
                    <p className="weather-widget-country">{widget.data.country}</p>
                  </div>
                  <div className="weather-widget-temp">{Math.round(widget.data.temperature)}°</div>
                </div>
                <p className="weather-widget-condition">{widget.data.condition}</p>
                <div className="weather-widget-stats">
                  <div className="weather-stat">
                    <span className="weather-stat-label">High</span>
                    <span className="weather-stat-value">{Math.round(widget.data.high)}°</span>
                  </div>
                  <div className="weather-stat">
                    <span className="weather-stat-label">Low</span>
                    <span className="weather-stat-value">{Math.round(widget.data.low)}°</span>
                  </div>
                  <div className="weather-stat">
                    <span className="weather-stat-label">Wind</span>
                    <span className="weather-stat-value">{Math.round(widget.data.windSpeed)} mph</span>
                  </div>
                </div>
                <div className="weather-forecast">
                  <p className="weather-forecast-title">Next few days</p>
                  <div className="weather-forecast-list">
                    {widget.data.forecast?.slice(1).map((day) => (
                      <div key={day.date} className="weather-forecast-row">
                        <span className="weather-forecast-day">{formatForecastDay(day.date)}</span>
                        <span className="weather-forecast-condition">{day.condition}</span>
                        <span className="weather-forecast-temps">
                          {Math.round(day.high)}° / {Math.round(day.low)}°
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="weather-widget-status">No weather loaded yet.</div>
            )}
          </div>
        )}

        {/* ── Steam ── */}
        {widget.type === 'steam' && (
          <div className="steam-widget">
            <div className="steam-widget-controls">
              <input type="text" className="steam-widget-input"
                value={widget.query}
                onChange={(e) => onSteamQueryChange(widget.id, e.target.value)}
                placeholder="Search featured games..." />
              <button type="button" className="deck-primary-btn"
                onClick={() => onSteamSearch(widget.id)}>Search</button>
            </div>
            {widget.loading ? (
              <div className="steam-widget-status">Loading games...</div>
            ) : widget.error ? (
              <div className="steam-widget-status steam-widget-status--error">{widget.error}</div>
            ) : (
              <div className="steam-game-list">
                {widget.items?.map((game) => (
                  <a key={game.appid} href={game.storeUrl} target="_blank"
                    rel="noopener noreferrer" className="steam-game-card">
                    <img src={game.headerImage || game.capsuleImage}
                      alt={game.name} className="steam-game-image" />
                    <div className="steam-game-meta">
                      <p className="steam-game-title">{game.name}</p>
                      <p className="steam-game-description">
                        {game.shortDescription || 'Open in Steam store'}
                      </p>
                      <p className="steam-game-price">{game.price || 'View on Steam'}</p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── AniList ── */}
        {widget.type === 'anilist' && (
          <div className="anilist-widget">
            <div className="anilist-widget-controls">
              <button type="button"
                className={`anilist-mode-btn ${widget.mode === 'today' ? 'anilist-mode-btn--active' : ''}`}
                onClick={() => onAniListModeChange(widget.id, 'today')}>Airs Today</button>
              <button type="button"
                className={`anilist-mode-btn ${widget.mode === 'week' ? 'anilist-mode-btn--active' : ''}`}
                onClick={() => onAniListModeChange(widget.id, 'week')}>This Week</button>
              <button type="button"
                className={`anilist-mode-btn ${widget.mode === 'season' ? 'anilist-mode-btn--active' : ''}`}
                onClick={() => onAniListModeChange(widget.id, 'season')}>Upcoming Season</button>
            </div>
            {widget.mode === 'season' && widget.seasonLabel && (
              <p className="anilist-season-label">{widget.seasonLabel}</p>
            )}
            {widget.loading ? (
              <div className="anilist-widget-status">Loading anime...</div>
            ) : widget.error ? (
              <div className="anilist-widget-status anilist-widget-status--error">{widget.error}</div>
            ) : (
              <div className="anilist-list">
                {widget.items?.map((anime) => (
                  <a key={`${anime.id}-${anime.episode ?? 'na'}`}
                    href={anime.siteUrl} target="_blank" rel="noopener noreferrer"
                    className="anilist-card">
                    <img src={anime.coverImage} alt={anime.title} className="anilist-card-image" />
                    <div className="anilist-card-meta">
                      <p className="anilist-card-title">{anime.title}</p>
                      <p className="anilist-card-episode">
                        {anime.episode ? `Episode ${anime.episode}` : 'Upcoming'}
                      </p>
                      <p className="anilist-card-time">
                        {anime.airingAt
                          ? formatAiringTime(anime.airingAt)
                          : `${anime.season} ${anime.seasonYear}`}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── GitHub ── */}
        {widget.type === 'github' && (
          <div className="github-widget">
            <div className="github-widget-controls">
              <input
                type="text"
                className="github-widget-input"
                value={widget.username}
                onChange={(e) => onGithubUsernameChange(widget.id, e.target.value)}
                placeholder="Enter GitHub username..."
                onKeyDown={(e) => e.key === 'Enter' && onGithubSearch(widget.id)}
              />
              <button type="button" className="deck-primary-btn"
                onClick={() => onGithubSearch(widget.id)}>Search</button>
            </div>

            {widget.loading && <div className="github-status">Loading profile…</div>}
            {widget.error   && <div className="github-status github-status--error">{widget.error}</div>}

            {widget.data && (
              <div className="github-profile">
                <div className="github-profile-header">
                  <img src={widget.data.avatar} alt={widget.data.username} className="github-avatar" />
                  <div className="github-profile-info">
                    <p className="github-name">{widget.data.name || widget.data.username}</p>
                    <p className="github-username">@{widget.data.username}</p>
                    {widget.data.bio && <p className="github-bio">{widget.data.bio}</p>}
                  </div>
                </div>

                <div className="github-stats">
                  <div className="github-stat">
                    <span className="github-stat-value">{widget.data.publicRepos}</span>
                    <span className="github-stat-label">Repos</span>
                  </div>
                  <div className="github-stat">
                    <span className="github-stat-value">{widget.data.followers}</span>
                    <span className="github-stat-label">Followers</span>
                  </div>
                  <div className="github-stat">
                    <span className="github-stat-value">{widget.data.following}</span>
                    <span className="github-stat-label">Following</span>
                  </div>
                </div>

                <div className="github-repos">
                  <p className="github-repos-label">RECENT REPOS</p>
                  {widget.data.repos.map((repo) => (
                    <a key={repo.name} href={repo.url} target="_blank"
                      rel="noopener noreferrer" className="github-repo-card">
                      <div className="github-repo-top">
                        <span className="github-repo-name">{repo.name}</span>
                        {repo.language && (
                          <span className="github-repo-lang">{repo.language}</span>
                        )}
                      </div>
                      {repo.description && (
                        <p className="github-repo-desc">{repo.description}</p>
                      )}
                      <div className="github-repo-meta">⭐ {repo.stars}</div>
                    </a>
                  ))}
                </div>

                <a href={widget.data.profileUrl} target="_blank"
                  rel="noopener noreferrer" className="github-profile-link">
                  View full profile →
                </a>
              </div>
            )}
          </div>
        )}

        {/* ── Reddit ── */}
        {widget.type === 'reddit' && (
          <div className="deck-widget-placeholder reddit-widget-placeholder">
            <div className="reddit-widget-badge"><RedditLogo /></div>
            <p className="deck-widget-placeholder-title">Reddit connected later</p>
            <p className="deck-widget-placeholder-text">
              This is a starter Reddit column. Later this can support subreddit
              feeds, saved posts, notifications, messages, or custom searches.
            </p>
          </div>
        )}

        {/* ── Empty ── */}
        {widget.type === 'empty' && (
          <div className="deck-widget-placeholder">
            <div className="deck-widget-plus">+</div>
            <p className="deck-widget-placeholder-title">Add content later</p>
            <p className="deck-widget-placeholder-text">
              This column is ready for a future widget like Weather, Reddit,
              Gmail, Spotify, YouTube, Steam, or News.
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
    { id: 'reddit',  name: 'Reddit',  description: 'Feeds, subreddits, saved posts, notifications, and more later.' },
    { id: 'weather', name: 'Weather', description: 'Current conditions and today\'s forecast for a city.' },
    { id: 'steam',   name: 'Steam',   description: 'Featured games, store cards, and quick search.' },
    { id: 'anilist', name: 'AniList', description: 'Anime airing today, this week, and upcoming seasonal shows.' },
    { id: 'github',  name: 'GitHub',  description: 'Profile stats and recently updated repos for any user.' },
  ];

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="widget-modal-overlay" onClick={onClose}>
      <div className="widget-modal" onClick={(e) => e.stopPropagation()}
        role="dialog" aria-modal="true" aria-labelledby="add-widget-title">
        <div className="widget-modal-header">
          <div>
            <p className="widget-modal-eyebrow">ADD WIDGET</p>
            <h2 id="add-widget-title" className="widget-modal-title">Choose a service</h2>
            <p className="widget-modal-subtitle">Start with one available service for now.</p>
          </div>
          <button type="button" className="widget-modal-close" onClick={onClose}
            aria-label="Close add widget modal">×</button>
        </div>

        <div className="widget-modal-search-wrap">
          <input type="text" className="widget-modal-search"
            placeholder="Search services..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        <div className="widget-service-list">
          {filteredServices.length === 0 ? (
            <div className="widget-service-empty">No services match that search yet.</div>
          ) : (
            filteredServices.map((service) => (
              <button key={service.id} type="button" className="widget-service-item"
                onClick={() => onSelectWidgetType(service.id)}>
                <div className="widget-service-icon">
                  {service.id === 'reddit'  && <RedditLogo />}
                  {service.id === 'weather' && <WeatherLogo />}
                  {service.id === 'steam'   && <SteamLogo />}
                  {service.id === 'anilist' && <AniListLogo />}
                  {service.id === 'github'  && <GitHubLogo />}
                </div>
                <div className="widget-service-content">
                  <span className="widget-service-name">{service.name}</span>
                  <span className="widget-service-description">{service.description}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}


function DeckArea({
  widgets,
  onOpenWidgetPicker,
  onResizeWidget,
  onWeatherCityChange,
  onWeatherRefresh,
  onSteamQueryChange,
  onSteamSearch,
  onAniListModeChange,
  onGithubUsernameChange,
  onGithubSearch,
}) {
  return (
    <section className="deck-panel">
      <div className="deck-panel-header">
        <div>
          <p className="deck-panel-eyebrow">WORKSPACE</p>
          <h2 className="deck-panel-title">Deck 1</h2>
          <p className="deck-panel-subtitle">Build your workspace by adding widget columns.</p>
        </div>
        <button type="button" className="deck-primary-btn" onClick={onOpenWidgetPicker}>
          + Add Widget
        </button>
      </div>

      <div className="deck-panel-body">
        {widgets.length === 0 ? (
          <div className="deck-empty-state">
            <div className="deck-empty-icon">+</div>
            <h3 className="deck-empty-title">Your first deck is empty</h3>
            <p className="deck-empty-text">
              Start by adding a widget column. For now, we'll support Reddit first.
            </p>
            <button type="button" className="deck-primary-btn" onClick={onOpenWidgetPicker}>
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
                onWeatherCityChange={onWeatherCityChange}
                onWeatherRefresh={onWeatherRefresh}
                onSteamQueryChange={onSteamQueryChange}
                onSteamSearch={onSteamSearch}
                onAniListModeChange={onAniListModeChange}
                onGithubUsernameChange={onGithubUsernameChange}
                onGithubSearch={onGithubSearch}
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
      <button type="button" className="deck-secondary-btn">{buttonText}</button>
    </section>
  );
}


export default function DashboardPage({ onLogout }) {
  const [widgets, setWidgets] = useState([]);
  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false);

  const nextWidgetNumber = useMemo(() => widgets.length + 1, [widgets.length]);

  useEffect(() => {
    loadWidgets();
  }, []);

  async function loadWidgets() {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    const { data, error } = await supabase
      .from('widgets')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error(error);
      return;
    }

    const formatted = data.map((w) => ({
      id: w.id,
      type: w.config.type,
      title: w.name,
      width: w.config.width,
      city: w.config.city,
      ...w.config,
    }));

    setWidgets(formatted);
  }

  // ── Weather ─────────────────────────────────────────────────────────────────
  async function fetchWeatherForWidget(widgetId, city) {
    setWidgets((prev) =>
      prev.map((w) => w.id === widgetId ? { ...w, loading: true, error: '' } : w)
    );
    try {
      const response = await fetch(
        `https://makeadash-env.eba-zpmydmm6.us-east-1.elasticbeanstalk.com/api/weather?city=${encodeURIComponent(city)}`
      );
      const text = await response.text();
      const data = JSON.parse(text);
      if (!response.ok) throw new Error(data.error || 'Failed to fetch weather.');
      setWidgets((prev) =>
        prev.map((w) => w.id === widgetId ? { ...w, loading: false, error: '', data } : w)
      );
    } catch (error) {
      setWidgets((prev) =>
        prev.map((w) =>
          w.id === widgetId ? { ...w, loading: false, error: error.message || 'Unable to load weather.' } : w
        )
      );
    }
  }

  function handleWeatherCityChange(widgetId, value) {
    setWidgets((prev) =>
      prev.map((w) => w.id === widgetId ? { ...w, city: value } : w)
    );
  }

  function handleWeatherRefresh(widgetId) {
    const widget = widgets.find((w) => w.id === widgetId);
    if (!widget || !widget.city.trim()) return;
    fetchWeatherForWidget(widgetId, widget.city.trim());
  }

  // ── Steam ────────────────────────────────────────────────────────────────────
  async function fetchSteamForWidget(widgetId, query = '') {
    setWidgets((prev) =>
      prev.map((w) => w.id === widgetId ? { ...w, loading: true, error: '' } : w)
    );
    try {
      const response = await fetch(
        `https://makeadash-env.eba-zpmydmm6.us-east-1.elasticbeanstalk.com/api/steam/featured?q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch Steam games.');
      setWidgets((prev) =>
        prev.map((w) =>
          w.id === widgetId ? { ...w, loading: false, error: '', items: data.items || [] } : w
        )
      );
    } catch (error) {
      setWidgets((prev) =>
        prev.map((w) =>
          w.id === widgetId ? { ...w, loading: false, error: error.message || 'Unable to load Steam games.' } : w
        )
      );
    }
  }

  function handleSteamQueryChange(widgetId, value) {
    setWidgets((prev) =>
      prev.map((w) => w.id === widgetId ? { ...w, query: value } : w)
    );
  }

  function handleSteamSearch(widgetId) {
    const widget = widgets.find((w) => w.id === widgetId);
    if (!widget) return;
    fetchSteamForWidget(widgetId, widget.query.trim());
  }

  // ── AniList ──────────────────────────────────────────────────────────────────
  async function fetchAniListForWidget(widgetId, mode = 'today') {
    setWidgets((prev) =>
      prev.map((w) => w.id === widgetId ? { ...w, loading: true, error: '', mode } : w)
    );
    try {
      const endpoint = mode === 'today' ? 'today' : mode === 'week' ? 'week' : 'season';
      const response = await fetch(`https://makeadash-env.eba-zpmydmm6.us-east-1.elasticbeanstalk.com/api/anilist/${endpoint}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch AniList data.');
      setWidgets((prev) =>
        prev.map((w) =>
          w.id === widgetId
            ? {
                ...w,
                loading: false,
                error: '',
                items: data.items || [],
                seasonLabel:
                  mode === 'season' && data.season && data.year
                    ? `${data.season} ${data.year}` : '',
                mode,
              }
            : w
        )
      );
    } catch (error) {
      setWidgets((prev) =>
        prev.map((w) =>
          w.id === widgetId ? { ...w, loading: false, error: error.message || 'Unable to load AniList data.' } : w
        )
      );
    }
  }

  function handleAniListModeChange(widgetId, mode) {
    fetchAniListForWidget(widgetId, mode);
  }

  // ── GitHub ───────────────────────────────────────────────────────────────────
  function handleGithubUsernameChange(widgetId, value) {
    setWidgets((prev) =>
      prev.map((w) => w.id === widgetId ? { ...w, username: value } : w)
    );
  }

  async function fetchGithubForWidget(widgetId, username) {
    if (!username.trim()) return;
    setWidgets((prev) =>
      prev.map((w) => w.id === widgetId ? { ...w, loading: true, error: '' } : w)
    );
    try {
      const res = await fetch(
        `https://makeadash-env.eba-zpmydmm6.us-east-1.elasticbeanstalk.com/api/github/user?username=${encodeURIComponent(username)}`,
        { credentials: 'include' }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch GitHub data.');
      setWidgets((prev) =>
        prev.map((w) => w.id === widgetId ? { ...w, loading: false, error: '', data } : w)
      );
    } catch (error) {
      setWidgets((prev) =>
        prev.map((w) =>
          w.id === widgetId ? { ...w, loading: false, error: error.message } : w
        )
      );
    }
  }

  function handleGithubSearch(widgetId) {
    const widget = widgets.find((w) => w.id === widgetId);
    if (!widget) return;
    fetchGithubForWidget(widgetId, widget.username.trim());
  }

  // ── Widget picker ────────────────────────────────────────────────────────────
  function openWidgetPicker()  { setIsWidgetModalOpen(true);  }
  function closeWidgetPicker() { setIsWidgetModalOpen(false); }

  async function handleAddWidgetByType(type) {
    
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    const newWidget = createWidget(type, widgets.length + 1);

    const { data, error } = await supabase
      .from('widgets')
      .insert({
        user_id: user.id,
        name: newWidget.title,
        config: {
          type: newWidget.type,
          width: newWidget.width,
          city: newWidget.city || null,
        },
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      return;
    }

    const savedWidget = {
      ...newWidget,
      id: data.id,
    };

    setWidgets((prev) => [...prev, savedWidget]);

    closeWidgetPicker();

    // optional auto-loads
    if (type === 'weather') {
      setTimeout(() => fetchWeatherForWidget(savedWidget.id, savedWidget.city), 0);
    }
    if (type === 'steam') {
      setTimeout(() => fetchSteamForWidget(savedWidget.id, ''), 0);
    }
    if (type === 'anilist') {
      setTimeout(() => fetchAniListForWidget(savedWidget.id, 'today'), 0);
    }
  }

  function handleResizeWidget(widgetId, delta) {
    setWidgets((prev) =>
      prev.map((w) =>
        w.id === widgetId
          ? { ...w, width: Math.max(260, Math.min(700, w.width + delta)) }
          : w
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
              <button type="button" className="deck-secondary-btn" onClick={onLogout}>
                Log out
              </button>
            )}
          </div>
        </header>

        <DeckArea
          widgets={widgets}
          onOpenWidgetPicker={openWidgetPicker}
          onResizeWidget={handleResizeWidget}
          onWeatherCityChange={handleWeatherCityChange}
          onWeatherRefresh={handleWeatherRefresh}
          onSteamQueryChange={handleSteamQueryChange}
          onSteamSearch={handleSteamSearch}
          onAniListModeChange={handleAniListModeChange}
          onGithubUsernameChange={handleGithubUsernameChange}
          onGithubSearch={handleGithubSearch}
        />

        <section className="dashboard-connections-grid">
          <ConnectionCard
            label="GMAIL" title="Connect Gmail"
            description="Link your Gmail account to show inbox widgets inside your deck."
            buttonText="Connect Gmail" />
          <ConnectionCard
            label="SPOTIFY" title="Connect Spotify"
            description="Sign in with Spotify to add player, feed, or playlist widgets later."
            buttonText="Connect Spotify" />
          <ConnectionCard
            label="MORE SERVICES" title="More widgets coming"
            description="Instagram, Twitter/X, notifications, DMs, and more can plug into this same deck model."
            buttonText="Coming Soon" />
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