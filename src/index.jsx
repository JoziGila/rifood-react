import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './Home/Home';
import Dashboard from './Dashboard/Dashboard';


class App extends React.Component {
	render() {
		return (
			<Switch>
				<Route path="/dashboard" component={Dashboard} />
				<Route path="/" component={Home} />
			</Switch>
		);
	}
}

ReactDOM.render(
	<BrowserRouter>
		<App />
	</BrowserRouter>,
	document.getElementById('root')
);