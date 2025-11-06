const metrics = new Map();

function trackMetrics(event, data) {
  const timestamp = new Date().toISOString();
  if (!metrics.has(event)) {
    metrics.set(event, []);
  }
  metrics.get(event).push({ timestamp, ...data });
}

function getMetrics(event) {
  return metrics.get(event) || [];
}

function clearMetrics() {
  metrics.clear();
}

module.exports = {
  trackMetrics,
  getMetrics,
  clearMetrics
};