$(document).ready(function() {

    var $radioWrapper = $(".radio-player-wrapper");

    ReactDOM.render(
        React.createElement(RadioPlayer, {

            autoplay: !(typeof $radioWrapper.data("autoplay") === "undefined")

        }), $radioWrapper.get(0));
});
