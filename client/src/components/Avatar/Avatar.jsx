import React from 'react';
import PropType from 'prop-types';
import Image from 'react-bootstrap/Image';
import styles from './Avatar.module.css';

const Avatar = ({ index, name, size }) => {
  return (
    <div className={styles.avatarContainer}>
      <Image
        src={`/images/avatars/avatar_${index}.png`}
        width={size === 'sm' ? 50 : 100}
        height={size === 'sm' ? 50 : 100}
      />
      <p>{name}</p>
    </div>
  );
};

Avatar.defaultProps = {
  index: 0,
  size: 'sm',
};

Avatar.propTypes = {
  index: PropType.number,
  name: PropType.string,
  size: PropType.string,
};

export default Avatar;
