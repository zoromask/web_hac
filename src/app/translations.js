/**
 * INSPINIA - Responsive Admin Theme
 *
 */
function config($translateProvider) {
    var lang = 'vi_VN',
        arrCookies = document.cookie.split(";");
    for(var i=0;i<arrCookies.length;i++){
        if(arrCookies[i].indexOf('lang') != -1){
            if(arrCookies[i].indexOf('en_US') != -1){
                lang = 'en_US';
            }
        }
    }
    $translateProvider.useStaticFilesLoader({
        prefix: '../translation/lang-',
        suffix: '.json'
    })
    .registerAvailableLanguageKeys(['en_US','vi_VN'], {
        'en_*': 'en',
        'vi_*': 'vn'
    })
    .preferredLanguage(lang);
}

angular
    .module('inspinia')
    .config(config)
