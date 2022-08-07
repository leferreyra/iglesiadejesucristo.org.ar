
function trackBookDownload(book) {
  ga('send', 'event', 'Descargas', 'descarga', book);
}

$(document).ready(function() {

    // var $radioWrapper = $(".radio-player-wrapper");

    // ReactDOM.render(
    //     React.createElement(RadioPlayer, {
    //         autoplay: !(typeof $radioWrapper.data("autoplay") === "undefined")
    //     }), $radioWrapper.get(0));


    var $agendaWrapper = $(".agenda-wrapper");

    if ($agendaWrapper.length) {
        ReactDOM.render(
            React.createElement(Agenda, {
                agenda: AGENDA_DATA
            }), $agendaWrapper.get(0));
    }


    // Mobile menu
    $('.mobile-menu-button, .close-mobile-menu').click(function(){
        $(document.body).toggleClass('mobile-menu-open');
    });

    $('.book-download').click(function(event) {
      trackBookDownload($(this).siblings('h2').text());
    });

});
