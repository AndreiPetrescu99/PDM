require('source-map-support/register');
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/auth/index.js":
/*!***************************!*\
  !*** ./src/auth/index.js ***!
  \***************************/
/*! exports provided: router */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./router */ "./src/auth/router.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "router", function() { return _router__WEBPACK_IMPORTED_MODULE_0__["router"]; });



/***/ }),

/***/ "./src/auth/router.js":
/*!****************************!*\
  !*** ./src/auth/router.js ***!
  \****************************/
/*! exports provided: router */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "router", function() { return router; });
/* harmony import */ var koa_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! koa-router */ "koa-router");
/* harmony import */ var koa_router__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(koa_router__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./store */ "./src/auth/store.js");
/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! jsonwebtoken */ "jsonwebtoken");
/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils */ "./src/utils/index.js");




const router = new koa_router__WEBPACK_IMPORTED_MODULE_0___default.a();

const createToken = user => {
  return jsonwebtoken__WEBPACK_IMPORTED_MODULE_2___default.a.sign({
    username: user.username,
    _id: user._id
  }, _utils__WEBPACK_IMPORTED_MODULE_3__["jwtConfig"].secret, {
    expiresIn: 60 * 60 * 60
  });
};

const createUser = async (user, response) => {
  try {
    await _store__WEBPACK_IMPORTED_MODULE_1__["default"].insert(user);
    response.body = {
      token: createToken(user)
    };
    response.status = 201; // created
  } catch (err) {
    response.body = {
      issue: [{
        error: err.message
      }]
    };
    response.status = 400; // bad request
  }
};

router.post('/signup', async ctx => await createUser(ctx.request.body, ctx.response));
router.post('/login', async ctx => {
  const credentials = ctx.request.body;
  const response = ctx.response;
  const user = await _store__WEBPACK_IMPORTED_MODULE_1__["default"].findOne({
    username: credentials.username
  });

  if (user && credentials.password === user.password) {
    response.body = {
      token: createToken(user)
    };
    response.status = 201; // created
  } else {
    response.body = {
      issue: [{
        error: 'Invalid credentials'
      }]
    };
    response.status = 400; // bad request
  }
});

/***/ }),

/***/ "./src/auth/store.js":
/*!***************************!*\
  !*** ./src/auth/store.js ***!
  \***************************/
/*! exports provided: UserStore, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserStore", function() { return UserStore; });
/* harmony import */ var nedb_promise__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! nedb-promise */ "nedb-promise");
/* harmony import */ var nedb_promise__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(nedb_promise__WEBPACK_IMPORTED_MODULE_0__);

class UserStore {
  constructor({
    filename,
    autoload
  }) {
    this.store = nedb_promise__WEBPACK_IMPORTED_MODULE_0___default()({
      filename,
      autoload
    });
  }

  async findOne(props) {
    return this.store.findOne(props);
  }

  async insert(user) {
    //
    return this.store.insert(user);
  }

}
/* harmony default export */ __webpack_exports__["default"] = (new UserStore({
  filename: './db/users.json',
  autoload: true
}));

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var koa__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! koa */ "koa");
/* harmony import */ var koa__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(koa__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var ws__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ws */ "ws");
/* harmony import */ var ws__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(ws__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! http */ "http");
/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(http__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var koa_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! koa-router */ "koa-router");
/* harmony import */ var koa_router__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(koa_router__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var koa_bodyparser__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! koa-bodyparser */ "koa-bodyparser");
/* harmony import */ var koa_bodyparser__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(koa_bodyparser__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils */ "./src/utils/index.js");
/* harmony import */ var _auth__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./auth */ "./src/auth/index.js");
/* harmony import */ var _train__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./train */ "./src/train/index.js");
/* harmony import */ var _train_store__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./train/store */ "./src/train/store.js");
/* harmony import */ var koa_jwt__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! koa-jwt */ "koa-jwt");
/* harmony import */ var koa_jwt__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(koa_jwt__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _koa_cors__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @koa/cors */ "@koa/cors");
/* harmony import */ var _koa_cors__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_koa_cors__WEBPACK_IMPORTED_MODULE_10__);












const app = new koa__WEBPACK_IMPORTED_MODULE_0___default.a();
const server = http__WEBPACK_IMPORTED_MODULE_2___default.a.createServer(app.callback());
const wss = new ws__WEBPACK_IMPORTED_MODULE_1___default.a.Server({
  server
});

const {
  upload
} = __webpack_require__(/*! upload.js */ "upload.js");

Object(_utils__WEBPACK_IMPORTED_MODULE_5__["initWss"])(wss);
app.use(_koa_cors__WEBPACK_IMPORTED_MODULE_10___default()());
app.use(_utils__WEBPACK_IMPORTED_MODULE_5__["timingLogger"]);
app.use(_utils__WEBPACK_IMPORTED_MODULE_5__["exceptionHandler"]);
app.use(koa_bodyparser__WEBPACK_IMPORTED_MODULE_4___default()());
app.use(koa_bodyparser__WEBPACK_IMPORTED_MODULE_4___default()({
  multipart: true
}));
const prefix = '/api'; // public

const publicApiRouter = new koa_router__WEBPACK_IMPORTED_MODULE_3___default.a({
  prefix
});
publicApiRouter.use('/auth', _auth__WEBPACK_IMPORTED_MODULE_6__["router"].routes());
app.use(publicApiRouter.routes()).use(publicApiRouter.allowedMethods());
app.use(koa_jwt__WEBPACK_IMPORTED_MODULE_9___default()(_utils__WEBPACK_IMPORTED_MODULE_5__["jwtConfig"]));
const protectedApiRouter = new koa_router__WEBPACK_IMPORTED_MODULE_3___default.a({
  prefix
});
protectedApiRouter.use('/train', _train__WEBPACK_IMPORTED_MODULE_7__["router"].routes());
app.use(protectedApiRouter.routes()).use(protectedApiRouter.allowedMethods()); // app.use(upload()) //  Route
// app.use(route).use(router.post('/upload',upload));

server.listen(3000);
console.log('started on port 3000');

/***/ }),

/***/ "./src/train/index.js":
/*!****************************!*\
  !*** ./src/train/index.js ***!
  \****************************/
/*! exports provided: router */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./router */ "./src/train/router.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "router", function() { return _router__WEBPACK_IMPORTED_MODULE_0__["router"]; });



/***/ }),

/***/ "./src/train/router.js":
/*!*****************************!*\
  !*** ./src/train/router.js ***!
  \*****************************/
/*! exports provided: router */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "router", function() { return router; });
/* harmony import */ var koa_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! koa-router */ "koa-router");
/* harmony import */ var koa_router__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(koa_router__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./store */ "./src/train/store.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "./src/utils/index.js");
/* harmony import */ var _utils_upload__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/upload */ "./src/utils/upload.js");
/* harmony import */ var _utils_upload__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_utils_upload__WEBPACK_IMPORTED_MODULE_3__);





const path = __webpack_require__(/*! path */ "path");

const fs = __webpack_require__(/*! fs */ "fs");

const multer = __webpack_require__(/*! multer */ "multer");

const router = new koa_router__WEBPACK_IMPORTED_MODULE_0___default.a();
router.get('/', async ctx => {
  const response = ctx.response;
  const from = ctx.state.user.from;
  const id = ctx.state.user._id;
  let trains = await _store__WEBPACK_IMPORTED_MODULE_1__["default"].find();
  response.body = trains;
  response.status = 200; // ok
});
router.get('/page/:id', async ctx => {
  const response = ctx.response;
  let page = ctx.params.id;
  console.log("Page " + page);
  let maxPage = 20;
  let crPage = 1;
  let cr = 0;
  let trains = await _store__WEBPACK_IMPORTED_MODULE_1__["default"].find();
  let out = [];

  for (let i = 0; i < trains.length; i++) {
    if (cr === maxPage - 1) {
      //console.log(cr);
      cr = 0;
      crPage = crPage + 1;
    }

    console.log(crPage);

    if (crPage === Number(page)) {
      //console.log("AICI");
      //console.log(trains[i]);
      out.push(trains[i]);
    }

    cr = cr + 1;
  } //console.log(out);


  response.body = JSON.stringify(out);
  response.status = 200;
});
router.get('/:id', async ctx => {
  const userId = ctx.state.user._id;
  const train = await _store__WEBPACK_IMPORTED_MODULE_1__["default"].findOne({
    _id: ctx.params.id
  });
  const response = ctx.response;

  if (train) {
    response.body = train;
    response.status = 200; // ok
  } else {
    response.status = 404; // not found
  }
});
router.put('/:id', async ctx => {
  console.log("PUT METHOD");
  let train = ctx.request.body; //console.log(train);

  train.nrSeats = train.nrSeats - 1;
  const id = ctx.params.id;
  const response = ctx.response;
  const userId = ctx.state.user._id; //let found = await trainStore.findOne({_id:id});

  try {
    const updatedCount = await _store__WEBPACK_IMPORTED_MODULE_1__["default"].update({
      _id: id
    }, train);
    console.log(updatedCount);
    ctx.response.body = train;
    ctx.response.status = 200; // ok

    console.log(response);
    console.log(train);
    Object(_utils__WEBPACK_IMPORTED_MODULE_2__["broadcast"])(userId, {
      event: 'updated',
      payload: train
    });
  } catch (error) {
    console.log(error);
  }
});

const createTrain = async (ctx, train, response) => {
  try {
    const userId = ctx.state.user._id;
    console.log(userId);
    const from = ctx.state.user.from;
    response.body = await _store__WEBPACK_IMPORTED_MODULE_1__["default"].insert(train);
    response.status = 201; // created

    Object(_utils__WEBPACK_IMPORTED_MODULE_2__["broadcast"])(userId, {
      type: 'created',
      payload: train
    });
  } catch (err) {
    response.body = {
      message: err.message
    };
    response.status = 400; // bad request
  }
};

router.post('/', async ctx => await createTrain(ctx, ctx.request.body, ctx.response));
router.post('/upload', _utils_upload__WEBPACK_IMPORTED_MODULE_3__["uploadImg"]);
router.del('/:id', async ctx => {
  const userId = ctx.state.user._id;
  const note = await _store__WEBPACK_IMPORTED_MODULE_1__["default"].findOne({
    _id: ctx.params.id
  });

  if (note && userId !== note.userId) {
    ctx.response.status = 403; // forbidden
  } else {
    await _store__WEBPACK_IMPORTED_MODULE_1__["default"].remove({
      _id: ctx.params.id
    });
    ctx.response.status = 204; // no content
  }
});

/***/ }),

/***/ "./src/train/store.js":
/*!****************************!*\
  !*** ./src/train/store.js ***!
  \****************************/
/*! exports provided: TrainStore, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TrainStore", function() { return TrainStore; });
/* harmony import */ var nedb_promise__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! nedb-promise */ "nedb-promise");
/* harmony import */ var nedb_promise__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(nedb_promise__WEBPACK_IMPORTED_MODULE_0__);

class TrainStore {
  constructor({
    filename,
    autoload
  }) {
    this.store = nedb_promise__WEBPACK_IMPORTED_MODULE_0___default()({
      filename,
      autoload
    });
  }

  async find(props) {
    return this.store.find(props);
  }

  async findOne(props) {
    return this.store.findOne(props);
  }

  async insert(note) {
    return this.store.insert(note);
  }

  async update(props, note) {
    return this.store.update(props, note);
  }

  async remove(props) {
    return this.store.remove(props);
  }

}
/* harmony default export */ __webpack_exports__["default"] = (new TrainStore({
  filename: './db/trains.json',
  autoload: true
}));

/***/ }),

/***/ "./src/utils/constants.js":
/*!********************************!*\
  !*** ./src/utils/constants.js ***!
  \********************************/
/*! exports provided: jwtConfig */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "jwtConfig", function() { return jwtConfig; });
const jwtConfig = {
  secret: 'my-secret'
};

/***/ }),

/***/ "./src/utils/index.js":
/*!****************************!*\
  !*** ./src/utils/index.js ***!
  \****************************/
/*! exports provided: jwtConfig, exceptionHandler, timingLogger, initWss, broadcast */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "./src/utils/constants.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "jwtConfig", function() { return _constants__WEBPACK_IMPORTED_MODULE_0__["jwtConfig"]; });

/* harmony import */ var _middleware__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./middleware */ "./src/utils/middleware.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "exceptionHandler", function() { return _middleware__WEBPACK_IMPORTED_MODULE_1__["exceptionHandler"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "timingLogger", function() { return _middleware__WEBPACK_IMPORTED_MODULE_1__["timingLogger"]; });

/* harmony import */ var _wss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./wss */ "./src/utils/wss.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "initWss", function() { return _wss__WEBPACK_IMPORTED_MODULE_2__["initWss"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "broadcast", function() { return _wss__WEBPACK_IMPORTED_MODULE_2__["broadcast"]; });





/***/ }),

/***/ "./src/utils/middleware.js":
/*!*********************************!*\
  !*** ./src/utils/middleware.js ***!
  \*********************************/
/*! exports provided: exceptionHandler, timingLogger */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "exceptionHandler", function() { return exceptionHandler; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "timingLogger", function() { return timingLogger; });
const exceptionHandler = async (ctx, next) => {
  try {
    return await next();
  } catch (err) {
    ctx.body = {
      message: err.message || 'Unexpected error.'
    };
    ctx.status = err.status || 500;
  }
};
const timingLogger = async (ctx, next) => {
  const start = Date.now();
  await next();
  console.log(`${ctx.method} ${ctx.url} => ${ctx.response.status}, ${Date.now() - start}ms`);
};

/***/ }),

/***/ "./src/utils/upload.js":
/*!*****************************!*\
  !*** ./src/utils/upload.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
    File upload
 */
const fs = __webpack_require__(/*! fs */ "fs");

const path = __webpack_require__(/*! path */ "path"); // const dateFormat = require('../utils/dateFormat.js')


const upload = {
  UPLOAD: '/upload',
  IMAGE: '/image/',
  FILE: '/file/',
  MAXFILESIZE: 200 * 1024 * 1024 //Upload file size

}; // Create a file directory

const mkdirFile = path => {
  let pathList = path.split('/');
  let fileDir = '';
  pathList.forEach(i => {
    if (i) {
      fileDir += '/' + i;

      if (!fs.existsSync(fileDir)) {
        fs.mkdirSync(fileDir, err => {
          LogFile.info('Create failure', err);
          return;
        });
      }
    }
  });
}; //Save file


const saveFile = (file, path) => {
  return new Promise((resolve, reject) => {
    let render = fs.createReadStream(file); // Create a write stream

    let upStream = fs.createWriteStream(path);
    render.pipe(upStream);
    upStream.on('finish', () => {
      resolve(path);
    });
    upStream.on('error', err => {
      reject(err);
    });
  });
};
/**
 * File upload
 * ps Generate file name SKD_date
 *     File paths are stored according to year and month
 */


const uploadImg = async ctx => {
  console.log(ctx);
  var time = Date.parse(new Date()); //let date = dateFormat.dateFormat(time, 'yyyyMMddhhmmss');

  let file = ctx.request.files.file;
  let fileName = 'SKD_ ' + upload.UPLOAD + upload.IMAGE; //Upload and save directory
  //let fileYear = date.substring(4, 8) + '/' +
  //date.substring(8, 10);

  let tail = file.name == 'blob' ? 'png' : file.name.split('.').pop();
  let filePath = path.join(fileName + '.' + tail); //Stitching file names according to time

  await mkdirFile(fileName + fileYear); //Create a file directory

  await saveFile(file.path, filePath).then(su => {
    let uplaod_img = su.substring(upload.UPLOAD.length, su.length);
    ctx.body = {
      error_code: 10000,
      error_message: 'Successful upload of files',
      realName: uplaod_img
    };
  }).catch(err => {
    ctx.body = {
      error_code: 20008,
      error_message: 'Failed to upload file!'
    };
  });
};

module.exports = {
  uploadImg
};

/***/ }),

/***/ "./src/utils/wss.js":
/*!**************************!*\
  !*** ./src/utils/wss.js ***!
  \**************************/
/*! exports provided: initWss, broadcast */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initWss", function() { return initWss; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "broadcast", function() { return broadcast; });
/* harmony import */ var ws__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ws */ "ws");
/* harmony import */ var ws__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ws__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jsonwebtoken */ "jsonwebtoken");
/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ "./src/utils/constants.js");



let wss;
const initWss = value => {
  wss = value;
  wss.on('connection', ws => {
    ws.on('message', message => {
      const {
        type,
        payload: {
          token
        }
      } = JSON.parse(message);

      if (type !== 'authorization') {
        ws.close();
        return;
      }

      try {
        ws.user = jsonwebtoken__WEBPACK_IMPORTED_MODULE_1___default.a.verify(token, _constants__WEBPACK_IMPORTED_MODULE_2__["jwtConfig"].secret);
      } catch (err) {
        ws.close();
      }
    });
  });
};
const broadcast = (userId, data) => {
  console.log("Broadcasting all...");

  if (!wss) {
    console.log("No wss");
    return;
  } //console.log(wss.clients.size);


  wss.clients.forEach(client => {
    //console.log(client);
    if (client.readyState === ws__WEBPACK_IMPORTED_MODULE_0___default.a.OPEN) {
      //console.log(`broadcast sent to ${client.user.username}`);
      client.send(JSON.stringify(data));
      console.log("Data sent");
    }
  });
};

/***/ }),

/***/ 0:
/*!****************************!*\
  !*** multi ./src/index.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! D:\PDM\train_server_auth\src/index.js */"./src/index.js");


/***/ }),

/***/ "@koa/cors":
/*!****************************!*\
  !*** external "@koa/cors" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@koa/cors");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ }),

/***/ "koa":
/*!**********************!*\
  !*** external "koa" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("koa");

/***/ }),

/***/ "koa-bodyparser":
/*!*********************************!*\
  !*** external "koa-bodyparser" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("koa-bodyparser");

/***/ }),

/***/ "koa-jwt":
/*!**************************!*\
  !*** external "koa-jwt" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("koa-jwt");

/***/ }),

/***/ "koa-router":
/*!*****************************!*\
  !*** external "koa-router" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("koa-router");

/***/ }),

/***/ "multer":
/*!*************************!*\
  !*** external "multer" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("multer");

/***/ }),

/***/ "nedb-promise":
/*!*******************************!*\
  !*** external "nedb-promise" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("nedb-promise");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "upload.js":
/*!****************************!*\
  !*** external "upload.js" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("upload.js");

/***/ }),

/***/ "ws":
/*!*********************!*\
  !*** external "ws" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("ws");

/***/ })

/******/ });
//# sourceMappingURL=main.map