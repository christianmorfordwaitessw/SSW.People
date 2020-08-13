const IP_DETECT_URL = 'https://api.userinfo.io/userinfos';
console.log('on meta');
fetch(IP_DETECT_URL)
  .then(response => response.json())
  .then(response => {
    
      if (response.country.code === 'AU') {
        /*var meta = document.createElement('meta');
        meta.httpEquiv = 'refresh';
        meta.content = `0; URL=https://peoplecn.ssw.com.au${location.pathname.replace(
          '/people/',
          '/people-cn/'
        )}`;
        document.getElementsByTagName('head')[0].appendChild(meta);*/
        /*window.location = `https://peoplecn.ssw.com.au${location.pathname.replace(
            '/people/',
            '/people-cn/'
          )}`;*/
      }
  });
