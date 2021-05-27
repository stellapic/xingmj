import React, { Component } from 'react';
import './Carousel.css';

type prosType = {
    dataList: Object[]
}

export default class Carousel extends Component<prosType> {
    render() {
        const { dataList } = this.props;
        return (
            <div className="my-carousel">
                <div className="carousel-inner">
                    {dataList.map((info) => {
                        return (
                            <div key={new Date().getTime()}></div>
                        )
                    })}
                </div>
            </div>
        )
    }
}
