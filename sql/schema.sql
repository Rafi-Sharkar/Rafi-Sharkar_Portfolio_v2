-- PostgreSQL schema for portfolio
-- Run these statements in your Neon (or other PostgreSQL) database.

-- projects table
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  github_link VARCHAR(512),
  live_link VARCHAR(512),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  issuer VARCHAR(255),
  date DATE,
  credential_url VARCHAR(1024)
);

-- gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id SERIAL PRIMARY KEY,
  image_url VARCHAR(1024) NOT NULL,
  caption TEXT
);

-- contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(320) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
