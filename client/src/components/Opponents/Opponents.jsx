import React from 'react';
import PropTypes from 'prop-types';
import styles from './Opponents.module.css';
import OpponentHand from '../OpponentHand/OpponentHand';

const Opponents = ({ players }) => {
  const positions = ['left', 'top', 'right'];

  return (
    <div className={styles.opponentsContainer}>
      {players.map((p, index) => {
        const position = positions[index];
        return (
          <div
            key={`opponent_${position}`}
            className={`${styles[position]} ${styles.opponent}`}
          >
            <OpponentHand position={position} player={p} />
          </div>
        );
      })}
    </div>
  );
};

Opponents.propTypes = {
  players: PropTypes.array.isRequired,
};

export default Opponents;
