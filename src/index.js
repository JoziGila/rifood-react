import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			days: [],
			menu: {primary: "prim", secondary: "sec"},
			error: ''
		}

		this.generateWeekDays = this.generateWeekDays.bind(this);
		this.loadMenuForDate = this.loadMenuForDate.bind(this);
		this._dayOfWeekAsString = this._dayOfWeekAsString.bind(this);
		this._monthAsString = this._monthAsString.bind(this);
	}

	componentDidMount() {
		this.initDays();
	}

	initDays() {
		// Get current day
		let currentDate = new Date();
		// Call genereateWeekDays
		this.generateWeekDays(currentDate);
		// Call getMenuForSelectedDay
	}

	generateWeekDays(date) {
		let day = date.getDay();
		let diff = date.getDate() - day + (day === 0 ? -6:1);
		let monday = new Date(date.setDate(diff));
		let friday = new Date();
		friday.setDate(monday.getDate() + 4)
		
		let dayObjs = [];
		for (let current = monday; current <= friday; current.setDate(current.getDate() + 1)) {
			const dayObj = {
				day: this._dayOfWeekAsString(current.getDay()),
				date: current.getDate(),
				month: this._monthAsString(current.getMonth()),
				selected: date === current,
				hasOrder: false
			}
			dayObjs.push(dayObj);
		}

		// Get Status
		this.setState({days: dayObjs}, function () {
			console.log(this.state);
		});

		this.loadMenuForDate(date);
	}

	_dayOfWeekAsString(dayIndex) {
		return ["Sunday", "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][dayIndex];
	}

	_monthAsString(monthIndex) {
		return ["January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
	  ][monthIndex];
	}

	loadMenuForDate(date) {
		console.log("Menu")
		// Get menu from API
		let menuObj = {
			primary: [{name: "Patate me kos", selected: true}, {name: "Pule me dicka", selected: false}],
			secondary: [{name: "Sallate jeshile", selected: false}, {name: "Supe me perime", selected: true}]
		}

		// Set menu to state
		this.setState({menu: menuObj}, function () {
			console.log(this.state);
		});
	}

	handleDayClick() {
		// Set selected
		// Call get menu for selected
	}

	handleSubmitClick() {
		// Validate and set error
		// Send to server
	}

	handleWeekControls() {
		// If next find next monday and sunday
		// If prev find last monday and sunday
		//
	}

	render() {
		return (
			<div className="app">
				<Calendar days={this.state.days} />
				<MenuTable type="Primary" meals={this.state.menu.primary} />
				<MenuTable type="Secondary" meals={this.state.menu.secondary} />
			</div>
		);
	}
}

	
class Day extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className={ this.props.selected ? "day selectedDay" : "day"}>
				<div className={"check"}>
					<img src={process.env.PUBLIC_URL + '/img' + (this.props.hasOrder ? '/check.svg' : '/warning.svg')} alt="check" />
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

class Calendar extends React.Component {
	constructor(props){
		super(props);
	}

	onClick() {
		console.log(this.props)
	}

	render(){
		return(

			<div className='calenderContainer' onClick={() => this.onClick()}>
				<div className='calendar'>
					<div className='weekArrow prevWeek'><img src={process.env.PUBLIC_URL + '/img/weekArrow.png'} alt={'prevWeek'}/></div>
					{this.props.days.map((day, key) => {
						console.log(day);
						return <Day key={key} {...day}></Day>
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
		console.log(props)
	}

	render(){
		return(
			<div className="menuTable">
				<div className="header">{this.props.type}</div>
				<div className="body">
					{this.props.meals.map((meal, key) => {
						return (
							<div className={'choice ' + (meal.selected ? 'selectedChoice' : '')} id={key}>
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
  <App  />,
  document.getElementById('root')
);