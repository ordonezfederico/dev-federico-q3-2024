document.addEventListener('DOMContentLoaded', function() {
  function getQueryParams(url) {
    let params = {};
    new URL(url).searchParams.forEach((value, key) => {
      params[key.toLowerCase()] = value.toLowerCase();
    });
    return params;
  }

  function getCookie(name) {
    let value = `; ${document.cookie}`;
    let parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  let urlParams = getQueryParams(window.location.href);
  let discountCookie = getCookie('discount_code') ? getCookie('discount_code').toLowerCase() : null;
  let banners = document.querySelectorAll('.promo-banner');
  let mostRecentBanner = null;
  let mostRecentTime = 0;

  banners.forEach(function(banner) {
    let utmMedium = banner.getAttribute('data-utm-medium').toLowerCase();
    let discountCode = banner.getAttribute('data-discount-code').toLowerCase();
    let bannerId = discountCode;

    if (localStorage.getItem(`dismissed-banner-${bannerId}`)) {
      banner.remove();
      return;
    }

    let currentTime = Date.now();
    let activatedTime = parseInt(localStorage.getItem(`activated-banner-${bannerId}`)) || 0;

    // Check if the banner should be activated now
    if ((urlParams['utm_medium'] && urlParams['utm_medium'] === utmMedium) || (discountCookie && discountCookie === discountCode)) {
      if (!localStorage.getItem(`activated-banner-${bannerId}`)) {
        activatedTime = currentTime;
        localStorage.setItem(`activated-banner-${bannerId}`, activatedTime);
      }
    }

    // Determine the most recent banner
    if (activatedTime > mostRecentTime) {
      if (mostRecentBanner) mostRecentBanner.style.display = 'none';
      mostRecentBanner = banner;
      mostRecentTime = activatedTime;
    } else {
      banner.remove();
    }
  });

  if (mostRecentBanner) {
    mostRecentBanner.style.display = 'block';
    mostRecentBanner.querySelector('.promo-banner__close').addEventListener('click', function() {
      mostRecentBanner.style.display = 'none';
      let bannerId = mostRecentBanner.getAttribute('data-discount-code').toLowerCase();
      localStorage.setItem(`dismissed-banner-${bannerId}`, true);
    });
  }
});
