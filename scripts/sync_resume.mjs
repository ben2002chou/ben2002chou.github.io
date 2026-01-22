#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const repoRoot = process.cwd();
const defaultSource = '/Users/Ben/Code/ben_resume/resume_linkedln.yaml';
const source = process.env.RESUME_SOURCE || defaultSource;
const fallback = path.join(repoRoot, 'data', 'resume.yaml');

const readYaml = (filePath) => yaml.load(fs.readFileSync(filePath, 'utf8'));

let rawData;
if (fs.existsSync(source)) {
  rawData = readYaml(source);
} else if (fs.existsSync(fallback)) {
  rawData = readYaml(fallback);
  console.warn(`RESUME_SOURCE not found; using ${fallback}`);
} else {
  console.error(`Resume source not found: ${source}`);
  process.exit(1);
}

const resume = rawData.resume || rawData;

const toSentence = (text) => {
  if (!text) return '';
  const parts = text.split(/\.\s+/);
  return parts[0]?.trim() || text.trim();
};

const normalizeWhitespace = (text) => (text || '').replace(/\s+/g, ' ').trim();

const parseContact = (contact = '') => {
  return contact
    .split('|')
    .map((entry) => entry.trim())
    .filter(Boolean);
};

const parseYearRange = (dateStr = '') => {
  const match = dateStr.match(/(\d{4})\s*--\s*(Present|\d{4})/i);
  if (!match) return { start: null, end: null };
  const startYear = Number(match[1]);
  const endRaw = match[2];
  const start = `${startYear}-01-01`;
  const end = /present/i.test(endRaw) ? null : `${Number(endRaw)}-12-31`;
  return { start, end };
};

const monthMap = {
  jan: 1,
  january: 1,
  feb: 2,
  february: 2,
  mar: 3,
  march: 3,
  apr: 4,
  april: 4,
  may: 5,
  jun: 6,
  june: 6,
  jul: 7,
  july: 7,
  aug: 8,
  august: 8,
  sep: 9,
  sept: 9,
  september: 9,
  oct: 10,
  october: 10,
  nov: 11,
  november: 11,
  dec: 12,
  december: 12
};

const parseMonthYear = (token = '') => {
  if (/present/i.test(token)) return null;
  const match = token.match(/([A-Za-z]+)\s*'?([0-9]{2,4})/);
  if (!match) return null;
  const month = monthMap[match[1].toLowerCase()];
  if (!month) return null;
  let year = Number(match[2]);
  if (year < 100) {
    year += 2000;
  }
  return `${year}-${String(month).padStart(2, '0')}-01`;
};

const parseRange = (dateStr = '') => {
  if (!dateStr) return { start: null, end: null };
  const parts = dateStr.split(/\s*[–-]\s*/);
  const start = parseMonthYear(parts[0]);
  const end = parts[1] ? parseMonthYear(parts[1]) : null;
  return { start, end };
};

const stripMarkdown = (text = '') => text.replace(/\*/g, '').trim();

const slugify = (text = '') =>
  stripMarkdown(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'item';

const extractSkills = (summary = '') => {
  const normalized = summary.replace(/\n/g, ' ');
  const match = normalized.match(/proficient in (.+?)\./i);
  if (!match) return [];
  const raw = match[1]
    .replace(/ and /gi, ',')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  return [...new Set(raw)];
};

const parseAuthors = (authors = '', displayName = '') => {
  if (!authors) return displayName ? ['me'] : ['me'];
  const clean = stripMarkdown(authors);
  const parts = clean.split(',').map((part) => part.trim()).filter(Boolean);
  const normalized = parts.map((part) => part.replace(/\s+/g, ' ').trim());
  const hasMe = normalized.some((part) => /chou/i.test(part));
  return hasMe ? ['me', ...normalized.filter((part) => !/chou/i.test(part))] : ['me', ...normalized];
};

const header = resume.header || {};
const contactEntries = parseContact(header.contact || '');
const email = contactEntries.find((entry) => entry.includes('@'));
const linkedin = contactEntries.find((entry) => /linkedin/i.test(entry));
const github = contactEntries.find((entry) => /github/i.test(entry));

const name = header.name || 'Benjamin Chou';
const nameParts = name.split(' ').filter(Boolean);
const given = nameParts[0] || name;
const family = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

const summary = (resume.professional_summary || '').replace(/Tensorflow/g, 'TensorFlow');
const role = toSentence(summary) || 'PhD Candidate, Purdue University';

const skillsExtracted = extractSkills(summary);
const skillsItems = skillsExtracted.map((item) => ({ label: item, level: 4 }));

const education = (resume.education || []).map((item) => {
  const { start, end } = parseYearRange(item.date || '');
  const details = [item.gpa ? `GPA: ${item.gpa}` : null, ...(item.details || [])].filter(Boolean);
  return {
    degree: item.degree || '',
    institution: item.institution || '',
    start,
    end,
    summary: details.join('\n') || ''
  };
});

const experience = (resume.work_experience || []).map((item) => {
  const { start, end } = parseRange(item.date || '');
  const bulletLines = (item.bullet_points || []).map((point) => `- ${point}`);
  return {
    role: item.title || '',
    org: item.organization || '',
    start,
    end,
    summary: bulletLines.join('\n')
  };
});

const awards = (resume.honors_awards || []).map((entry) => {
  const yearMatch = entry.match(/(\d{4})/);
  return {
    title: entry,
    awarder: '',
    date: yearMatch ? `${yearMatch[1]}-01-01` : '',
    summary: ''
  };
});

const interests = [
  'Audio and music machine learning',
  'Multimodal systems',
  'Generative models',
  'Transformers',
  'Deepfake detection'
];

const author = {
  schema: 'hugoblox/author/v1',
  slug: 'me',
  is_owner: true,
  name: {
    display: name,
    given,
    family,
    alternate: '',
    pronunciation: '',
    pronouns: ''
  },
  postnominals: [],
  status: {
    icon: '🎧'
  },
  role,
  bio: normalizeWhitespace(summary),
  affiliations: [
    {
      name: 'Purdue University',
      url: 'https://www.purdue.edu/'
    }
  ],
  links: [
    email ? { icon: 'at-symbol', url: `mailto:${email}`, label: 'Email' } : null,
    linkedin ? { icon: 'brands/linkedin', url: linkedin.startsWith('http') ? linkedin : `https://${linkedin}` } : null,
    github ? { icon: 'brands/github', url: github.startsWith('http') ? github : `https://${github}` } : null
  ].filter(Boolean),
  interests,
  education,
  experience,
  skills: skillsItems.length
    ? [
        {
          name: 'Technical Skills',
          items: skillsItems
        }
      ]
    : [],
  awards
};

fs.mkdirSync(path.join(repoRoot, 'data'), { recursive: true });
fs.mkdirSync(path.join(repoRoot, 'data', 'authors'), { recursive: true });
fs.writeFileSync(path.join(repoRoot, 'data', 'resume.yaml'), yaml.dump({ resume }, { lineWidth: 120 }));
fs.writeFileSync(path.join(repoRoot, 'data', 'authors', 'me.yaml'), yaml.dump(author, { lineWidth: 120 }));

const ensureDir = (dir) => fs.mkdirSync(dir, { recursive: true });

const writePage = (dir, frontMatter, body = '') => {
  ensureDir(dir);
  const lines = ['---', ...frontMatter, '---', '', body.trim(), ''].join('\n');
  fs.writeFileSync(path.join(dir, 'index.md'), lines);
};

const toYamlLine = (key, value) => {
  if (value === null || value === undefined || value === '') return null;
  return `${key}: ${JSON.stringify(value)}`;
};

const contentPublications = path.join(repoRoot, 'content', 'publications');
if (fs.existsSync(contentPublications)) {
  fs.readdirSync(contentPublications).forEach((entry) => {
    if (entry === '_index.md') return;
    fs.rmSync(path.join(contentPublications, entry), { recursive: true, force: true });
  });
}

const publications = resume.publications || [];
const defaultYear = new Date().getFullYear();
publications.forEach((pub, index) => {
  const slug = slugify(pub.title);
  const yearMatch = (pub.venue || '').match(/(\d{4})/);
  const year = yearMatch ? Number(yearMatch[1]) : defaultYear;
  const date = `${year}-01-01`;
  const authorList = parseAuthors(pub.authors || '', name);
  const frontMatter = [
    toYamlLine('title', stripMarkdown(pub.title || '')),
    `authors: [${authorList.map((author) => JSON.stringify(author)).join(', ')}]`,
    toYamlLine('date', `${date}T00:00:00Z`),
    toYamlLine('publishDate', `${date}T00:00:00Z`),
    'publication_types: ["article"]',
    toYamlLine('publication', pub.venue || 'Under Submission'),
    toYamlLine('publication_short', ''),
    toYamlLine('summary', ''),
    index < 2 ? 'featured: true' : 'featured: false',
    pub.link
      ? 'links:\n- type: preprint\n  url: ' + (pub.link.startsWith('http') ? pub.link : `https://${pub.link}`)
      : null
  ].filter(Boolean);

  writePage(path.join(contentPublications, slug), frontMatter, '');
});

const contentProjects = path.join(repoRoot, 'content', 'projects');
if (fs.existsSync(contentProjects)) {
  fs.readdirSync(contentProjects).forEach((entry) => {
    if (entry === '_index.md') return;
    fs.rmSync(path.join(contentProjects, entry), { recursive: true, force: true });
  });
}

const cleanSkills = (skills = '') =>
  skills
    .replace(/\*\*/g, '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const projects = resume.projects || [];
projects.forEach((project) => {
  const slug = slugify(project.title);
  const bullets = (project.bullet_points || []).map((point) => `- ${point}`).join('\n');
  const tags = cleanSkills(project.skills || '');
  const frontMatter = [
    toYamlLine('title', stripMarkdown(project.title || '')),
    toYamlLine('summary', stripMarkdown(project.bullet_points?.[0] || '')),
    toYamlLine('date', `${defaultYear}-01-01T00:00:00Z`),
    tags.length ? `tags: [${tags.map((tag) => JSON.stringify(tag)).join(', ')}]` : null,
    'featured: true'
  ].filter(Boolean);

  writePage(path.join(contentProjects, slug), frontMatter, bullets);
});

console.log('Resume sync complete.');
