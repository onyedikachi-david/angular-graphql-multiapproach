# GraphQL in Angular: 5 Approaches for Data Fetching

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.7.


## Overview

This project demonstrates five different approaches to fetching data from a GraphQL API in an Angular application. Each approach is implemented as a separate component, showcasing different libraries and techniques for GraphQL integration.

## Table of Contents

- [GraphQL in Angular: 5 Approaches for Data Fetching](#graphql-in-angular-5-approaches-for-data-fetching)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Project Structure](#project-structure)
  - [Approaches Implemented](#approaches-implemented)
  - [Running the Application](#running-the-application)
  - [Error Handling](#error-handling)
  - [Contributing](#contributing)
  - [License](#license)

## Installation

To set up this project locally, follow these steps:

1. Clone the repository:

   ```sh
   git clone https://github.com/onyedikachi-david/angular-graphql-multiapproach.git
   ```

2. Navigate to the project directory:

   ```sh
   cd angular-graphql-multiapproach
   ```

3. Install dependencies:

   ```sh
   npm install
   ```

## Project Structure

The project is structured as follows:

```sh
.
├── src
│   ├── app
│   │   ├── apollo-angular
│   │   │   └── post-list.component.ts
│   │   ├── urql
│   │   │   ├── post-list.component.html
│   │   │   └── post-list.component.ts
│   │   ├── graphql-request
│   │   │   └── post-list.component.ts
│   │   ├── axios
│   │   │   └── post-list.component.ts
│   │   ├── fetch
│   │   │   └── post-list.component.ts
│   │   ├── app.component.ts
│   │   └── app.config.ts
│   ├── environments
│   │   ├── environment.prod.ts
│   │   └── environment.ts
│   └── main.ts
├── angular.json
├── package.json
├── tsconfig.json
└── README.md
```

## Approaches Implemented

1. **Apollo Angular**: A comprehensive GraphQL client that provides robust features like caching and state management.
2. **Urql**: A lightweight and flexible GraphQL client with a focus on simplicity and customization.
3. **GraphQL-Request**: A minimal GraphQL client supporting Node and browsers.
4. **Axios**: A promise-based HTTP client that can be used to send GraphQL queries.
5. **Fetch API**: The native browser API for making HTTP requests, used here for GraphQL queries.

Each approach is implemented in its own component under the respective directory in `src/app/`.

## Running the Application

To run the application locally:

1. First start the tailcall server by running:

```sh
 tailcall start ./tailcall/jsonplaceholder.graphql
```

2. Start the development server:

   ```sh
   ng serve
   ```

3. Open your browser and navigate to `http://localhost:4200`

The application will display all five approaches on the same page, allowing for easy comparison.

## Error Handling

Each component implements error handling to demonstrate how to manage various types of errors that may occur during GraphQL operations:

- Network errors
- GraphQL-specific errors
- Unexpected errors

The error handling logic is designed to provide user-friendly messages and log detailed error information to the console.

## Contributing

Contributions to this project are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

Please ensure your code adheres to the existing style and includes appropriate tests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---
