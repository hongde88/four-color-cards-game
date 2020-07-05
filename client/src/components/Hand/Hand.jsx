import PropTypes from 'prop-types';
import React, { useState, useCallback } from 'react';
import Card from '../Card/Card';
import Melded from '../Melded/Melded';
// import styles from './Hand.module.css';
import styled from 'styled-components/macro';
import Draggable from '../Draggable/Draggable';
import { inRange } from 'lodash';

const WIDTH = 30;

const Hand = ({ cards, melded, opponent }) => {
  cards.forEach((card, index) => (card.id = index));
  const [state, setState] = useState({
    order: cards,
    dragOrder: cards,
    draggedIndex: null,
  });

  const handleDrag = useCallback(
    ({ translation, id }) => {
      const delta = Math.round(translation.x / (WIDTH + 10));
      const index = state.order.findIndex((card) => card.id === id);
      const dragOrder = state.order.filter((card) => card.id !== id);

      if (!inRange(index + delta, 0, cards.length)) {
        return;
      }

      dragOrder.splice(index + delta, 0, state.order[index]);

      setState((state) => ({
        ...state,
        draggedIndex: id,
        dragOrder,
      }));
    },
    [state.order, cards.length]
  );

  const handleDragEnd = useCallback(() => {
    state.dragOrder.forEach((c, index) => (c.zIndex = index));

    setState((state) => ({
      ...state,
      order: state.dragOrder,
      draggedIndex: null,
    }));
  }, []);

  return (
    <HandContainer>
      <Melded groupOfCards={melded} position="bottom" />
      <Cards>
        {state.dragOrder.map((card) => {
          const isDragging = state.draggedIndex === card.id;
          const draggedLeft =
            state.order.findIndex((c) => c.id === card.id) * (WIDTH + 10);
          const draggedIndex = state.dragOrder.findIndex(
            (c) => c.id === card.id
          );
          const left = draggedIndex * (WIDTH + 10);

          return (
            <Draggable
              key={card.id}
              id={card.id}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
            >
              <CardContainer
                key={`card_${card.id}`}
                left={isDragging ? draggedLeft : left}
                isDragging={isDragging}
              >
                <Card card={card} />
              </CardContainer>
            </Draggable>
          );
        })}
      </Cards>
    </HandContainer>
  );
};

Hand.propTypes = {
  cards: PropTypes.array.isRequired,
  melded: PropTypes.array.isRequired,
};

export default Hand;

const HandContainer = styled.div`
  position: relative;
  height: 250px;
`;

const CardContainer = styled.div.attrs((props) => ({
  style: {
    left: `${props.left}px`,
    transition: props.isDragging ? 'none' : 'all 500ms',
  },
}))`
  position: absolute;
`;

const Cards = styled.div`
  position: absolute;
  top: 110px;
`;
