
function showTitleScreen() {
  var oDisplay = document.getElementById("canvas");
  var ctx = oDisplay.getContext("2d");
  var sChars = "_YX☣❤☢⚘⚒☮☥K男ヱ甸甹町Ⓐ画甼ヷ甽Ⓐ甾甿☣❤☢⚘ヸKK畀ャ畂畃せポ畄畅Ⓐ畋界畑";
  var aChars = sChars.split("");
  var iFontSize = 16;
  var drops = [];

  //making the canvas full screen
  oDisplay.height = window.innerHeight;
  oDisplay.width = window.innerWidth;

  var columns = oDisplay.width/iFontSize; //number of columns for the rain

  //x below is the x coordinate
  //1 = y co-ordinate of the drop(same for every drop initially)
  for(var x = 0; x < columns; x++)
  	drops[x] = 1;

  //drawing the characters
  fnDraw = function () {
  	//Black BG for the canvas
  	//translucent BG to show trail
  	ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  	ctx.fillRect(0, 0, oDisplay.width, oDisplay.height);

  	ctx.fillStyle = "#EE4B2B";//"#880808";
  	ctx.font = iFontSize + "px arial";
  	//looping over drops
  	for(var i = 0; i < drops.length; i++)
  	{
  		//a random chinese character to print
  		var text = aChars[Math.floor(Math.random()*aChars.length)];
  		//x = i*font_size, y = value of drops[i]*font_size
  		ctx.fillText(text, i*iFontSize, drops[i]*iFontSize);

  		//sending the drop back to the top randomly after it has crossed the screen
  		//adding a randomness to the reset to make the drops scattered on the Y axis
  		if(drops[i]*iFontSize > oDisplay.height && Math.random() > 0.975)
  			drops[i] = 0;

  		//incrementing Y coordinate
  		drops[i]++;
  	}
  }

  fnStartPhase2 = function () {
    clearInterval(donny);
    setTimeout(() => { fnDraw() }, 100);
    setTimeout(() => { fnDraw() }, 150);
    setTimeout(() => { fnDraw() }, 200);
    setTimeout(() => { fnDraw() }, 270);
    setTimeout(() => { fnDraw() }, 300);
    setTimeout(() => { fnDraw() }, 400);
    setTimeout(() => { fnDraw() }, 500);
    setTimeout(() => { fnDraw() }, 700);
    setTimeout(() => { ctx.clearRect(0, 0, oDisplay.width, oDisplay.height); }, 1000);
    setTimeout(() => { dialog.classList.add("invisible"); fnStartPhase3(); }, 1300);

    var dialog = document.getElementById("breachedMSG");
    dialog.classList.remove("invisible");
  }

  fnStartPhase3 = function () {
    oDisplay.classList.add("invisible");
    document.getElementById("Menu").classList.remove("invisible");
    document.getElementById("content").classList.remove("invisible");

    //TODO: print in matrix style: Ⓐrtist, Art, Contact, ???
    var itemArtist = document.getElementById("MenuArtist");
    var itemArt = document.getElementById("MenuArt");
    var itemContact = document.getElementById("MenuContact");
    var itemHome = document.getElementById("HomeIcon")

    menuMatrixText();

    setTimeout(function(){
      showHome();
    },0);
  }

  //fnStartPhase3();
  var donny = setInterval(fnDraw, 20);
  setTimeout(() => { fnStartPhase2() }, 4000);
}

function menuMatrixText () {
  var itemArtist = $("#MenuArtist");
  var itemArt = $("#MenuArt");
  var itemContact = $("#MenuContact");
  var itemHome = $("#HomeIcon");

  itemHome.removeClass("invisible");
  itemArtist.removeClass("invisible");
  itemArt.removeClass("invisible");
  itemContact.removeClass("invisible");

  setGenericMatrixText(itemHome.text(), "HomeIcon");
  setGenericMatrixText(itemArtist.text(), "MenuArtist");
  setGenericMatrixText(itemArt.text(), "MenuArt");
  setGenericMatrixText(itemContact.text(), "MenuContact");
}

function setGenericMatrixText (sFinalText, sItemId) {
  var fnGetMatrixRand = function (sFinal, finalCharIndex) {
    let i = 0, text = "", possible = "甸甹町Ⓐ画甼甽Ⓐ甾甿畂畃せポ畄畅Ⓐ畋界畑";

    for (i = 0; i < sFinal.length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    if (finalCharIndex != 0) {
      text = sFinal.substring(0,finalCharIndex) + text.substring(finalCharIndex, sFinal.length);
    }

    return text;
  }

  let item = $("#" + sItemId), index = 0, secIndex = 0, interval = {};

  interval["interval-" + sItemId] = setInterval(function(){
    if (index >= sFinalText.length) {
      clearInterval(interval["interval-" + sItemId]);
    }
    item.text(fnGetMatrixRand(sFinalText, index));
    if (secIndex >= 4) {
      secIndex = 0;
      index++;
    } else {
      secIndex++;
    }
  }, 50);
}

function showHome () {

  var fnGetSpotlightContentPromise = function () {
    var myPromise = new Promise((resolve, reject) => {
      $.ajax({
        dataType: "html",
        url: "/pages/spotlight.html",
        success: function (data) {
          resolve(data);
        },
        error: function (sError) {
          reject();
        }
      });
    });

    return myPromise;
  };

  var fngetBlogContentPromise = function () {
    var myPromise = new Promise((resolve, reject) => {
      $.ajax({
        dataType: "html",
        url: "/pages/blog.html",
        success: function (data) {
          resolve(data);
        },
        error: function (sError) {
          reject();
        }
      });
    });

    return myPromise;
  };

  var fnBuild = function () {
    var sHome, sSpotlight, sBlog;

    sSpotlight = "<div style='height: 100%; width: 50%;'> <h1 id='HomeSpotlightHeader' class='HomeHeader'>Spotlight</h1> <div class='HomeSpotlightContainer'>" + _sSpotlightContent + "</div> </div>";
    sBlog = "<div style='height: 100%; width: 50%;'> <h1 id='HomeBlogHeader' class='HomeHeader'>Blog</h1> <div class='HomeBlogContainer'>" + _sBlogContent + "</div> </div>";

    sHome = "<div class='HomeSection'> " + sSpotlight + sBlog + " </div>";

    $(".content").empty();
    $(".content").append(sHome);

    setGenericMatrixText($("#HomeSpotlightHeader").text(), "HomeSpotlightHeader");
    setGenericMatrixText($("#HomeBlogHeader").text(), "HomeBlogHeader");
  };

  if (window._sSpotlightContent == null) {
    fnGetSpotlightContentPromise().then( (spotlightHtml) => {
      _sSpotlightContent = spotlightHtml;
      if (_sBlogContent != null) {
        fnBuild();
      }
    });
  }

  if (window._sBlogContent == null) {
    fngetBlogContentPromise().then( (blogHtml) => {
      _sBlogContent = blogHtml;
      if (_sSpotlightContent != null) {
        fnBuild();
      }
    });
  }

  if (_sSpotlightContent != null && _sBlogContent != null) { fnBuild(); }
}

function showArt () {
    var fnGetArtContentPromise = function () {
      var myPromise = new Promise((resolve, reject) => {
        $.ajax({
          dataType: "html",
          url: "/src/pics.json",
          success: function (data) {
            resolve(data);
          },
          error: function (sError) {
            reject();
          }
        });
      });

      return myPromise;
    };

    var fnBuild = function () {
      $(".content").empty();
      $(".content").append(_sArtHtml);
    };

    var fnGetSeriesItem = function (series) {
      if (series.publish) {
        var seriesHTML = "<div class='seriesItemContent' onClick='onClickSeries(" + series.id + ")'>";
        seriesHTML = seriesHTML + "<div class='seriesItemHeader'>" + series.name + "</div>";
        seriesHTML = seriesHTML + "<img src='" + series.previewImg + "' alt='Image not found' class='img seriesImg'></img>";

        return seriesHTML + "</div>";
      } else {
        return "";
      }
    }

    var seriesHTML = "";

    if (window._sArtHtml == null) {
      fnGetArtContentPromise().then( (data) => {
        aSeries = JSON.parse(data).series;
        for (var i = 0; i < aSeries.length; i++) {
          seriesHTML = seriesHTML + fnGetSeriesItem(aSeries[i]);
        }
        _sArtHtml = "<div class='seriesContainer'>" + seriesHTML + "</div>";
        fnBuild();
      });
    } else {
      fnBuild();
    }
}

function onClickSeries (sId) {
  alert(sId);
}

function showArtist () {
    var fnGetArtistContentPromise = function () {
      var myPromise = new Promise((resolve, reject) => {
        $.ajax({
          dataType: "html",
          url: "/pages/artist.html",
          success: function (data) {
            resolve(data);
          },
          error: function (sError) {
            reject();
          }
        });
      });

      return myPromise;
    };

    var fnBuild = function () {
      $(".content").empty();
      $(".content").append(_sArtistHtml);
    };

    if (window._sArtistHtml == null) {
      fnGetArtistContentPromise().then( (artistHtml) => {
        _sArtistHtml = artistHtml;
        fnBuild();
      });
    } else {
      fnBuild();
    }
}

function showContact () {
    var fnGetContactContentPromise = function () {
      var myPromise = new Promise((resolve, reject) => {
        $.ajax({
          dataType: "html",
          url: "/pages/contact.html",
          success: function (data) {
            resolve(data);
          },
          error: function (sError) {
            reject();
          }
        });
      });

      return myPromise;
    };

    var fnBuild = function () {
      $(".content").empty();
      $(".content").append(_sContactHtml);
    };

    if (window._sContactHtml == null) {
      fnGetContactContentPromise().then( (contactHtml) => {
        _sContactHtml = contactHtml;
        fnBuild();
      });
    } else {
      fnBuild();
    }
}

function instagramIconPressed () {
  window.open("https://www.instagram.com/kaihetzler", "_blank");
}


/** old stuff **/



function imgSizeFit(img, maxWidth, maxHeight, naturalWidth, naturalHeight){
  var ratio = Math.min(1, maxWidth / naturalWidth, maxHeight / naturalHeight);
  img.style.width = naturalWidth * ratio + 'px';
  img.style.height = naturalHeight * ratio + 'px';
}

function getImageSize(img, callback) {
    var wait = setInterval(function() {
        var w = img.naturalWidth,
            h = img.naturalHeight;
        if (w && h) {
            clearInterval(wait);
            callback.apply(this, [w, h]);
        }
    }, 30);
}

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    array.sort(function(a, b){
      if (a.favour && b.favour) {
        return 0;
      } else if (a.favour) {
        return -1;
      } else {
        return 1;
      }
    });
}

function buildContentWithData (aPics, bOnlyFavour) {
  var
  oImage,
  oNameLine,
  sName,
  oTypeLine,
  sType,
  oPriceLine,
  sPrice,
  i = 0,
  iMaxWidth = window.innerWidth * 0.8,
  iMaxHeight = window.innerHeight * 0.8,
  oDisplay = $(".display"),
  oContent = $(".pictureScroll");

  oContent.empty();

  for (i; i < aPics.length; i++) {

    if (aPics[i].publish && (aPics[i].favour == true || aPics[i].favour == bOnlyFavour) ) {

      oImage = new Image();
      oImage.src = "/pics/" + aPics[i].path;
      oImage.id = "idImage" + i;
      oImage.className = "artwork";
      oImage.sId = aPics[i].id;

      oNameLine = document.createElement('div');
      if (aPics[i].name) {
        sName = aPics[i].name;
      } else {
        sName = "Untitled: Nr. " + aPics[i].id;
      }
      oNameLine.textContent = sName;
      oNameLine.className = "artwork-name";
      oNameLine.id = "artwork-name-" + aPics[i].id;

      oTypeLine = document.createElement('div');
      if (aPics[i].type === "AL") {
        sType = "Acryl auf Leinwand - " + aPics[i].size;
      } else if (aPics[i].type === "AOL") {
        sType = "Acryl und Ölfarbe auf Leinwand - " + aPics[i].size;
      } else if (aPics[i].type === "D") {
        sType = "Digital";
      } else if (aPics[i].type === "A3") {
        sType = "Acryl auf Papier - A3";
      } else if (aPics[i].type === "AO3") {
        sType = "Acryl und Ölfarben auf Papier - A3";
      } else if (aPics[i].type === "A") {
        sType = "Acryl - " + aPics[i].size;
      } else if (aPics[i].type === "MM") {
        sType = "Mixed-Media - Leinwand - " + aPics[i].size;
      }

      oTypeLine.textContent = sType;
      oTypeLine.className = "artwork-type";
      oTypeLine.id = "artwork-type-" + aPics[i].id;

      oPriceLine = document.createElement('a');
      if (aPics[i].sold) {
        sPrice = "Orginal Vergriffen - Prints Verfügbar";
      }
      //else if (aPics[i].price) {
      //  sPrice = aPics[i].price + "€ zzgl. Versandkosten";
      //}
      else if (aPics[i].type === "D") {
        sPrice = "Prints Verfügbar";
      } else {
        sPrice = "Preis auf Anfrage"
      }
      oPriceLine.textContent = sPrice;
      oPriceLine.className = "artwork-price";
      oPriceLine.id = "artwork-price-" + aPics[i].id;
      oPriceLine.href = "mailto:contact@kai-hetzler.art?subject=Anfrage '" + sName + "' &body=Hallo Kai, %0A%0A ich hätte Interesse an [einem Druck | dem Orginal] von '" + sName + "'. %0A%0A Viele Grüße %0A [Dein Name]";

      oContent.append(oImage);
      oContent.append(oNameLine);
      oContent.append(oTypeLine);
      oContent.append(oPriceLine);
    }
  }


  $(".artwork").each(function () {
    let oImg = $(this);

    getImageSize(oImg[0], function(width, height) {
      imgSizeFit(oImg[0], iMaxWidth, iMaxHeight, width, height);

      setTimeout(function () {
        if (oImg[0].complete) {
            oImg[0].classList.add("artwork-loaded");
            $("#artwork-price-" + oImg[0].sId)[0].classList.add("loaded");
            $("#artwork-type-" + oImg[0].sId)[0].classList.add("loaded");
            $("#artwork-name-" + oImg[0].sId)[0].classList.add("loaded");
        } else {
          oImg.on("load", function () {
            oImg[0].classList.add("artwork-loaded");
            $("#artwork-price-" + oImg[0].sId)[0].classList.add("loaded");
            $("#artwork-type-" + oImg[0].sId)[0].classList.add("loaded");
            $("#artwork-name-" + oImg[0].sId)[0].classList.add("loaded");
          });
        }
      }, 500);
    });
  });

}

function buildLogoSection (aSeries) {
  var oLogoImage = new Image(100, 100);
  oLogoImage.src = "/logo/logo.png";
  oLogoImage.id = "idLogoImage"
  oLogoImage.className = "logoImage";
  $(".logoContent").prepend(oLogoImage);

  $("#idLogoImage").on("load", function () {
    //this.classList.add("logoImage-loaded");
    $(".logoContent")[0].classList.add("logoContent-loaded");
    $(".socialMediaItems")[0].classList.add("socialMediaItems-loaded");
  });

  $("#idLogoImage").click(function () {
    if (!!window._bShowIsRunning) {
      endTheShow();
    } else {
      startTheShow();
    }
  });
}

function onSeriesChange (sSeriesId) {
  var aPicsFiltered;

  aPicsFiltered = _aPics.filter(function(oItem) {
    if (sSeriesId === "0" || sSeriesId === "99") { return true; }
    return oItem.series && oItem.series.indexOf(sSeriesId) >= 0;
  });

  _aPicsFiltered = aPicsFiltered;

  buildContentWithData(aPicsFiltered);
}

function buildSocialMediaIcons () {
  var oInstagramIcon;

  oInstagramIcon = '<a onclick="instagramIconPressed()" class="fa fa-instagram"></a>';
  $(".socialMediaItems").append(oInstagramIcon);
}

function buildCoverSection () {
  var oCover;

  oCover = new Image();
  oCover.src = "/pics/" + aPics[i].path;

  oCover.src = "/logo/cover.gif";
  oCover.id = "idCover"
  oCover.className = "cover";
  $(".cover").append(oCover);
}

function showMoreArt () {
  if (window._bShowIsRunning) {
    window.open("/Art","_self");
  } else {
    _onlyFavour = false;
    $(".moreArtLink").hide();
    buildContentWithData(_aPics, _onlyFavour);
  }
}