import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApolloPostListComponent } from './apollo-angular/post-list.component';
import { UrqlPostListComponent } from './urql/post-list.component';
import { GraphqlRequestPostListComponent } from './graphql-request/post-list.component';
import { AxiosPostsListsComponent } from './axios/post-list.component';
import { FetchPostListComponent } from './fetch/post-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ApolloPostListComponent,
    UrqlPostListComponent,
    GraphqlRequestPostListComponent,
    AxiosPostsListsComponent,
    FetchPostListComponent,
  ],
  template: `
    <h1>Angular with GraphQL and Tailcall</h1>
    <app-apollo-post-list></app-apollo-post-list>
    <app-urql-post-list></app-urql-post-list>
    <app-graphql-request-post-list></app-graphql-request-post-list>
    <app-axios-post-list></app-axios-post-list>
    <app-fetch-post-list></app-fetch-post-list>
  `,
})
export class AppComponent {}
