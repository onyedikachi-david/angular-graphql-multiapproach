import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphQLClient, gql, ClientError } from 'graphql-request';

@Component({
  selector: 'app-graphql-request-post-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Posts (Graphql Request Angular)</h2>
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
export class GraphqlRequestPostListComponent {
  private client: GraphQLClient;
  posts: any[] = [];
  loading = false;
  error: string | null = null;

  // Error simulation flags
  private simulateNetworkError = false;
  private simulateGraphQLError = false;
  private simulateUnexpectedError = false;

  constructor(private cdr: ChangeDetectorRef) {
    this.client = new GraphQLClient('http://localhost:4200/graphql');
  }

  private GET_DATA = gql`
    query GetPosts($limit: Int) {
      posts(limit: $limit) {
        id
        title
        ${this.simulateGraphQLError ? 'nonExistentField' : ''}
      }
    }
  `;

  async fetchPosts() {
    this.loading = true;
    this.error = null;
    this.posts = [];
    this.cdr.detectChanges();

    try {
      if (this.simulateNetworkError) {
        throw new Error('Simulated network error');
      }

      if (this.simulateUnexpectedError) {
        throw new Error('Simulated unexpected error');
      }

      const result: any = await this.client.request(this.GET_DATA, {
        limit: 10,
      });
      this.posts = result.posts;
      this.loading = false;
      this.cdr.detectChanges();
    } catch (error) {
      this.handleError(error);
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  private handleError(error: any) {
    if (error instanceof ClientError) {
      if (error.response.errors) {
        // GraphQL errors
        this.error = `GraphQL error: ${error.response.errors
          .map((e) => e.message)
          .join(', ')}`;
      } else {
        // Network errors or other HTTP errors
        this.error = `Network error: ${error.response.status} ${error.response['statusText']}`;
      }
    } else if (error instanceof Error) {
      if (error.message === 'Simulated network error') {
        this.error = 'Network error. Please check your internet connection.';
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
