import { Collection } from '@msw/data';
import { mockTodos } from './mockData';
import { todoModel, userModel } from './utils/models';

export const db = {
  todos: new Collection({
    schema: todoModel,
  }),
  users: new Collection({
    schema: userModel,
  }),
};

export type Model = keyof typeof db;

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
  data[model] = db[model].all();
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

async function deleteFile(path: string) {
  try {
    const { unlink } = await import('fs/promises');
    await unlink(path);
    console.log('File deleted:', path);
  } catch (err: any) {
    if (err?.code === 'ENOENT') {
      console.log('File does not exist:', path);
    } else {
      console.error('Error deleting file:', err);
    }
  }
}

export const reinitializeDb = async () => {
  deleteFile(dbFilePath);
};

export const resetDb = () => {
  window.localStorage.clear();
};
