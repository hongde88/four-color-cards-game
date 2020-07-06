import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components/macro';

const CardBack = ({ degree, size, absolute, disabled }) => {
  return (
    <Container
      style={{
        opacity: disabled ? 0.4 : 1,
        pointerEvents: disabled ? 'none' : 'initial',
      }}
      degree={degree}
      isSmall={size === 'sm'}
      absolute={absolute}
    >
      <InnerContainer isSmall={size === 'sm'}></InnerContainer>
    </Container>
  );
};

CardBack.defaultProps = {
  degree: 0,
  size: 'sm',
  absolute: true,
  disabled: false,
};

CardBack.propTypes = {
  degree: PropTypes.number,
  size: PropTypes.string,
  absolute: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default CardBack;

const Container = styled.div.attrs((props) => ({
  style: {
    transform: `rotate(${props.degree}deg)`,
    height: props.isSmall ? '90px' : '154px',
    width: props.isSmall ? '30px' : '60px',
    border: `${props.isSmall ? '2px' : '4px'} solid black`,
    padding: props.isSmall ? '4px' : '8px',
    position: props.isSmall && props.absolute ? 'absolute' : 'static',
  },
}))`
  transform-origin: top;
  background-color: beige;
`;

const InnerContainer = styled.div.attrs((props) => ({
  style: {
    height: '100%',
    backgroundColor: 'darkred',
  },
}))``;
