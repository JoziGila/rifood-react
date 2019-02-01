import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import moment from 'moment';
import { Button, Container, Col, Row } from 'react-bootstrap';


class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			days: [],
			menu: { meals: [], buke: false },
			error: ''
		}

		this.generateWeekDays = this.generateWeekDays.bind(this);
		this.loadMenuForDate = this.loadMenuForDate.bind(this);
		this.handleWeekControls = this.handleWeekControls.bind(this);
		this.handleDayClick = this.handleDayClick.bind(this);
		this.handleMealSelect = this.handleMealSelect.bind(this);
		this.handleBukeSelect = this.handleBukeSelect.bind(this);
		this._dayOfWeekAsString = this._dayOfWeekAsString.bind(this);
		this._monthAsString = this._monthAsString.bind(this);
	}

	componentDidMount() {
		const now = moment();
		this.generateWeekDays(now);
	}

	generateWeekDays(date) {
		let day = date.day();
		let monday = moment(date).subtract(day - 1, "days");
		let friday = moment(monday).add(4, "days");


		let dayObjs = [];
		for (let current = monday; current.isSameOrBefore(friday); current.add(1, "days")) {
			const dayObj = {
				datetime: moment(current),
				day: this._dayOfWeekAsString(current.day()),
				date: current.date(),
				month: this._monthAsString(current.month()),
				selected: date.isSame(current),
				hasOrder: false
			}
			dayObjs.push(dayObj);
		}

		this.setState({ days: dayObjs });

		this.loadMenuForDate(date);
	}

	_dayOfWeekAsString(dayIndex) {
		return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dayIndex];
	}

	_monthAsString(monthIndex) {
		return ["January", "February", "March", "April", "May", "June",
			"July", "August", "September", "October", "November", "December"
		][monthIndex];
	}

	loadMenuForDate(datetime) {
		// Get menu from API
		let menuObj = {
			meals:
				[{ id: 1, name: "Patate me kos", selected: true, type: "Primary" }, { id: 2, name: "Pule me dicka", selected: false, type: "Primary" },
				{ id: 3, name: "Sallate jeshile", selected: false, type: "Secondary" }, { id: 4, name: "Supe me perime", selected: true, type: "Secondary" }],
			buke: false
		};

		// Set menu to state
		this.setState({ menu: menuObj });
	}

	handleDayClick(datetime) {
		let daysCopy = [...this.state.days];

		// Remove selected
		daysCopy.map(d => {
			d.selected = false;
			return d;
		});

		// Set selected
		const newSelectedIndex = this.state.days.findIndex(d => d.datetime.isSame(datetime));
		daysCopy[newSelectedIndex].selected = true;

		// Call get menu for selected
		this.loadMenuForDate(datetime);
	}

	handleSubmitClick() {
		// Validate and set error
		// Send to server
	}

	handleWeekControls(type) {
		let newCurrent = moment(this.state.days.filter(d => d.selected === true)[0].datetime);
		newCurrent.add((type === "next" ? 7 : -7), "days");

		this.generateWeekDays(newCurrent);
	}

	handleMealSelect(id, type) {
		let menuCopy = [...this.state.menu.meals];
		let clickedMeal = menuCopy.filter(m => m.id === id)[0];

		if (clickedMeal.selected === true) {
			clickedMeal.selected = false;
		} else {
			// If no primaries are selected no restriction is applied to secondary meals
			if (menuCopy.filter(m => m.type === "Primary" && m.selected === false).length === 2) {
				if (clickedMeal.type === "Secondary") {
					clickedMeal.selected = true;
				} else if (menuCopy.filter(m => m.type === "Secondary" && m.selected === true).length !== 2) {
					clickedMeal.selected = true;
				}
			} else {
				// Deselect all except the clicked one
				menuCopy.filter(m => m.type === type).map(m => {
					m.selected = (m.id === id ? true : false);
					return m;
				})
			}
		}

		this.setState({ ...this.state.menu.meals, menuCopy });
	}

	handleBukeSelect() {
		let menuCopy = { ...this.state.menu }
		menuCopy.buke = !menuCopy.buke;
		this.setState({ menu: menuCopy });
	}

	render() {
		const calendarFunctions = {
			weekControl: this.handleWeekControls,
			dayClick: this.handleDayClick
		}

		const menuFunctions = {
			mealSelect: this.handleMealSelect
		}

		return (
			<div className="app">
				<Calendar days={this.state.days} {...calendarFunctions} />
				<Container>
					<Row>
						<Col><MenuTable type="Primary" key="prim" {...menuFunctions} meals={this.state.menu.meals.filter(m => m.type === "Primary")} /></Col>
						<Col><MenuTable type="Secondary" key="sec" {...menuFunctions} meals={this.state.menu.meals.filter(m => m.type === "Secondary")} /></Col>
					</Row>
					<Row>
						<Col></Col>
					</Row>
				</Container>


			</div>
		);
	}
}


class Day extends React.Component {
	render() {
		return (
			<div className={this.props.selected ? "day selectedDay" : "day"} onClick={() => this.props.dayClick(this.props.datetime)}>
				<div className={"check"}>
					<img src={process.env.PUBLIC_URL + './img' + (this.props.hasOrder ? '/check.svg' : '/warning.svg')} alt="check" />
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
	render() {
		return (

			<div className='calendarContainer'>
				<div className='calendar'>
					<div className='weekArrow prevWeek'><img src={process.env.PUBLIC_URL + './img/weekArrow.png'} alt={'prevWeek'} onClick={() => this.props.weekControl("prev")} /></div>
					{this.props.days.map((day, key) => {
						return <Day key={key} {...day} dayClick={this.props.dayClick}></Day>
					})}
					<div className='weekArrow nextWeek'><img src={process.env.PUBLIC_URL + './img/weekArrow.png'} alt={'nextWeek'} onClick={() => this.props.weekControl("next")} /></div>
				</div>
			</div>
		);
	}
}

class MenuTable extends React.Component {
	render() {
		return (
			<div className="menuTable" >
				<div className="header">{this.props.type}</div>
				<div className="body">
					{this.props.meals.map((meal, key) => {
						return (
							<div key={key} className={'choice ' + (meal.selected ? 'selectedChoice' : '')} id={key} onClick={() => this.props.mealSelect(meal.id, meal.type)}>
								<img className='selectedIcon' src={process.env.PUBLIC_URL + './img' + (meal.selected ? '/tick.svg' : '/empty.svg')} />
								<div className='mealName'>{meal.name}</div>
							</div>
						);
					})}
				</div>
			</div>
		);
	}
}

class Buke extends React.Component {
	render() {
		return (

			<div className="menuTable buke" >
				<div className="body">
					<div className={'buke choice ' + (this.props.buke === true ? 'selectedChoice' : '')} onClick={() => this.props.bukeSelect()}>
						<img className='selectedIcon' src={process.env.PUBLIC_URL + './img' + (this.props.buke === true ? '/tick.svg' : '/empty.svg')} />
						<div className='mealName'>Buke</div>
					</div>
				</div>
			</div>
		);
	}
}

ReactDOM.render(
	<App />,
	document.getElementById('root')
);