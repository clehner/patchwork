'use babel'
import React from 'react'
import mlib from 'ssb-msgs'
import threadlib from 'patchwork-threads'
import { MsgLink, UserLink, UserPic, NiceDate } from '../index'
import { Inline as MdInline } from '../markdown'
import u from '../../lib/util'
import app from '../../lib/app'

const INLINE_LENGTH_LIMIT = 100

export default class Notification extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      subjectMsg: null, // the message that `props.msg` is about (used by votes)
      wasSeen: false // did the user click on the note, and so we can stop showing as 'new' ?
     } 
  }

  componentDidMount() {
    // load the subject msg
    const msg = this.props.msg
    if (!msg || msg.value.content.type !== 'vote')
      return this.setState({ subjectMsg: null }) // no subject msg needed

    // `props.msg` is a vote, load the subject msg
    const vote = mlib.link(msg.value.content.vote, 'msg')
    if (!vote)
      return this.setState({ subjectMsg: null }) // malformed

    app.ssb.get(vote.link, (err, subjectMsg) => {
      if (subjectMsg) {
        subjectMsg = { key: vote.link, value: subjectMsg }
        threadlib.decryptThread(app.ssb, subjectMsg, () => this.setState({ subjectMsg: subjectMsg }))
      } else
        this.setState({ subjectMsg: null })
    })
  }

  onSelect() {
    // get root msg
    var subject = this.state.subjectMsg || this.props.msg
    threadlib.getParentPostThread(app.ssb, subject.key, (err, thread) => {
      if (err)
        return app.issue('Failed to load thread', err, 'This occurred when a notification link was clicked')
      this.props.onSelect(thread, true)
    })
  }

  render() {
    const msg = this.props.msg
    const content = this.renderContent()
    if (!content)
      return <span/>
    const setWasSeen = () => { this.setState({ wasSeen: true }) }
    return <div className={'msg-view notification'+((msg.isLiveUpdate&&!this.state.wasSeen)?' new':'')} onClick={setWasSeen}>
      <div className="ctrls"><UserPic id={msg.value.author} /></div>
      <div className="content">
        <div>{content}</div>
        <div><NiceDate ts={msg.value.timestamp} /></div>
      </div>
    </div>
  }

  renderContent() {
    const msg = this.props.msg
    const c = msg.value.content
    switch (c.type) {
    case 'post':    return this.renderPost()
    case 'vote':    return this.renderVote()
    case 'contact': return this.renderContact()
    }
    return false
  }

  renderPost() {
    // we're going to assume this post mentions the user, since that's what notifications are used for
    const msg = this.props.msg
    const c = msg.value.content
    const text = (c.text || 'this message')
    return <span>
      <i className="fa fa-at" /> <UserLink id={msg.value.author} /> mentioned you in <a className="subject" onClick={this.onSelect.bind(this)}>
        <MdInline md={text}/>
      </a>
    </span>
  }

  renderVote() {
    const msg = this.props.msg
    const c = msg.value.content
    const subject = this.state.subjectMsg
    const text = (subject && subject.value.content && subject.value.content.text || 'this message')
    if (typeof c.vote.value !== 'number')
      return false
    const icon = (c.vote.value > 0) ? 'fa fa-hand-peace-o' : (c.vote.value === 0) ? 'fa fa-times'            : 'fa fa-flag'
    const desc = (c.vote.value > 0) ? 'dug'                : (c.vote.value === 0) ? 'removed their vote for' : 'flagged'
    const reason = (c.vote.reason) ? ('as '+c.vote.reason) : ''
    return <span>
      <i className={icon} /> <UserLink id={msg.value.author} /> {desc} <a className="subject" onClick={this.onSelect.bind(this)}>
        <MdInline md={text}/>
      </a> {reason}
    </span> 
  }

  renderContact() {
    const msg = this.props.msg
    const c = msg.value.content    
    const pid = mlib.link(c.contact).link
    if (c.following === true) return <span><i className="fa fa-user-plus" /> <UserLink id={msg.value.author} /> followed you</span>
    if (c.blocking === true) return <span><i className="fa fa-microphone-slash" /> <UserLink id={msg.value.author} /> blocked you</span>
    if (c.following === false) return <span><i className="fa fa-user-times" /> <UserLink id={msg.value.author} /> unfollowed you</span>
  }
}