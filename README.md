# phr-core
Personal Health Record middleware for Patient which is capable of install/remove applications.

## Introduction

## installation

- Clone the [GitHub repo](https://github.com/softbrew/phr-core)
- Go to the project directory `cd phr-core`
- Install node dependencies `npm install`
- Create a file `config.js` in project root directory with `config.js.dist` template using `cp config.js.dist config.js`
  - Configure `config.js` files with appropriate settings
  - `staticFilesDirectory` path should be absolute folder location to [PHR Dashboard](https://github.com/softbrew/phr-dashboard) project
- Build application bundle using `npm run gulp`
- Start server using `npm start`
- Go to [http://localhost:8000/public/login.html](http://localhost:8000/public/login.html)
