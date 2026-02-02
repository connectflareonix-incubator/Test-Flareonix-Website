import { API } from '@/config/constants';

// Generate or retrieve session ID
export const getSessionId = () => {
  let sessionId = sessionStorage.getItem('flareonix_session');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    sessionStorage.setItem('flareonix_session', sessionId);
  }
  return sessionId;
};

// Track page view
export const trackPageView = async (page) => {
  try {
    await fetch(`${API}/analytics/pageview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page,
        referrer: document.referrer || null,
        session_id: getSessionId()
      })
    });
  } catch (error) {
    console.error('Analytics error:', error);
  }
};

// Track button click
export const trackClick = async (buttonId, buttonName, page) => {
  try {
    await fetch(`${API}/analytics/click`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        button_id: buttonId,
        button_name: buttonName,
        page,
        session_id: getSessionId()
      })
    });
  } catch (error) {
    console.error('Analytics error:', error);
  }
};

// Wrapper for tracking links
export const trackAndNavigate = async (buttonId, buttonName, page, url, newTab = true) => {
  await trackClick(buttonId, buttonName, page);
  if (newTab) {
    window.open(url, '_blank');
  } else {
    window.location.href = url;
  }
};

// Wrapper for tracking scroll
export const trackAndScroll = async (buttonId, buttonName, page, targetId) => {
  await trackClick(buttonId, buttonName, page);
  const element = document.querySelector(targetId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};
