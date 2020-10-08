import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '@mdi/react'
import { mdiCalendarMultiple } from '@mdi/js';

import style from "./styles.module.css";

interface MonthBoxProps {
    onClick : any
}

export default class MonthBox extends React.PureComponent<MonthBoxProps> {
    render() {
        return (
            <div className={style.box} onClick={this.props.onClick}>
              <Icon
                  path={ mdiCalendarMultiple }
                  title="Sélectionner des dates"
                  size={1.0}
                  horizontal
                  vertical
                  rotate={180}
                  color="white"
                  className={style.icons}
              />
            </div>
        )
    }
}


