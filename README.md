# Book Library Tool

The Royal Library of Belgium would like to have a tool to easily manage their stock and allow customers to browse and reserve books online.

## UML class diagram

The UML class diagram provides an overview of the system's architecture and relationships between different components.

![usage example](https://github.com/taheroo/book-library-tool/blob/main/uml-class-diagram.png)

## Development

To set up the development environment for this project, follow the steps below:

1. Create .env file, follow .env.example:

2. Install the required dependencies:

```sh
npm install
```

3. Setup the database (this will generate books and users data):

```sh
npx migrate up
```

4. Start the development server, which automatically rebuilds assets on file changes:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

5. Visit the following url in your browser to check swagger documentation to test the APIs

```sh
http://localhost:3000/api-docs/
```

## Testing

To run the test suite for the project, execute the following command:

```sh
npm run test
```

## Project structure

A very simple project structure:

- `src`: The main container for all the application's code.
  - `model`: Contains data models that define the schema for the database.
  - `routes`: Stores all the routes (URL paths) that define the endpoints of the application.
  - `controllers`: Handle requests, process data, and return responses.
  - `services`: Contains business logic.

## Contribution

Contributions to this project are welcome. If you find any issues or have suggestions for improvement, please feel free to create a pull request or submit an issue on the project's repository.
