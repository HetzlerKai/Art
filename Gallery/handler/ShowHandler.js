
function startTheShow () {
  _cleanUp();
  _setDarkMode();

  window._bShowIsRunning = true;
  $(".logoContent")[0].classList.add("logoContent-showMode");
  $(".socialMediaItems")[0].classList.add("socialMediaItems-showMode");

  $(".moreArtSection").prepend('<center> <iframe src="https://open.spotify.com/embed/playlist/55EXzBY7LydY0BE3moDR0E" width="300" height="80" frameborder="0" class="spotifyIframe" allowtransparency="true" allow="encrypted-media"></iframe> </center>');

  _showLoadingIcon();
  _loadImages();
}

function endTheShow () {
  window.open("/Art","_self");
}

// Internal Functions

function _cleanUp () {
  var
  oContent = $(".pictureScroll");

  oContent.empty();
}

function _setDarkMode () {
  $("body")[0].classList.add("darkmode");
}

function _loadSuccessCallback () {
  var
  fnNextImage,
  oInterval,
  iCount = 0,
  iMaxWidth = window.innerWidth * 0.8,
  iMaxHeight = window.innerHeight * 0.8,
  oContent = $(".pictureScroll");

  fnNextImage = function () {
    _cleanUp();

    oContent.append(_aShowImgs[iCount]);
    imgSizeFit(_aShowImgs[iCount], iMaxWidth, iMaxHeight, _aShowImgs[iCount].naturalWidth, _aShowImgs[iCount].naturalHeight);

    if (iCount + 1 === _aShowImgs.length) {
      //clearInterval(oInterval);
      iCount = -1;
    }
    iCount++;
  };

  _hideLoadingIcon();

  fnNextImage();
  oInterval = setInterval(fnNextImage, 7000);
}

function _loadErrorCallback () {
  alert("An unexpected Error occurred");
  setTimeout(function () {
    endTheShow();
  }, 500);
}

function _loadImages() {
  var oPromise;

  $.ajax({
    dataType: "json",
    url: "getDataFile",
    success: function (oData) {
      var aPics = [];

      for (var i = 0; i < oData.pics.length; i++) {
        if (oData.pics[i].publish && oData.pics[i].favour) {
          aPics.push("/pics/" + oData.pics[i].path);
        }
      }

      shuffleArray(aPics);

      oPromise = new Promise((resolve, reject) => {

          var
          iTarget = aPics.length,
          iActual = 0,
          oInterval;

          for (var i = 0; i < aPics.length; i++) {
            _aShowImgs[i] = new Image();
            _aShowImgs[i].src = aPics[i];
            _aShowImgs[i].className = "showArtwork";
            _aShowImgs[i].onload  = function () {
              iActual++;
            };
          }

          oInterval = setInterval(function () {
            if (iTarget === iActual && iActual !== 0) {
              clearInterval(oInterval);
              resolve();
            }
          }, 2000);
      });

      oPromise.then(_loadSuccessCallback, _loadErrorCallback);
    },
    error: function (sError) {
      console.log(sError);
    }
  });
}

function _showLoadingIcon () {
  var
  oLoadingLogo,
  oContent = $(".pictureScroll");

  oLoadingLogo = new Image(500, 500);
  oLoadingLogo.src = "/logo/logo.png";
  oLoadingLogo.id = "idLoadingLogo"
  oLoadingLogo.className = "loadingLogo";

  oContent.append(oLoadingLogo);
}

function _hideLoadingIcon () {
  _cleanUp();
}
