import React from 'react';

class Day extends React.Component {
    render() {
        const classNames = `day ${this.props.selected && 'selectedDay'} ${!this.props.hasMenu && 'unavailable'}`;
        const statusImg = process.env.PUBLIC_URL + `./img${this.props.hasMenu ? (this.props.hasOrder ? '/check.svg' : '/warning.svg') : '/empty.svg'}`
        return (
            <div className={classNames} onClick={() => this.props.dayClick(this.props.datetime)}>
                <div className={"check"}>
                    <img src={statusImg} alt="check" />
                </div>
                <div className={"info"}>
                    <div className={"infoContent"}>
                        <span className={"infoContentDay"}>{this.props.day}</span>
                        <span className={"infoContentDate"}>{this.props.date}</span>
                        <span className={"infoContentMonth"}>{this.props.month}</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default class Calendar extends React.Component {
    render() {
        return (

            <div className='calendarContainer'>
                <div className='calendar'>
                    <div className='weekArrow prevWeek'><img src={process.env.PUBLIC_URL + './img/weekArrow.png'} alt={'prevWeek'} onClick={() => this.props.weekControl("prev")} /></div>
                    {this.props.days.map((day, key) => {
                        return <Day key={key} {...day} dayClick={this.props.dayClick} />
                    })}
                    <div className='weekArrow nextWeek'><img src={process.env.PUBLIC_URL + './img/weekArrow.png'} alt={'nextWeek'} onClick={() => this.props.weekControl("next")} /></div>
                </div>
            </div>
        );
    }
}