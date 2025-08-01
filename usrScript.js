// ==UserScript==
// @name         YouTube Live Chat Iframe Spam Tool By TheGreen
// @namespace    http://tampermonkey.net/
// @version      2025-06-11-v4-collapsible-tweaks
// @description  yt live Spam tool,  numeric fields centered, delay labels below inputs, per latest spec
// @match        https://www.youtube.com/live_chat*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

    const wrapper = document.createElement("div");
        document.body.appendChild(wrapper);
        wrapper.style.display = "none";

    if (location.pathname.startsWith('/live_chat')) {
 if (!location.pathname.startsWith('/live_chat')) return;

  let chatInput = null;
  let spamInterval = null;


  // Main container
  const ui = document.createElement('div');
  Object.assign(ui.style, {
    position: 'fixed',
    top: '10px',
    right: '10px',
    width: '320px',
    background: '#1e1e1e',
    border: '1px solid #444',
    borderRadius: '6px',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    color: '#eee',
    boxShadow: '0 3px 8px rgba(0,0,0,0.3)',
    zIndex: 999999,
    display: 'flex',
    flexDirection: 'column',
    userSelect: 'none',
  });
  wrapper.appendChild(ui);

  // Header: arrow at left, title centered, particle canvas behind
  const header = document.createElement('div');
  Object.assign(header.style, {
    position: 'relative',
    height: '32px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 10px',
    background: '#2a2a2a',
    borderTopLeftRadius: '6px',
    borderTopRightRadius: '6px',
    overflow: 'hidden',
  });
  const canvas = document.createElement('canvas');
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.width = header.clientWidth || 300;
  canvas.height = header.clientHeight || 32;
  header.appendChild(canvas);

  const arrow = document.createElement('span');
  arrow.textContent = '►';
  Object.assign(arrow.style, {
    position: 'absolute',
    left: '10px',
    fontSize: '14px',
    zIndex: '1',
  });
  const titleText = document.createElement('span');
  titleText.textContent = 'Spam Tool v4';
  titleText.style.fontWeight = '600';
  titleText.style.fontSize = '14px';
  titleText.style.zIndex = '1';

  header.append(arrow, titleText);
  ui.appendChild(header);

  const content = document.createElement('div');
  Object.assign(content.style, {
    display: 'none',
    flexDirection: 'column',
    padding: '8px 10px',
    gap: '8px',
    background: '#282828',
    borderBottomLeftRadius: '6px',
    borderBottomRightRadius: '6px',
  });
  ui.appendChild(content);

  const messageContainer = document.createElement('div');
  Object.assign(messageContainer.style, {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    maxHeight: '152px',
    overflowY: 'hidden',
  });
  content.appendChild(messageContainer);

  const messageFields = [];
  function addMessageField() {
    const idx = messageFields.length + 1;
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.placeholder = `Load First And Enter Your Spam Comment ${idx}`;
    Object.assign(inp.style, {
      padding: '6px 8px',
      border: '1px solid #555',
      borderRadius: '4px',
      background: '#1f1f1f',
      color: '#eee',
      fontSize: '13px',
      width: '100%',
      boxSizing: 'border-box',
      margin: '0',
      cursor: inp.disabled ? 'not-allowed' : 'text',
    });
    inp.disabled = true;
    messageFields.push(inp);
    messageContainer.appendChild(inp);
    if (messageFields.length > 4) {
      messageContainer.style.overflowY = 'auto';
    } else {
      messageContainer.style.overflowY = 'hidden';
    }
  }
  function resetMessageFieldsInitial() {
    messageFields.slice().forEach(f => messageContainer.removeChild(f));
    messageFields.length = 0;
    addMessageField();
  }
  resetMessageFieldsInitial();

  const sendCountWrapper = document.createElement('div');
  Object.assign(sendCountWrapper.style, {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '4px',
  });
  const sendCountLabel = document.createElement('label');
  sendCountLabel.textContent = '\u00A0\u00A0\u00A0\u00A0Send Msg Count:';
  sendCountLabel.style.fontSize = '13px';
  sendCountLabel.style.userSelect = 'none';
  const sendCountInput = document.createElement('input');
  sendCountInput.type = 'number';
  sendCountInput.value = '9999';
  sendCountInput.min = '1';
  Object.assign(sendCountInput.style, {
   padding: '6px 8px',
    border: '1px solid #555',
    borderRadius: '4px',
    background: '#1f1f1f',
    color: '#eee',
    fontSize: '13px',
    textAlign: 'center',
    width: '49%',
    boxSizing: 'border-box',
    cursor: 'not-allowed',
  });
  sendCountInput.disabled = true;
  sendCountWrapper.append(sendCountLabel, sendCountInput);
  content.appendChild(sendCountWrapper);

  const delaysWrapper = document.createElement('div');
  Object.assign(delaysWrapper.style, {
    display: 'flex',
    gap: '8px',
    marginTop: '4px',
  });
  const clickCol = document.createElement('div');
  Object.assign(clickCol.style, {
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
    gap: '4px',
  });
  const clickDelayInput = document.createElement('input');
  clickDelayInput.type = 'number';
  clickDelayInput.value = '1000';
  clickDelayInput.min = '0';
  Object.assign(clickDelayInput.style, {
    padding: '6px 8px',
    border: '1px solid #555',
    borderRadius: '4px',
    background: '#1f1f1f',
    color: '#eee',
    fontSize: '13px',
    textAlign: 'center',
    width: '100%',
    boxSizing: 'border-box',
    cursor: 'not-allowed',
  });
  clickDelayInput.disabled = true;
  const clickDelayLabel = document.createElement('div');
  clickDelayLabel.textContent = '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0Click Delay (ms)';
  clickDelayLabel.style.fontSize = '13px';
  clickDelayLabel.style.userSelect = 'none';
  clickCol.append(clickDelayInput, clickDelayLabel);

  const loopCol = document.createElement('div');
  Object.assign(loopCol.style, {
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
    gap: '4px',
  });
  const loopDelayInput = document.createElement('input');
  loopDelayInput.type = 'number';
  loopDelayInput.value = '2000';
  loopDelayInput.min = '0';
  Object.assign(loopDelayInput.style, {
    padding: '6px 8px',
    border: '1px solid #555',
    borderRadius: '4px',
    background: '#1f1f1f',
    color: '#eee',
    fontSize: '13px',
    textAlign: 'center',
    width: '100%',
    boxSizing: 'border-box',
    cursor: 'not-allowed',
  });
  loopDelayInput.disabled = true;
  const loopDelayLabel = document.createElement('div');
  loopDelayLabel.textContent = '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0Loop Delay (ms)';
  loopDelayLabel.style.fontSize = '13px';
  loopDelayLabel.style.userSelect = 'none';
  loopCol.append(loopDelayInput, loopDelayLabel);

  delaysWrapper.append(clickCol, loopCol);
  content.appendChild(delaysWrapper);

  const buttonsWrapper = document.createElement('div');
  Object.assign(buttonsWrapper.style, {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginTop: '4px',
  });
  function createBtn(text) {
    const b = document.createElement('button');
    b.textContent = text;
    Object.assign(b.style, {
      padding: '6px 8px',
      border: '1px solid #666',
      borderRadius: '4px',
      background: '#3a3a3a',
      color: '#eee',
      cursor: 'not-allowed',
      fontSize: '13px',
      width: '100%',
      boxSizing: 'border-box',
      margin: '0',
    });
    b.onmouseenter = () => {
      if (!b.disabled) b.style.background = '#505050';
    };
    b.onmouseleave = () => {
      if (!b.disabled) b.style.background = '#3a3a3a';
    };
    b.disabled = true;
    return b;
  }
  const loadBtn = createBtn('Load');
  loadBtn.disabled = false;
  loadBtn.style.cursor = 'pointer';
  const sendBtn = createBtn('Send');
  const addFieldBtn = createBtn('Add Field');
  const cancelBtn = createBtn('Cancel');
  const refreshBtn = createBtn('Refresh Tool');
  buttonsWrapper.append(loadBtn, sendBtn, addFieldBtn, cancelBtn, refreshBtn);
  content.appendChild(buttonsWrapper);

  const bottomWrapper = document.createElement('div');
  Object.assign(bottomWrapper.style, {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid #444',
    paddingTop: '6px',
    marginTop: '4px',
  });
  const statusLabel = document.createElement('div');
  statusLabel.textContent = 'Status: Waiting To Load';
  statusLabel.style.fontSize = '13px';
  statusLabel.style.userSelect = 'none';
  const devLabel = document.createElement('div');
  devLabel.textContent = 'Dev: </>TheGreen';
  devLabel.style.color = '#00ff00';
  devLabel.style.fontSize = '13px';
  devLabel.style.userSelect = 'none';
  bottomWrapper.append(statusLabel, devLabel);
  content.appendChild(bottomWrapper);

  // Toggle collapse/expand
  let expanded = false;
  header.addEventListener('click', () => {
    expanded = !expanded;
    if (expanded) {
      content.style.display = 'flex';
      arrow.textContent = '▼';
      canvas.width = header.clientWidth;
      canvas.height = header.clientHeight;
    } else {
      content.style.display = 'none';
      arrow.textContent = '►';
    }
  });

  const ctx = canvas.getContext('2d');
  let particles = [];
  function initParticles() {
    particles = [];
    const count = 30;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: 1 + Math.random() * 2,
        alpha: 0.3 + Math.random() * 0.3,
      });
    }
  }
  function animateParticles() {
    if (!header.isConnected) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.fillStyle = `rgba(200,200,200,${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(animateParticles);
  }
  const resizeObserver = new ResizeObserver(() => {
    canvas.width = header.clientWidth;
    canvas.height = header.clientHeight;
    initParticles();
  });
  resizeObserver.observe(header);
  initParticles();
  requestAnimationFrame(animateParticles);

  function setEnabled(el, enabled) {
    el.disabled = !enabled;
    el.style.cursor = enabled ? (el.tagName === 'INPUT' ? 'text' : 'pointer') : 'not-allowed';
  }

  function resetControls() {
    if (spamInterval) {
      clearInterval(spamInterval);
      spamInterval = null;
    }
    resetMessageFieldsInitial();
    messageFields.forEach(f => setEnabled(f, false));
    setEnabled(sendCountInput, false);
    sendCountInput.value = '9999';
    setEnabled(clickDelayInput, false);
    clickDelayInput.value = '1000';
    setEnabled(loopDelayInput, false);
    loopDelayInput.value = '2000';
    setEnabled(sendBtn, false);
    setEnabled(addFieldBtn, false);
    setEnabled(cancelBtn, false);
    setEnabled(refreshBtn, true);
    setEnabled(loadBtn, true);
    statusLabel.textContent = 'Status: Waiting To Load';
    statusLabel.style.color = '#eee';
  }

  loadBtn.onclick = () => {
    const field =
      document.querySelector('yt-live-chat-text-input-field-renderer #input') ||
      document.querySelector('style-scope yt-live-chat-text-input-field-renderer #input');
    if (!field) {
      statusLabel.textContent = 'Status: Input not found';
      statusLabel.style.color = '#ff0000';
      return;
    }
    chatInput = field;
    statusLabel.textContent = 'Status: ✅ Loaded';
    statusLabel.style.color = '#eee';
    messageFields.forEach(f => setEnabled(f, true));
    setEnabled(sendCountInput, true);
    setEnabled(clickDelayInput, true);
    setEnabled(loopDelayInput, true);
    setEnabled(sendBtn, true);
    setEnabled(addFieldBtn, true);
    setEnabled(cancelBtn, false);
    setEnabled(loadBtn, true);
    setEnabled(refreshBtn, true);
  };

  addFieldBtn.onclick = () => {
    if (messageFields.length < 10) {
      addMessageField();
      const last = messageFields[messageFields.length - 1];
      setEnabled(last, true);
      statusLabel.textContent = `Status: ✅ Field added (${messageFields.length})`;
      statusLabel.style.color = '#eee';
    }
  };

  sendBtn.onclick = () => {
    const msgs = messageFields.map(f => f.value.trim()).filter(m => m);
    if (!msgs.length) {
      statusLabel.textContent = 'Status: Waiting for messages';
      statusLabel.style.color = '#eee';
      return;
    }
    if (!chatInput) {
      statusLabel.textContent = 'Status: Chat input missing';
      statusLabel.style.color = '#ff0000';
      return;
    }
    const total = parseInt(sendCountInput.value, 10);
    if (isNaN(total) || total < 1) {
      statusLabel.textContent = 'Status: Waiting for valid count';
      statusLabel.style.color = '#eee';
      return;
    }
    const sendDelay = parseInt(clickDelayInput.value, 10);
    const loopDelay = parseInt(loopDelayInput.value, 10);
    if (isNaN(sendDelay) || sendDelay < 0 || isNaN(loopDelay) || loopDelay < 0) {
      statusLabel.textContent = 'Status: Waiting for valid delays';
      statusLabel.style.color = '#eee';
      return;
    }
    messageFields.forEach(f => setEnabled(f, false));
    setEnabled(sendCountInput, false);
    setEnabled(clickDelayInput, false);
    setEnabled(loopDelayInput, false);
    setEnabled(sendBtn, false);
    setEnabled(addFieldBtn, false);
    setEnabled(cancelBtn, true);
    setEnabled(loadBtn, false);
    setEnabled(refreshBtn, true);

    let count = 0;
    statusLabel.textContent = 'Status: Sending...';
    statusLabel.style.color = '#eee';

    spamInterval = setInterval(() => {
      if (count >= total) {
        clearInterval(spamInterval);
        spamInterval = null;
        statusLabel.textContent = 'Status: Done';
        statusLabel.style.color = '#eee';
        setEnabled(cancelBtn, false);
        messageFields.forEach(f => setEnabled(f, true));
        setEnabled(sendCountInput, true);
        setEnabled(clickDelayInput, true);
        setEnabled(loopDelayInput, true);
        setEnabled(sendBtn, true);
        setEnabled(addFieldBtn, true);
        setEnabled(loadBtn, true);
        return;
      }
      const msg = msgs[count % msgs.length];
      chatInput.focus();
      chatInput.textContent = msg;
      chatInput.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
      setTimeout(() => {
        const sBtn = document.querySelector('#send-button button');
        if (sBtn) sBtn.click();
        else console.warn('❌ Send button not found');
      }, sendDelay);
      count++;
    }, loopDelay + sendDelay);
  };

  cancelBtn.onclick = () => {
    if (spamInterval) {
      clearInterval(spamInterval);
      spamInterval = null;
      statusLabel.textContent = 'Status: Cancelled';
      statusLabel.style.color = '#eee';
      messageFields.forEach(f => setEnabled(f, true));
      setEnabled(sendCountInput, true);
      setEnabled(clickDelayInput, true);
      setEnabled(loopDelayInput, true);
      setEnabled(sendBtn, true);
      setEnabled(addFieldBtn, true);
      setEnabled(cancelBtn, false);
      setEnabled(loadBtn, true);
    }
  };

  refreshBtn.onclick = () => {
    resetControls();
  };

  resetControls();
    }
})();
