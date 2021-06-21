import React from 'react';
import './SearchBoard.css';
import logo from './img/search.png';
import {connect} from 'react-redux';
import { addData } from '../../redux/store';

class FLightsBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allFlights: [],
            flightsToRender: [],
            direction: 'arrival',
            error: '',
            search: null,
            active: true
        }
    }


    async componentWillMount() {
        const response = await this.getData();
        this.props.add(response);
    }

    componentWillReceiveProps(np) {
        if(this.props.allFlights.length === 0 && np.allFlights && np.allFlights.arrival.length){
            this.setState({ allFlights: np.allFlights }, () => { this.setState({ flightsToRender: this.state.allFlights['arrival'] }) });
        }
    }

    getData = async () => {
        const date = `${new Date().getDate()}` + `-${new Date().getMonth()+1}` + `-${new Date().getFullYear()}`;
        const url = `https://api.iev.aero/api/flights/${date}`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }

    searchFlight = () => {
        const value = this.state.search;

        if(this.state.direction === 'arrival'){
            const filteredArrivalFlights = this.state.allFlights[this.state.direction].filter(flights => 
                flights['airportFromID.city'].startsWith(value) || flights.codeShareData[0].codeShare.startsWith(value));
            this.setState({ flightsToRender: filteredArrivalFlights });
        }else{
            const filteredDepartureFlights = this.state.allFlights[this.state.direction].filter(flights => 
                flights['airportToID.city'].startsWith(value) || flights.codeShareData[0].codeShare.startsWith(value));
            this.setState({ flightsToRender: filteredDepartureFlights });
        }
    }

    selectDirection = (direction) => {
        this.setState({ direction }, () => {
            this.setState({ flightsToRender: this.state.allFlights[this.state.direction] });
        });
        this.setState({active: !this.state.active});
    }

    handleSearchChange = (e) => {
        this.setState({ search: e.target.value });
    }


    render() {
        const flightsToRender = this.state.flightsToRender;

        return (
            <div className="dataArea">
                <div className="searchArea">
                    <div>
                        <img src={logo} alt="searchImg" />
                    </div>
                    <input type="text" placeholder="Номер рейсу або місто" onChange={this.handleSearchChange} />
                    <button type="submit" onClick={this.searchFlight}>Пошук</button>
                </div>
                <div className="direction">
                    <button id="active" onClick={() => this.selectDirection('arrival')}>Прибуття</button>
                    <button  onClick={() => this.selectDirection('departure')}>Відправлення</button>
                </div>
                <div className="flightsHeaders">
                    <div>Час</div>
                    <div>Напрямок</div>
                    <div>Рейс</div>
                    <div>Компанія</div>
                    <div>Статус</div>
                </div>
                {flightsToRender.map(flights =>
                    <div key={flights['ID']} className="showFlightsData">
                        <div id="time">{flights.actual ? flights.actual.slice(11, -4) : 'No info'}</div>
                        <div id="direction">{this.state.direction === 'arrival' ? flights['airportFromID.city'] : flights['airportToID.city']}</div>
                        <div id="race">{flights.codeShareData[0].codeShare}</div>
                        <div id="company">{flights.airline.en['name']}</div>
                        <div id="status">{+flights.fltNo.substr(0, 1) > 4  ? "Прибув" : "Очікується"}</div>
                    </div>
                )}
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
      add: data => dispatch(addData(data)),
    };
  }

const mapStateToProps = function (state){
    return{
        allFlights: state.allFlights,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FLightsBoard);

