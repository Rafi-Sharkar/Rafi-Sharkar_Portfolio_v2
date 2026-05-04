# Netlify Functions + Neon (Postgres) setup

This document shows how the included serverless functions work and how to configure them.

Files added:
- `netlify/functions/db.js` - DB helper that reuses a single `pg` client across warm invocations.
- `netlify/functions/getProjects.js`, `addProject.js`, `updateProject.js`, `deleteProject.js` - project CRUD.
- `netlify/functions/getGallery.js`, `addGallery.js`, `updateGallery.js`, `deleteGallery.js` - gallery CRUD.
- `netlify/functions/getCertificates.js`, `addCertificate.js`, `updateCertificate.js`, `deleteCertificate.js` - certificate CRUD.
- `netlify/functions/getContacts.js`, `addContact.js`, `deleteContact.js` - contact inbox and message submission.
- `src/pages/admin/AdminDashboard.jsx` - database-backed admin UI.
- `sql/schema.sql` - SQL to create tables.

Quick setup
1. Install the `pg` package locally so Netlify builds it:

```bash
npm install pg
```

2. Do NOT commit secrets. Set the `DATABASE_URL` in Netlify (Site Settings → Build & deploy → Environment):

```
DATABASE_URL=postgresql://neondb_owner:REPLACE_WITH_PASSWORD@host.neon.tech/dbname?sslmode=require&channel_binding=require
```

You can use the Neon connection string you have, but keep it private. The functions use `process.env.DATABASE_URL`.

Database schema
- Run `sql/schema.sql` in your Neon database (via psql, Neon UI, or another client).

Calling the functions from React

- GET projects:

```js
fetch('/.netlify/functions/getProjects')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

- POST a new project (example):

```js
fetch('/.netlify/functions/addProject', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'My Project',
    description: 'Short description',
    github_link: 'https://github.com/you/repo',
    live_link: 'https://your-site.com'
  })
})
  .then(res => res.json())
  .then(newProject => console.log('Inserted:', newProject))
  .catch(err => console.error(err));
```

Example fetch calls for the other tables:

```js
fetch('/.netlify/functions/getGallery').then((res) => res.json())
fetch('/.netlify/functions/getCertificates').then((res) => res.json())
fetch('/.netlify/functions/getContacts').then((res) => res.json())
```

```js
fetch('/.netlify/functions/addGallery', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ image_url: 'https://example.com/photo.jpg', caption: 'My photo' }),
})
```

```js
fetch('/.netlify/functions/addCertificate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Node.js Basics',
    issuer: 'FreeCodeCamp',
    date: '2026-05-04',
    credential_url: 'https://example.com/certificate',
  }),
})
```

```js
fetch('/.netlify/functions/addContact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Rafi', email: 'rafi@example.com', message: 'Hello!' }),
})
```

Admin dashboard notes
- The admin route now loads and edits records from PostgreSQL instead of local storage.
- Projects use `title`, `description`, `github_link`, and `live_link`.
- Gallery uses `image_url` and `caption`.
- Certificates use `title`, `issuer`, `date`, and `credential_url`.
- Contacts are treated as incoming messages, not editable site copy.

Notes and production-safety tips
- Use parameterized queries (the functions do this) to avoid SQL injection.
- Keep `DATABASE_URL` and other secrets out of source control and set them in Netlify environment settings.
- Consider using role-limited DB users and rotate credentials periodically.
- For heavy workloads use a connection pooler; serverless cold starts and connection limits may require additional configuration. Neon provides a connection pooling proxy in the dashboard.
