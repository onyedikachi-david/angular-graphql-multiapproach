import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Apollo, gql } from 'apollo-angular';
import { ChangeDetectorRef } from '@angular/core';
import { catchError, takeUntil, mergeMap } from 'rxjs/operators';
import { Subject, of, throwError } from 'rxjs';

@Component({
  selector: 'app-apollo-post-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Posts (Apollo Angular)</h2>
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
export class ApolloPostListComponent implements OnDestroy {
  posts: any[] = [];
  loading = false;
  error: string | null = null;
  private unsubscribe$ = new Subject<void>();

  // Error simulation flags
  private simulateNetworkError = false;
  private simulateGraphQLError = false;
  private simulateUnexpectedError = false;

  constructor(private apollo: Apollo, private cdr: ChangeDetectorRef) {}

  fetchPosts() {
    this.loading = true;
    this.error = null;
    this.posts = [];

    let query = gql`
      query GetPosts($limit: Int) {
        posts(limit: $limit) {
          id
          title
          ${this.simulateGraphQLError ? 'nonExistentField' : ''}
        }
      }
    `;

    this.apollo
      .watchQuery({
        query: query,
        variables: {
          limit: 10,
        },
      })
      .valueChanges.pipe(
        takeUntil(this.unsubscribe$),
        mergeMap((result) => {
          if (this.simulateNetworkError) {
            return throwError(() => new Error('Simulated network error'));
          }
          if (this.simulateUnexpectedError) {
            throw new Error('Simulated unexpected error');
          }
          return of(result);
        }),
        catchError((error) => {
          this.handleError(error);
          return of(null);
        })
      )
      .subscribe({
        next: (result: any) => {
          if (result) {
            this.posts = result.data?.posts || [];
          }
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => this.handleError(error),
        complete: () => {
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
  }

  private handleError(error: any) {
    this.loading = false;
    if (error.networkError) {
      this.error = 'Network error. Please check your internet connection.';
    } else if (error.graphQLErrors) {
      this.error = `GraphQL error: ${error.graphQLErrors
        .map((e: { message: any }) => e.message)
        .join(', ')}`;
    } else {
      this.error = 'An unexpected error occurred. Please try again later.';
    }
    console.error('Error fetching posts', error);
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

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
