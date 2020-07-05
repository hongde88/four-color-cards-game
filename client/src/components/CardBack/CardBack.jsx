import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components/macro';

const CardBack = ({ degree, size }) => {
  return (
    <Container degree={degree} isSmall={size === 'sm'}>
      <InnerContainer isSmall={size === 'sm'}></InnerContainer>
    </Container>
  );
};

CardBack.defaultProps = {
  degree: 0,
  size: 'sm',
};

CardBack.propTypes = {
  degree: PropTypes.number,
  size: PropTypes.string,
};

export default CardBack;

const Container = styled.div.attrs((props) => ({
  style: {
    transform: `rotate(${props.degree}deg)`,
    width: props.isSmall ? '20px' : '60px',
    border: `${props.isSmall ? '2px' : '4px'} solid black`,
    padding: props.isSmall ? '4px' : '8px',
    position: props.isSmall ? 'absolute' : 'static',
  },
}))`
  transform-origin: top;
  background-color: beige;
`;

const InnerContainer = styled.div.attrs((props) => ({
  style: {
    height: props.isSmall ? `60px` : `160px`,
    backgroundColor: 'darkred',
  },
}))``;
