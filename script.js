function CheckDevice(){
  ua=(navigator.userAgent).toLowerCase()
  userAgents=["trident","msie","iphone","android","mobile","ipad","ios"]
  uallowed=new Number
  for(i in userAgents){
    if(ua.indexOf(userAgents[i])>0){
      uallowed+=1
    }
  }
  if(uallowed > 0){
    document.getElementById("incompatible").style.display = "block"
  }
}

/*#### Checking device, to block mobile and IE ####*/



id=0;
JSNMin = {};

//Thanx 2 https://stackoverflow.com/questions/13007582/html5-drag-and-copy
function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text/html", ev.target.id);
}
function drop(ev) {
  ev.preventDefault();
  var data=ev.dataTransfer.getData("text/html");
  if($(data).classList.contains("Template")){
    var nodeCopy = $(data).cloneNode(true);
    nodeCopy.id = id;
    nodeCopy.classList.remove("Template");
  }else{
    var nodeCopy = $(data);
  }
  if(checkTrash(ev.target, nodeCopy)==true){return}
  if(checkCopy(ev.target,nodeCopy) == true){return;}
    if(ev.target.classList.contains("Dropper")){
      ev.target.parentNode.insertBefore(nodeCopy, ev.target)
    }else{
      ev.target.parentNode.parentNode.parentNode.insertBefore(nodeCopy, ev.target.parentNode.parentNode)
    }
  id++;
}

function checkCopy(evObj, nodeCopy){
var ret = new Boolean;
ret += evObj.parentElement.classList.contains("Template")
ret += evObj.parentElement.parentElement.classList.contains("Template")
ret += nodeCopy.contains(evObj)
return ret;
}

function checkTrash(target, node){
  if(target.classList.contains("trash")){
    node.remove()
    return true
  }
}

function evalScr(ObjectID, env){
  var ChildArray = $(ObjectID).children;
  for(var i=1;i <= ChildArray.length-2;i++){
    eval(ChildArray[i].classList[0]+"("+ChildArray[i].id+",\""+env+"\")")
  }
    return(Str)
}


function DoNTimes(ObjectID, env){
  Str += "For /l %%"+CharRepr(ObjectID)+" in (1, 1, "+$(ObjectID).children[0].children[1].value+") do (\r\n"
  evalScr(ObjectID, CharRepr(ObjectID))
  Str += ")\r\n"
}

function Echo(ObjectID, env){
  Str += "Echo "+_$($(ObjectID).children[0].children[1].value, env)+"\r\n"
}

function WriteToFile(ObjectID, env){
  Str += "Echo "+_$($(ObjectID).children[0].children[1].value, env)+" >>\""+_$($(ObjectID).children[0].children[3].value, env)+"\"\r\n"
}

function DeleteFile(ObjectID, env){
  Str += "Del /F /Q \""+_$($(ObjectID).children[0].children[1].value, env)+"\"\r\n"
}

function DeleteFolder(ObjectID, env){
  Str += "Rd /S /Q \""+_$($(ObjectID).children[0].children[1].value, env)+"\"\r\n"
}

function CreateFolder(ObjectID, env){
  Str += "Md \""+_$($(ObjectID).children[0].children[1].value, env)+"\"\r\n"
}

function IfExists(ObjectID, env){
  MaybeNot = ""
  if($(ObjectID).children[0].children[2].checked){
      MaybeNot = "not"
  }
  Str += "If "+MaybeNot+" exist \""+_$($(ObjectID).children[0].children[1].value, env)+"\" (\r\n"
  evalScr(ObjectID, env)
  Str += ")\r\n"
}

function OtherCommand(ObjectID, env){
Str += _$($(ObjectID).children[0].children[1].value, env)+"\r\n"
}

function ClearScreen(ObjectID, env){
Str += "Cls\r\n"
}

function ForInFolder(ObjectID, env){
  Str += "for /f \"usebackq delims=|\" %%"+CharRepr(ObjectID)+" in (`dir /b \""+_$($(ObjectID).children[0].children[1].value, env)+"\"`) do (\r\n"
  evalScr(ObjectID, CharRepr(ObjectID))
  Str += ")\r\n"
}

function $(ObjectID){
  return document.getElementById(ObjectID)
}

function _$(val, env){
if(env != "nul"){
  return EscapeBat(val.replace(/\^iter\^/g, ("%%"+env)))
}else{
  return EscapeBat(val)
}

}

function EscapeBat(Str){
  //Batch uses the ^ as escape character... 
  return Str.replace(/\^|&|<|>|\||'|`|,|;|=|\(|\)/g, "^$&")
}

function ReformatDisplay(val){
    var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return val.replace(/[&<>"']/g, function(m) { return map[m]; });
}

function CharRepr(env){
  return String.fromCharCode(65+env%27)
}

function callCookie(){
  if(document.cookie != ""){
    saveAsCookie()
  }
  else{
    if(confirm("Are you sure you want to save as cookie?\nThis feature is experimental and may take up a lot of space!")){
      saveAsCookie()
    }
  }
}


function saveAsCookie(){
//Very funny variable names, ik, thank me later :P
RawCookie = $("CodeInput").querySelectorAll('input')
for(i=0;i<RawCookie.length;i++){
if(RawCookie[i].attributes.type.nodeValue=="checkbox"){
  if(RawCookie[i].checked){
    RawCookie[i].setAttribute('checked', '');
  }else{
    RawCookie[i].removeAttribute('checked');
  }
  continue
}
chocolateChips=RawCookie[i].value
RawCookie[i].setAttribute("value",chocolateChips)

}
BakedCookie = $("CodeInput").innerHTML
BakedCookie = BakedCookie.replace(/\t|\n/g,"")
BakedCookie = BakedCookie.replace(/\s{2,}/g," ") //Trying to reduce the cookie size

document.cookie = "SavedData="+btoa(BakedCookie)+CookieExpiryDate();
}

function LoadCookie(){
  if(document.cookie==""){
    return
  }
  BakedCookie=document.cookie.split("; ")[0]
  UnbakedCookie=atob(BakedCookie.substr(10,BakedCookie.length))
  $("CodeInput").innerHTML=UnbakedCookie
}

function CookieExpiryDate(){
var now = new Date();
now.setUTCMonth(now.getUTCMonth()+1);
return '; expires='+now.toUTCString()+'; path=/';
}

/*$("savetext").innerHTML=evalScr().replace(/\n/g, "<br />")*/
function DisplayScript(windowClass){
  Str = "echo off\r\nchcp 65001\r\ncls\r\n";
  document.getElementsByClassName(windowClass)[0].classList.toggle('display');
  $("CodeField").classList.toggle('blur');
  $("CodeBits").classList.toggle('blur');
  $("savetext").innerHTML = ReformatDisplay(evalScr("CodeInput", "nul")).replace(/\n/g, "<br>")+"cmd /k"
}

function HideScript(windowClass){
  document.getElementsByClassName(windowClass)[0].classList.toggle('display');
  $("CodeField").classList.toggle('blur');
  $("CodeBits").classList.toggle('blur');
}

function DownloadScript(){
  Str = "echo off\r\nchcp 65001\r\ncls\r\n";
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(evalScr("CodeInput", "nul")+"cmd /k"));
  element.setAttribute('download', prompt("Please enter file name:", "Script")+".bat");
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

window.onbeforeunload = function() {
    return true;
};