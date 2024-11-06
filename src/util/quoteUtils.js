export async function getQuotes(company, sessionToken) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const url = new URL('/api/auth/open', baseUrl);
  url.searchParams.append('company', company);

  console.log('company: ', company);
  console.log('session: ', sessionToken);
  console.log('url: ', url);

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionToken}`,
    },
  });

  if (!res.ok) {
    console.error('Fetch failed:', res.status, res.statusText);
    throw new Error(`Failed to fetch quotes: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  return data;
}

export async function getQuote(quoteId, sessionToken) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const url = new URL(`/api/auth/quote/${quoteId}`, baseUrl);

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionToken}`,
    },
  });

  if (!res.ok) {
    console.error('Fetch failed:', res.status, res.statusText);
    throw new Error(`Failed to fetch quote: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  return data.quote;
}
