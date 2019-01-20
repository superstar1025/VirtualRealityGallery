var navElems, hostName;

    function splitHostname() {
            var result = {};
            var regexParse = new RegExp('([a-z\-0-9]{2,63})\.([a-z\.]{2,5})$');
            var urlParts = regexParse.exec(window.location.hostname);
            result.domain = urlParts[1];
            result.type = urlParts[2];
            result.subdomain = window.location.hostname.replace(result.domain + '.' + result.type, '').slice(0, -1);;
            return result;
    };
    hostName = splitHostname();
    //console.log(hostName);
    //subdomain = 'http://'+ hostName.subdomain + '.' + hostName.domain + '.' + hostName.type + '/ar_vr/';
    //console.log("length",hostName.subdomain.length);
    //if ( !hostName.subdomain.length ) {  return; }
    //{circle: , circleArrow: , gallery: ,loading: }

    if (hostName.domain=="3dspecial") { 
        navElems = ['img/border-circle.png', 'img/hotspot.png', 'img/image-gallery.png']; 
    }else { 
        navElems = ['static/content/img/border-circle.png', 'static/content/img/hotspot.png', 'static/content/img/image-gallery.png', 'static/content/img/loading.png']; 
    }
