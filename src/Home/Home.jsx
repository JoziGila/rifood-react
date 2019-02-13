import React from 'react';
import moment from 'moment';
import { Button, Container, Col, Row, Alert } from 'react-bootstrap';
import MenuTable, { Buke } from './Menu';
import Calendar from './Calendar';
import httpClient from '../Services/common';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            days: [],
            menu: { meals: [], buke: false },
            message: null,
            blocking: false
        }

        this.generateWeekDays = this.generateWeekDays.bind(this);
        this.loadMenuForDate = this.loadMenuForDate.bind(this);
        this.handleWeekControls = this.handleWeekControls.bind(this);
        this.handleDayClick = this.handleDayClick.bind(this);
        this.handleMealSelect = this.handleMealSelect.bind(this);
        this.handleBukeSelect = this.handleBukeSelect.bind(this);
        this.handleSubmitClick = this.handleSubmitClick.bind(this);
        this._dayOfWeekAsString = this._dayOfWeekAsString.bind(this);
        this._monthAsString = this._monthAsString.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        // Check for token
        const token = localStorage.getItem('token');
        if (!token) {
            window.location = './login.html';
            return;
        }

        console.log(token);

        httpClient.get('/account/me');

        const now = moment().startOf('day');
        this.generateWeekDays(now);
    }

    generateWeekDays(date) {
        this.setState({ blocking: true, message: null });

        let day = date.day();
        let monday = moment(date).subtract(day - 1, "days");
        let friday = moment(monday).add(4, "days");

        httpClient.get("/user_week_status", {
            start_date: monday.valueOf(),
            end_date: friday.valueOf()
        }).then((result) => {
            let dayObjs = [];
            for (let current = monday; current.isSameOrBefore(friday); current.add(1, "days")) {
                const hasMenu = result.data.findIndex(d => d.date === current.valueOf()) !== -1;
                const hasOrder = result.data.findIndex(d => d.date === current.valueOf() && d.selected === true) !== -1;

                const dayObj = {
                    datetime: moment(current),
                    day: this._dayOfWeekAsString(current.day()),
                    date: current.date(),
                    month: this._monthAsString(current.month()),
                    selected: date.isSame(current),
                    hasOrder: hasOrder,
                    hasMenu: hasMenu
                }
                dayObjs.push(dayObj);
            }

            this.setState({ days: dayObjs });
            this.loadMenuForDate(date);
        });
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
        this.setState({ blocking: true, message: null, menu: { meals: [], buke: false } });
        httpClient.get('/user_day_menu', {
            date: datetime.valueOf()
        }).then((result) => {
            const meals = result.data.menu_items.map(m => {
                const meal = {
                    id: m.id,
                    name: m.meal.name,
                    type: m.menu_item_type === 1 ? "Primary" : "Secondary",
                    selected: m.selected
                }
                return meal;
            });

            const menu = {
                meals: meals,
                buke: result.data.include_bread
            }

            this.setState({ menu: menu });
        }).then(() => {
            this.setState({ blocking: false });
        })
    }

    handleDayClick(datetime) {
        // Get selected index
        const newSelectedIndex = this.state.days.findIndex(d => d.datetime.isSame(datetime));
        let daysCopy = [...this.state.days];
        if (!daysCopy[newSelectedIndex].hasMenu) return;

        // Remove selected from all
        daysCopy.map(d => {
            d.selected = false;
            return d;
        });

        // Set for the new one
        daysCopy[newSelectedIndex].selected = true;
        this.setState({ days: daysCopy });

        // Call get menu for selected
        this.loadMenuForDate(datetime);
    }

    handleSubmitClick() {
        // Send to server
        this.setState({ blocking: true, message: null });
        const currentDate = this.state.days.filter(d => d.selected)[0].datetime;
        const selectedIds = this.state.menu.meals.filter(m => m.selected).map(m => m.id);
        const data = {
            "date": currentDate.valueOf(),
            "menu_item_ids": selectedIds,
            "include_bread": this.state.menu.buke
        }

        const daysCopy = [...this.state.days];
        let submittedDay = daysCopy.filter(d => d.datetime.isSame(currentDate))[0];
        submittedDay.hasOrder = true;
        debugger;

        // Axios
        httpClient.post("/user_orders", data)
            .then(result => {
                this.setState({ days: daysCopy });
                this.setState({ message: { type: 's', msg: "Submitted successfully" } });
            }).catch((messages) => {
                this.setState({ message: { type: 'e', msg: messages[0] } });
            }).then(() => {
                this.setState({ blocking: false });
            });
    }

    logout() {
        localStorage.setItem('token', '');
        localStorage.setItem('user', '');
        window.location = './login.html';
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
            <BlockUi className={'block'} tag={"div"} blocking={this.state.blocking}>
                <div className="app">
                    <div className="header"><img src="./img/logo.svg"></img><Button onClick={this.logout} variant={"danger"}>Logout</Button></div>
                    {this.state.days.length !== 0 && <Calendar days={this.state.days} {...calendarFunctions} />}
                    {this.state.menu.meals.length !== 0 &&
                        <Container>
                            <Row>
                                <Col><MenuTable type="Primary" key="prim" {...menuFunctions} meals={this.state.menu.meals.filter(m => m.type === "Primary")} /></Col>
                                <Col><MenuTable type="Secondary" key="sec" {...menuFunctions} meals={this.state.menu.meals.filter(m => m.type === "Secondary")} /></Col>
                            </Row>
                            <Row>
                                <Col><Buke buke={this.state.menu.buke} bukeSelect={this.handleBukeSelect} /></Col>
                                <Col><div className="buttonContainer"><Button onClick={this.handleSubmitClick} className="submit" size={"lg"}>Submit</Button></div></Col>
                            </Row>
                            <Row>
                                <Col>{this.state.message && <Alert variant={this.state.message.type === 'e' ? 'danger' : 'success'}>{this.state.message.msg}</Alert>}</Col>
                            </Row>
                        </Container>
                    }
                </div>
            </BlockUi>
        );
    }
}