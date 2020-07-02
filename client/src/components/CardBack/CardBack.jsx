import React from 'react';
import PropTypes from 'prop-types';
import styles from './CardBack.module.css';

const CardBack = ({ degree }) => {
  const transform = 'rotate(' + degree + 'deg)';
  return (
    <div className={styles.backContainer} style={{ transform }}>
      <div className={styles.innerContainer}></div>
    </div>
  );
};

CardBack.propTypes = {
  degree: PropTypes.number.isRequired,
};

export default CardBack;
