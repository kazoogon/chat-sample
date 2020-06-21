import React, { useState, useEffect } from 'react'
import './Chat.css'
import queryString from 'query-string'
import io from 'socket.io-client'
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";

let socket

const Chat = ({location}) => {
  const [name, setName] = useState('')
  const [room, setRoom] = useState('')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const ENDPOINT = 'localhost:5000';

  // similar to componentDidMount + componentDidUpdate
  useEffect(() => {
    const {name, room} = queryString.parse(location.search)//location is from react router, get URL parameter

    socket = io(ENDPOINT)
    setName(name)
    setRoom(room)
    socket.emit('join', {name, room}, () => {

    })

    return () => {
      socket.emit('disconnect')
      socket.off()
    }

  }, [ENDPOINT, location.search])//ここの値が変わったら、useEffect executes

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages([...messages, message])
    })
  }, [messages])

  const sendMessage = (event) => {
    event.preventDefault()
    if(message) {
      socket.emit('sendMessage', message, () => setMessage(''))
    }
  }

  console.log(message, messages)

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room}/>
        <Messages messages={messages} name={name}/>
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
      </div>
      {/*<TextContainer users={users} />*/}
    </div>
  )
}

export default Chat