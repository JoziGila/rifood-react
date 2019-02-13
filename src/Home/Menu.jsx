import React from 'react';

export default class MenuTable extends React.Component {
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

export class Buke extends React.Component {
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