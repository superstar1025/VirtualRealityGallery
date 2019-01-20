var uiState = { hoverOnMatlib: false };
var handleMenu;
var data;

     var container, camera, scene, renderer, loader, orbitControls, stats, gui;
      var renderTarget, spritePoint, spritePointText, spritePointG, spritePointGbg;
      var elem =0;
      var camera, scene, renderer;
      var mesh;
      var textureD, textureN, textureA;
      var views, glRenderer, camera, cssrenderer;
      var cssScene, cssRenderer;
      var realData,startPosition,  light;
      var cameraF,cameraT,cameraB,cameraI,helpert,helperb,helperf,helperi;
      var clock = new THREE.Clock();
      var changeSpotText;
      //console.log('main', data, handleMenu);
      var envMap, manager;
      var objState= {
      img_dataf: {},
      img_datab: {},   
      img_datat: {}, 
      img_datai: {}, 
      matsChoose:  false
      };
      var uiState= {};

      var cube, firstInt;
      var intersTime = 0;
      var projector = new THREE.Projector();
      var mouse = { x: 0, y: 0 }, INTERSECTED;
      var sprite1;
      var texture1, texture2;
      var pointsArr=[];
      var uiState={};
      var raycaster = new THREE.Raycaster();
      var hotSpot = new THREE.Group(); 
      var hotSpotG = new THREE.Group();
      var mapIndoor, mapOutdoor;
      var loadBar;  

document.addEventListener("DOMContentLoaded", function(event) {

if ( !hostName.subdomain.length ) { console.log('you don`t have a subdomain!'); return; }
   loadBar = document.getElementById("loadBar");

//hamburger
jQuery(function($){
  $( '#nav-icon3' ).click(function(){
    $('.responsive-menu').toggleClass('expand');
    //$(this).toggleClass('open');
  });
$(document).ready(function(){

});
  $(document).on("click", function(e){
    if( 
      $(e.target).closest(".responsive-menu").length == 0 &&
      $(".responsive-menu").hasClass("expand") &&
      $(e.target).closest("#nav-icon3").length == 0
    ){
      $('.responsive-menu').toggleClass('expand');
      //$('#nav-icon3').toggleClass('open');
    }
  });
});



    /*var data2 = {
        vr: { 
          enable: true, 
          hotSpPos: { first: { title: "Second space", x:551, y:2048 }, second: { title: "First space", x: 2570, y: 1024 } },
          url: [ 'img/Workspace_VR_Stero.jpg', 'img/Cinema_VR.jpg' ]
        }, 
        gallery: { 
          enable: true, 
          hotSpPos:{ first: { x: 1360, y: 1760 }, second: { x: 2060, y: 795 } },
          url: [ 'img/1.jpg', 'img/Img2.jpg', 'img/Img3.jpg', 'img/4.jpg', 'img/5.jpg', 'img/6.jpg', 'img/7.jpg', 'img/8.jpg' ],
          urlFilter: ['img/6.jpg', 'img/7.jpg', 'img/8.jpg']
        },
        floorPlan: { 
          enable: true, 
          url: [  'img/4.jpg', 'img/5.jpg', 'img/6.jpg', 'img/7.jpg', 'img/8.jpg', 'img/1.jpg', 'img/2.jpg', 'img/3.jpg' ]
        }
      };
      var output = JSON.stringify( data2 );
      data = JSON.parse( output );
      proccedData(data);*/
//
    $.ajax({
        url : 'http://n90i.co.uk/get_data',
        type: 'POST',
        data :  JSON.stringify({
         'user': hostName.subdomain
        }),
        contentType: 'application/json',
        dataType: 'json',
        cache: false,
        processData:false,
        success: function (response) {
          console.log('response', response, data); 
          var output = JSON.stringify( response );
          data = JSON.parse( output );
          proccedData(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
           console.log(textStatus, errorThrown);
        }
      }); 

function proccedData(data) {
         //dimensions
         data.loadImg = { first: {}, second: {} }; 
         var addLink = function(url){
              var link = document.createElement('script');
              link.src = url;
              link.type = "text/javascript"; // no need for HTML5
              document.getElementsByTagName('body')[0].appendChild(link); // for IE6
              //console.log('added_'+url, document.getElementsByTagName('body')[0]);
          };

        handleMenu = function( dataFunct ) {
          uiState.frameState = dataFunct;
          document.getElementById("vrElem").classList.remove("active");
          document.getElementById("galleryElem").classList.remove("active"); 
          
          var floorPlan = document.getElementById("floorplansElem");
          floorPlan.classList.remove("active"); 

          if (dataFunct!=="vrElem") objState.vrEnable = false; 
          if (dataFunct=="vrElem") {
            if (data.vr.enable) {
              if (container) container.style.zIndex = 50;
              gallery.style.zIndex = 0; 
              floorPlan.style.zIndex = 0; 
            }
          objState.vrEnable = true;  
          document.getElementById(dataFunct).classList.add("active");
          }else if (dataFunct=="galleryElem") {
            if (data.vr.enable) {
              gallery.style.zIndex = 50;
              if (container) container.style.zIndex = 0;
              floorPlan.style.zIndex = 0;
            }
            document.getElementById(dataFunct).classList.add("active"); 
          }else if (dataFunct=="floorplansElem") {
            if (data.floorPlan.enable) {
              floorPlan.style.zIndex = 50;
              if (container) container.style.zIndex = 0;
              gallery.style.zIndex = 0;
            }
            document.getElementById(dataFunct).classList.add("active"); 
          }
        };

        var ButtonsElems = document.getElementsByClassName("aim-button");
        for (var i = ButtonsElems.length - 1; i >= 0; i--) {
          if (i==2) { var id = "vrElem"; if (!data.vr.enable) ButtonsElems[i].style.display = 'none'; }
          else if (i==1) { var id = "galleryElem"; if (!data.gallery.enable) ButtonsElems[i].style.display = 'none'; }
          //else if (i==1) var id = "poisElem";
          else if (i==0) { var id = "floorplansElem"; if (!data.floorPlan.enable) ButtonsElems[i].style.display = 'none'; }
          ButtonsElems[i].id = id; 
          if (i==1 && !data.vr.enable) ButtonsElems[i].classList.add("active");
          if (i==0 &&!data.gallery.enable && !data.vr.enable) ButtonsElems[i].classList.add("active");

          ButtonsElems[i].onclick = function(){ handleMenu( this.id ); };
        };
        //console.log('handleMenu', handleMenu );
    if (data.vr.enable) {
/*
        addLink("./js/OrbitControls.js");
        addLink("./js/GLTFLoader.js");
        addLink("./js/dat.gui.min.js");
        addLink("./js/camera-controls.js");
        addLink("./js/Detector.js");
        addLink("./js/Projector.js");
*/
        //addLink("main.js");
     objState.vrEnable = true;
     changeSpotText = function (txt) {
              // console.log(txt, txt.length);
              uiState.context2.clearRect(0,0,256,256);
              var message = txt;
              var metrics = uiState.context2.measureText(message);
              var width = metrics.width;
              var marg = width<240 ? (240-width)/2 : 0;
              //console.log('width', width);
              uiState.context2.fillStyle = "rgba(255,255,255,0.85)"; // white filler
              uiState.context2.fillRect( marg+2,0, width+20,60 );
              uiState.context2.font = "normal 30px futura";
              uiState.context2.fillStyle = "rgba(0,0,0,1)";
              uiState.context2.fillText( message, ((width)/15)+marg+2, 40);
              spritePointText.material.map.needsUpdate = true;
      };

        init();
        animate();
         
    function init() {
        //it's an initialising main things 
        container = document.getElementById("container");
        camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 2000 );

        camera.position.set(2.4051118623063763,0.2151509762326989, -9.704078884016724);

        scene = new THREE.Scene();
        scene.background = new THREE.Color( 0xffffff );

        var ambient = new THREE.AmbientLight( 0xffffff, 1 );
        scene.add( ambient );

        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );        
        renderer.gammaInput = true;
        renderer.gammaOutput = true; 
        container.appendChild( renderer.domElement );


        manager = new THREE.LoadingManager();
        manager.onLoad = function ( ) {
        //thing happened after all the texture data will loaded    
        myProgress.style.opacity = 0; setTimeout(function(){myProgress.style.display="none";}, 400);
        console.log( 'Loading complete!');
        };
        manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
        //update the prog bar  
        myBar.style.width = Math.round(itemsLoaded / itemsTotal *100) + '%'; 
        };
        manager.onError = function ( url ) {
        console.log( 'There was an error loading ' + url );
        };

        CameraControls.install( { THREE: THREE } );
        //setting the main camera holder 
        orbitControls = new CameraControls( camera, renderer.domElement );


        
        var geometry = new THREE.SphereGeometry( 150, 80, 80 );
        var material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.BackSide } );
        objState.sphere = new THREE.Mesh( geometry, material );
        scene.add( objState.sphere );

        var txtLoad = new THREE.TextureLoader(manager);
        txtLoad.load(data.vr.url[0], function ( texture ) {
          mapIndoor = texture;
          texture.wrapT = texture.wrapS = THREE.RepeatWrapping;

          var maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
          mapIndoor.anisotropy = maxAnisotropy;

          objState.sphere.material.map = texture; 
          objState.sphere.material.needsUpdate = true;
          texture.needsUpdate = true;

          data.loadImg.first.x = texture.image.naturalWidth; 
          data.loadImg.first.y = texture.image.naturalHeight;
          //hotspots coordinates
          var coords = getCoords( data.vr.hotSpPos.first.x, data.vr.hotSpPos.first.y, data.loadImg.first );
          hotSpot.rotation.set( 0, coords.x, coords.y );

          var coords = getCoords( data.gallery.hotSpPos.first.x, data.gallery.hotSpPos.first.y, data.loadImg.first );
          hotSpotG.rotation.set(0, coords.x, coords.y );

         // console.log(texture.image.naturalHeight, texture.image.naturalWidth, objState.sphere.material.map);  
        });



        /*var createTexture = function(url, obj ) {
          var image = new Image();
          image.src = url;
          image.onload = function() {
            obj.x = this.width; 
            obj.y = this.height;
            //console.log(data.loadImg, obj);
          };
        };

        if (data.vr.url[0]) createTexture( data.vr.url[0], data.loadImg.first );
        if (data.vr.url[1]) createTexture( data.vr.url[1], data.loadImg.second );*/

        //text over
        uiState.canvas2 = document.createElement('canvas');
        uiState.canvas2.width = 256;
        uiState.canvas2.height = 256;
        uiState.context2 = uiState.canvas2.getContext('2d');

        uiState.context2.font = "normal 35px Arial";
        uiState.context2.fillStyle = "rgba(0,0,0,0.95)";

        //objState.sphere.material.map.anisotropy=16;
        //objState.sphere.material.map.magFilter  = THREE.NearestFilter;
        //objState.sphere.material.map.needsUpdate = true;
        var text = new THREE.Texture(uiState.canvas2); 
        text.needsUpdate = true;
        //text.wrapT = text.wrapS = THREE.RepeatWrapping;

        var circle = new THREE.TextureLoader(manager).load( navElems[1] );
        circle.wrapT = circle.wrapS = THREE.RepeatWrapping;

        var circleG = new THREE.TextureLoader(manager).load( navElems[0] );
        circleG.wrapT = circleG.wrapS = THREE.RepeatWrapping;



        spritePointText = new THREE.Sprite( new THREE.SpriteMaterial( { color: 0xffffff, map: text, transparent: true, visible:true, opacity:1, depthTest:false } ) );
        spritePointText.scale.set(25,25);
        spritePointText.material.map.needsUpdate = true;

        changeSpotText( data.vr.hotSpPos.first.title );
        changeSpotText( data.vr.hotSpPos.first.title );

        spritePoint = new THREE.Sprite( new THREE.SpriteMaterial( { color: 0xeeeeee, map: circle, transparent: true, visible:true, opacity:0.85, depthTest:false } ) );
        spritePoint.position.set(-134,0,0);
        //spritePoint.rotation.set(0, 0.444, 0);
        spritePoint.scale.set(13,13);
        spritePoint.userData.action = "outDoor";
        spritePoint.userData.num = 0; 

        hotSpot.add( spritePoint );
        hotSpot.add( spritePointText );
        //


        //hot point vr add
        if (data.vr.url[1]) scene.add(hotSpot);
        pointsArr.push(spritePoint);

        spritePointText.position.set(spritePoint.position.x, -20, 0 );

        spritePointG = new THREE.Sprite( new THREE.SpriteMaterial( { color: 0x000000, transparent: true, visible:true, opacity:0.85, depthTest:false } ) );
        //if (navElems[2]) { 
          var gall =  new THREE.TextureLoader(manager).load( navElems[2] );
          gall.wrapT = gall.wrapS = THREE.RepeatWrapping; 
          spritePointG.material.map = gall;
        //}

        spritePointG.scale.set(8,8);
        spritePointG.position.set(-134, 0, 0);
        spritePointGbg = new THREE.Sprite( new THREE.SpriteMaterial( { color: 0xeeeeee, map: circleG, transparent: true, visible:true, opacity:0.85, depthTest:false } ) );

        spritePointGbg.scale.set(13,13);
        spritePointGbg.userData.num = 1;
        spritePointGbg.position.set(-134, 0, 0);

        hotSpotG.add(spritePointGbg); 
        hotSpotG.add(spritePointG);
        //hotSpot.rotation.set(0, hotSpotPos.vr.first.y, hotSpotPos.vr.first.z );

        //hot point gallery add 
        if (data.gallery.enable) scene.add(hotSpotG); 

         /* var gui = new dat.GUI();
          var pos = spritePointGbg;
          var step = 150;
          var folder = gui.addFolder( 'pos' );
          folder.add( pos.position, 'x', pos.position.x-step, pos.position.x+step, 0.001 );
          folder.add( pos.position, 'y', pos.position.x-step, pos.position.x+step, 0.001 );
          folder.add( pos.position, 'z', pos.position.z-step, pos.position.z+step, 0.001 );
          folder.open();
          var folder = gui.addFolder( 'rot' );
          //folder.add( hotSpot.rotation, 'x', 0,Math.PI *2, 0.001 );
          folder.add( hotSpot.rotation, 'y', 0,Math.PI *2, 0.001 );
          folder.add( hotSpot.rotation, 'z', -Math.PI/2,Math.PI/2, 0.001 );
          folder.open();*/

        pointsArr.push(spritePointGbg);

        document.addEventListener( 'mousemove', onDocumentMouseMove, false );
        document.addEventListener( 'mousedown', onDocumentMouseclick, false ); 
        window.addEventListener( 'resize', onWindowResize, false );

    };

      function ChangeEnvMap(action){
        var loader = new THREE.TextureLoader();
        if (action=="outDoor") {
          if (!mapOutdoor && data.vr.url[1] ) {
          loadBar.style.display = "block";  
          loader.load(
            data.vr.url[1],
            function ( texture ) {
                //pointsArr[0].material.color.setHex( 0xffffff );
                //pointsArr[0].position.set(102.7303059802472,-0.720332191864512,-109.1302692103592);
                //spritePointText.position.set(pointsArr[0].position.x, pointsArr[0].position.y, pointsArr[0].position.z);
                //spritePointG.position.set( 141.00956155224242,50.78103041533913,-2.8823945739812578);
                //spritePointGbg.position.set(141.00956155224242,50.78103041533913,-2.8823945739812578);
                //console.log(texture.image.naturalHeight, texture.image.naturalWidth, "sec");
                data.loadImg.second.x = texture.image.naturalWidth; 
                data.loadImg.second.y = texture.image.naturalHeight;
                //hotspots coordinates
                var coords = getCoords( data.vr.hotSpPos.second.x, data.vr.hotSpPos.second.y, data.loadImg.second );
                hotSpot.rotation.set(0, coords.x, coords.y );

                var coords = getCoords( data.gallery.hotSpPos.second.x, data.gallery.hotSpPos.second.y, data.loadImg.second );
                hotSpotG.rotation.set(0, coords.x, coords.y );

                changeSpotText( data.vr.hotSpPos.second.title );  

                pointsArr[0].userData.action = "inDoor";
                mapOutdoor = texture;
                mapOutdoor.wrapT = mapOutdoor.wrapS = THREE.RepeatWrapping;
                objState.sphere.material.map = mapOutdoor;
                var maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
                objState.sphere.material.map.anisotropy = maxAnisotropy;
                loadBar.style.display = "none";
            },
            undefined,
            function ( err ) {
              console.error( 'An error happened.' );
            }
          );
          }else{
          //pointsArr[0].material.color.setHex( 0xffffff );
          //pointsArr[0].position.set(102.7303059802472,-0.720332191864512,-109.1302692103592);
          //spritePointText.position.set(spritePoint.position.x, spritePoint.position.y, spritePoint.position.z);
          //spritePointG.position.set( 141.00956155224242,50.78103041533913,-2.8823945739812578);
          //spritePointGbg.position.set(141.00956155224242,50.78103041533913,-2.8823945739812578);
          var coords = getCoords( data.vr.hotSpPos.second.x, data.vr.hotSpPos.second.y, data.loadImg.second );
          hotSpot.rotation.set(0, coords.x, coords.y );

          var coords = getCoords( data.gallery.hotSpPos.second.x, data.gallery.hotSpPos.second.y, data.loadImg.second );
          hotSpotG.rotation.set(0, coords.x, coords.y );
          changeSpotText( data.vr.hotSpPos.second.title ); 

          pointsArr[0].userData.action = "inDoor";
          objState.sphere.material.map = mapOutdoor;  
          }
        }else{
                //pointsArr[0].material.color.setHex( 0x000000 );
                //pointsArr[0].position.set(-12.218952979338605, 3.388769190302174, 48.33699780219709);
                //pointsArr[0].position.set(-134.37940672338118,-3.7997608902457087,66.34040692158301);
                //spritePointText.position.set(pointsArr[0].position.x, pointsArr[0].position.y, pointsArr[0].position.z);
                //spritePointG.position.set(-71.43444241279849, 33.266208967242214, 127.47616797734668);
                //spritePointGbg.position.set(-71.43444241279849, 33.266208967242214, 127.47616797734668); 
                var coords = getCoords( data.vr.hotSpPos.first.x, data.vr.hotSpPos.first.y, data.loadImg.first ); 
                hotSpot.rotation.set(0, coords.x, coords.y );
               
                var coords = getCoords( data.gallery.hotSpPos.first.x, data.gallery.hotSpPos.first.y, data.loadImg.first );
                hotSpotG.rotation.set(0, coords.x, coords.y );
                
                changeSpotText( data.vr.hotSpPos.first.title ); 

                pointsArr[0].userData.action = "outDoor";
                objState.sphere.material.map = mapIndoor;
        }
      };


      function onDocumentMouseclick( event ) {
        //orbitControls.autoRotate = false;
        raycaster.setFromCamera( mouse, camera );
        var intersection = raycaster.intersectObjects( pointsArr  );  
        var intersectionO = raycaster.intersectObjects( scene.children  ); 
                if ( intersection.length > 0  ) {
                    if (intersection[0].object&&uiState.frameState!=="galleryElem"){
                        if (intersection[0].object.userData.num==1) handleMenu("galleryElem");
                        else ChangeEnvMap(intersection[0].object.userData.action);
                    }
                }
      };

        function onDocumentMouseMove( event ) {
          mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
          mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        };

      //mouse hover effects code
      function updateInfo() {

        var vector = new THREE.Vector3( mouse.x, mouse.y, 1 ); vector.unproject( camera ); 
        var dir = vector.sub( camera.position ).normalize();
        var ray = new THREE.Raycaster( camera.position, dir );
        var intersects = ray.intersectObjects( pointsArr );

        if ( intersects.length > 0 )
        {
          container.style.cursor = 'pointer';
          elem = +intersects[ 0 ].object.userData.num;
          if ( intersects[ 0 ].object != INTERSECTED   ) 
          {
            if ( INTERSECTED && INTERSECTED.material.color.getHex() !== 0x222222  )  INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
            
            INTERSECTED = intersects[ 0 ].object;
            elem = +intersects[ 0 ].object.userData.num;
            INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
            INTERSECTED.material.color.setHex( 0xffffff );
            INTERSECTED.material.opacity =1;

            //if ( intersects[0].object.name  ) INTERSECTED.material.color.setHex( 0xffffff );
          }
        } else {
          if ( INTERSECTED ) {

          if (objState.currentSeat&&objState.currentSeat.name!==INTERSECTED.name)INTERSECTED.material.color.setHex( INTERSECTED.currentHex );

          if (!objState.currentSeat) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
          if (objState.matsChoose==null ){ objState.matsChoose=true; INTERSECTED.material.color.setHex( 0x000000 ); }
          if (objState.currentSeat&&objState.currentSeat.material.map) INTERSECTED.material.color.setHex( 0x000000 );
          }    INTERSECTED = null;
          container.style.cursor = 'auto';
        }

          if (INTERSECTED&&INTERSECTED.scale.x<=15) {

          INTERSECTED.scale.x+=0.5;
          INTERSECTED.scale.y+=0.5;

          }else if(INTERSECTED==null){
            pointsArr[elem].material.opacity =0.9;

            if (true) {
             // for (var i = pointsArr.length - 1; i >= 0; i--) {
                if (pointsArr[elem].scale.x>13) {
                  pointsArr[elem].scale.x-=0.5;
                  pointsArr[elem].scale.y-=0.5;
                }else{
                  pointsArr[elem].scale.x=13
                  pointsArr[elem].scale.y=13;
                }
             // };
            }
          }

      };
        //
        function getCoords( x, y, obj ) {
          //console.log(obj, 'getCoords' );
          var imgSize = { x: obj.x, y: obj.y };
          var coords = {   
            x: ( Math.PI*2 ) / ( imgSize.x / (x >= 1 ? x : 1) ), 
            y: (( Math.PI ) / ( imgSize.y / ( y >= 1 ? y : 1) )) <= Math.PI/2       ? 
             0 - ( (Math.PI/2) - (( Math.PI ) / ( imgSize.y / (y >= 1 ? y : 1) )) ) : 
             0 + ( (Math.PI/1) - (( Math.PI ) / ( imgSize.y / (y >= 1 ? y : 1) )) )
          };

          return coords;
        };

      function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
      };

      function animate() {
        requestAnimationFrame( animate );
        var delta = clock.getDelta();
        if (objState.vrEnable) {
          renderer.render( scene, camera );
          orbitControls.update( delta );
          updateInfo();
        }
      };


    }else {
      myProgress.style.opacity = 0; setTimeout(function(){myProgress.style.display="none";}, 400); 
    }  

if (data.gallery.enable || data.floorPlan.enable) {

 if (data.gallery.enable && data.floorPlan.enable ) {
    document.getElementById("prev2").style.display='none';
    document.getElementById("next2").style.display='none';
 } 

  if (data.gallery.enable) {

      function swithImageGallery( elem ){
        //console.log(elem.dataset.default);
        if (elem.dataset.default.length) {

          objState.imgGallArray[+elem.dataset.number].style.opacity = 0;
          elem.classList.add("active");
          setTimeout(function(){ 
            objState.imgGallArray[+elem.dataset.number].style.opacity = 1;  
            objState.imgGallArray[+elem.dataset.number].attributes[0].value = elem.dataset.content;
            elem.dataset.default = ''; 
          }, 300);
          
        }else{
          
          objState.imgGallArray[+elem.dataset.number].style.opacity = 0;
          elem.classList.remove("active");
          setTimeout(function(){ 
            objState.imgGallArray[+elem.dataset.number].style.opacity = 1;
            objState.imgGallArray[+elem.dataset.number].attributes[0].value = elem.dataset.contentBefore;
            elem.dataset.default = true;
          }, 300);
          
        }

      };

      var createGalleryElem = function( url, ind ) {
        var galleryCont= document.getElementById("galleryImageContainer");
        var num = createGalleryElem.num();

        var contElem = document.createElement( 'div' );
        contElem.className = 'slide';
        contElem.dataset.content = "content-"+num;
          var imageCont = document.createElement( 'div' );
          imageCont.className = 'img-wrap'; 
            var image = document.createElement( 'img' ); 
            image.src = url;
            image.alt = 'img'+num;
            image.dataset.number = num-1;
            image.dataset.type =  'img';
            if (!objState.imgGallArray) objState.imgGallArray =[];
            objState.imgGallArray.push(image);
            //image.onclick = function(){ swithImageGallery( this ); };
          imageCont.appendChild(image);  

          var button= document.createElement( 'button' ); 
          button.className = 'content-switch';
          button.innrHTML = 'Read more';
        contElem.appendChild(imageCont);

        if ( data.gallery.urlFilter && data.gallery.urlFilter[ind] ) {
            var switcherCont = document.createElement( 'div' );
            switcherCont.id = 'switcherCont';
            //for (var k = 0; k <= data.gallery.urlFilter.length - 1; k++) {
                var switcher = document.createElement( 'div' );
                switcher.className = 'switchBut';
                switcher.dataset.content =  data.gallery.urlFilter[ind];
                switcher.dataset.type =  'btn';
                switcher.dataset.contentBefore =  data.gallery.url[ind];
                switcher.dataset.default = true;
                switcher.dataset.number =  ind;
                switcher.onclick = function(){ swithImageGallery( this ); };

            switcherCont.appendChild(switcher);
            //};
            //document.getElementById("gallery").appendChild(switcherCont);
            contElem.appendChild(switcherCont);
        }

        contElem.appendChild(button); 

        galleryCont.appendChild(contElem);  
      };
      createGalleryElem.num = makeCounter();

      for (var i = 0; i <= data.gallery.url.length - 1; i++) {
        createGalleryElem( data.gallery.url[i], i );
      };
  }

if (data.floorPlan.enable) {
      var createGalleryElem = function( url ) {
        var galleryCont= document.getElementById("galleryImageContainer2");
        var num = createGalleryElem.num();

        var contElem = document.createElement( 'div' );
        contElem.className = 'slide';
        contElem.dataset.content = "content-"+num;
          var imageCont = document.createElement( 'div' );
          imageCont.className = 'img-wrap'; 
            var image = document.createElement( 'img' ); 
            image.src = url;
            image.alt = 'img'+num;
          imageCont.appendChild(image);  

          var button= document.createElement( 'button' ); 
          button.className = 'content-switch';
          button.innrHTML = 'Read more';
        contElem.appendChild(imageCont);
        contElem.appendChild(button); 

        galleryCont.appendChild(contElem);  
      };
      createGalleryElem.num = makeCounter();

      for (var i = 0; i <= data.floorPlan.url.length - 1; i++) {
        createGalleryElem( data.floorPlan.url[i] );
      };
}else{
 document.getElementById("gallery2").style.display = "none"; 
}

      function makeCounter( num ) {
        var currentCount = num || 1;
        return function() {
          return currentCount++;
        };
      };
        //scripts
        //addLink("./js/dragdealer.js");
        //addLink("./js/classie.js");
       // addLink("./js/dragslideshow.js");

  /**
 * dragslideshow.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2014, Codrops
 * http://www.codrops.com
 */
;( function( window ) {
  
  'use strict';
  
  var docElem = window.document.documentElement,
    transEndEventNames = {
      'WebkitTransition': 'webkitTransitionEnd',
      'MozTransition': 'transitionend',
      'OTransition': 'oTransitionEnd',
      'msTransition': 'MSTransitionEnd',
      'transition': 'transitionend'
    },
    transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
    support = { transitions : Modernizr.csstransitions };

  /**
   * gets the viewport width and height
   * based on http://responsejs.com/labs/dimensions/
   */
  function getViewport( axis ) {
    var client, inner;
    if( axis === 'x' ) {
      client = docElem['clientWidth'];
      inner = window['innerWidth'];
    }
    else if( axis === 'y' ) {
      client = docElem['clientHeight'];
      inner = window['innerHeight'];
    }
    
    return client < inner ? inner : client;
  }

  /**
   * extend obj function
   */
  function extend( a, b ) {
    for( var key in b ) { 
      if( b.hasOwnProperty( key ) ) {
        a[key] = b[key];
      }
    }
    return a;
  }

  /**
   * DragSlideshow function
   */
  function DragSlideshow( el, options ) { 
    this.el = el;
    this.options = extend( {}, this.options );
    extend( this.options, options );
    this._init();
  }

  /**
   * DragSlideshow options
   */
  DragSlideshow.prototype.options = {
    perspective : '1200',
    slideshowRatio : 0.3, // between: 0,1
    onToggle : function() { return false; },
    onToggleContent : function() { return false; },
    onToggleContentComplete : function() { return false; }
  }

  /**
   * init function
   * initialize and cache some vars
   */
  DragSlideshow.prototype._init = function() {
    var self = this;

    // current
    this.current = 0;

    // status
    this.isFullscreen = true;
    
    // the images wrapper element
    this.imgDragger = this.el.querySelector( 'section.dragdealer' );
    
    // the moving element inside the images wrapper
    this.handle = this.imgDragger.querySelector( 'div.handle' );
    
    // the slides
    this.slides = [].slice.call( this.handle.children );
    
    // total number of slides
    this.slidesCount = this.slides.length;
    
    if( this.slidesCount < 1 ) return;

    // cache options slideshowRatio (needed for window resize)
    this.slideshowRatio = this.options.slideshowRatio;

    // add class "current" to first slide
    classie.add( this.slides[ this.current ], 'current' );
    
    // the pages/content
    this.pages = this.el.querySelector( 'section.pages' );

    // set the width of the handle : total slides * 100%
    this.handle.style.width = this.slidesCount * 100 + '%';
    
    // set the width of each slide to 100%/total slides
    this.slides.forEach( function( slide ) {
      slide.style.width = 100 / self.slidesCount + '%';
    } );
    
    // initialize the DragDealer plugin
    this._initDragDealer();

    // init events
    this._initEvents();
  }

  /**
   * initialize the events
   */
  DragSlideshow.prototype._initEvents = function() {
    var self = this;
    
    this.slides.forEach( function( slide ) {
      // clicking the slides when not in isFullscreen mode
      slide.addEventListener( 'click', function() {
        if( self.isFullscreen || self.dd.activity || self.isAnimating ) return false;
        
        if( self.slides.indexOf( slide ) === self.current ) {
          self.toggle();
        }
        else {
          self.dd.setStep( self.slides.indexOf( slide ) + 1 );
        }

      } );

      // reveal content
      slide.querySelector( 'button.content-switch' ).addEventListener( 'click', function() { self._toggleContent( slide );  } );
    } );

    // keyboard navigation events
    document.addEventListener( 'keydown', function( ev ) {
      var keyCode = ev.keyCode || ev.which,
        currentSlide = self.slides[ self.current ];

      if( self.isContent ) {
        switch (keyCode) {
          // up key
          case 38:
            // only if current scroll is 0:
            if( self._getContentPage( currentSlide ).scrollTop === 0 ) {
              //self._toggleContent( currentSlide );
            }
            break;
        }
      }
      else {
        switch (keyCode) {
          // down key
          case 40:
            // if not fullscreen don't reveal the content. If you want to navigate directly to the content then remove this check.
            if( !self.isFullscreen ) return;
            //self._toggleContent( currentSlide );
            break;
          // right and left keys
          case 37:
            self.dd.setStep( self.current );
            console.log(self.current);
            break;
          case 39:
            self.dd.setStep( self.current + 2 );
            console.log(self.current);
            break;
        }
      }
    } );

prev.addEventListener( 'click', function() {
self.dd.setStep( self.current );
console.log(self.current);
} );

next.addEventListener( 'click', function() {
self.dd.setStep( self.current + 2 );
console.log(self.current);
} );

prev2.addEventListener( 'click', function() {
self.dd.setStep( self.current );
} );

next2.addEventListener( 'click', function() {
self.dd.setStep( self.current + 2 );
} );

  }

  /**
   * gets the content page of the current slide
   */
  DragSlideshow.prototype._getContentPage = function( slide ) {
    return this.pages.querySelector( 'div.content[data-content = "' + slide.getAttribute( 'data-content' ) + '"]' );
  }

  /**
   * show/hide content
   */
  DragSlideshow.prototype._toggleContent = function( slide ) {
    if( this.isAnimating ) {
      return false;
    }
    this.isAnimating = true;

    // callback
    this.options.onToggleContent();

    // get page
    var page = this._getContentPage( slide );
    
    if( this.isContent ) {
      // enable the dragdealer
      this.dd.enable();
      classie.remove( this.el, 'show-content' );
    }
    else {
      // before: scroll all the content up
      if (page) page.scrollTop = 0;
      // disable the dragdealer
      this.dd.disable();
      classie.add( this.el, 'show-content' ); 
      classie.add( page, 'show' );
    }

    var self = this,
      onEndTransitionFn = function( ev ) {
        if( support.transitions ) {
          if( ev.propertyName.indexOf( 'transform' ) === -1 || ev.target !== this ) return;
          this.removeEventListener( transEndEventName, onEndTransitionFn );
        }
        if( self.isContent ) {
          classie.remove( page, 'show' ); 
        }
        self.isContent = !self.isContent;
        self.isAnimating = false;
        // callback
        self.options.onToggleContentComplete();
      };

    if( support.transitions ) {
      this.el.addEventListener( transEndEventName, onEndTransitionFn );
    }
    else {
      onEndTransitionFn();
    }
  }

  /**
   * initialize the Dragdealer plugin
   */
  DragSlideshow.prototype._initDragDealer = function() {
    var self = this;
    this.dd = new Dragdealer( this.imgDragger, {
      steps: this.slidesCount,
      speed: 0.4,
      loose: true,
      requestAnimationFrame : true,
      callback: function( x, y ) {
        self._navigate( x, y );
      }
    });
  }

  /**
   * DragDealer plugin callback: update current value
   */
  DragSlideshow.prototype._navigate = function( x, y ) {
    // add class "current" to the current slide / remove that same class from the old current slide
    classie.remove( this.slides[ this.current || 0 ], 'current' );
    this.current = this.dd.getStep()[0] - 1;
    classie.add( this.slides[ this.current ], 'current' );
  }

  /**
   * toggle between fullscreen and minimized slideshow
   */
  DragSlideshow.prototype.toggle = function() {
    if( this.isAnimating ) {
      return false;
    }
    this.isAnimating = true;

    // add preserve-3d to the slides (seems to fix a rendering problem in firefox)
    this._preserve3dSlides( true );
    
    // callback
    this.options.onToggle();

    classie.remove( this.el, this.isFullscreen ? 'switch-max' : 'switch-min' );
    classie.add( this.el, this.isFullscreen ? 'switch-min' : 'switch-max' );
    
    var self = this,
      p = this.options.perspective,
      r = this.options.slideshowRatio,
      zAxisVal = this.isFullscreen ? p - ( p / r ) : p - p * r;

    this.imgDragger.style.WebkitTransform = 'perspective(' + this.options.perspective + 'px) translate3d( -50%, -50%, ' + zAxisVal + 'px )';
    this.imgDragger.style.transform = 'perspective(' + this.options.perspective + 'px) translate3d( -50%, -50%, ' + zAxisVal + 'px )';

    var onEndTransitionFn = function( ev ) {
      if( support.transitions ) {
        if( ev.propertyName.indexOf( 'transform' ) === -1 ) return;
        this.removeEventListener( transEndEventName, onEndTransitionFn );
      }

      if( !self.isFullscreen ) {
        // remove preserve-3d to the slides (seems to fix a rendering problem in firefox)
        self._preserve3dSlides();
      }

      // replace class "img-dragger-large" with "img-dragger-small"
      classie.remove( this, self.isFullscreen ? 'img-dragger-large' : 'img-dragger-small' );
      classie.add( this, self.isFullscreen ? 'img-dragger-small' : 'img-dragger-large' );

      // reset transforms and set width & height
      self.imgDragger.style.WebkitTransform = 'translate3d( -50%, -50%, 0px )';
      self.imgDragger.style.transform = 'translate3d( -50%, -50%, 0px )';
      this.style.width = self.isFullscreen ? self.options.slideshowRatio * 100 + '%' : '100%';
      this.style.height = self.isFullscreen ? self.options.slideshowRatio * 100 + '%' : '100%';
      // reinstatiate the dragger with the "reflow" method
      self.dd.reflow();

      // change status
      self.isFullscreen = !self.isFullscreen;
      
      self.isAnimating = false;
    };

    if( support.transitions ) {
      this.imgDragger.addEventListener( transEndEventName, onEndTransitionFn );
    }
    else {
      onEndTransitionFn();
    }
  }

  /**
   * add/remove preserve-3d to the slides (seems to fix a rendering problem in firefox)
   */
  DragSlideshow.prototype._preserve3dSlides = function( add ) {
    this.slides.forEach( function( slide ) {
      slide.style.transformStyle = add ? 'preserve-3d' : '';
    });
  }

  /**
   * add to global namespace
   */
  window.DragSlideshow = DragSlideshow;


            (function() {


          var overlay = document.getElementById( 'overlay' ),
            overlayClose = overlay.querySelector( 'button' ),
            header = document.getElementById( 'gallery' ),
            switchBtnn = header.querySelector( 'button.slider-switch' ),
            toggleBtnn = function() {
              if( slideshow.isFullscreen ) {
                classie.add( switchBtnn, 'view-maxi' );
              }
              else {
                classie.remove( switchBtnn, 'view-maxi' );
              }
            },
            toggleCtrls = function() {
              if( !slideshow.isContent ) {
                classie.add( header, 'hide' );
              }
            },
            toggleCompleteCtrls = function() {
              if( !slideshow.isContent ) {
                classie.remove( header, 'hide' );
              }
            },
            slideshow = new DragSlideshow( document.getElementById( 'slideshow' ), { 
              // toggle between fullscreen and minimized slideshow
              onToggle : toggleBtnn,
              // toggle the main image and the content view
              onToggleContent : toggleCtrls,
              // toggle the main image and the content view (triggered after the animation ends)
              onToggleContentComplete : toggleCompleteCtrls
            }),
            toggleSlideshow = function() {
              slideshow.toggle();
              toggleBtnn();
            },
            closeOverlay = function() {
              classie.add( overlay, 'hide' );
            };
            // toggle between fullscreen and small slideshow
            switchBtnn.addEventListener( 'click', toggleSlideshow );
            // close overlay
            overlayClose.addEventListener( 'click', closeOverlay );



          var overlay = document.getElementById( 'overlay2' ),
            overlayClose = overlay.querySelector( 'button' ),
            header = document.getElementById( 'gallery2' ),
            switchBtnn = header.querySelector( 'button.slider-switch' ),
            toggleBtnn = function() {
              if( slideshow.isFullscreen ) {
                classie.add( switchBtnn, 'view-maxi' );
              }
              else {
                classie.remove( switchBtnn, 'view-maxi' );
              }
            },
            toggleCtrls = function() {
              if( !slideshow.isContent ) {
                classie.add( header, 'hide' );
              }
            },
            toggleCompleteCtrls = function() {
              if( !slideshow.isContent ) {
                classie.remove( header, 'hide' );
              }
            },
            slideshow = new DragSlideshow( document.getElementById( 'slideshow2' ), { 
              // toggle between fullscreen and minimized slideshow
              onToggle : toggleBtnn,
              // toggle the main image and the content view
              onToggleContent : toggleCtrls,
              // toggle the main image and the content view (triggered after the animation ends)
              onToggleContentComplete : toggleCompleteCtrls
            }),
            toggleSlideshow = function() {
              slideshow.toggle();
              toggleBtnn();
            },
            closeOverlay = function() {
              classie.add( overlay, 'hide' );
            };
            // toggle between fullscreen and small slideshow
            switchBtnn.addEventListener( 'click', toggleSlideshow );
            // close overlay
            overlayClose.addEventListener( 'click', closeOverlay );

          }());

} )( window );     

    } 
  };  
  });