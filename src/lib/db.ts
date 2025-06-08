import { Column, Task } from "@/types/kanban";

const DB_NAME = "kanban-db";
const DB_VERSION = 2;

// interface DBSchema {
//   columns: Column[];
// }

export class KanbanDB {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = request.result;
        if (!db.objectStoreNames.contains("columns")) {
          db.createObjectStore("columns", { keyPath: "id" });
        }

        // Migrate existing data to include comments field
        if (event.oldVersion < 2) {
          const transaction = request.transaction;
          if (transaction) {
            const store = transaction.objectStore("columns");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            store.openCursor().onsuccess = (e: any) => {
              const cursor = e.target.result;
              if (cursor) {
                const column = cursor.value;
                column.tasks = column.tasks.map((task: Task) => ({
                  ...task,
                  comments: task.comments || [],
                }));
                cursor.update(column);
                cursor.continue();
              }
            };
          }
        }
      };
    });
  }

  async getAllColumns(): Promise<Column[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("Database not initialized"));
        return;
      }

      const transaction = this.db.transaction(["columns"], "readonly");
      const store = transaction.objectStore("columns");
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || []);
    });
  }

  async saveColumns(columns: Column[]): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("Database not initialized"));
        return;
      }

      const transaction = this.db.transaction(["columns"], "readwrite");
      const store = transaction.objectStore("columns");

      // Clear existing data
      store.clear().onsuccess = () => {
        // Add all columns
        columns.forEach((column) => {
          console.log(column);
          store.put(column);
        });
      };

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async updateColumn(column: Column): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("Database not initialized"));
        return;
      }

      const transaction = this.db.transaction(["columns"], "readwrite");
      const store = transaction.objectStore("columns");
      const request = store.put(column);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async deleteColumn(columnId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("Database not initialized"));
        return;
      }

      const transaction = this.db.transaction(["columns"], "readwrite");
      const store = transaction.objectStore("columns");
      const request = store.delete(columnId);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}

export const db = new KanbanDB();
