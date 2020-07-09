import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components/macro';
import Card from '../Card/Card';

const WIDTHS = { sm: 18, md: 24, lg: 36 };
const HEIGHTS = { sm: 70, md: 90, lg: 140 };
const BORDERS = { sm: 2, md: 3, lg: 4 };
const PADDINGS = { sm: 0, md: 0, lg: 2 };

const Card = ({
  card,
  size,
  degree,
  absolute,
  disabled,
  marginLeft,
  marginTop,
}) => {
  return (
    <Container
      disabled={disabled}
      degree={degree}
      absolute={absolute}
      marginLeft={marginLeft}
      marginTop={marginTop}
    >
      <Card
        card={card}
        height={HEIGHTS[size]}
        width={WIDTHS[size]}
        border={BORDERS[size]}
        padding={PADDINGS[size]}
      />
    </Container>
  );
};

Card.defaultProps = {
  card: null,
  size: 'sm',
  degree: 0,
  absolute: false,
  disabled: false,
  marginLeft: 0,
  marginTop: 0,
};

Card.propTypes = {
  card: PropTypes.object,
  size: PropTypes.string,
  degree: PropTypes.number,
  absolute: PropTypes.bool,
  disabled: PropTypes.bool,
  marginLeft: PropTypes.number,
  marginTop: PropTypes.number,
};

export default Card;

const Container = styled.div.attrs((props) => ({
  style: {
    transform: `rotate(${props.degree}deg)`,
    position: props.absolute ? 'absolute' : 'static',
    pointerEvents: props.disabled ? 'none' : 'initial',
    opacity: props.disabled ? 0.4 : 1,
    marginLeft: props.marginLeft,
    marginTop: props.marginTop,
  },
}))`
  transform-origin: top;
`;
