import React from 'react';
import PropType from 'prop-types';
import Image from 'react-bootstrap/Image';
import styles from './Avatar.module.css';

const Avatar = ({ index, name }) => {
  return (
    <div className={styles.avatarContainer}>
      <Image
        className={styles.avatar}
        src={`/images/avatars/avatar_${index}.png`}
      />
      {name}
    </div>
  );
};

Avatar.defaultProps = {
  index: 0,
};

Avatar.propTypes = {
  index: PropType.number,
  name: PropType.string,
};

export default Avatar;
