import { inRange } from 'lodash';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
// import styles from './Hand.module.css';
import { useDispatch } from 'react-redux';
import styled from 'styled-components/macro';
import Card from '../Card/Card';
import Draggable from '../Draggable/Draggable';
import { updatePlayerCardOrder } from '../../store/actions/player';
import { setRoomCurrentPlayerSelectedCard } from '../../store/actions/room';

const WIDTH = 30;

const Hand = ({ cards }) => {
  const dispatch = useDispatch();

  const [state, setState] = useState({
    order: cards,
    dragOrder: cards,
    draggedIndex: null,
  });

  useEffect(() => {
    if (state.dragOrder) {
      dispatch(updatePlayerCardOrder({ cards: state.dragOrder }));
    }
  }, [state.dragOrder]);

  const onClick = (card, isDragging) => {
    if (card && !isDragging) {
      dispatch(
        setRoomCurrentPlayerSelectedCard({ currentPlayerSelectedCard: card })
      );
    }
  };

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
    setState((state) => ({
      ...state,
      order: state.dragOrder,
      draggedIndex: null,
    }));
  }, []);

  return (
    <HandContainer>
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
                onClick={() => onClick(card, isDragging)}
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
};

export default Hand;

const HandContainer = styled.div`
  position: relative;
  height: 154px;
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
`;
