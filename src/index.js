import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


	
class Day extends React.Component {
	constructor(props){
		super(props);
		
		this.state = {
			day: 'Wednesday',
			date: 25,
			month: 'June',
			hasOrder: true,
			selected: false
		}
	}
	
	render() {
		return (
			<div className={ this.state.selected ? "day selectedDay" : "day"}>
				<div className={"check"}>
					<img src={process.env.PUBLIC_URL + '/img' + (this.state.hasOrder ? '/check.svg' : '/warning.svg')} alt="check" />
				</div>
				<div className={"info"}>
					<div className={"infoContent"}>
						<span className={"infoContentDay"}>{this.state.day}</span>
						<span className={"infoContentDate"}>{this.state.date}</span>
						<span className={"infoContentMonth"}>{this.state.month}</span>
					</div>
				</div>
			</div>
		);
	}
}

ReactDOM.render(
  <Day />,
  document.getElementById('root')
);