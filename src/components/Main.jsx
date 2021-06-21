import React from 'react';
import Header from './Header/Header';
import RacesData from './RacesData/RacesData';
import './Main.css';

function Main() {
    return (
        <div className="main">
            <Header />
            <RacesData />
        </div>
    );
}

export default Main;