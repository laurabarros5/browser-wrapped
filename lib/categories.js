const CATEGORY_RULES = [
  {
    id: 'dev',
    label: 'Desenvolvimento',
    emoji: '💻',
    color: '#58a6ff',
    domains: [
      'github.com', 'gitlab.com', 'stackoverflow.com', 'stackexchange.com',
      'npmjs.com', 'pypi.org', 'developer.mozilla.org', 'docs.google.com',
      'vercel.com', 'netlify.com', 'heroku.com', 'docker.com', 'digitalocean.com',
      'cursor.com', 'codepen.io', 'jsfiddle.net', 'replit.com', 'leetcode.com',
      'hackerrank.com', 'codewars.com', 'figma.com', 'notion.so', 'linear.app',
      'jira.atlassian.com', 'atlassian.com', 'bitbucket.org', 'supabase.com',
      'firebase.google.com', 'aws.amazon.com', 'cloud.google.com', 'azure.com'
    ]
  },
  {
    id: 'social',
    label: 'Redes sociais',
    emoji: '💬',
    color: '#f778ba',
    domains: [
      'twitter.com', 'x.com', 'instagram.com', 'facebook.com', 'linkedin.com',
      'reddit.com', 'tiktok.com', 'threads.net', 'discord.com', 'discordapp.com',
      'whatsapp.com', 'web.whatsapp.com', 'telegram.org', 'web.telegram.org',
      'pinterest.com', 'snapchat.com', 'mastodon.social', 'bsky.app'
    ]
  },
  {
    id: 'entertainment',
    label: 'Entretenimento',
    emoji: '🎬',
    color: '#ff6b6b',
    domains: [
      'youtube.com', 'youtu.be', 'netflix.com', 'twitch.tv', 'spotify.com',
      'open.spotify.com', 'primevideo.com', 'disneyplus.com', 'hbo.com',
      'max.com', 'crunchyroll.com', 'soundcloud.com', 'deezer.com', 'vimeo.com',
      'kick.com', 'globoplay.globo.com', 'globo.com'
    ]
  },
  {
    id: 'productivity',
    label: 'Produtividade',
    emoji: '📋',
    color: '#3dd68c',
    domains: [
      'google.com', 'mail.google.com', 'calendar.google.com', 'drive.google.com',
      'docs.google.com', 'sheets.google.com', 'slides.google.com',
      'outlook.com', 'office.com', 'microsoft.com', 'teams.microsoft.com',
      'trello.com', 'asana.com', 'monday.com', 'clickup.com', 'airtable.com',
      'evernote.com', 'todoist.com', 'canva.com', 'miro.com', 'slack.com'
    ]
  },
  {
    id: 'news',
    label: 'Notícias & informação',
    emoji: '📰',
    color: '#ffd93d',
    domains: [
      'news.google.com', 'bbc.com', 'cnn.com', 'nytimes.com', 'theguardian.com',
      'uol.com.br', 'g1.globo.com', 'folha.uol.com.br', 'estadao.com.br',
      'infomoney.com.br', 'valor.globo.com', 'wikipedia.org', 'medium.com',
      'substack.com', 'techcrunch.com', 'arstechnica.com'
    ]
  },
  {
    id: 'shopping',
    label: 'Compras',
    emoji: '🛒',
    color: '#ff9f43',
    domains: [
      'amazon.com', 'amazon.com.br', 'mercadolivre.com.br', 'mercadolibre.com',
      'aliexpress.com', 'ebay.com', 'magazineluiza.com.br', 'americanas.com.br',
      'shopee.com.br', 'shein.com', 'shopify.com', 'etsy.com'
    ]
  },
  {
    id: 'learning',
    label: 'Aprendizado',
    emoji: '📚',
    color: '#a29bfe',
    domains: [
      'coursera.org', 'udemy.com', 'khanacademy.org', 'duolingo.com',
      'alura.com.br', 'udacity.com', 'edx.org', 'brilliant.org', 'freecodecamp.org',
      'codecademy.com', 'pluralsight.com', 'skillshare.com', 'domestika.org'
    ]
  },
  {
    id: 'finance',
    label: 'Finanças',
    emoji: '💰',
    color: '#26de81',
    domains: [
      'nubank.com.br', 'banco.bradesco', 'itau.com.br', 'santander.com.br',
      'binance.com', 'coinbase.com', 'tradingview.com', 'investing.com',
      'b3.com.br', 'statusinvest.com.br', 'fundamentus.com.br', 'paypal.com'
    ]
  }
];

const DOMAIN_LOOKUP = new Map();
for (const cat of CATEGORY_RULES) {
  for (const domain of cat.domains) {
    DOMAIN_LOOKUP.set(domain, cat);
  }
}

export function categorizeDomain(domain) {
  if (DOMAIN_LOOKUP.has(domain)) return DOMAIN_LOOKUP.get(domain);
  for (const [key, cat] of DOMAIN_LOOKUP) {
    if (domain.endsWith('.' + key) || domain === key) return cat;
  }
  return { id: 'other', label: 'Outros', emoji: '🌐', color: '#888888' };
}

export function getAllCategories() {
  return [...CATEGORY_RULES, { id: 'other', label: 'Outros', emoji: '🌐', color: '#888888' }];
}

export { CATEGORY_RULES };
