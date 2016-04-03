
var STREAM_SERVER = "http://209.133.213.93:2035/;stream/1";

var RadioPlayer = React.createClass({

    displayName: "RadioPlayer",

    getInitialState: function() {
        return {
            initialized: false,
            playing: false,
            muted: false,
            volume: 80
        };
    },

    componentDidMount: function() {

        if (this.props.autoplay) {
            this._initializePlayer();
        }
    },

    componentDidUpdate: function() {

        if (this.state.playing) {

            this.el.jPlayer("setMedia", {
                mp3: STREAM_SERVER
            }).jPlayer("play");

        } else {

            this.el.jPlayer("clearMedia");
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

            }.bind(this)
        });

    },

    _renderUninitialized: function() {

        return (
            <button className="radio-player-init" onClick={this._initializePlayer}>
                Escuchar la radio en vivo
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

    render: function() {

        return this.state.initialized ?
                this._renderPlayer() :
                this._renderUninitialized();
    }
});

