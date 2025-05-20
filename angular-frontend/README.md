# Angular Frontend

This directory contains the source code and configuration for the Angular-based frontend
application of the eCMR project.

## Structure

- `src/` – Angular application source code
- `angular.json` – Angular CLI configuration
- `package.json` – Project dependencies and scripts
- `tsconfig.*.json` – TypeScript configuration

## Build & Run

To install dependencies and start the development server:

```bash
npm install
ng serve
```

By default, the app is available at `http://localhost:4200/`.

To build for production:

```bash
ng build
```

## Testing

Run unit tests:

```bash
ng test
```

## Notes

- Ensure that the backend API is running and accessible during local development.
- Configuration for API endpoints can be found in the environment files under `src/environments/`.

## Related Projects

This frontend connects to the [eCMR Backend](https://gitlab.com/openlogistics/ecmr-backend).

## License

Licensed under the Open Logistics Foundation License 1.3.
