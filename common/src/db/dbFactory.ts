import { FirebaseDBClient } from "@shora/common/firebase/firebaseDBClient";
import { IDBClient } from "@shora/common/models/types";

export class DBFactory {
    private static articlesInstance: IDBClient | null = null;
    private static stocksInstance: IDBClient | null = null;
    
    static get articles() {
        if(!this.articlesInstance) {
            this.articlesInstance = new FirebaseDBClient('articles');
        }
        return this.articlesInstance;
    }
  
    static get stocks() {
        if(!this.stocksInstance) {
            this.stocksInstance = new FirebaseDBClient('stocks');
        }
        return this.stocksInstance;
    }
}