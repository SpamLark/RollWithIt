import React from 'react';
import dayjs from 'dayjs';
import { TabList, Tab } from '@chakra-ui/react';

const GameNightTabHeadings = ({gameNights}) => {
    return (
        <TabList alignItems='center' justifyContent='center'>
          {gameNights.data && gameNights.data.map(gameNight => (
          <Tab key={gameNight.game_night_id}>{gameNight.game_night_location} <br></br> {
            //moment(gameNight.game_night_datetime, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('dddd Do MMMM, h:mm a')
            dayjs(gameNight.game_night_datetime, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('dddd D MMMM, h:mm a')
            }</Tab>
          ))}
        </TabList>
    );
  };

export default GameNightTabHeadings;