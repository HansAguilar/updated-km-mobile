import React from "react";
import { View, Image, Text } from "react-native";
import moment from 'moment/moment';

export const MessageBox = React.memo(({ item }) => {
  return (
    <View
      style={{
        width: '100%',
        padding: 5,
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 3,
        justifyContent: item.type === 'ADMIN' ? 'flex-start' : 'flex-end',
      }}
    >
      <Text
        style={{
          fontSize: 10,
          width: '100%',
          color: item.type === 'ADMIN' ? '#fff' : '#27272a',
          textAlign: item.type === 'ADMIN' ? 'left' : 'right',
        }}
      >
        {moment(item.createdDateAndTime).format('LLL')}
      </Text>
      <View
        style={{
          maxWidth: 250,
          paddingHorizontal: 20,
          paddingVertical: 15,
          borderRadius: 15,
          backgroundColor: item.type === 'ADMIN' ? '#06b6d4' : '#fff',
          borderBottomLeftRadius: item.type !== 'ADMIN' ? 15 : 0,
          borderBottomRightRadius: item.type === 'ADMIN' ? 15 : 0,
          color: item.type === 'ADMIN' ? '#fff' : '',
        }}
      >

        <Text style={{ marginLeft: "auto", color: item.type === 'ADMIN' ? '#fff' : '#27272a' }}>
          {item.messageContent}
        </Text>
      </View>
    </View>
  );
});
