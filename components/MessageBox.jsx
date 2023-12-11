import React from "react";
import { View, Image, Text } from "react-native";
import moment from 'moment/moment';

export const MessageBox = React.memo(({ item }) => {
  return (
    <View
      style={{
        width: '100%',
        padding: 5,
        display:"flex",
        flexDirection: 'column',
        alignItems: item.type === 'ADMIN' ? 'flex-start' : 'flex-end',
        gap: 3,
      }}
    >
      <Text
        style={{
          fontSize: 10,
          width: '100%',
          color: item.type === 'ADMIN' ? '#27272a' : '#27272a',
          textAlign: item.type === 'ADMIN' ? 'left' : 'right',
        }}
      >
        {moment(item.createdDateAndTime).format('L')}
      </Text>
      <View
        style={{
          maxWidth: 250,
          borderRadius: 15,
          padding: 10,
          backgroundColor: item.type === 'ADMIN' ? '#06b6d4' : '#fff',
          borderBottomLeftRadius: item.type !== 'ADMIN' ? 15 : 0,
          borderBottomRightRadius: item.type === 'ADMIN' ? 15 : 0,
          color: item.type === 'ADMIN' ? '#fff' : '',
        }}
      >

        <Text style={{ color: item.type === 'ADMIN' ? '#fff' : '#27272a' }}>
          {item.messageContent.trim()}
        </Text>
      </View>
    </View>
  );
});
