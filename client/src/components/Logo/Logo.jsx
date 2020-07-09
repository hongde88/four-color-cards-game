import React from 'react';
import PropTypes from 'prop-types';
import Card from '../Card/Card';
import styled from 'styled-components/macro';

const Logo = ({ size }) => {
  const isSmall = size === 'sm';
  return (
    <Container isSmall={isSmall}>
      <LogoCard degree={300} marginLeft={60} marginTop={40} isSmall={isSmall}>
        <Card
          card={{ color: 'green', character: 'general' }}
          size={isSmall ? 'md' : 'lg'}
        />
      </LogoCard>
      <LogoCard degree={340} marginLeft={100} marginTop={20} isSmall={isSmall}>
        <Card
          card={{ color: 'yellow', character: 'general' }}
          size={isSmall ? 'md' : 'lg'}
        />
      </LogoCard>
      <LogoCard degree={20} marginLeft={140} marginTop={20} isSmall={isSmall}>
        <Card
          card={{ color: 'red', character: 'general' }}
          size={isSmall ? 'md' : 'lg'}
        />
      </LogoCard>
      <LogoCard degree={60} marginLeft={180} marginTop={40} isSmall={isSmall}>
        <Card
          card={{ color: 'white', character: 'general' }}
          size={isSmall ? 'md' : 'lg'}
        />
      </LogoCard>
      <Text>TỨ SẮC</Text>
    </Container>
  );
};

Logo.defaultProps = {
  size: 'sm',
};

Logo.propTypes = {
  size: PropTypes.string,
};

export default Logo;

const Container = styled.div.attrs((props) => ({
  style: {
    width: props.isSmall ? '200px' : '400px',
    height: props.isSmall ? '160px' : '240px',
  },
}))`
  position: relative;
  margin-bottom: 30px;
`;

const LogoCard = styled.div.attrs((props) => ({
  style: {
    transform: `rotate(${props.degree}deg)`,
    marginLeft: props.isSmall ? '-15px' : '-30px',
  },
}))`
  top: 20px;
  position: absolute;
  left: 50%;
  transform-origin: bottom;
`;

const Text = styled.div`
  font-size: 48px;
  position: absolute;
  bottom: 0;
  text-align: center;
  left: 0;
  right: 0;
  font-weight: 800;
  color: gold;
  text-shadow: 2px 2px black;
`;
