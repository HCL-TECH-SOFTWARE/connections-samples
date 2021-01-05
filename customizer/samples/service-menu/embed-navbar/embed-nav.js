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

window.onmouseover=function(e)
{
    if(e.target.nodeName == "BODY")
    {
        window.top.postMessage('1', '*')
    }
};

window.onbeforeunload = function(e)
{
    if(typeof document.activeElement.href == "undefined")
    {
        return null;
    }
   
    e.stopPropagation();
    window.top.postMessage('url='+document.activeElement.href, '*');
    window.onbeforeunload = null;
    return undefined;
}

var t = setInterval(function()
{
    if(document.getElementById('lotusBannerApps_dropdown') !== null)
    {
        clearInterval(t);
        document.querySelectorAll('#lconnheadermenu-apps a').forEach(function(e)
        {
            e.addEventListener('click',function(a)
            {
                document.activeElement.href = this.href;
                window.location.href         = this.href;
            },true);
           
        });
    }
},200);