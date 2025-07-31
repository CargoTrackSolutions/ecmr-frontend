# eCMR Frontend

The **eCMR frontend** is the web-based user interface for interacting with the [eCMR Backend](https://gitlab.com/openlogistics/ecmr-backend).
It allows users to create, view, and manage electronic consignment notes (eCMRs) in a user-friendly environment.

The core technology of the frontend is the [Angular](https://angular.io/) framework.

## Project Context

This project is part of a broader ecosystem initiated by the [Open Logistics Foundation](https://openlogisticsfoundation.org/), which brings together logistics stakeholders to develop standardized, manufacturer-independent, and open-source software components for digital logistics infrastructure.

Specifically, this repository is maintained by members of the **[Working Group “Electronic Transport Documents”](https://openlogisticsfoundation.org/en/working-groups/electronic-transport-documents/)**,
whose goal is to define and implement digital document standards (like eCMR, delivery notes, transport orders, etc.).


## Getting Started

> **If you are new to the eCMR project, please start by exploring the [`eCMR Backend`](https://gitlab.com/openlogistics/ecmr-backend)**.
> In particular, read its [README.md](https://gitlab.com/openlogistics/ecmr-backend/-/blob/main/README.md) and visit the backend's [documentation section](https://gitlab.com/openlogistics/ecmr-backend/-/tree/main/docs) to understand the API structure and system architecture.

## Related Projects
- [eCMR Data Model](https://git.openlogisticsfoundation.org/wg-electronictransportdocuments/ecmr/ecmr-model)
- [eCMR Backend](https://gitlab.com/openlogistics/ecmr-backend)
- [eSEAL Open Source Implementation](https://git.openlogisticsfoundation.org/wg-electronictransportdocuments/ecmr/eseal)

## Features

- User authentication and role-based views
- Creation and visualization of eCMR documents
- Real-time status tracking and document history
- Responsive design for use across devices
- Integrated with the official eCMR API from the backend

## Technologies Used

- Angular
- TypeScript
- REST API integration
- Docker (for deployment)

### Important runtime versions

* trion/ng-cli-karma:18.2.11 - CI Pipeline Base Image
* Node.js: 22.11.0 (as used by the trion/ng-cli-karma:18.2.11 image to build the application)
* npm: 10.9.0 (as used by the given Node version)
* Angular CLI: 18.2.12

## Documentation

For a full overview of the architecture, API, data model, and integration patterns, please refer to the ecmr-backend documentation:

[eCMR Backend Documentation](https://git.openlogisticsfoundation.org/wg-electronictransportdocuments/ecmr/ecmr-backend/-/tree/main/documentation)

This frontend is designed to interact with the backend's API endpoints as described in the backend documentation. Please make sure you understand the backend structure before integrating or extending the frontend.

## Contributing

We welcome contributions from the community! Please read our [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines and setup instructions.

## License

Licensed under the Open Logistics Foundation License 1.3.
For details on the licensing terms, see the LICENSE file.

## 📣 Give Feedback

We welcome your input to help improve and shape the future of the open source eCMR.

If you have suggestions, questions, or would like to share your use case, feel free to contact us:

📧 **ecmr-feedback@lists.openlogisticsfoundation.org**

Your feedback ensures the project stays relevant to real-world needs across industries and borders.


## Maintainers & Contact

This component is maintained by the **Open Logistics Foundation Working Group "Electronic Transport Documents"**.

Maintainer
- Jens Leveling (jens.leveling@iml.fraunhofer.de)
- Artur Blek (artur.blek@rhenus.com)

Contact info@openlogisticsfoundation.org for general questions or visit the [official website](https://openlogisticsfoundation.org).
