import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef } from '@angular/core';
import { gql } from '@apollo/client/core';
import {
  createClient,
  fetchExchange,
  cacheExchange,
  Client,
  CombinedError,
} from '@urql/core';

@Component({
  selector: 'app-urql-post-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Posts (Urql Angular)</h2>
    <button (click)="fetchPosts()" [disabled]="loading">
      {{ loading ? 'Loading...' : 'Load Posts' }}
    </button>
    <button (click)="triggerNetworkError()">Trigger Network Error</button>
    <button (click)="triggerGraphQLError()">Trigger GraphQL Error</button>
    <button (click)="triggerUnexpectedError()">Trigger Unexpected Error</button>
    <ul *ngIf="!error">
      <li *ngFor="let post of posts">{{ post.title }}</li>
    </ul>
    <div *ngIf="error" class="error-message">
      {{ error }}
    </div>
  `,
  styles: [
    `
      .error-message {
        color: red;
        margin-top: 10px;
      }
    `,
  ],
})
export class UrqlPostListComponent {
  posts: any[] = [];
  client: Client;
  loading = false;
  error: string | null = null;

  // Error simulation flags
  private simulateNetworkError = false;
  private simulateGraphQLError = false;
  private simulateUnexpectedError = false;

  constructor(private cdr: ChangeDetectorRef) {
    this.client = createClient({
      url: 'http://localhost:4200/graphql',
      exchanges: [cacheExchange, fetchExchange],
    });
  }

  getPostsQuery = gql`
    query GetPosts($limit: Int) {
      posts(limit: $limit) {
        id
        title
        ${this.simulateGraphQLError ? 'nonExistentField' : ''}
      }
    }
  `;

  fetchPosts() {
    this.loading = true;
    this.error = null;
    this.posts = [];
    this.cdr.detectChanges();

    if (this.simulateNetworkError) {
      this.handleError(
        new CombinedError({
          networkError: new Error('Simulated network error'),
        })
      );
      return;
    }

    if (this.simulateUnexpectedError) {
      this.handleError(new Error('Simulated unexpected error'));
      return;
    }

    this.client
      .query(this.getPostsQuery, { limit: 10 })
      .toPromise()
      .then((result) => {
        if (result.error) {
          this.handleError(result.error);
        } else {
          this.posts = result.data?.posts || [];
          this.loading = false;
          this.cdr.detectChanges();
        }
      })
      .catch((error) => this.handleError(error))
      .finally(() => {
        this.loading = false;
        this.cdr.detectChanges();
      });
  }

  private handleError(error: any) {
    this.loading = false;
    if (error instanceof CombinedError) {
      if (error.networkError) {
        this.error = 'Network error. Please check your internet connection.';
      } else if (error.graphQLErrors.length > 0) {
        this.error = `GraphQL error: ${error.graphQLErrors
          .map((e) => e.message)
          .join(', ')}`;
      }
    } else if (error instanceof Error) {
      this.error = `An unexpected error occurred: ${error.message}`;
    } else {
      this.error = 'An unexpected error occurred. Please try again later.';
    }
    console.error('Error fetching posts:', error);
    this.cdr.detectChanges();
  }

  triggerNetworkError() {
    this.simulateNetworkError = true;
    this.fetchPosts();
  }

  triggerGraphQLError() {
    this.simulateGraphQLError = true;
    this.fetchPosts();
  }

  triggerUnexpectedError() {
    this.simulateUnexpectedError = true;
    this.fetchPosts();
  }
}
