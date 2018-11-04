//create cofig toexport


var environments = {};

 //staging env
 environments.stageing = {

 	'httpport' : 4000,
 	'httpsport' : 4001,
 	'envName' : 'stageing' 
 };

 environments.production = {

 	'httpport' : 5000,
 	'httpsport' : 5001,
 	'envName' : 'production' 
 }


 var inputEnv = typeof(process.env.NODE_ENV) == 'string'? 
 						process.env.NODE_ENV : '';
 var detectEnv = typeof(environments[inputEnv]) == 'object' ? 
 							environments[inputEnv] 
 							: environments.stageing;



 module.exports = detectEnv;