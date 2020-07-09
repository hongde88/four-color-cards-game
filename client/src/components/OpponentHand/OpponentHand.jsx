import React from 'react';
import CardBack from '../CardBack/CardBack';
import PropTypes from 'prop-types';
import Avatar from '../Avatar/Avatar';
import Melded from '../Melded/Melded';
import styled from 'styled-components/macro';

const OpponentHand = ({ position, player }) => {
  const hand = [];

  const degree = position === 'top' ? 270 : 180;
  const negative = position === 'right' ? -1 : 1;

  for (let i = 0; i < 19; i++) {
    hand.push(<CardBack key={i} degree={degree + 10 * i * negative} />);
  }

  return (
    <Container top={position === 'top'}>
      <Hand position={position}>{hand}</Hand>
      <Melded groupOfCards={player.melded} position={position} />
      <RemainingText position={position}>{player.cardsRemaining}</RemainingText>
      <StyledAvatar position={position}>
        <Avatar name={player.name} index={player.avatarIndex} small={true} />
      </StyledAvatar>
    </Container>
  );
};

OpponentHand.propTypes = {
  position: PropTypes.string.isRequired,
  player: PropTypes.object.isRequired,
};

export default OpponentHand;

const Container = styled.div.attrs((props) => ({
  style: {
    height: props.top ? '150px' : 'auto',
    width: props.top ? 'auto' : '200px',
    margin: props.top ? 'auto' : 0,
  },
}))``;

const Hand = styled.div.attrs((props) => {
  const isLeft = props.position === 'left';
  const isRight = props.position === 'right';
  const isTop = props.position === 'top';

  return {
    style: {
      left: isLeft ? 0 : 'auto',
      right: isRight ? '20px' : 'auto',
      marginLeft: isTop ? 'auto' : 0,
      marginRight: isTop ? 'auto' : 0,
    },
  };
})`
  position: absolute;
`;

const StyledAvatar = styled.div.attrs((props) => ({
  style: {
    top: 0,
    marginLeft: props.position === 'top' ? '-120px' : 0,
    right: props.position === 'right' ? 0 : 'auto',
    marginTop:
      props.position === 'left' || props.position === 'right' ? '-120px' : 0,
  },
}))`
  position: absolute;
`;

const RemainingText = styled.div.attrs((props) => ({
  style: {
    marginLeft: '-5px',
    marginTop: props.position === 'top' ? 0 : '-20px',
    right: props.position === 'right' ? 0 : 'auto',
  },
}))`
  position: absolute;
  height: 40px;
  width: 40px;
  font-size: 30px;
  border-radius: 20px;
  background: black;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
`;
