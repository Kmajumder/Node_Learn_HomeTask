//Dependencies

const http = require('http');
const https = require ('https');
const config = require('./config');
const fs = require ('fs');
const url = require('url');
const stringDecoder = require('string_decoder').StringDecoder;



//Create a http server

var HTTPServer = http.createServer((req,res)=>{

	processServer(req,res,config.envName);

});

var httpPort = config.httpport;
HTTPServer.listen(httpPort,()=>{
	console.log('Server running at ',httpPort);
});


//Creating https server

var httpsOption = {

	'key' : fs.readFileSync('./https/key.pam'),
	'cert' : fs.readFileSync('./https/cert.pam')
}


var HTTPSServer = https.createServer(httpsOption,(req,res)=>{

	processServer(req,res, config.envName);

});

var httpsPort = config.httpsport;
HTTPSServer.listen(httpsPort,()=>{
	console.log('Server running at ',httpsPort);
});



processServer = function(req,res,hostname) {


	var prsurl = url.parse(req.url,true);
 

	var pathname = prsurl.pathname.replace(/^\/+|\/+$/g,'');
	
	var query = prsurl.query;


	var decoder = new stringDecoder('utf-8');

	var buffer = '';

	req.on('data',(data)=>{

		buffer +=  decoder.write(data);
	});

	req.on('end',()=>{

		buffer += decoder.end();

  
		var chooseRouter = router[pathname] !== undefined ?
							router[pathname]
							:handler.notFound;	



		 var msg = {

		 	'message': buffer
		 	 
		 }

	     chooseRouter(msg,(statusCode,data)=>{
	     		

	     		statusCode = typeof(statusCode) == 'number'? statusCode : 200;

	     		data = typeof(data) == 'object' ? data : {};

				 data.envName = hostname; //insert hostname from config
	     		//Return the response
					res.setHeader('Content-type','application/json'); 
					res.writeHead(statusCode);
					res.end(JSON.stringify(data));

					console.log('We are returning this data: ',statusCode, data);

	     });//End if choosrouter

	   }); //End of req-end function 

	};

  

	 var handler = {};

	var status = 201;

	handler.hello = function (data,callback){
 
		callback(status,{'input':data.message,'output':'Hello user'});

	}

	handler.notFound = function(data,callback){

		callback(404);

	}

	 
	//Creating router

	var router = {

		'hello' : handler.hello
	}


	

