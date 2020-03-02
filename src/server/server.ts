

/**
 * Shamanic Web Server
 *
 * @author khinds, davidps
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * @copyright Shamanic, http://www.shamanic.io
 */

// dependencies from old app
import express = require('express');
import path = require('path');
import favicon = require('serve-favicon');
import logger = require('morgan');
import cookieParser = require('cookie-parser');
import bodyParser = require('body-parser');
import bcrypt = require('bcrypt');
import session = require('cookie-session');
import jwt = require('jsonwebtoken');

// dependencies for @angular-universal
//import * as dotenv from 'dotenv';
import renderModuleFactory from '@angular/platform-server';
import { enableProdMode } from '@angular/core';
const server = express();
server.set('views', path.join(__dirname, '../ui/html'));
server.set('view engine', 'ejs');
