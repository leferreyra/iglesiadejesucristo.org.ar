
var DAY_NAMES = [
    "DOM",
    "LUN",
    "MAR",
    "MIE",
    "JUE",
    "VIE",
    "SAB"
];

var MONTH_NAMES = [
    "ENERO",
    "FEBRERO",
    "MARZO",
    "ABRIL",
    "MAYO",
    "JUNIO",
    "JULIO",
    "AGOSTO",
    "SETIEMBRE",
    "OCTUBRE",
    "NOVIEMBRE",
    "DICIEMBRE"
];

var Agenda = React.createClass({

    getInitialState: function() {
        return {
            filters: ['tv', 'radio', 'youtube', 'reunion']
        };
    },

    _getDayEvents: function(date) {

        var recurrent = this.props.agenda.recurrentes;
        var once = this.props.agenda.unicos;

        return _.chain(recurrent.concat(once))
            .filter(function(event){

                // para eventos unicos
                if (event.dia) {

                    var _dia = event.dia.split("/");

                    var day = parseInt(_dia[0]);
                    var month = parseInt(_dia[1]) - 1;
                    var year = parseInt(_dia[2]);

                    return date.toDateString() ===
                        (new Date(year, month, day)).toDateString();
                }

                return event.dias.indexOf(DAY_NAMES[date.getDay()]) !== -1;
            })
            .filter(function(event) {
                return _.some(event.tipos, function(tipo){
                    return this.state.filters.indexOf(tipo) !== -1;
                }, this);
            }, this)
            .map(function(event){

                var time = event.hora.inicio.split(":");
                var eventDate = new Date(date.getTime());

                eventDate.setHours(parseInt(time[0]));
                eventDate.setMinutes(parseInt(time[1]));
                eventDate.setSeconds(0);

                return _.extend(event, {
                    date: eventDate
                });
            })
            .sortBy(function(event){
                return event.date;
            })
            .value();
    },

    _getDay: function(date) {

        var dayEvents = this._getDayEvents(date);

        return dayEvents.length ? {
            name: DAY_NAMES[date.getDay()],
            date: date.getDate() + " " + MONTH_NAMES[date.getMonth()],
            isToday: date.toDateString() === (new Date()).toDateString(),
            events: dayEvents
        } : null;
    },

    _getAgenda: function() {

        return _.chain(_.range(0, 14))
            .map(function(d){
                var date = new Date();
                date.setDate(date.getDate() + d);
                return this._getDay(date);
            }, this)
            .filter(function(day) {
                return !_.isNull(day);
            })
            .value();
    },

    _renderEventType: function(type) {

        var typeClasses = classNames('fa', {
            tv: 'fa-tv',
            radio: 'fa-microphone',
            reunion: 'fa-map-marker',
            youtube: 'fa-youtube-play'
        }[type]);

        var typeName = {
            tv: "TV",
            radio: "Radio",
            youtube: "YouTube",
            reunion: "Reunion"
        }[type];

        return (
            <span>
                <i className={typeClasses}></i> {typeName}
            </span>
        );

    },

    _renderEvent: function(event) {

        return (
            <div className="event">
                <div className="time">
                    {event.hora.inicio}/ <br />
                    {event.hora.fin}
                </div>

                <div className="info">
                    <h3>{event.nombre}</h3>
                    <p>
                        {event.descripcion}
                    </p>
                    <ul className="tipos">
                        {event.tipos.map(function(type){
                            return (
                                <li>
                                    {this._renderEventType(type)}
                                </li>
                            );
                        }.bind(this))}
                    </ul>
                </div>
            </div>
        );
    },

    _renderDayRow: function(day) {

        return (
            <div className="day-row clearfix">

                <div className="day">
                    <span className="day-name">
                        {day.name}
                    </span>
                    <span className="day-number">
                        {day.date}
                        {day.isToday ?
                            <span className="hoy">
                                HOY
                            </span> : null}
                    </span>
                </div>

                <div className="events">
                    {day.events.map(function(event){
                        return this._renderEvent(event);
                    }.bind(this))}
                </div>

            </div>
        );

    },

    _onFilterChange: function(filter) {

        var filters = this.state.filters;

        if (filters.indexOf(filter) !== -1) {
            filters = _.without(filters, filter);
        } else {
            filters.push(filter);
        }

        this.setState({
            filters: filters
        });
    },

    render: function() {

        return (

            <div className="agenda">

                <div className="filters">
                    <ul className="container">
                        <li className="filtrar-label">
                            Filtrar eventos
                        </li>
                        {['tv', 'radio', 'reunion'].map(function(type){
                            return (
                                <li>
                                    <label>
                                        <input type="checkbox"
                                            checked={
                                                this.state.filters.indexOf(type) !== -1
                                            }
                                            onClick={this._onFilterChange.bind(this, type)}/>

                                        {this._renderEventType(type)}
                                    </label>
                                </li>
                            );
                        }.bind(this))}
                    </ul>
                </div>

                <div className="days">
                    <div className="container">
                        {this._getAgenda().map(function(day) {
                            return this._renderDayRow(day);
                        }.bind(this))}
                    </div>
                </div>

            </div>

        );
    }

});
