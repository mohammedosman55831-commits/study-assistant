/* ============================================
   RESPONSIVE MOBILE TOUCH CONTROLS
   Provides virtual D-pad and action buttons for
   mobile devices and touchscreens.
   ============================================ */

export function getMobileControlsHtml(options = {}) {
  const { hasAction = true, actionLabel = 'ACTION', hasSecondary = false, secondaryLabel = 'B', dpadType = '4way' } = options;

  return `
  <!-- Mobile Virtual Controls Overlay -->
  <div id="mobile-controls" class="mobile-controls-container">
    <div class="dpad-cluster">
      ${dpadType === '4way' || dpadType === 'updown' ? '<button class="vbtn dpad-btn" id="btn-up" data-key="ArrowUp">▲</button>' : ''}
      <div class="dpad-horizontal">
        <button class="vbtn dpad-btn" id="btn-left" data-key="ArrowLeft">◀</button>
        <div class="dpad-center"></div>
        <button class="vbtn dpad-btn" id="btn-right" data-key="ArrowRight">▶</button>
      </div>
      ${dpadType === '4way' || dpadType === 'updown' ? '<button class="vbtn dpad-btn" id="btn-down" data-key="ArrowDown">▼</button>' : ''}
    </div>

    <div class="action-cluster">
      ${hasSecondary ? `<button class="vbtn action-btn sec" id="btn-sec" data-key="KeyX">${secondaryLabel}</button>` : ''}
      ${hasAction ? `<button class="vbtn action-btn main" id="btn-action" data-key="Space">${actionLabel}</button>` : ''}
    </div>
  </div>
  `;
}

export const MOBILE_CONTROLS_CSS = `
  /* Responsive Mobile Touch Controls */
  .mobile-controls-container {
    display: none;
    position: absolute;
    bottom: 12px;
    left: 12px;
    right: 12px;
    justify-content: space-between;
    align-items: flex-end;
    pointer-events: none;
    z-index: 50;
    user-select: none;
    -webkit-user-select: none;
  }

  @media (max-width: 900px), (pointer: coarse) {
    .mobile-controls-container {
      display: flex;
    }
  }

  .vbtn {
    pointer-events: auto;
    background: rgba(255, 255, 255, 0.18);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1.5px solid rgba(255, 255, 255, 0.35);
    color: #ffffff;
    border-radius: 14px;
    font-family: inherit;
    font-weight: 800;
    touch-action: manipulation;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    active-scale: 0.94;
    transition: transform 0.05s ease, background 0.05s ease;
  }
  .vbtn:active, .vbtn.pressed {
    background: rgba(99, 102, 241, 0.6);
    transform: scale(0.92);
  }

  .dpad-cluster {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }
  .dpad-horizontal {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .dpad-center {
    width: 32px;
    height: 32px;
  }
  .dpad-btn {
    width: 48px;
    height: 48px;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .action-cluster {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .action-btn {
    min-width: 58px;
    height: 58px;
    padding: 0 14px;
    border-radius: 50%;
    font-size: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .action-btn.main {
    background: rgba(99, 102, 241, 0.45);
    border-color: rgba(165, 180, 252, 0.6);
  }
  .action-btn.sec {
    background: rgba(239, 68, 68, 0.4);
    border-color: rgba(252, 165, 165, 0.6);
    width: 48px;
    height: 48px;
  }
`;

export const MOBILE_CONTROLS_JS = `
// Initialize Mobile Touch Controller
(function setupMobileControls() {
  const buttons = document.querySelectorAll('.vbtn');
  buttons.forEach(btn => {
    const key = btn.getAttribute('data-key');
    if (!key) return;

    const fireKeyDown = (e) => {
      e.preventDefault();
      btn.classList.add('pressed');
      window.dispatchEvent(new KeyboardEvent('keydown', { key: key, code: key, bubbles: true }));
      if (typeof handleVirtualKey === 'function') handleVirtualKey(key, true);
    };

    const fireKeyUp = (e) => {
      e.preventDefault();
      btn.classList.remove('pressed');
      window.dispatchEvent(new KeyboardEvent('keyup', { key: key, code: key, bubbles: true }));
      if (typeof handleVirtualKey === 'function') handleVirtualKey(key, false);
    };

    btn.addEventListener('touchstart', fireKeyDown, { passive: false });
    btn.addEventListener('touchend', fireKeyUp, { passive: false });
    btn.addEventListener('mousedown', fireKeyDown);
    btn.addEventListener('mouseup', fireKeyUp);
    btn.addEventListener('mouseleave', fireKeyUp);
  });
})();
`;
