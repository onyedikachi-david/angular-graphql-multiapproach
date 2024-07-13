import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fetch-post-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Posts (Fetch Angular)</h2>
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
export class FetchPostListComponent {
  private endpoint = '/graphql';
  posts: any[] = [];
  loading = false;
  error: string | null = null;

  // Error simulation flags
  private simulateNetworkError = false;
  private simulateGraphQLError = false;
  private simulateUnexpectedError = false;

  constructor(private cdr: ChangeDetectorRef) {}

  private GET_DATA = `
    query GetPosts($limit: Int) {
      posts(limit: $limit) {
        id
        title
        ${this.simulateGraphQLError ? 'nonExistentField' : ''}
      }
    }
  `;

  async query(queryString: string, variables: any = {}) {
    if (this.simulateNetworkError) {
      throw new Error('Simulated network error');
    }

    if (this.simulateUnexpectedError) {
      throw new Error('Simulated unexpected error');
    }

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: queryString,
          variables,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors.map((e: any) => e.message).join(', '));
      }

      return result;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async fetchPosts() {
    this.loading = true;
    this.error = null;
    this.posts = [];
    this.cdr.detectChanges();

    try {
      const result = await this.query(this.GET_DATA, { limit: 10 });
      this.posts = result.data.posts;
      this.loading = false;
      this.cdr.detectChanges();
    } catch (error) {
      // Error is already handled in query method
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  private handleError(error: any) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      this.error = 'Network error. Please check your internet connection.';
    } else if (error instanceof Error) {
      if (error.message.includes('GraphQL error')) {
        this.error = `GraphQL error: ${error.message}`;
      } else if (error.message.startsWith('HTTP error!')) {
        this.error = `Server error: ${error.message}`;
      } else {
        this.error = 'An unexpected error occurred. Please try again later.';
      }
    } else {
      this.error = 'An unexpected error occurred. Please try again later.';
    }
    console.error('Error fetching posts:', error);
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
