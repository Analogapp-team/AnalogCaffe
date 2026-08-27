import Parse from "parse";

// Back4App configuration - DONT TOUCH - Look in .env for keys. 
/* A configuration module that initializes the Parse SDK with application credentials
   Sets up the connection to the Back4App server, centralizes backend configuration 
   for the entire app, uses environment variables for security*/
   
const PARSE_APPLICATION_ID = process.env.REACT_APP_BACK4APP_APPLICATION_ID;
const PARSE_JAVASCRIPT_KEY = process.env.REACT_APP_BACK4APP_JAVASCRIPT_KEY;
const PARSE_HOST_URL = process.env.REACT_APP_BACK4APP_SERVER_URL;

Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY);
Parse.serverURL = PARSE_HOST_URL;

export default Parse;
