const DB_NAME = 'dicoding-story-db';
const DB_VERSION = 1;
const STORE_NAME = 'stories';

class StoryDB {
  static async openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = event => {
        const db = event.target.result;
        console.log('Database upgrade needed, creating object store...');
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          console.log('Object store created:', STORE_NAME);
        }
      };
      request.onsuccess = event => {
        console.log('Database opened successfully');
        resolve(event.target.result);
      };
      request.onerror = event => {
        console.error('Error opening database:', event.target.error);
        reject(event.target.error);
      };
    });
  }

  static async saveStories(stories) {
    const preparedStories = await Promise.all(
      stories.map(async story => {
        const storyCopy = { ...story };
        if (storyCopy.photoUrl) {
          try {
            const response = await fetch(storyCopy.photoUrl, { mode: 'cors' });
            if (response.ok) {
              storyCopy.photoBlob = await response.blob();
              delete storyCopy.photoUrl;
              console.log(`Photo fetched for story ${storyCopy.id}`);
            } else {
              console.warn(`Failed to fetch photo for story ${storyCopy.id}: HTTP ${response.status}`);
            }
          } catch (error) {
            console.error(`Failed to fetch photo for story ${storyCopy.id}:`, error);
          }
        }
        return storyCopy;
      })
    );

    const db = await this.openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    const savePromises = preparedStories.map(story => {
      return new Promise((resolve, reject) => {
        const request = store.put(story);
        request.onsuccess = () => {
          console.log(`Story ${story.id} saved to IndexedDB`);
          resolve();
        };
        request.onerror = event => {
          console.error(`Error saving story ${story.id}:`, event.target.error);
          reject(event.target.error);
        };
      });
    });

    try {
      await Promise.all(savePromises);
      return new Promise((resolve, reject) => {
        tx.oncomplete = () => {
          console.log('All stories saved to IndexedDB');
          resolve();
        };
        tx.onerror = event => {
          console.error('Transaction error:', event.target.error);
          reject(event.target.error);
        };
      });
    } catch (error) {
      console.error('Error saving stories:', error);
      throw error;
    }
  }

  static async getStories() {
    const db = await this.openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        const stories = request.result;
        console.log('Retrieved stories from IndexedDB:', stories);
        stories.forEach(story => {
          if (story.photoBlob) {
            story.photoUrl = URL.createObjectURL(story.photoBlob);
          }
        });
        resolve(stories);
      };
      request.onerror = event => {
        console.error('Error retrieving stories:', event.target.error);
        reject(event.target.error);
      };
    });
  }

  static async deleteStory(id) {
    const db = await this.openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => {
        console.log(`Story ${id} deleted from IndexedDB`);
        resolve();
      };
      request.onerror = event => {
        console.error(`Error deleting story ${id}:`, event.target.error);
        reject(event.target.error);
      };
    });
  }
}

export default StoryDB;