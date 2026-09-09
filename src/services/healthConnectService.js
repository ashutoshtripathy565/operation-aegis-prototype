/**
 * Google Fitness demo integration.
 * The OAuth client ID is public configuration. Access tokens are kept only in
 * memory and are sent in an Authorization header, never in a URL or storage.
 */
const GIS_URL = 'https://accounts.google.com/gsi/client';
const FITNESS_BASE = 'https://www.googleapis.com/fitness/v1/users/me';
const SCOPES = [
  'https://www.googleapis.com/auth/fitness.heart_rate.read',
  'https://www.googleapis.com/auth/fitness.activity.read',
  'https://www.googleapis.com/auth/fitness.sleep.read',
].join(' ');

const loadGoogleIdentity = () => new Promise((resolve, reject) => {
  if (window.google?.accounts?.oauth2) return resolve(window.google);
  const existing = document.querySelector('script[data-aegis-google-identity]');
  if (existing) {
    existing.addEventListener('load', () => resolve(window.google), { once: true });
    existing.addEventListener('error', () => reject(new Error('Google Identity could not be loaded.')), { once: true });
    return;
  }
  const script = document.createElement('script');
  script.src = GIS_URL;
  script.async = true;
  script.defer = true;
  script.dataset.aegisGoogleIdentity = 'true';
  script.onload = () => window.google?.accounts?.oauth2 ? resolve(window.google) : reject(new Error('Google Identity is unavailable.'));
  script.onerror = () => reject(new Error('Google Identity could not be loaded.'));
  document.head.appendChild(script);
});

const latestNumber = (points, key) => {
  const value = points?.at(-1)?.value?.[0];
  return Number(value?.[key] ?? value?.fpVal ?? value?.intVal) || undefined;
};

async function fitnessGet(path, accessToken) {
  const response = await fetch(`${FITNESS_BASE}${path}`, { headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Google Fitness API returned ${response.status}.`);
  return response.json();
}

export async function requestGoogleFitnessToken(clientId) {
  if (!clientId?.trim()) throw new Error('Enter your Google OAuth client ID first.');
  const google = await loadGoogleIdentity();
  return new Promise((resolve, reject) => {
    const tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: clientId.trim(), scope: SCOPES,
      callback: (response) => response?.access_token ? resolve(response.access_token) : reject(new Error(response?.error_description || response?.error || 'Google authorization was not completed.')),
      error_callback: (error) => reject(new Error(error?.message || 'Google authorization was not completed.')),
    });
    tokenClient.requestAccessToken({ prompt: 'consent' });
  });
}

export async function fetchGoogleFitnessData(accessToken, deviceName = 'Google Fitness connected wearable') {
  if (!accessToken) throw new Error('Google authorization is required.');
  const now = Date.now();
  const start = (now - 7 * 24 * 60 * 60 * 1000) * 1000000; // 7 days ago
  const end = (now + 1 * 24 * 60 * 60 * 1000) * 1000000;   // 1 day in the future

  const getSyntheticData = (errorMessage) => ({
    restingHeartRate: 65,
    totalSteps: 8500,
    sleepHours: 7.2,
    spO2: 98,
    hrv: 45,
    deviceName,
    timestamp: new Date().toISOString(),
    source: 'google_fitness_mock',
    isReal: false,
    error: errorMessage
  });

  try {
    // 1. Fetch all data sources for heart rate to ensure we capture 3rd party apps (like boAt)
    const hrSources = await fitnessGet('/dataSources?dataTypeName=com.google.heart_rate.bpm', accessToken);
    const hrPromises = (hrSources.dataSource || []).map(ds => 
      fitnessGet(`/dataSources/${ds.dataStreamId}/datasets/${start}-${end}`, accessToken).catch(() => ({ point: [] }))
    );
    
    // Also fetch standard steps and sleep streams
    const [hrDatasets, steps, sleep] = await Promise.all([
      Promise.all(hrPromises),
      fitnessGet(`/dataSources/derived:com.google.step_count.delta:com.google.android.gms:estimated_steps/datasets/${start}-${end}`, accessToken).catch(() => ({ point: [] })),
      fitnessGet(`/dataSources/derived:com.google.sleep.segment:com.google.android.gms:merged/datasets/${start}-${end}`, accessToken).catch(() => ({ point: [] })),
    ]);

    // 2. Find the absolute most recent heart rate reading across ALL data sources
    let latestHrPoint = null;
    for (const dataset of hrDatasets) {
      if (!dataset.point) continue;
      for (const p of dataset.point) {
        if (!latestHrPoint || BigInt(p.endTimeNanos) > BigInt(latestHrPoint.endTimeNanos)) {
          latestHrPoint = p;
        }
      }
    }

    console.log("Google Fitness Data - Latest HR Point:", latestHrPoint);
    console.log("Google Fitness Data - Steps:", steps);
    console.log("Google Fitness Data - Sleep:", sleep);

    const restingHeartRate = latestHrPoint ? Math.round(Number(latestHrPoint.value?.[0]?.fpVal ?? latestHrPoint.value?.[0]?.intVal ?? 0)) : 0;
    
    if (!restingHeartRate) {
      return getSyntheticData('Google Fitness returned no heart-rate readings for the last 24 hours.');
    }
    
    const totalSteps = (steps.point || []).reduce((sum, point) => sum + (latestNumber([point], 'intVal') ?? 0), 0);
    const sleepNanos = (sleep.point || []).reduce((sum, point) => sum + Math.max(0, Number(point.endTimeNanos) - Number(point.startTimeNanos)), 0);
    
    return {
      restingHeartRate, totalSteps, sleepHours: sleepNanos ? +(sleepNanos / 3.6e12).toFixed(1) : undefined,
      deviceName, timestamp: new Date().toISOString(), source: 'google_fitness', isReal: true,
    };
  } catch (err) {
    console.error("Health Connect Sync Error:", err);
    return getSyntheticData(err.message || 'Failed to fetch data from Google Fitness API.');
  }
}
