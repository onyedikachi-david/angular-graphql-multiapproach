import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import axios, { AxiosInstance, AxiosError } from 'axios';

@Component({
  selector: 'app-axios-post-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Posts (Axios Angular)</h2>
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
export class AxiosPostsListsComponent implements OnInit {
  private client: AxiosInstance;
  posts: any[] = [];
  loading = false;
  error: string | null = null;

  // Error simulation flags
  private simulateNetworkError = false;
  private simulateGraphQLError = false;
  private simulateUnexpectedError = false;

  constructor(private cdr: ChangeDetectorRef) {
    this.client = axios.create({
      baseURL: '/graphql',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  ngOnInit() {
    // Add a request interceptor
    this.client.interceptors.request.use(
      (config) => {
        if (this.simulateNetworkError) {
          return Promise.reject(new Error('Simulated network error'));
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

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
    try {
      if (this.simulateUnexpectedError) {
        throw new Error('Simulated unexpected error');
      }
      const response = await this.client.post('', {
        query: queryString,
        variables,
      });
      return response.data;
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
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        this.error = `Server error: ${axiosError.response.status} ${axiosError.response.statusText}`;
      } else if (axiosError.request) {
        // The request was made but no response was received
        this.error = 'Network error. Please check your internet connection.';
      } else {
        // Something happened in setting up the request that triggered an Error
        this.error = 'An unexpected error occurred. Please try again later.';
      }
    } else if (error.graphQLErrors) {
      this.error = `GraphQL error: ${error.graphQLErrors
        .map((e: any) => e.message)
        .join(', ')}`;
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
