import React from 'react';
import styles from './styles.module.css';

export default function FeatureBlock(props){
    return (
        <div className={styles.featureBlock}>
            <h3><props.svg />{props.title}</h3>
            {props.children}
        </div>
    );
}
