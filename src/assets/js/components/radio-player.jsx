
var STREAM_SERVER = "http://209.133.213.92:8004/;stream/1";

var RadioPlayer = React.createClass({

    displayName: "RadioPlayer",

    getInitialState: function() {
        return {
            initialized: false,
            playing: false,
            muted: false,
            volume: 80,
            error: false
        };
    },

    componentDidMount: function() {

        if (this.props.autoplay) {
            this._initializePlayer();
        }
    },

    componentDidUpdate: function(prevProps, prevState) {

        if (prevState.playing !== this.state.playing) {
            if (this.state.playing) {

                this.el.jPlayer("setMedia", {
                    mp3: STREAM_SERVER
                }).jPlayer("play");

                this._track('play');

            } else {
                this.el.jPlayer("clearMedia");
                this._track('stop');
            }
        }

        this.el.jPlayer("volume", this.state.volume / 100);
        this.el.jPlayer(this.state.muted ? "mute" : "unmute");
    },

    _initializePlayer: function() {

        this.el = $("<div>");
        $("body").append(this.el);

        this.el.jPlayer({

            ready: function() {

                this.setState({
                    initialized: true,
                    playing: true
                });

            }.bind(this),

            error: function(error) {
                if (!this.state.error) {
                    this.setState({
                        error: true
                    });
                    ga('send', 'exception', {
                        exDescription: 'Radio failed: ' + error.jPlayer.error.message
                    });
                }
            }.bind(this)

        });

        $(document.body).addClass('radio-initialized');
    },

    _renderUninitialized: function() {

        return (
            <button className="radio-player-init" onClick={this._initializePlayer}>
                <span>Escuchar la radio en vivo</span>
            </button>
        );

    },

    _renderPlayer: function() {

        var playButtonClasses = classNames('fa', {
            'fa-play': !this.state.playing,
            'fa-stop': this.state.playing
        });

        var volume = this.state.volume;
        var muted = this.state.muted;

        var muteButtonClasses = classNames("fa", {
            'fa-volume-up': volume > 50 && !muted,
            'fa-volume-down': volume > 0 && volume <= 50 && !muted,
            'fa-volume-off': volume === 0 || this.state.muted
        });

        if (this.state.error) {
            return (
                <div className="radio-player error">
                    <i className="fa fa-exclamation-triangle"></i>
                    <span>La radio esta teniendo problemas, por favor intente mas tarde.</span>
                </div>
            );
        }
        
        return (
            <div className="radio-player">

                <button onClick={this._togglePlay}>
                    <i className={playButtonClasses}></i>
                </button>

                <button onClick={this._toggleMute}>
                    <i className={muteButtonClasses}></i>
                </button>

                <ReactSlider
                    defaultValue={this.state.volume}
                    onChange={this._onVolumeChange}/>

                {
                    this.props.autoplay ? null :
                    <button onClick={this._openPopup}>
                        <i className="fa fa-external-link"></i>
                    </button>
                }
            </div>
        );

    },

    _togglePlay: function() {
        this.setState({
            playing: !this.state.playing
        });
    },

    _toggleMute: function() {
        this.setState({
            muted: !this.state.muted
        });
    },

    _onVolumeChange: function(vol) {
        this.setState({
            volume: vol
        });
    },

    _openPopup: function() {

        window.open("/radio-popup.html",
            "Radio Cristiana 89.7 FM",
            "menubar=no,location=no,resizable=no,scrollbars=no,status=no,height=50,width=250");

        this.setState({
            playing: false
        });
    },

    _track(eventAction, eventLabel) {
        ga('send', 'event', 'Radio', eventAction, eventLabel);
    },

    render: function() {

        return this.state.initialized ?
                this._renderPlayer() :
                this._renderUninitialized();
    }
});

