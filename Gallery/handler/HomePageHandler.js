
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
      }
      oTypeLine.textContent = sType;
      oTypeLine.className = "artwork-type";
      oTypeLine.id = "artwork-type-" + aPics[i].id;

      oPriceLine = document.createElement('a');
      if (aPics[i].sold) {
        sPrice = "Verkauft - Prints Verfügbar";
      } else if (aPics[i].price) {
        sPrice = aPics[i].price + "€ zzgl. Versandkosten";
      } else if (aPics[i].type === "D") {
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
  oLogoImage.src = "/logo/logo.jpg";
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

function instagramIconPressed () {
  window.open("https://www.instagram.com/kaihetzler", "_blank");
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
