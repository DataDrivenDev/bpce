import React from 'react';

import style from "./spinner.module.css";

export default class Spinner extends React.PureComponent {

    render() {
        let styl2 = style.skcube + " " +  style.skcube2,
            styl4 = style.skcube4 + " " + style.skcube,
            styl3 = style.skcube3 + " " + style.skcube;
        
        return (
            <div className={style.skfoldingcube}>
                <div className={style.skcube}></div>
                <div className={styl2}></div>
                <div className={styl4}></div>
                <div className={styl3}></div>
            </div>
        );
    }
}