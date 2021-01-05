/* *************************************************************** */
/*                                                                 */
/* HCL Confidential                                                */
/*                                                                 */
/* OCO Source Materials                                            */
/*                                                                 */
/* Copyright HCL Technologies Limited 2020                         */
/*                                                                 */
/* The source code for this program is not published or otherwise  */
/* divested of its trade secrets, irrespective of what has been    */
/* deposited with the U.S. Copyright Office.                       */
/*                                                                 */
/* *************************************************************** */

// Retrieve and embed the Connections navigation bar
// in 3rd party web pages and applications
var cnx_reusable_navbar = {
	
	_debug : false,
	
	_stack : {},
	
	init : function(d)
	{
		var obj = this;
		if(!(d !== undefined && d !== null && d.constructor == Object))
		{
			console.error("JSON object expected!");
			return;
		}
		
		Object.keys(d).forEach((e,k) => obj._store(e,d[e]));
		
		this._set_debugger();
		this._set_iframe();
		this._draw_iframe();
		this._register_window_listeners();
	},
	
	debug : function(bool)
	{
		this._debug = !!bool;
	},
	
	_set_debugger : function()
	{
		var a = window.navigator.userAgent.indexOf("MSIE ");

		if(a == -1)
		{
			let params 		= new URLSearchParams(window.location.search);
			let debug_param = params.get('debug');
			
			if(debug_param == "true")
			{
				this.debug(true);
			}
		}
	},
	
	_store : function(e,k)
	{
		this._stack[e] = k;
	},
	
	_fetch : function(id)
	{
		return this._stack[id];
	},
	
	_set_iframe : function()
	{
		var user_iframe_attributes 				= {};
		var obj									= this;
		NamedNodeMap.prototype.forEach 			= Array.prototype.forEach;
		var script_tag 							= document.getElementById(this._fetch('script_tag_name'));
		var iframe_attributes 					= {"anchorid" : "","hostname" : "","framewidth" : '100%',"frameheight" : "50px","maxframeheight" : "500px","frameborder" : "0","framepadding" : "0","framemargin" : "0"};
		
		script_tag.attributes.forEach(e =>	user_iframe_attributes[e.name] = e.value);
		Object.keys(user_iframe_attributes).forEach(function(e,k) {iframe_attributes[e] = user_iframe_attributes[e]});
		
		Object.keys(iframe_attributes).forEach(function(e,k)
		{
			obj._store(e,iframe_attributes[e]);
			if(obj._debug) { 
				console.debug(`### embedNavbar: ${e}=${iframe_attributes[e]}`);
			}
		});
		
		var banner_frame 						= document.createElement('iframe');
		banner_frame.id 						= this._fetch('frame_id');
		banner_frame.src 						= '//'+this._fetch('hostname')+'/homepage/web/pageHeader';  
		banner_frame.style.width 				= this._fetch('framewidth');
		banner_frame.style.height 				= this._fetch('frameheight');
		banner_frame.style.border 				= this._fetch('frameborder');
		banner_frame.style.padding 				= this._fetch('framepadding');
		banner_frame.style.margin 				= this._fetch('framemargin');
		banner_frame.style.overflowY 			= 'none';
		
		this._store("cnx_nav_iframe", banner_frame);
	},
	
	_draw_iframe : function()
	{
		document.getElementById(this._fetch("anchorid")).appendChild(this._fetch("cnx_nav_iframe"));
	},
	
	_register_window_listeners : function()
	{
		var obj = this;
		document.getElementById(obj._fetch('frame_id')).addEventListener('mouseover',function()
		{
			document.getElementById(obj._fetch('frame_id')).style.height = obj._fetch('maxframeheight');
		});

		window.onmessage = function(e)
		{
			if(e.data == "1")
			{
				document.getElementById(cnx_reusable_navbar._fetch('frame_id')).style.height = cnx_reusable_navbar._fetch('frameheight');
			}
			
			if(e.data.indexOf('url=') > -0x01)
			{
				window.location.href = e.data.substr(0x04);
			}
		};

		if(this._debug)
		{
			window.onmouseover=function(e)
			{
				console.debug(e.target.nodeName);
			};
		}
	},
	
	version : "1",
};
document.addEventListener('DOMContentLoaded', function()
{
	cnx_reusable_navbar.init({"script_tag_name" : "embedCNXNavbar", "frame_id" : "cnx_nav"});
},false);