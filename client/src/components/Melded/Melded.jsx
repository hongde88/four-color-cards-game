import React from 'react';
import PropTypes from 'prop-types';
import Card from '../Card/Card';
import styled from 'styled-components/macro';

const Melded = ({ groupOfCards, position }) => {
  let margin = 0;

  const isLeftOrRight = position === 'left' || position === 'right';
  return (
    <Container position={position}>
      {groupOfCards.map((cards, groupIndex) => {
        margin += isLeftOrRight ? 0 : groupIndex === 0 ? 0 : 50;
        return (
          <Group key={`group_${groupIndex}`} position={position}>
            {cards.map((card, cardIndex) => {
              margin += cardIndex === 0 ? 0 : 20;
              return (
                <CardContainer
                  key={`card_${cardIndex}`}
                  position={position}
                  marginLeft={
                    position === 'left'
                      ? cardIndex * 20
                      : position === 'right'
                      ? 'auto'
                      : margin
                  }
                  marginTop={isLeftOrRight ? groupIndex * 50 : 0}
                  marginRight={position === 'right' ? cardIndex * 20 : 'auto'}
                >
                  <Card card={card} size="md" />
                </CardContainer>
              );
            })}
          </Group>
        );
      })}
    </Container>
  );
};

Melded.defaultProps = {
  groupOfCards: [],
};

Melded.propTypes = {
  groupOfCards: PropTypes.array,
  position: PropTypes.string.isRequired,
};

export default Melded;

const Container = styled.div.attrs((props) => {
  const topOrBottom = props.position === 'top' || props.position === 'bottom';
  return {
    style: {
      marginTop: topOrBottom ? 0 : '-120px',
      marginLeft: props.position === 'top' ? '50px' : 0,
      height: topOrBottom ? '110px' : '50%',
      minWidth: topOrBottom ? '300px' : '120px',
      right: props.position === 'right' ? 0 : 'auto',
      overflowY: topOrBottom ? 'hidden' : 'auto',
    },
  };
})`
  position: absolute;
  overflow-y: hidden;
`;

const Group = styled.div.attrs((props) => ({
  style: { right: props.position === 'right' ? 0 : 'auto' },
}))``;

const CardContainer = styled.div.attrs((props) => ({
  style: {
    marginLeft: props.marginLeft,
    marginRight: props.marginRight,
    marginTop: props.marginTop,
    right: props.position === 'right' ? 0 : 'auto',
  },
}))`
  position: absolute;
`;
