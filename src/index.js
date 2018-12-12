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

class Calendar extends React.Component {
	constructor(props){
		super(props);

		this.state = {
			days: [
				{
					day: 'Wednesday',
					date: 25,
					month: 'June',
					hasOrder: true,
					selected: false
				},
				{
					day: 'Wednesday',
					date: 25,
					month: 'June',
					hasOrder: true,
					selected: false
				},
				{
					day: 'Wednesday',
					date: 25,
					month: 'June',
					hasOrder: true,
					selected: false
				},
				{
					day: 'Wednesday',
					date: 25,
					month: 'June',
					hasOrder: true,
					selected: false
				},
				{
					day: 'Wednesday',
					date: 25,
					month: 'June',
					hasOrder: true,
					selected: false
				}
			]
		}
	}

	render(){
		return(
			<div className='calenderContainer'>
				<div className='calendar'>
					<div className='weekArrow'><img src={process.env.PUBLIC_URL + '/img/weekArrow.png'} alt={'prevWeek'}/></div>
					{this.state.days.map((day, key) => {
						return <Day key={key} props={day}></Day>
					})}
					<div className='weekArrow nextWeek'><img src={process.env.PUBLIC_URL + '/img/weekArrow.png'} alt={'nextWeek'}/></div>
				</div>
			</div>
		);
	}
}

class MenuTable extends React.Component {
	constructor(props){
		super(props);

		this.state = {
			type: "Primary",
			meals: [{name: 'Pule me patate', selected: false}, {name: 'Byrek me mish', selected: true}]
		}
	}

	render(){
		return(
			<div className="menuTable">
				<div className="header">{this.state.type}</div>
				<div className="body">
					{this.state.meals.map((meal, key) => {
						return (<div className={'choice ' + (meal.selected ? 'selectedChoice' : '')} id={key}>
									<img className='selectedIcon' src={process.env.PUBLIC_URL + '/img' + (meal.selected ? '/tick.svg' : '/empty.svg') } />
									<div className='mealName'>{meal.name}</div>
								</div>
						);
					})}
				</div>
			</div>
		);
	}
}

ReactDOM.render(
  <Calendar />,
  document.getElementById('root')
);