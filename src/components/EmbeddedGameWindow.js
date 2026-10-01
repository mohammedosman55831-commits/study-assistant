'use client';

import { useState, useRef, useEffect } from 'react';
import {
  downloadGameHtml,
  downloadGameCss,
  downloadGameJs,
  downloadGameZip,
} from '@/lib/game-engine/exporter';

export default function EmbeddedGameWindow({ game, onClose, onRestart }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const containerRef = useRef(null);
  const iframeRef = useRef(null);

  // Restart iframe game
  const handleRestart = () => {
    if (iframeRef.current) {
      // Reload iframe srcDoc
      const prevSrc = iframeRef.current.srcdoc;
      iframeRef.current.srcdoc = '';
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.srcdoc = prevSrc || game.fullHtml;
        }
      }, 50);
    }
    setIsPlaying(true);
    if (onRestart) onRestart();
  };

  // Toggle play/pause by messaging or simulating P key
  const handleTogglePlay = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'p', code: 'KeyP', bubbles: true })
        );
      } catch (e) {}
    }
    setIsPlaying(!isPlaying);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      await downloadGameZip(game);
    } catch (e) {
      console.error('ZIP generation error:', e);
    } finally {
      setIsZipping(false);
      setShowDownloadMenu(false);
    }
  };

  if (!game) return null;

  return (
    <div
      ref={containerRef}
      className={`embedded-game-panel ${isFullscreen ? 'fullscreen-mode' : ''}`}
      style={{
        background: 'var(--bg-card, #131722)',
        borderRadius: isFullscreen ? '0px' : '18px',
        border: '1px solid var(--border, #2d3748)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        margin: isFullscreen ? '0' : '16px 0',
        transition: 'all 0.25s ease',
        zIndex: isFullscreen ? 9999 : 'auto',
        position: isFullscreen ? 'fixed' : 'relative',
        inset: isFullscreen ? '0' : 'auto',
        width: isFullscreen ? '100vw' : '100%',
        height: isFullscreen ? '100vh' : 'auto',
      }}
    >
      {/* Top Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 18px',
          background: 'var(--bg-secondary, #1a202c)',
          borderBottom: '1px solid var(--border, #2d3748)',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        {/* Game Title & Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '17px',
              boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
            }}
          >
            🎮
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--text-primary, #ffffff)' }}>
              {game.title}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary, #94a3b8)', display: 'flex', gap: '6px' }}>
              <span style={{ textTransform: 'uppercase', fontWeight: 700, color: '#38bdf8' }}>
                {game.type}
              </span>
              <span>•</span>
              <span style={{ color: '#10b981', fontWeight: 600 }}>HTML5 Canvas (Offline)</span>
            </div>
          </div>
        </div>

        {/* Action Controls Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
          {/* Controls Toggle */}
          <button
            type="button"
            onClick={() => setShowControls(!showControls)}
            title="View Game Controls"
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border, #334155)',
              background: showControls ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.06)',
              color: showControls ? '#818cf8' : 'var(--text-secondary, #cbd5e1)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            🕹️ Controls
          </button>

          {/* Play/Pause */}
          <button
            type="button"
            onClick={handleTogglePlay}
            title={isPlaying ? 'Pause Game (P)' : 'Play Game (P)'}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border, #334155)',
              background: isPlaying ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
              color: isPlaying ? '#34d399' : '#f87171',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>

          {/* Restart */}
          <button
            type="button"
            onClick={handleRestart}
            title="Restart Game"
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border, #334155)',
              background: 'rgba(255,255,255,0.06)',
              color: 'var(--text-primary, #ffffff)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            🔄 Restart
          </button>

          {/* Fullscreen */}
          <button
            type="button"
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border, #334155)',
              background: 'rgba(255,255,255,0.06)',
              color: 'var(--text-primary, #ffffff)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            {isFullscreen ? '⛷️ Exit Fullscreen' : '⛶ Fullscreen'}
          </button>

          {/* Download Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setShowDownloadMenu(!showDownloadMenu)}
              title="Download Game Files"
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: '0 2px 10px rgba(16,185,129,0.3)',
              }}
            >
              💾 Download ▾
            </button>

            {showDownloadMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '6px',
                  background: 'var(--bg-card, #1e293b)',
                  border: '1px solid var(--border, #334155)',
                  borderRadius: '12px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
                  minWidth: '200px',
                  zIndex: 100,
                  padding: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <button
                  type="button"
                  onClick={handleDownloadZip}
                  disabled={isZipping}
                  style={{
                    padding: '8px 12px',
                    textAlign: 'left',
                    borderRadius: '8px',
                    background: 'rgba(99,102,241,0.15)',
                    border: '1px solid rgba(99,102,241,0.3)',
                    color: '#a5b4fc',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: isZipping ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>📦 Full ZIP Project</span>
                  <small style={{ fontSize: '10px', opacity: 0.8 }}>Offline</small>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    downloadGameHtml(game);
                    setShowDownloadMenu(false);
                  }}
                  style={{
                    padding: '8px 12px',
                    textAlign: 'left',
                    borderRadius: '8px',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary, #ffffff)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>📄 Download HTML</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    downloadGameCss(game);
                    setShowDownloadMenu(false);
                  }}
                  style={{
                    padding: '8px 12px',
                    textAlign: 'left',
                    borderRadius: '8px',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary, #ffffff)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>🎨 Download CSS</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    downloadGameJs(game);
                    setShowDownloadMenu(false);
                  }}
                  style={{
                    padding: '8px 12px',
                    textAlign: 'left',
                    borderRadius: '8px',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary, #ffffff)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>⚡ Download JavaScript</span>
                </button>
              </div>
            )}
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              title="Close Preview"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                border: 'none',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#ef4444',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Controls Info Banner */}
      {showControls && (
        <div
          style={{
            padding: '10px 18px',
            background: 'rgba(99, 102, 241, 0.1)',
            borderBottom: '1px solid rgba(99, 102, 241, 0.2)',
            fontSize: '12.5px',
            color: '#c7d2fe',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span style={{ fontWeight: 700, color: '#818cf8' }}>🕹️ CONTROLS:</span>
          <span>{game.controls}</span>
        </div>
      )}

      {/* Sandboxed Game Iframe */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: isFullscreen ? 'calc(100vh - 56px)' : '480px',
          background: '#090b10',
          overflow: 'hidden',
        }}
      >
        <iframe
          ref={iframeRef}
          srcDoc={game.fullHtml}
          title={game.title}
          sandbox="allow-scripts allow-same-origin allow-modals"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block',
          }}
        />
      </div>

      {/* Bottom Status Bar */}
      <div
        style={{
          padding: '8px 18px',
          background: 'var(--bg-secondary, #1a202c)',
          borderTop: '1px solid var(--border, #2d3748)',
          fontSize: '11.5px',
          color: 'var(--text-secondary, #94a3b8)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div>
          <span style={{ color: '#10b981', fontWeight: 700 }}>● Game Ready!</span>{' '}
          {game.description}
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <span>⌨️ Keyboard Supported</span>
          <span>📱 Touch & Mobile Ready</span>
          <span>⚡ No External Engine</span>
        </div>
      </div>
    </div>
  );
}
