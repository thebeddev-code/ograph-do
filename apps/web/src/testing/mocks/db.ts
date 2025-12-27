import { factory, nullable, primaryKey } from '@mswjs/data';
import { mockTodos } from './mockData';

const models = {
  todos: {
    id: primaryKey(Number),
    title: String,
    description: String,
    tags: Array,
    color: nullable(String),
    status: nullable(String),
    time: nullable({
      start: {
        hour: Number,
        end: Number,
      },
      end: {
        hour: Number,
        end: Number,
      },
    }),
    due: String,
    updatedAt: String,
    completedAt: nullable(String),
    isRecurring: Boolean,
    recurrenceRule: String,
  },
  users: {
    id: primaryKey(Number),
    email: String,
    password: String,
  },
};

export const db = factory(models);

export type Model = keyof typeof models;

const dbFilePath = 'mocked-db.json';

export const loadDb = async () => {
  // If we are running in a Node.js environment
  if (typeof window === 'undefined') {
    const { readFile, writeFile } = await import('fs/promises');
    const initialDbData = {
      todos: mockTodos,
    };
    try {
      const data = await readFile(dbFilePath, 'utf8');
      return JSON.parse(data);
    } catch (error: any) {
      // This will run on initial read, since the file doesn't yet exist
      // thus seeding the db with initial data
      if (error?.code === 'ENOENT') {
        await writeFile(dbFilePath, JSON.stringify(initialDbData, null, 2));
        return initialDbData;
      } else {
        console.error('Error loading mocked DB:', error);
        return null;
      }
    }
  }
  // If we are running in a browser environment
  return Object.assign(
    JSON.parse(window.localStorage.getItem('msw-db') || '{}'),
  );
};

export const storeDb = async (data: string) => {
  // If we are running in a Node.js environment
  if (typeof window === 'undefined') {
    const { writeFile } = await import('fs/promises');
    await writeFile(dbFilePath, data);
  } else {
    // If we are running in a browser environment
    window.localStorage.setItem('msw-db', data);
  }
};

export const persistDb = async (model: Model) => {
  if (process.env.NODE_ENV === 'test') return;
  const data = await loadDb();
  data[model] = db[model].getAll();
  await storeDb(JSON.stringify(data));
};

export const initializeDb = async () => {
  const dbData = await loadDb();
  for (const [tableName, model] of Object.entries(db)) {
    const dataEntries = dbData[tableName];
    if (Array.isArray(dataEntries)) {
      for (const entry of dataEntries) {
        model.create(entry);
      }
    }
  }
};

export const resetDb = () => {
  window.localStorage.clear();
};
