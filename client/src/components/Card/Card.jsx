import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import styled from 'styled-components/macro';

// First index is yellow/red
// Second index is green/white
const CHARACTERS = {
  general: ['帥', '將'],
  advisor: ['仕', '士'],
  bishop: ['像', '相'],
  rook: ['車', '俥'],
  cannon: ['炮', '包'],
  horse: ['馬', '傌'],
  soldier: ['兵', '卒'],
};

const HEIGHT = { sm: 60, md: 96, lg: 140 };
const FONT_SIZE = { sm: 14, md: 24, lg: 36 };
const PADDING = { sm: 3, md: 4, lg: 5 };

const Card = ({
  card,
  size,
  degree,
  absolute,
  disabled,
  marginTop,
  marginLeft,
}) => {
  const styles = useMemo(() => {
    const isGeneral = card ? card.character === 'general' : false;

    const character = card
      ? card.color === 'yellow' || card.color === 'red'
        ? CHARACTERS[card.character][0]
        : CHARACTERS[card.character][1]
      : '';

    const outerBkg = card ? card.color : 'beige';
    const innerBkgColor = card ? card.color : 'darkred';
    const innerBkg = isGeneral
      ? `${innerBkgColor} url('/images/star.svg') no-repeat center`
      : innerBkgColor;

    const padding = PADDING[size];

    const innerLRPad = padding;
    const innerWidth = FONT_SIZE[size] + 2 * innerLRPad;

    return {
      character,
      outerBkg,
      innerBkg,
      height: HEIGHT[size],
      width: innerWidth + padding * 2,
      innerPadding: `${padding}px ${innerLRPad}px`,
      outerPadding: padding,
      hasCenterLine: card && !isGeneral,
      fontSize: FONT_SIZE[size],
    };
  }, [card, size]);

  return (
    <Outer
      height={styles.height}
      width={styles.width}
      background={styles.outerBkg}
      padding={styles.outerPadding}
      fontSize={styles.fontSize}
      disabled={disabled}
      degree={degree}
      absolute={absolute}
      marginLeft={marginLeft}
      marginTop={marginTop}
    >
      <Inner padding={styles.innerPadding} background={styles.innerBkg}>
        <Top hasCenterLine={styles.hasCenterLine}>{styles.character}</Top>
        <Bottom>{styles.character}</Bottom>
      </Inner>
    </Outer>
  );
};

Card.defaultProps = {
  size: 'md',
  degree: 0,
  absolute: false,
  disabled: false,
  marginLeft: 0,
  marginTop: 0,
};

Card.propTypes = {
  card: PropTypes.object.isRequired,
  size: PropTypes.string,
  degree: PropTypes.number,
  absolute: PropTypes.bool,
  disabled: PropTypes.bool,
  marginLeft: PropTypes.number,
  marginTop: PropTypes.number,
};

export default Card;

const Top = styled.div.attrs((props) => ({
  style: {
    borderBottom: props.hasCenterLine ? '1px solid black' : 'none',
  },
}))``;

const Bottom = styled.div`
  -webkit-transform: rotate(-180deg);
  -moz-transform: rotate(-180deg);
  -o-transform: rotate(-180deg);
  transform: rotate(-180deg);
  ms-filter: 'progid:DXImageTransform.Microsoft.BasicImage(rotation=2)';
  filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=2);
`;

const Inner = styled.div.attrs((props) => ({
  style: {
    padding: props.padding,
    border: `1px solid black`,
    background: props.background,
  },
}))`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;

  > div {
    height: 50%;
  }
`;

const Outer = styled.div.attrs((props) => ({
  style: {
    height: props.height,
    width: props.width,
    fontSize: `${props.fontSize}px`,
    padding: `${props.padding}px`,
    boxShadow: `-1px 0 2px black`,
    background: props.background,
    transform: `rotate(${props.degree}deg)`,
    position: props.absolute ? 'absolute' : 'static',
    pointerEvents: props.disabled ? 'none' : 'initial',
    opacity: props.disabled ? 0.4 : 1,
    marginLeft: props.marginLeft,
    marginTop: props.marginTop,
  },
}))`
  transform-origin: top;
  font-weight: 500;
  text-align: center;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;
