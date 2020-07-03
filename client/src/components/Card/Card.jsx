import React from 'react';
import PropTypes from 'prop-types';

import styles from './Card.module.css';

const CHARACTERS = {
  general: '帥',
  advisor: '士',
  bishop: '象',
  rook: '車',
  cannon: '炮',
  horse: '馬',
  soldier: '兵',
};

const Card = ({ card, size }) => {
  const { character, color } = card;

  return (
    <div className={`${styles.cardContainer} ${styles[color]} ${styles[size]}`}>
      <div className={styles.innerContainer}>
        <div className={styles.topCharacter}>{CHARACTERS[character]}</div>
        <div className={styles.bottomCharacter}>{CHARACTERS[character]}</div>
      </div>
    </div>
  );
};

Card.defaultProps = {
  size: 'lg',
};

Card.propTypes = {
  card: PropTypes.object.isRequired,
  size: PropTypes.string,
};

export default Card;
