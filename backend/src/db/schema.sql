

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  name  VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  icon VARCHAR,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('On track', 'Pending', 'Completed')),
  due_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  priority VARCHAR(20) DEFAULT 'Medium' CHECK(priority IN ('Low','Medium','High')),
  status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Completed')),
  due_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);
