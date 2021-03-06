'use strict';

let BSON = require('bson');
const require_optional = require('optional-require')(require);
const EJSON = require('./utils').retrieveEJSON();

try {
  // Ensure you always wrap an optional require in the try block NODE-3199
  // Attempt to grab the native BSON parser
  const BSONNative = require_optional('bson-ext');
  // If we got the native parser, use it instead of the
  // Javascript one
  if (BSONNative) {
    BSON = BSONNative;
  }
} catch (err) {} // eslint-disable-line

/** An enumeration of valid server API versions */
const ServerApiVersion = Object.freeze({
  v1: '1'
});
const ValidServerApiVersions = Object.keys(ServerApiVersion).map(key => ServerApiVersion[key]);

module.exports = {
  // Versioned API
  ServerApiVersion,
  ValidServerApiVersions,
  // Errors
  MongoError: require('./error').MongoError,
  MongoNetworkError: require('./error').MongoNetworkError,
  MongoParseError: require('./error').MongoParseError,
  MongoTimeoutError: require('./error').MongoTimeoutError,
  MongoServerSelectionError: require('./error').MongoServerSelectionError,
  MongoWriteConcernError: require('./error').MongoWriteConcernError,
  // Core
  Connection: require('./connection/connection'),
  Server: require('./topologies/server'),
  ReplSet: require('./topologies/replset'),
  Mongos: require('./topologies/mongos'),
  Logger: require('./connection/logger'),
  Cursor: require('./cursor').CoreCursor,
  ReadPreference: require('./topologies/read_preference'),
  Sessions: require('./sessions'),
  BSON: BSON,
  EJSON: EJSON,
  Topology: require('./sdam/topology').Topology,
  // Raw operations
  Query: require('./connection/commands').Query,
  // Auth mechanisms
  MongoCredentials: require('./auth/mongo_credentials').MongoCredentials,
  defaultAuthProviders: require('./auth/defaultAuthProviders').defaultAuthProviders,
  MongoCR: require('./auth/mongocr'),
  X509: require('./auth/x509'),
  Plain: require('./auth/plain'),
  GSSAPI: require('./auth/gssapi'),
  ScramSHA1: require('./auth/scram').ScramSHA1,
  ScramSHA256: require('./auth/scram').ScramSHA256,
  // Utilities
  parseConnectionString: require('./uri_parser')
};
