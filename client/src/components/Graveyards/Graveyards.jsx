import React from 'react';
import PropTypes from 'prop-types';
import Graveyard from '../Graveyard/Graveyard';

const POSITIONS = ['top-left', 'top-right', 'bottom-right', 'bottom-left'];

const Graveyards = ({ graveyards }) => {
  return POSITIONS.map((position) => (
    <Graveyard
      key={`graveyard_${position}`}
      cards={graveyards[position]}
      position={position}
    />
  ));
};

Graveyards.propTypes = {
  graveyards: PropTypes.object.isRequired,
};

export default Graveyards;
