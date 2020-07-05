import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './Card.module.css';

let cx = classNames.bind(styles);

// First index is yellow/red
// Second index is green/white
const CHARACTERS = {
  general: ['帥', '將'],
  advisor: ['仕', '士'],
  bishop: ['像', '相'],
  rook: ['車', '俥'],
  cannon: ['炮', '包'],
  horse: ['馬', '傌'],
  soldier: ['兵', '卒'],
};

const Card = ({ card, size, zIndex }) => {
  const { character, color } = card;

  const isGeneral = character === 'general';

  const isColor = (c) => {
    return color === c;
  };

  const getCharacter = (index) => {
    return CHARACTERS[character][index];
  };

  const className = cx({
    cardContainer: true,
    [color]: true,
    [size]: true,
    general: isGeneral,
  });

  const charToDisplay =
    isColor('yellow') || isColor('red') ? getCharacter(0) : getCharacter(1);

  return (
    <div className={className}>
      <div className={styles.innerContainer}>
        <div className={styles.topCharacter}>{charToDisplay}</div>
        <div className={styles.bottomCharacter}>{charToDisplay}</div>
      </div>
    </div>
  );
};

Card.defaultProps = {
  size: 'large',
  zIndex: 0,
};

Card.propTypes = {
  card: PropTypes.object.isRequired,
  size: PropTypes.string,
};

export default Card;
