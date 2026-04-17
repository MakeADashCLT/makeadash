import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'
import Sidebar from '../components/Sidebar';
import './DashboardPage.css';

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';


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

function CalendarLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="3" fill="#1f2937" />
      <rect x="3" y="5" width="18" height="4" rx="3" fill="#4f98a3" />
      <path d="M8 3V7" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M16 3V7" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="7" y="12" width="3" height="3" rx="1" fill="white" />
      <rect x="12" y="12" width="3" height="3" rx="1" fill="white" opacity="0.75" />
      <rect x="7" y="17" width="3" height="3" rx="1" fill="white" opacity="0.75" />
    </svg>
  );
}

function CanvasLmsLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#C8102E" />
      <circle cx="12" cy="6.4" r="1.5" fill="white" />
      <circle cx="17.2" cy="9.4" r="1.5" fill="white" />
      <circle cx="17.2" cy="14.6" r="1.5" fill="white" />
      <circle cx="12" cy="17.6" r="1.5" fill="white" />
      <circle cx="6.8" cy="14.6" r="1.5" fill="white" />
      <circle cx="6.8" cy="9.4" r="1.5" fill="white" />
      <circle cx="12" cy="12" r="2.1" fill="white" />
    </svg>
  );
}

function SpotifyLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#1DB954" />
      <path d="M7 9.5c2.8-1.1 6.2-1 9 .5" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M7.5 12.5c2.3-.9 5.2-.8 7.5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 15.5c1.8-.7 4-.6 5.8.4" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function generateId() {
  return crypto?.randomUUID?.() ??
    Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function msToTime(ms) {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

function createWidget(type) {
  if (type === 'reddit') return {
    id: generateId(), type: 'reddit', title: 'Reddit', width: 320,
  };

  if (type === 'weather') return {
    id: generateId(), type: 'weather', title: 'Weather',
    width: 400, city: 'Charlotte', loading: false, error: '', data: null,
  };

  if (type === 'steam') return {
    id: generateId(), type: 'steam', title: 'Steam',
    width: 480, query: '', loading: false, error: '', items: [],
  };

  if (type === 'anilist') return {
    id: generateId(), type: 'anilist', title: 'AniList',
    width: 430, mode: 'today', loading: false, error: '', items: [], seasonLabel: '',
  };

  if (type === 'github') return {
    id: generateId(), type: 'github', title: 'GitHub',
    width: 360, username: '', loading: false, error: '', data: null,
  };

  if (type === 'calendar') return {
    id: generateId(),
    type: 'calendar',
    title: 'Calendar',
    width: 430,
    loading: false,
    error: '',
    events: [],
    connected: false,
    view: 'today',
  };

  if (type === 'canvas') return {
  id: generateId(),
  type: 'canvas',
  title: 'Canvas',
  width: 430,
  canvasUrl: '',
  canvasToken: '',
  loading: false,
  error: '',
  connected: false,
  assignments: [],
  courseColors: {},
};

if (type === 'spotify') return {
  id: generateId(),
  type: 'spotify',
  title: 'Spotify',
  width: 380,
  loading: false,
  error: '',
  connected: false,
  data: null,
};

  return {
    id: generateId(), type: 'empty', title: 'Widget', width: 320,
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
  onRemoveWidget,
  onConnectGoogleCalendar,
  onFetchCalendarEvents,
  onCanvasUrlChange,
  onCanvasTokenChange,
  onCanvasConnect,
  onSpotifyConnect,
  onSpotifyDisconnect,
  onSpotifyRefresh,
  onSpotifyTogglePlay,
  onSpotifyNext,
  onSpotifyPrevious,
  onSpotifySeek,
}) {
  return (
    <div
      className={`deck-widget-column ${
        widget.type === 'weather' ? 'deck-widget-column--weather' :
        widget.type === 'steam'   ? 'deck-widget-column--steam'   :
        widget.type === 'anilist' ? 'deck-widget-column--anilist' :
        widget.type === 'github'  ? 'deck-widget-column--github'  : 
        widget.type === 'calendar' ? 'deck-widget-column--calendar' :
        widget.type === 'canvas' ? 'deck-widget-column--canvas' :
        widget.type === 'spotify' ? 'deck-widget-column--spotify' :
        ''
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
             widget.type === 'github'  ? 'GITHUB WIDGET'  :
             widget.type === 'calendar' ? 'CALENDAR WIDGET' :
             widget.type === 'canvas' ? 'CANVAS WIDGET' :
             widget.type === 'spotify' ? 'SPOTIFY WIDGET' :
            'EMPTY WIDGET'}
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
          <button
            type="button"
            className="deck-widget-remove-btn"
            onClick={() => onRemoveWidget(widget.id)}
            aria-label={`Remove ${widget.title}`}
          >
            ×
          </button>
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

        {/* ── Calendar ── */}
        {widget.type === 'calendar' && (
          <div className="calendar-widget">
            {!widget.connected ? (
              <div className="calendar-empty">
                <div className="calendar-empty-icon">📅</div>
                <p className="calendar-empty-title">Connect Google Calendar</p>
                <p className="calendar-empty-text">
                  Grant read access only when you want to use this widget.
                </p>
                <button
                  type="button"
                  className="deck-primary-btn"
                  onClick={() => onConnectGoogleCalendar()}
                >
                  Connect Calendar
                </button>
              </div>
            ) : (
              <>
                <div className="calendar-view-toggle">
                  <button
                    type="button"
                    className={`calendar-view-btn ${widget.view === 'today' ? 'calendar-view-btn--active' : ''}`}
                    onClick={() => onFetchCalendarEvents(widget.id, 'today')}
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    className={`calendar-view-btn ${widget.view === 'week' ? 'calendar-view-btn--active' : ''}`}
                    onClick={() => onFetchCalendarEvents(widget.id, 'week')}
                  >
                    This Week
                  </button>
                </div>

                {widget.loading ? (
                  <div className="calendar-widget-status">Loading events...</div>
                ) : widget.error ? (
                  <div className="calendar-widget-status calendar-widget-status--error">
                    {widget.error}
                  </div>
                ) : (
                  <div className="calendar-events-list">
                    {widget.events?.length > 0 ? (
                      widget.events.map((event) => (
                        <div key={event.id} className="calendar-event-card">
                          <div className="calendar-event-stripe" />
                          <div className="calendar-event-content">
                            <p className="calendar-event-title">
                              {event.summary || 'Untitled event'}
                            </p>
                            {event.start?.date ? (
                              <span className="calendar-event-allday">All day</span>
                            ) : (
                              <p className="calendar-event-time">
                                {formatCalendarEventTime(event.start, event.end)}
                              </p>
                            )}
                            {event.location && (
                              <p className="calendar-event-location">📍 {event.location}</p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="calendar-empty">
                        <div className="calendar-empty-icon">📅</div>
                        <p className="calendar-empty-title">All clear</p>
                        <p className="calendar-empty-text">No events found for this view.</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── Canvas ── */}
        {widget.type === 'canvas' && (
          <div className="canvas-widget">
            <div className="canvas-widget-dev-note">
              Dev only: use your Canvas base URL and personal access token.
            </div>

            <div className="canvas-widget-controls">
              <input
                type="text"
                className="canvas-widget-input"
                value={widget.canvasUrl}
                onChange={(e) => onCanvasUrlChange(widget.id, e.target.value)}
                placeholder="https://instructure.charlotte.edu/"
              />
              <input
                type="password"
                className="canvas-widget-input"
                value={widget.canvasToken}
                onChange={(e) => onCanvasTokenChange(widget.id, e.target.value)}
                placeholder="Canvas access token"
              />
              <button
                type="button"
                className="deck-primary-btn"
                onClick={() => onCanvasConnect(widget.id)}
              >
                Connect
              </button>
            </div>

            {widget.loading ? (
              <div className="canvas-widget-status">Connecting to Canvas...</div>
            ) : widget.error ? (
              <div className="canvas-widget-status canvas-widget-status--error">
                {widget.error}
              </div>
            ) : widget.connected ? (
              <div className="canvas-assignments-list">
                {widget.assignments.length > 0 ? (
                  widget.assignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="canvas-assignment-card"
                      style={{
                        borderLeft: `4px solid ${widget.courseColors?.[assignment.courseName] || '#4f98a3'}`,
                      }}
                    >
                      <p className="canvas-assignment-title">{assignment.name}</p>
                      <p className="canvas-assignment-course">{assignment.courseName}</p>
                      <p className="canvas-assignment-meta">
                        Due: {assignment.dueAt || 'No due date'}
                      </p>
                      <p className="canvas-assignment-meta">
                        Points: {assignment.pointsPossible ?? 'N/A'}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="canvas-widget-status">No upcoming assignments found.</div>
                )}
              </div>
            ) : (
              <div className="canvas-widget-status">
                Enter a Canvas URL and token to test the connection.
              </div>
            )}
          </div>
        )}
        
        {/* ── Spotify ── */}
        {widget.type === 'spotify' && (
          <div className="spotify-widget">
            {!widget.connected ? (
              <div className="spotify-connect-box">
                <div className="spotify-connect-icon"><SpotifyLogo /></div>
                <p className="spotify-connect-title">Connect Spotify</p>
                <p className="spotify-connect-text">
                  Sign in with Spotify to see what&apos;s playing and control playback.
                </p>
                <button
                  type="button"
                  className="spotify-connect-btn"
                  onClick={() => onSpotifyConnect(widget.id)}
                >
                  Connect Spotify
                </button>
              </div>
            ) : (
              <>
                <div className="spotify-widget-top-bar">
                  <div className="spotify-profile-row">
                    {widget.data?.profile?.avatar && (
                      <img
                        src={widget.data.profile.avatar}
                        alt="Spotify avatar"
                        className="spotify-avatar"
                      />
                    )}
                    <div>
                      <p className="spotify-display-name">
                        {widget.data?.profile?.displayName || 'Spotify User'}
                      </p>
                      <p className="spotify-product">
                        {widget.data?.profile?.product || 'free'}
                      </p>
                      {widget.data?.current?.device?.name && (
                        <p className="spotify-device-name">
                          {widget.data.current.device.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="spotify-top-actions">
                    <button
                      type="button"
                      className="spotify-refresh-btn"
                      onClick={() => onSpotifyRefresh(widget.id)}
                      aria-label="Refresh Spotify"
                    >
                      ↻
                    </button>
                    <button
                      type="button"
                      className="spotify-disconnect-btn"
                      onClick={() => onSpotifyDisconnect(widget.id)}
                    >
                      Disconnect
                    </button>
                  </div>
                </div>

                {widget.loading && <div className="spotify-status">Loading...</div>}
                {widget.error && <div className="spotify-status spotify-status--error">{widget.error}</div>}

                <div className="spotify-scroll-area">
                  {widget.data?.current ? (
                    <div className="spotify-now-playing">
                      <p className="spotify-section-label">
                        {widget.data.current.isPlaying ? '▶ NOW PLAYING' : '⏸ PAUSED'}
                      </p>

                      <div className="spotify-np-card">
                        {widget.data.current.track.image && (
                          <img
                            src={widget.data.current.track.image}
                            alt="Album art"
                            className="spotify-np-art"
                          />
                        )}

                        <div className="spotify-np-meta">
                          <a
                            href={widget.data.current.track.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="spotify-np-title"
                          >
                            {widget.data.current.track.name}
                          </a>

                          <p className="spotify-np-artist">{widget.data.current.track.artists}</p>
                          <p className="spotify-np-album">{widget.data.current.track.album}</p>

                          <div className="spotify-player-controls">
                            <button
                              type="button"
                              className="spotify-player-btn"
                              onClick={() => onSpotifyPrevious(widget.id)}
                              aria-label="Previous track"
                            >
                              ⏮
                            </button>

                            <button
                              type="button"
                              className="spotify-player-btn spotify-player-btn--main"
                              onClick={() => onSpotifyTogglePlay(widget.id)}
                              aria-label={widget.data.current.isPlaying ? 'Pause' : 'Play'}
                            >
                              {widget.data.current.isPlaying ? '⏸' : '▶'}
                            </button>

                            <button
                              type="button"
                              className="spotify-player-btn"
                              onClick={() => onSpotifyNext(widget.id)}
                              aria-label="Next track"
                            >
                              ⏭
                            </button>
                          </div>

                          {widget.data.current.durationMs > 0 && (
                            <>
                              <input
                                type="range"
                                className="spotify-seek-slider"
                                min="0"
                                max={widget.data.current.durationMs}
                                value={Math.min(
                                  widget.localProgressMs ?? widget.data.current.progressMs ?? 0,
                                  widget.data.current.durationMs
                                )}
                                onChange={(e) =>
                                  onSpotifySeek(widget.id, Number(e.target.value))
                                }
                              />

                              <div className="spotify-progress-times">
                                <span>
                                  {msToTime(widget.localProgressMs ?? widget.data.current.progressMs ?? 0)}
                                </span>
                                <span>{msToTime(widget.data.current.durationMs)}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    !widget.loading && <p className="spotify-idle">Nothing playing right now.</p>
                  )}

                  {widget.data?.topTracks?.length > 0 && (
                    <div className="spotify-section">
                      <p className="spotify-section-label">TOP TRACKS</p>
                      <div className="spotify-track-list">
                        {widget.data.topTracks.map((track, i) => (
                          <a
                            key={track.id}
                            href={track.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="spotify-track-row"
                          >
                            <span className="spotify-track-num">{i + 1}</span>
                            {track.image && (
                              <img src={track.image} alt={track.name} className="spotify-track-art" />
                            )}
                            <div className="spotify-track-meta">
                              <p className="spotify-track-name">{track.name}</p>
                              <p className="spotify-track-artist">{track.artists}</p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {widget.data?.recentTracks?.length > 0 && (
                    <div className="spotify-section">
                      <p className="spotify-section-label">RECENTLY PLAYED</p>
                      <div className="spotify-track-list">
                        {widget.data.recentTracks.map((track) => (
                          <a
                            key={track.id}
                            href={track.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="spotify-track-row"
                          >
                            {track.image && (
                              <img src={track.image} alt={track.name} className="spotify-track-art" />
                            )}
                            <div className="spotify-track-meta">
                              <p className="spotify-track-name">{track.name}</p>
                              <p className="spotify-track-artist">{track.artists}</p>
                            </div>
                            <span className="spotify-track-time">
                              {new Date(track.playedAt).toLocaleTimeString([], {
                                hour: 'numeric',
                                minute: '2-digit',
                              })}
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
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
    { id: 'calendar', name: 'Google Calendar', description: 'Connect and view your calendars and upcoming events.' },
    { id: 'canvas', name: 'Canvas', description: 'Dev-only token test for assignments, due dates, and points.' },
    { id: 'spotify', name: 'Spotify', description: 'Now playing, top tracks, and recently played songs.' },
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

      <div className="widget-service-list-scroll">
        <div className="widget-service-list">
          {filteredServices.length === 0 ? (
            <div className="widget-service-empty">No services match that search yet.</div>
          ) : (
            filteredServices.map((service) => (
              <button key={service.id} type="button" className="widget-service-item"
                onClick={() => onSelectWidgetType(service.id)}>
                <div className="widget-service-icon">
                  {service.id === 'reddit'   && <RedditLogo />}
                  {service.id === 'weather'  && <WeatherLogo />}
                  {service.id === 'steam'    && <SteamLogo />}
                  {service.id === 'anilist'  && <AniListLogo />}
                  {service.id === 'github'   && <GitHubLogo />}
                  {service.id === 'calendar' && <CalendarLogo />}
                  {service.id === 'canvas'   && <CanvasLmsLogo />}
                  {service.id === 'spotify'  && <SpotifyLogo />}
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
  </div>
);}

function SortableWidgetItem({ widget, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="sortable-widget-item"
      {...attributes}
      {...listeners}
    >
      {children}
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
  onRemoveWidget,
  onDragEnd,
  onConnectGoogleCalendar,
  onFetchCalendarEvents,
  onCanvasUrlChange,
  onCanvasTokenChange,
  onCanvasConnect,
  onSpotifyConnect,
  onSpotifyDisconnect,
  onSpotifyRefresh,
  onSpotifyTogglePlay,
  onSpotifyNext,
  onSpotifyPrevious,
  onSpotifySeek,
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

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
              Start by adding a widget column.
            </p>
            <button type="button" className="deck-primary-btn" onClick={onOpenWidgetPicker}>
              Add your first widget
            </button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={widgets.map((widget) => widget.id)}
              strategy={horizontalListSortingStrategy}
            >
              <div className="deck-columns">
                {widgets.map((widget) => (
                  <SortableWidgetItem key={widget.id} widget={widget}>
                    <WidgetColumn
                      widget={widget}
                      onResize={onResizeWidget}
                      onWeatherCityChange={onWeatherCityChange}
                      onWeatherRefresh={onWeatherRefresh}
                      onSteamQueryChange={onSteamQueryChange}
                      onSteamSearch={onSteamSearch}
                      onAniListModeChange={onAniListModeChange}
                      onGithubUsernameChange={onGithubUsernameChange}
                      onGithubSearch={onGithubSearch}
                      onRemoveWidget={onRemoveWidget}
                      onConnectGoogleCalendar={onConnectGoogleCalendar}
                      onFetchCalendarEvents={onFetchCalendarEvents}
                      onCanvasUrlChange={onCanvasUrlChange}
                      onCanvasTokenChange={onCanvasTokenChange}
                      onCanvasConnect={onCanvasConnect}
                      onSpotifyConnect={onSpotifyConnect}
                      onSpotifyDisconnect={onSpotifyDisconnect}
                      onSpotifyRefresh={onSpotifyRefresh}
                      onSpotifyTogglePlay={onSpotifyTogglePlay}
                      onSpotifyNext={onSpotifyNext}
                      onSpotifyPrevious={onSpotifyPrevious}
                      onSpotifySeek={onSpotifySeek}
                    />
                  </SortableWidgetItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
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

function formatCalendarEventTime(startObj, endObj) {
  const startValue = startObj?.dateTime || startObj?.date;
  const endValue = endObj?.dateTime || endObj?.date;

  if (!startValue) return 'Time TBA';

  const start = new Date(startValue);

  // all-day event
  if (startObj?.date && !startObj?.dateTime) {
    return start.toLocaleDateString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }

  if (!endValue) {
    return start.toLocaleString([], {
      weekday: 'short',
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  const end = new Date(endValue);

  return `${start.toLocaleString([], {
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
  })} – ${end.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  })}`;
}


export default function DashboardPage({ onLogout }) {
  const [widgets, setWidgets] = useState([]);
  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false);
  const API_BASE = 'https://www.makeadash.tech';
  console.log("API_BASE =", API_BASE);
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

    const formatted = data.map((w) => {
      const { id: _configId, ...safeConfig } = w.config || {};

      return {
        ...safeConfig,
        id: w.id,
        type: safeConfig.type,
        title: w.name,
        width: safeConfig.width,
        city: safeConfig.city,
      };
    });

    setWidgets(formatted);
  }

  async function handleRemoveWidget(widgetId) {
    console.log('Attempting to delete widget:', widgetId);

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      console.error('Could not get current user for delete:', userError);
      return;
    }

    const user = userData.user;
    console.log('Current user id:', user.id);

    // verify the row exists before deleting
    const { data: existingRows, error: lookupError } = await supabase
      .from('widgets')
      .select('id, user_id, name')
      .eq('id', widgetId);

    console.log('Widget rows matching id before delete:', existingRows);
    if (lookupError) {
      console.error('Lookup before delete failed:', lookupError);
    }

    const { data: deletedRows, error } = await supabase
      .from('widgets')
      .delete()
      .eq('id', widgetId)
      .eq('user_id', user.id)
      .select();

    if (error) {
      console.error('Failed to delete widget:', error);
      return;
    }

    console.log('Deleted rows:', deletedRows);

    setWidgets((prev) => prev.filter((widget) => widget.id !== widgetId));
  }

  async function persistWidgetOrder(reorderedWidgets) {
    const updates = reorderedWidgets.map((widget, index) =>
      supabase
        .from('widgets')
        .update({ order_index: index })
        .eq('id', widget.id)
    );

    const results = await Promise.all(updates);
    const failed = results.find((result) => result.error);

    if (failed) {
      console.error('Failed to persist widget order:', failed.error);
    }
  }

  async function handleDragEnd(event) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = widgets.findIndex((widget) => widget.id === active.id);
    const newIndex = widgets.findIndex((widget) => widget.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(widgets, oldIndex, newIndex).map((widget, index) => ({
      ...widget,
      order_index: index,
    }));

    setWidgets(reordered);
    await persistWidgetOrder(reordered);
  }

  // ── Weather ─────────────────────────────────────────────────────────────────
  async function fetchWeatherForWidget(widgetId, city) {
    setWidgets((prev) =>
      prev.map((w) => w.id === widgetId ? { ...w, loading: true, error: '' } : w)
    );
    try {
      const response = await fetch(
        `https://www.makeadash.tech/api/weather?city=${encodeURIComponent(city)}`
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
        `https://www.makeadash.tech/api/steam/featured?q=${encodeURIComponent(query)}`
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
      const response = await fetch(`https://www.makeadash.tech/api/anilist/${endpoint}`);
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
        `https://www.makeadash.tech/api/github/user?username=${encodeURIComponent(username)}`,
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

  // ── Calendar ───────────────────────────────────────────────────────────
  async function connectGoogleCalendar() {
    localStorage.setItem('connect_google_calendar', 'true');

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        scopes: 'https://www.googleapis.com/auth/calendar.readonly',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error('Calendar OAuth failed:', error);
    }
  }

  async function fetchCalendarEventsForWidget(widgetId, view = 'today') {
    setWidgets((prev) =>
      prev.map((w) =>
        w.id === widgetId ? { ...w, loading: true, error: '', view } : w
      )
    );

    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;

      const token = data?.session?.provider_token;
      if (!token) {
        throw new Error('No Google provider token found. Please connect Google Calendar.');
      }

      const now = new Date();

      let timeMin;
      let timeMax;

      if (view === 'today') {
        const start = new Date(now);
        start.setHours(0, 0, 0, 0);

        const end = new Date(now);
        end.setHours(23, 59, 59, 999);

        timeMin = start.toISOString();
        timeMax = end.toISOString();
      } else {
        const start = new Date(now);
        start.setHours(0, 0, 0, 0);

        const end = new Date(now);
        end.setDate(end.getDate() + 7);
        end.setHours(23, 59, 59, 999);

        timeMin = start.toISOString();
        timeMax = end.toISOString();
      }

      const params = new URLSearchParams({
        timeMin,
        timeMax,
        singleEvents: 'true',
        orderBy: 'startTime',
        maxResults: view === 'today' ? '20' : '50',
      });

      const res = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error?.message || 'Failed to fetch calendar events.');
      }

      setWidgets((prev) =>
        prev.map((w) =>
          w.id === widgetId
            ? {
                ...w,
                loading: false,
                error: '',
                connected: true,
                events: json.items || [],
                view,
              }
            : w
        )
      );
    } catch (error) {
      setWidgets((prev) =>
        prev.map((w) =>
          w.id === widgetId
            ? {
                ...w,
                loading: false,
                error: error.message || 'Unable to load calendar events.',
              }
            : w
        )
      );
    }
  }

  useEffect(() => {
    async function tryCalendarReconnect() {
      const shouldConnect = localStorage.getItem('connect_google_calendar');
      if (shouldConnect !== 'true') return;

      localStorage.removeItem('connect_google_calendar');

      const calendarWidget = widgets.find((w) => w.type === 'calendar');
      if (!calendarWidget) return;

      await fetchCalendarEventsForWidget(calendarWidget.id, 'today');
    }

    if (widgets.length > 0) {
      tryCalendarReconnect();
    }
  }, [widgets]);

  // Canvas
  function handleCanvasUrlChange(widgetId, value) {
    setWidgets((prev) =>
      prev.map((w) => (w.id === widgetId ? { ...w, canvasUrl: value } : w))
    );
  }

  function handleCanvasTokenChange(widgetId, value) {
    setWidgets((prev) =>
      prev.map((w) => (w.id === widgetId ? { ...w, canvasToken: value } : w))
    );
  }

    function pickCourseColor(index) {
    const palette = ['#4f98a3', '#7aa2ff', '#ff9f43', '#9bdeac', '#ec6ead', '#c792ea'];
    return palette[index % palette.length];
  }

  async function connectCanvasWidget(widgetId) {
    const widget = widgets.find((w) => w.id === widgetId);
    if (!widget) return;

    const canvasUrl = widget.canvasUrl.trim().replace(/\/+$/, '');
    const canvasToken = widget.canvasToken.trim();

    if (!canvasUrl || !canvasToken) {
      setWidgets((prev) =>
        prev.map((w) =>
          w.id === widgetId
            ? { ...w, error: 'Canvas URL and token are required.' }
            : w
        )
      );
      return;
    }

    setWidgets((prev) =>
      prev.map((w) =>
        w.id === widgetId
          ? { ...w, loading: true, error: '', connected: false }
          : w
      )
    );

    try {
      const userRes = await fetch(`https://www.makeadash.tech/api/canvas/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ canvasUrl, canvasToken }),
      });

      const userJson = await userRes.json();

      if (!userRes.ok) {
        throw new Error(userJson.error || 'Canvas connection failed.');
      }

      const assignmentsRes = await fetch(`https://www.makeadash.tech/api/canvas/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ canvasUrl, canvasToken }),
      });

      const assignmentsJson = await assignmentsRes.json();

      if (!assignmentsRes.ok) {
        throw new Error(assignmentsJson.error || 'Failed to fetch assignments.');
      }

      const uniqueCourses = [...new Set(assignmentsJson.assignments.map((a) => a.courseName))];
      const courseColors = Object.fromEntries(
        uniqueCourses.map((course, index) => [course, pickCourseColor(index)])
      );

      setWidgets((prev) =>
        prev.map((w) =>
          w.id === widgetId
            ? {
                ...w,
                loading: false,
                error: '',
                connected: true,
                assignments: assignmentsJson.assignments || [],
                courseColors,
              }
            : w
        )
      );
    } catch (error) {
      setWidgets((prev) =>
        prev.map((w) =>
          w.id === widgetId
            ? {
                ...w,
                loading: false,
                error: error.message || 'Unable to connect to Canvas.',
                connected: false,
              }
            : w
        )
      );
    }
  }

async function fetchSpotifyForWidget(widgetId) {
  setWidgets(prev =>
    prev.map(w =>
      w.id === widgetId ? { ...w, loading: true, error: '' } : w
    )
  )

  try {
    const res = await fetch('https://www.makeadash.tech/api/spotify/me', {
      credentials: 'include',
    })

    const data = await res.json()

    if (res.status === 401) {
      setWidgets(prev =>
        prev.map(w =>
          w.id === widgetId
            ? { ...w, loading: false, connected: false, data: null, error: '', localProgressMs: 0 }
            : w
        )
      )
      return
    }

    if (!res.ok) {
      throw new Error(data.error || 'Failed to fetch Spotify data.')
    }

    setWidgets(prev =>
      prev.map(w =>
        w.id === widgetId
          ? {
              ...w,
              loading: false,
              error: '',
              connected: true,
              data,
              localProgressMs: data.current?.progressMs ?? 0,
            }
          : w
      )
    )
  } catch (err) {
    setWidgets(prev =>
      prev.map(w =>
        w.id === widgetId
          ? { ...w, loading: false, error: err.message || 'Unable to load Spotify.' }
          : w
      )
    )
  }
}

function handleSpotifyConnect(widgetId) {
  sessionStorage.setItem('spotifyWidgetId', widgetId)
  window.location.href = 'https://www.makeadash.tech/api/spotify/login'
}

async function handleSpotifyDisconnect(widgetId) {
  try {
    await fetch('https://www.makeadash.tech/api/spotify/disconnect', {
      credentials: 'include',
    })
  } catch (_) {}

  setWidgets(prev =>
    prev.map(w =>
      w.id === widgetId
        ? { ...w, connected: false, data: null, error: '', localProgressMs: 0 }
        : w
    )
  )
}

function handleSpotifyRefresh(widgetId) {
  fetchSpotifyForWidget(widgetId)
}

async function runSpotifyCommand(widgetId, endpoint, method = 'POST') {
  try {
    const res = await fetch(`https://www.makeadash.tech/api/spotify/${endpoint}`, {
      method,
      credentials: 'include',
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      throw new Error(data.error || `Failed to run Spotify action: ${endpoint}`)
    }

    setTimeout(() => {
      fetchSpotifyForWidget(widgetId)
    }, 450)
  } catch (err) {
    setWidgets(prev =>
      prev.map(w =>
        w.id === widgetId
          ? { ...w, error: err.message || 'Spotify action failed.' }
          : w
      )
    )
  }
}

function handleSpotifyTogglePlay(widgetId) {
  const widget = widgets.find(w => w.id === widgetId)
  const isPlaying = !!widget?.data?.current?.isPlaying
  runSpotifyCommand(widgetId, isPlaying ? 'pause' : 'play', 'PUT')
}

function handleSpotifyNext(widgetId) {
  runSpotifyCommand(widgetId, 'next', 'POST')
}

function handleSpotifyPrevious(widgetId) {
  runSpotifyCommand(widgetId, 'previous', 'POST')
}

async function handleSpotifySeek(widgetId, positionMs) {
  try {
    setWidgets(prev =>
      prev.map(w =>
        w.id === widgetId ? { ...w, localProgressMs: positionMs } : w
      )
    )

    const res = await fetch(
      `https://www.makeadash.tech/api/spotify/seek?position_ms=${positionMs}`,
      {
        method: 'PUT',
        credentials: 'include',
      }
    )

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      throw new Error(data.error || 'Failed to seek playback.')
    }

    setTimeout(() => {
      fetchSpotifyForWidget(widgetId)
    }, 300)
  } catch (err) {
    setWidgets(prev =>
      prev.map(w =>
        w.id === widgetId
          ? { ...w, error: err.message || 'Seek failed.' }
          : w
      )
    )
  }
}

// ── Check status on mount for any existing Spotify widgets ──
useEffect(() => {
  async function checkSpotifyStatus() {
    const spotifyWidgets = widgets.filter(w => w.type === 'spotify');
    if (spotifyWidgets.length === 0) return;
    try {
      const res = await fetch('https://www.makeadash.tech/api/spotify/status', { credentials: 'include' });
      const { connected } = await res.json();
      if (connected) {
        spotifyWidgets.forEach(w => fetchSpotifyForWidget(w.id));
      }
    } catch (_) {}
  }
  if (widgets.length > 0) checkSpotifyStatus();
}, [widgets.length]);

useEffect(() => {
  const spotifyWidgetId = sessionStorage.getItem('spotifyWidgetId');
  if (!spotifyWidgetId) return;
  sessionStorage.removeItem('spotifyWidgetId');

  // Wait for widgets to load, then fetch Spotify data
  const tryFetch = () => {
    const match = widgets.find(w => w.id === spotifyWidgetId);
    if (match) {
      fetchSpotifyForWidget(spotifyWidgetId);
    }
  };
  if (widgets.length > 0) tryFetch();
}, [widgets.length]);

// Poll Spotify every 8 seconds for connected widgets
useEffect(() => {
  const spotifyWidgets = widgets.filter(w => w.type === 'spotify' && w.connected)

  if (spotifyWidgets.length === 0) return

  const interval = setInterval(() => {
    spotifyWidgets.forEach(w => {
      fetchSpotifyForWidget(w.id)
    })
  }, 8000)

  return () => clearInterval(interval)
}, [widgets.filter(w => w.type === 'spotify' && w.connected).map(w => w.id).join('|')])

// Smooth local progress ticking every second
useEffect(() => {
  const interval = setInterval(() => {
    setWidgets(prev =>
      prev.map(w => {
        if (w.type !== 'spotify' || !w.connected || !w.data?.current?.isPlaying) {
          return w
        }

        const duration = w.data.current.durationMs ?? 0
        const nextProgress = Math.min((w.localProgressMs ?? w.data.current.progressMs ?? 0) + 1000, duration)

        return {
          ...w,
          localProgressMs: nextProgress,
        }
      })
    )
  }, 1000)

  return () => clearInterval(interval)
}, [])

  // ── Widget picker ────────────────────────────────────────────────────────────
  function openWidgetPicker()  { setIsWidgetModalOpen(true);  }
  function closeWidgetPicker() { setIsWidgetModalOpen(false); }

  async function handleAddWidgetByType(type) {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    const newWidget = createWidget(type);

    const { data, error } = await supabase
      .from('widgets')
      .insert({
        user_id: user.id,
        name: newWidget.title,
        order_index: widgets.length,
        config: {
          type: newWidget.type,
          width: newWidget.width,
          city: newWidget.city,
          query: newWidget.query,
          mode: newWidget.mode,
          username: newWidget.username,
          canvasUrl: newWidget.canvasUrl,
          canvasToken: newWidget.canvasToken,
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
      order_index: data.order_index ?? widgets.length,
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

    if (type === 'github') {
      // no auto-fetch until username entered
    }

    if (type === 'calendar') {
    // no auto-fetch until user clicks connect
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
            <h1 className="dashboard-title">Welcome to MakeADash</h1>
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
          onRemoveWidget={handleRemoveWidget}
          onDragEnd={handleDragEnd}
          onConnectGoogleCalendar={connectGoogleCalendar}
          onFetchCalendarEvents={fetchCalendarEventsForWidget}
          onCanvasUrlChange={handleCanvasUrlChange}
          onCanvasTokenChange={handleCanvasTokenChange}
          onCanvasConnect={connectCanvasWidget}
          onSpotifyConnect={handleSpotifyConnect}
          onSpotifyDisconnect={handleSpotifyDisconnect}
          onSpotifyRefresh={handleSpotifyRefresh}
          onSpotifyTogglePlay={handleSpotifyTogglePlay}
          onSpotifyNext={handleSpotifyNext}
          onSpotifyPrevious={handleSpotifyPrevious}
          onSpotifySeek={handleSpotifySeek}
        />

              <div className="dashboard-coming-soon">
        <div className="dashboard-coming-soon-left">
          <p className="dashboard-coming-soon-eyebrow">ROADMAP</p>
          <h3 className="dashboard-coming-soon-title">More widgets on the way</h3>
          <p className="dashboard-coming-soon-text">
            Gmail, Instagram, Twitter/X, Notion, Discord notifications, and more
            are being built into this same deck model.
          </p>
        </div>
        <div className="dashboard-coming-soon-chips">
          {['Gmail', 'Instagram', 'Twitter / X', 'Notion', 'Discord', 'YouTube', 'Twitch', 'LinkedIn'].map(name => (
            <span key={name} className="dashboard-coming-soon-chip">{name}</span>
          ))}
        </div>
      </div>
      </main>

      <AddWidgetModal
        isOpen={isWidgetModalOpen}
        onClose={closeWidgetPicker}
        onSelectWidgetType={handleAddWidgetByType}
      />
    </div>
  );
}