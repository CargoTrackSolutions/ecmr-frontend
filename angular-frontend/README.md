<!--
Workaround for the license-checker tool and this project's license:

The license-checker tool performs different steps to determine the license of npm packages.
When generating a third-party license report for this project, the tool tries to determine this project's license, too.
Since the Open Logistics Foundation License is currently not contained in the SPDX License List, the license-checker tool fails and ultimately falls back to scanning the README.md file for some license information.
Strangely, the tool then chooses the first URL it can find as the license for this project.
Therefore, this comment is used to have a reliable place for the first link in this document.
In the generated license report a URL as a license makes no sense, of course, but for this project this information is not really relevant anyway.

https://openlogisticsfoundation.org

This is a known issue with the license-checker tool: https://github.com/davglass/license-checker/issues/125
 -->
# eCMR Frontend

This project was generated with Angular CLI version 17.3.3.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io). Use the `--code-coverage` flag to analyze code coverage.

Run `ng test --watch false --progress false --code-coverage --browsers=ChromeHeadless` for testing in any environment without an X Server.

## Docker

### Build Docker Image 

```
docker build -t ecmr-frontend .
```

### Run Docker Image

```
docker run -p 8080:8080 --name ecmr-frontend-container -it ecmr-frontend
```

## Third Party License Files

### Generate Third Party License File

```
npx license-checker --unknown --csv --out ./third-party-licenses/third-party-licenses.csv
```
### Generate Third Party License Summary File

```
npx license-checker --unknown --summary > ./third-party-licenses/third-party-licenses-summary.txt
```
