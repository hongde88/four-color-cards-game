import { inRange } from 'lodash';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import Card from '../Card/Card';
import Draggable from '../Draggable/Draggable';
import {
  updatePlayerCardOrder,
  setPlayerSelectedCard,
  removePlayerSelectedCard,
} from '../../store/actions/player';

const WIDTH = 30;

const Hand = ({ cards }) => {
  const dispatch = useDispatch();

  const playerSelectedCards = useSelector(
    (state) => state.player.player.selectedCards
  );

  const deselectCards = useSelector((state) => state.room.room.deselectCards);

  const [dragging, setDragging] = useState(false);

  const [state, setState] = useState({
    order: cards,
    dragOrder: cards,
    draggedIndex: null,
  });

  useEffect(() => {
    if (deselectCards) {
      dispatch(
        removePlayerSelectedCard({
          playerDeselectedCard: Array.isArray(playerSelectedCards)
            ? playerSelectedCards
            : [playerSelectedCards],
        })
      );
    }
  }, [deselectCards]);

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
                onMouseDown={() => {
                  if (dragging) {
                    setDragging(false);
                  }
                }}
                onMouseMove={() => {
                  if (!dragging) {
                    setDragging(true);
                  }
                }}
                onMouseUp={() => {
                  if (!dragging) {
                    // on click
                    if (!playerSelectedCards.includes(card)) {
                      dispatch(
                        setPlayerSelectedCard({ playerSelectedCard: card })
                      );
                    } else {
                      dispatch(
                        removePlayerSelectedCard({
                          playerDeselectedCard: [card],
                        })
                      );
                    }

                    // update card order if it's different from the original
                    if (cards !== state.dragOrder) {
                      dispatch(
                        updatePlayerCardOrder({
                          cards: state.dragOrder,
                        })
                      );
                    }
                  } else {
                    setDragging(false);
                  }
                }}
              >
                <Card
                  card={card}
                  size="lg"
                  marginTop={playerSelectedCards.includes(card) ? -20 : 0}
                />
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

const Cards = styled.div``;
