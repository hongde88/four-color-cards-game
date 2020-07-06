import ArrowLeft from '@material-ui/icons/ArrowLeft';
import ArrowRight from '@material-ui/icons/ArrowRight';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
// import { createPrivateRoom, joinRoom } from '../../store/actions/room';
import Avatar from '../../components/Avatar/Avatar';
import styles from './PlayerCreation.module.css';
import { joinARoom } from '../../store/actions/room';

const NUMBER_OF_AVATARS = 10;

const PlayerCreation = () => {
  const dispatch = useDispatch();

  // const [awaitNav, setAwaitNav] = useState(false);

  const [playerName, setPlayerName] = useState('');
  const [avatarIndex, setAvatarIndex] = useState(0);

  const roomId = useSelector((state) => state.room.room.roomId);
  // const navigatedFrom = useSelector((state) => state.room.navigatedFrom);
  const [navigatedFrom, setNavigatedFrom] = useState(null);
  // const user = useSelector((state) => state.user.user.name);
  // const roomId = null;
  // const navigatedFrom = null;
  // const user = null;
  const errors = {
    roomError: useSelector((state) => state.room.errors.message),
    playerError: useSelector((state) => state.player.errors.message),
  };

  useEffect(() => {
    if (window.location.search.includes('?roomId=')) {
      setNavigatedFrom(window.location.search.substring('?roomId='.length));
    }

    if (errors.roomError && errors.roomError) {
      setNavigatedFrom(null);
      window.history.replaceState(null, null, '/');
    }
  }, [window, errors.roomError]);

  // useEffect(() => {
  //   if (awaitNav && roomId && user) {
  //     if (!errors.roomError && !errors.userError) {
  //       history.push(`/rooms/${roomId}`);
  //     }
  //   }
  // }, [roomId, navigatedFrom, user, history, errors, awaitNav]);
  useEffect(() => {
    if (roomId) {
      window.history.replaceState(null, null, `/?roomId=${roomId}`);
    }
  }, [roomId]);

  const goToPrivateRoom = () => {
    // setAwaitNav(true);
    // history.replace('/', {});
    dispatch(joinARoom({ playerName, avatarIndex }));
  };

  const joinPublicOrPrivateRoom = () => {
    // setAwaitNav(true);
    dispatch(
      joinARoom({ playerName, avatarIndex, roomId: roomId || navigatedFrom })
    );
  };

  const prevAvatar = () => {
    if (avatarIndex - 1 < 0) {
      setAvatarIndex(NUMBER_OF_AVATARS - 1);
    } else {
      setAvatarIndex(avatarIndex - 1);
    }
  };

  const nextAvatar = () => {
    if (avatarIndex + 1 === NUMBER_OF_AVATARS) {
      setAvatarIndex(0);
    } else {
      setAvatarIndex(avatarIndex + 1);
    }
  };

  return (
    <div className="d-flex flex-column align-items-center">
      {(errors.roomError || errors.playerError) && (
        <Alert variant="danger">{errors.roomError || errors.playerError}</Alert>
      )}
      <div className={styles.avatarDiv}>
        <Button variant="icon" size="sm" onClick={prevAvatar}>
          <ArrowLeft className={styles.leftArrow} />
        </Button>
        <Avatar index={avatarIndex} size="lg" />
        <Button variant="icon" size="sm" onClick={nextAvatar}>
          <ArrowRight className={styles.rightArrow} />
        </Button>
      </div>
      <Form className="d-flex flex-column align-items-center">
        <Form.Group controlId="username">
          <Form.Control
            type="username"
            placeholder="Enter username"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
        </Form.Group>

        {/* <Form.Group>
          <Button variant="primary" onClick={joinPublicOrPrivateRoom}>
            PLAY NOW
          </Button>
        </Form.Group> */}

        {(roomId || navigatedFrom) && (
          <Form.Group>
            <Button variant="primary" onClick={joinPublicOrPrivateRoom}>
              JOIN ROOM {roomId || navigatedFrom}
            </Button>
          </Form.Group>
        )}

        <Form.Group>
          <Button variant="primary" onClick={goToPrivateRoom}>
            CREATE PRIVATE ROOM
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
};

export default PlayerCreation;
