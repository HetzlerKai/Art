// HOME -------------------------------------------------------------
function showHome (bSupressHistoryChange) {

  if (!bSupressHistoryChange) {
    history.pushState(null, null, '?home');
  }

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
    var sHome;

    sHome = "<div class='HomeSection'> " + _sHomeContent + " </div>";

    $(".content").empty();
    $(".content").append(sHome);
  };

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

// ART -------------------------------------------------------------
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

function showArt (bSupressHistoryChange) {
    var navToSeriesId = null;

    if (window.location.search && window.location.search.startsWith("?art/")) {
       navToSeriesId = window.location.search.split("?art/")[1];
    }

    if (!bSupressHistoryChange) {
      history.pushState(null, null, '?art');
    }

    var fnBuild = function () {
      $(".content").empty();
      $(".content").append(_sArtHtml);
      $(".seriesContainer").addClass("loaded");
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

        i = _aSeries.length;
        while (i > 0) {
          i--;
          seriesHTML = seriesHTML + fnGetSeriesItem(_aSeries[i]);
        }
        _sArtHtml = "<div id='ArtSeriesHeader' class='ArtSeriesHeader'>Projekte</div><div class='seriesContainer'>" + seriesHTML + "</div>";
        fnBuild();
        window.setTimeout(function () {
          if (navToSeriesId) {
            onClickSeries(navToSeriesId);
          }
        }, 0);
      });
    } else {
      fnBuild();
      window.setTimeout(function () {
        if (navToSeriesId) {
          onClickSeries(navToSeriesId);
        }
      }, 0);
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
  seriesHTML = seriesHTML + "<div class='seriesDetailHeaderContent'><button type='button' class='btn btn-default btnBack' onclick='history.back();'>ᗒ</button>";
  seriesHTML = seriesHTML + "<div class='seriesDetailHeader'>" + name + "</div></div>";
  seriesHTML = seriesHTML + "<div class='seriesDetailDescription'>" + desc + "</div>";
  seriesHTML = seriesHTML + "<div class='seriesDetailImgContainer'>" + sImgHTML + "</div></div>";

  history.pushState(null, null, '?art/' + id);

  $(".content").empty();
  $(".content").append(seriesHTML);
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


// ARTIST -------------------------------------------------------------
function showArtist (bSupressHistoryChange) {

    if (!bSupressHistoryChange) {
      history.pushState(null, null, '?artist');
    }

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
