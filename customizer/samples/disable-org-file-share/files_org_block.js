var observer = new MutationObserver(function(mutations)
{
  var dom_change = false;
  for(var index = 0; index < mutations.length; index++)
  {
    var mutation = mutations[index];
    if(mutation.type === 'childList' && mutation.addedNodes.length)
    { 
      dom_change = true;
      break;
    }
  }
  if(dom_change)
  {
    //files
    if(document.querySelector('.lotusDialog.lotusForm .lconnPickerSourceArea') !== null)
    {
        try
        {
            document.querySelector('.lotusDialog.lotusForm #submit_button').addEventListener('click',function(){var timer = setInterval(function(){if(document.querySelector('div[id^=lconn_share_widget_Dialog]').style.display == "none"){clear_dialog();}},1000);},false);
            document.querySelector('.lotusDialog.lotusForm #cancel_button').addEventListener('click',clear_dialog,false);
            document.querySelector('.lotusDialog.lotusForm a.lotusDialogClose').addEventListener('click',clear_dialog,false);
            document.querySelector('input[type="radio"][value="public"]').disabled = true;
        }
        catch(e)
        {
        }
    }
    //folder
    
    if(document.querySelector('.lotusDialog.lotusForm .lotusDialogContent._qkrDialogCompact table') !== null)
    {
        try
        {
            document.querySelector('.lotusDialog.lotusForm #submit_button').addEventListener('click',function(){var timer = setInterval(function(){if(document.querySelector('div[id^=lconn_share_widget_Dialog]').style.display == "none"){clear_dialog();}},1000);},false);
            document.querySelector('.lotusDialog.lotusForm #cancel_button').addEventListener('click',clear_dialog,false);
            document.querySelector('.lotusDialog.lotusForm a.lotusDialogClose').addEventListener('click',clear_dialog,false);
            document.querySelector('input[type="radio"][value="public"]').disabled = true;
        }
        catch(e)
        {
        }
    }
    
    //file viewer
    if(document.querySelector('select[data-dojo-attach-point="typeaheadSelector"]') !== null)
    {
        try
        {
        document.querySelector('select[data-dojo-attach-point="typeaheadSelector"] option[value="everyone"]').disabled = true;
        }
        catch(e)
        {}
    }
  }
});
observer.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});

function clear_dialog()
{
      var list = document.querySelectorAll("div.lotusDialogWrapper[id^=lconn_share_widget_Dialog]");
      for(i = 0;i < list.length; i++)
      {
          list[i].outerHTML = "";
      }

      var list = document.querySelectorAll("div[id^=dijit_DialogUnderlay]");
      for(i = 0;i < list.length; i++)
      {
          list[i].outerHTML = "";
      }
}
