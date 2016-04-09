$(document).ready(function() {


    var $radioWrapper = $(".radio-player-wrapper");

    ReactDOM.render(
        React.createElement(RadioPlayer, {
            autoplay: !(typeof $radioWrapper.data("autoplay") === "undefined")
        }), $radioWrapper.get(0));


    var $agendaWrapper = $(".agenda-wrapper");

    if ($agendaWrapper.length) {
        ReactDOM.render(
            React.createElement(Agenda, {
                agenda: AGENDA_DATA
            }), $agendaWrapper.get(0));
    }

});
