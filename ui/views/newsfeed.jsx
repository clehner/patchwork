'use babel'
import React from 'react'
import pull from 'pull-stream'
import mlib from 'ssb-msgs'
import MsgList from '../com/msg-list'
import Card from '../com/msg-list/card'
import app from '../lib/app'

export default class NewsFeed extends React.Component {
  cursor (msg) {
    if (msg)
      return [msg.value.timestamp, msg.value.author]
  }

  render() {
    return <div id="feed">
      <MsgList
        threads
        ListItem={Card}
        live={{ gt: [Date.now(), null] }}
        emptyMsg="Your feed is empty"
        source={app.ssb.patchwork.createNewsfeedStream}
        cursor={this.cursor} />
    </div>
  }
}