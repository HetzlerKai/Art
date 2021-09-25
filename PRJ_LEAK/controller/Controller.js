
function showTitleScreen() {
  var oDisplay = document.getElementById("canvas");
  var ctx = oDisplay.getContext("2d");
  var sChars = window._sMatrixChars;
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

    var itemArtist = document.getElementById("MenuArtist");
    var itemArt = document.getElementById("MenuArt");
    var itemContact = document.getElementById("MenuContact");
    var itemHome = document.getElementById("HomeIcon")

    //menuMatrixText();

    // particlesJS.load('particles-js', 'src/particlesjs-config.json', function() {
    //   console.log('callback - particles.js config loaded');
    // });

    //showArt();3

    setTimeout(function(){
      //showHome();3
      $(".seriesContainer").addClass("loaded");
    },1000);
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

  //setGenericMatrixText(itemHome.text(), "HomeIcon");
  //setGenericMatrixText(itemArtist.text(), "MenuArtist");
  //setGenericMatrixText(itemArt.text(), "MenuArt");
  //setGenericMatrixText(itemContact.text(), "MenuContact");
}

function setGenericMatrixText (sFinalText, sItemId) {
  var fnGetMatrixRand = function (sFinal, finalCharIndex) {
    let i = 0, text = "", possible = window._sMatrixChars;

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
  }, 40);
}

function showHome () {

  // var fnGetSpotlightContentPromise = function () {
  //   var myPromise = new Promise((resolve, reject) => {
  //     $.ajax({
  //       dataType: "html",
  //       url: "/pages/spotlight.html",
  //       success: function (data) {
  //         resolve(data);
  //       },
  //       error: function (sError) {
  //         reject();
  //       }
  //     });
  //   });
  //
  //   return myPromise;
  // };

  var fngetHomeContentPromise = function () {
    var myPromise = new Promise((resolve, reject) => {
      $.ajax({
        dataType: "html",
        url: "/pages/homeIntro.html",
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
    var sHome; //, sSpotlight, sBlog;

    //sSpotlight = "<div style='height: 100%; width: 50%;'> <h1 id='HomeSpotlightHeader' class='HomeHeader'>Spotlight</h1> <div class='HomeSpotlightContainer'>" + _sSpotlightContent + "</div> </div>";

    sHome = "<div class='HomeSection'> " + _sHomeContent + " </div>";

    $(".content").empty();
    $(".content").append(sHome);

    //setGenericMatrixText($("#HomeSpotlightHeader").text(), "HomeSpotlightHeader");
    //setGenericMatrixText($("#HomeBlogHeader").text(), "HomeBlogHeader");
  };

  // if (window._sSpotlightContent == null) {
  //   fnGetSpotlightContentPromise().then( (spotlightHtml) => {
  //     _sSpotlightContent = spotlightHtml;
  //     if (_sBlogContent != null) {
  //       fnBuild();
  //     }
  //   });
  // }

  getArtContentPromise().then( (data) => {
    _aSeries = JSON.parse(data).series;
    _aPics = JSON.parse(data).pics;
  });

  if (window._sHomeContent == null) {
    fngetHomeContentPromise().then( (Html) => {
      _sHomeContent = Html;
        fnBuild();
    });
  } else {
    fnBuild();
  }
}

function getArtContentPromise () {
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

function showArt () {
    var fnBuild = function () {
      $(".content").empty();
      $(".content").append(_sArtHtml);
      $(".seriesContainer").addClass("loaded");
      //setGenericMatrixText($("#ArtSeriesHeader").text(), "ArtSeriesHeader");
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
      getArtContentPromise().then( (data) => {
        _aSeries = JSON.parse(data).series;
        _aPics = JSON.parse(data).pics;
        /*for (var i = 0; i < _aSeries.length; i++) {
          seriesHTML = seriesHTML + fnGetSeriesItem(_aSeries[i]);
        }*/
        i = _aSeries.length;
        while (i > 0) {
          i--;
          seriesHTML = seriesHTML + fnGetSeriesItem(_aSeries[i]);
        }
        _sArtHtml = "<div id='ArtSeriesHeader' class='ArtSeriesHeader'>Projekte</div><div class='seriesContainer'>" + seriesHTML + "</div>";
        fnBuild();
      });
    } else {
      fnBuild();
    }
}

function onClickArtwork (id) {
  $('#artDialog').modal();
}

function onClickSeries (id) {
  var fnGetImgHTMLContent = function (seriesId) {
    var sIMGHTML = "";
    var sImageName, sImageNameHTML, sImage, artworkId;

    for (var i = 0; i < _aPics.length; i++) {
      if (_aPics[i].series == seriesId && _aPics[i].publish == true) {

        if (_aPics[i].name) {
          sImageName = _aPics[i].name;
        } else {
          sImageName = "Untitled: Nr. " + _aPics[i].id;
        }

        sImageNameHTML = "<div class='AtworkName' onClick='onClickArtwork(" + _aPics[i].id + ")' data-toggle='modal' data-target='#artDialog' data-artWorkId='" + i + "'>" + sImageName + "</div>";
        sImage = "<img src='pics/" + seriesId + "/" + _aPics[i].path + "' alt='Image not found' class='img artworkImg' data-toggle='modal' data-target='#artDialog' data-artWorkId='" + i + "'></img>";
        sIMGHTML = sIMGHTML + "<div class='ImgItemContainer'>" + sImageNameHTML + sImage + "</div>";
      }
    }

    window.setTimeout(function(){
      window.scrollTo(0, 0);
    },0);

    return sIMGHTML;
  };

  var seriesHTML;
  var name = _aSeries[id].name;
  var desc = _aSeries[id].description;
  var sImgHTML = fnGetImgHTMLContent(id);

  seriesHTML = "<div class='seriesDetailContainer'>";
  seriesHTML = seriesHTML + "<div class='seriesDetailHeaderContent'><button type='button' class='btn btn-default btnBack' onclick='showArt();'>ᗒ</button>";
  seriesHTML = seriesHTML + "<div class='seriesDetailHeader'>" + name + "</div></div>";
  seriesHTML = seriesHTML + "<div class='seriesDetailDescription'>" + desc + "</div>";
  seriesHTML = seriesHTML + "<div class='seriesDetailImgContainer'>" + sImgHTML + "</div></div>";

  $(".content").empty();
  $(".content").append(seriesHTML);
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
      //setGenericMatrixText($("#artistHeader").text(), "artistHeader");
      //setGenericMatrixText($("#artistContactHeader").text(), "artistContactHeader");
      //setGenericMatrixText($("#artistImpressumHeader").text(), "artistImpressumHeader");
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

function getDialogContent (id) {

  var fnGetCarouselIndicators = function (parts) {
    var sIndicators = "";

    for (var i = 0; i < parts.length; i++) {
      if (i == 0) {
        sIndicators = sIndicators + "<li data-target='#artDialogCarousel' data-slide-to='" + i + "' class='active'>";
      } else {
        sIndicators = sIndicators + "<li data-target='#artDialogCarousel' data-slide-to='" + i + "'>";
      }
    }

    return sIndicators;
  };

  var fnGetCarouselItems = function (parts, seriesId) {
    var sItems = "";

    for (var i = 0; i < parts.length; i++) {
      if (i == 0) {
        sItems = sItems + "<div class='item active'><img src='pics/" + seriesId + "/" + parts[i] + "' alt='Image not found'></div>" //style='height: 600px'
      } else {
        sItems = sItems + "<div class='item'><img src='pics/" + seriesId + "/" + parts[i] + "' alt='Image not found'></div>" //style='height: 600px'
      }
    }

    return sItems;
  };

  var fnGetArtWorkDetails = function (dataItem) {
    var sDetails, line1, line2, line3, line4, sName;

    if (dataItem.name) {
      sName = dataItem.name;
    } else {
      sName = "Untitled: Nr. " + dataItem.id;
    }

    line1 = "Name: " + sName;

    if (dataItem.type === "AL") {
      line2 = "Acryl auf Leinwand - " + dataItem.size;
    } else if (dataItem.type === "AOL") {
      line2 = "Acryl und Ölfarbe auf Leinwand - " + dataItem.size;
    } else if (dataItem.type === "D") {
      line2 = "Digital";
    } else if (dataItem.type === "A3") {
      line2 = "Acryl auf Papier - A3";
    } else if (dataItem.type === "AO3") {
      line2 = "Acryl und Ölfarben auf Malkarton - A3";
    } else if (dataItem.type === "A") {
      line2 = "Acryl - " + dataItem.size;
    } else if (dataItem.type === "MM") {
      line2 = "Mixed-Media - Leinwand - " + dataItem.size;
    } else if (dataItem.type === "SFL") {
      line2 = "Sprühfarbe auf Leinwand - " + dataItem.size;
    } else if (dataItem.type === "ASL") {
      line2 = "Acryl und Sprühfarbe auf Leinwand - " + dataItem.size;
    } else if (dataItem.type === "MMR") {
      line2 = "Mixed Media mit echtem Rost auf Leinwand - " + dataItem.size;
    } else if (dataItem.type === "ARL") {
      line2 = "Acryl auf Leinwand mit echtem Rost - " + dataItem.size;
    }

    if (dataItem.sold) {
      line3 = "Orginal vergriffen";
    } else {
      line3 = "Orginal verfügbar";
    }

    var sKaufButton = '<a class="btn btn-primary buyButton" href="mailto:contact@kai-hetzler.art?subject=Anfrage ' + sName + '&body=Hallo Kai, %0A%0A ich hätte Interesse an [einem Druck | dem Orginal] von ' + sName + '. %0A%0A Viele Grüße %0A [Dein Name]">Kaufanfrage</a>';
    var sCloseButton = '<button class="btn btn-secondary" onclick="closeArtDialog();" style="margin-top: 1rem;">Schließen</button>';

    return sDetails = "<div class='artDialogText'> <div> <p>" + line1 + "</p><p>" + line2 + "</p><p>" + line3 + "</p></div><div class='artDialogButtonContainer'>" + sKaufButton + sCloseButton + "</div></div>";
  };

  var aParts = _aPics[id].altPaths.split(",");
  aParts.push(_aPics[id].path);

  var sButtons = "<a class='left carousel-control' href='#artDialogCarousel' data-slide='prev'><span class='glyphicon glyphicon-chevron-left'></span><span class='sr-only'>Previous</span></a>";
  sButtons = sButtons + "<a class='right carousel-control' href='#artDialogCarousel' data-slide='next'><span class='glyphicon glyphicon-chevron-right'></span><span class='sr-only'>Next</span></a>";

  var sArtCarousel = "<div id='artDialogCarousel' class='carousel' data-ride='carousel'><ol class='carousel-indicators'>" + fnGetCarouselIndicators(aParts) + "</ol> <div class='carousel-inner'>" + fnGetCarouselItems(aParts, _aPics[id].series) + "</div>" + sButtons + "</div>";

   return "<div>" + fnGetArtWorkDetails(_aPics[id]) + sArtCarousel + "</div>";
}

function closeArtDialog () {
  $('#artDialog').modal('hide')
}

function triggerKaufanfrage (id) {
  alert("Kaufanfrage für Artwork: " + id);
}
