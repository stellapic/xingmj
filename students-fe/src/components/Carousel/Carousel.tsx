import React, { Component } from 'react';
import './Carousel.css';

type prosType = {
    dataList: Object[]
}

export default class Carousel extends Component {
    props: prosType = {
        dataList: []
    }
    render() {
        const { dataList } = this.props;
        return (
            <div className="my-carousel">
                <div className="carousel-inner">
                    {dataList.map((info) => {
                        return (
                            <div></div>
                        )
                    })}
                </div>
            </div>
        )
    }
}
