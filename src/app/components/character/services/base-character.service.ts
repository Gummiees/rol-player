import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentChangeAction
} from '@angular/fire/compat/firestore';
import { Base } from '@shared/models/base.model';
import { Character } from '@shared/models/character.model';
import { UserService } from '@shared/services/user.service';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class BaseCharacterService<T extends Base> {
  protected collection?: AngularFirestoreCollection<T> | null;
  constructor(protected firestore: AngularFirestore, protected userService: UserService) {}

  protected getCollection(
    character: Character,
    user: firebase.User
  ): AngularFirestoreCollection<T> {
    if (!this.collection) {
      this.collection = this.firestore.collection<T>(
        `characters/${character.id}/inventory`,
        (ref) => ref.where('userId', '==', user.uid)
      );
    }
    return this.collection;
  }

  public listItems(character: Character, user: firebase.User): Observable<T[]> {
    if (!character.id) {
      throw new Error('Character ID is required');
    }
    return this.getCollection(character, user)
      .snapshotChanges()
      .pipe(
        map((items: DocumentChangeAction<T>[]) => {
          return items.map((item: DocumentChangeAction<T>) => {
            return {
              ...item.payload.doc.data(),
              id: item.payload.doc.id
            };
          });
        })
      );
  }

  public async createItem(character: Character, item: T): Promise<void> {
    if (!character.id) {
      throw new Error('Character ID is required');
    }
    const user: firebase.User | null = await this.userService.user;
    if (!user) {
      throw new Error('You must be signed in');
    }
    item.userId = user.uid;
    await this.getCollection(character, user).add(item);
  }

  public async deleteItem(character: Character, item: T): Promise<void> {
    if (!character.id) {
      throw new Error('Character ID is required');
    }
    const user: firebase.User | null = await this.userService.user;
    if (!user) {
      throw new Error('You must be signed in');
    }
    await this.getCollection(character, user).doc(item.id).delete();
  }

  public async updateItem(character: Character, item: T): Promise<void> {
    if (!character.id) {
      throw new Error('Character ID is required');
    }
    const user: firebase.User | null = await this.userService.user;
    if (!user) {
      throw new Error('You must be signed in');
    }
    if (!item.id) {
      throw new Error('Item ID is required');
    }
    await this.getCollection(character, user).doc(item.id).update(item);
  }

  public async setItem(character: Character, item: T): Promise<void> {
    if (!character.id) {
      throw new Error('Character ID is required');
    }
    const user: firebase.User | null = await this.userService.user;
    if (!user) {
      throw new Error('You must be signed in');
    }
    if (!item.id) {
      throw new Error('Item ID is required');
    }
    await this.getCollection(character, user).doc(item.id).set(item);
  }
}