import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import httpClient from '../Services/common';
import moment from 'moment';

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            meals: [],
            form: {},
            menus: [],
            filter: null
        }

        this.handleForm = this.handleForm.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.loadMeals = this.loadMeals.bind(this);
        this.loadMenus = this.loadMenus.bind(this);
    }

    componentDidMount() {
        this.loadMeals();
        this.loadMenus();
    }

    handleForm(event) {
        const options = event.target.options;
        let value = [];
        for (var i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                value.push(options[i].value);
            }
        }

        let formCopy = { ...this.state.form };
        if (event.target.id === 'primarySelect') {
            formCopy.primary = value;
        } else {
            formCopy.secondary = value;
        }

        this.setState({ form: formCopy });
    }

    handleDate(event) {
        const value = event.target.value;
        let timestamp = moment(value).valueOf();
        let formCopy = { ...this.state.form };
        formCopy.date = timestamp;
        this.setState({ form: formCopy });
    }

    handleFilter(event) {
        const value = event.target.value;
        let timestamp = moment(value).valueOf();
        this.setState({ filter: timestamp });
    }

    handleSubmit(event) {
        event.preventDefault();
        const primary = this.state.form.primary.map(i => {
            return { "meal_id": i, "menu_item_type": 1 }
        });
        const secondary = this.state.form.secondary.map(i => {
            return { "meal_id": i, "menu_item_type": 2 }
        });

        const selected = [...primary, ...secondary];
        const data = {
            date: this.state.form.date,
            menu_items: selected
        }

        httpClient.post('/menu_items', data).then((result) => {
            debugger;
        })
    }

    loadMeals() {
        httpClient.get('/meals').then((result) => {
            this.setState({ meals: result.data });
        })
    }

    loadMenus() {
        // Pull all menus from today to the end
        const now = moment().startOf('day').valueOf();
        httpClient.get('/reports', { start_date: now }).then((result) => {
            this.setState({ menus: result.data });
        });
    }



    render() {
        return (
            <Container>
                <br />
                <Row>
                    <Col>
                        <Form>
                            <Form.Group controlId="dateSelect">
                                <Form.Label>Date for new menu</Form.Label>
                                <Form.Control type="date" onChange={this.handleDate} />
                            </Form.Group>
                            <Form.Group controlId="primarySelect" >
                                <Form.Label>Select two primary meals</Form.Label>
                                <Form.Control as="select" multiple onChange={this.handleForm}>
                                    {this.state.meals.map(m => {
                                        return <option key={m.id} value={m.id}>{m.name}</option>
                                    })}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="secondarySelect" onChange={this.handleForm}>
                                <Form.Label>Select two secondary meals</Form.Label>
                                <Form.Control as="select" multiple>
                                    {this.state.meals.map(m => {
                                        return <option key={m.id} value={m.id}>{m.name}</option>
                                    })}
                                </Form.Control>
                            </Form.Group>
                            <Button variant="primary" type="submit" onClick={this.handleSubmit}>
                                Submit
                            </Button>
                        </Form>
                    </Col>
                    <Col>
                        <Form>
                            <Form.Group controlId="dateFilter">
                                <Form.Label>Filter by date</Form.Label>
                                <Form.Control type="date" onChange={this.handleFilter} />
                            </Form.Group>
                        </Form>
                        {this.state.menus.filter(i => this.state.filter ? i.date === this.state.filter : true).map(m => {
                            return (
                                <div key={m.date} class="day-report" style={{ marginBottom: '2rem' }}>
                                    <h4>{moment(m.date).format("MM/DD/YYYY")}</h4>
                                    {m.items.map(i => {
                                        return (
                                            <div class='meal-count'>{i.name}: {i.count}</div>
                                        );
                                    })}
                                    <div class='bread'>Buke: {m.count_bread}</div>
                                    <div class='abstained'><strong>Abstained: </strong>{m.abstained.join(', ')}</div>
                                </div>
                            );
                        })}
                    </Col>
                </Row>
            </Container>
        );
    }
}