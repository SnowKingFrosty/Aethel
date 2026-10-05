const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');

const klipyApiKey = defineSecret('KLIPY_API_KEY');
const klipyApiBaseUrl = 'https://api.klipy.com/api/v1';
const gifUrlHost = 'static.klipy.com';

exports.searchKlipyGifs = onCall(
  {
    region: 'us-central1',
    maxInstances: 5,
    secrets: [klipyApiKey]
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Sign in to search for GIFs.');
    }

    const searchTerm = typeof request.data?.query === 'string'
      ? request.data.query.trim().slice(0, 80)
      : '';
    const endpoint = searchTerm ? 'gifs/search' : 'gifs/trending';
    const parameters = new URLSearchParams({
      page: '1',
      per_page: '24',
      content_filter: 'high',
      format_filter: 'gif',
      customer_id: request.auth.uid
    });
    if (searchTerm) parameters.set('q', searchTerm);

    let response;
    try {
      response = await fetch(
        `${klipyApiBaseUrl}/${encodeURIComponent(klipyApiKey.value())}/${endpoint}?${parameters}`,
        { signal: AbortSignal.timeout(10000) }
      );
    } catch {
      throw new HttpsError('unavailable', 'Klipy GIF search timed out. Try again in a moment.');
    }
    if (!response.ok) {
      throw new HttpsError(
        response.status === 429 ? 'resource-exhausted' : 'unavailable',
        'Klipy could not return GIFs. Try again in a moment.'
      );
    }

    const payload = await response.json();
    const records = Array.isArray(payload?.data?.data) ? payload.data.data : [];
    const gifs = records.flatMap((record) => {
      const url = record?.file?.hd?.gif?.url || record?.file?.md?.gif?.url;
      if (!record?.id || typeof url !== 'string') return [];
      try {
        const parsedUrl = new URL(url);
        if (parsedUrl.protocol !== 'https:' || parsedUrl.hostname !== gifUrlHost) return [];
      } catch {
        return [];
      }
      return [{
        id: String(record.id),
        title: typeof record.title === 'string' ? record.title.slice(0, 100) : 'Klipy GIF',
        url
      }];
    });

    return { gifs };
  }
);
