import React, { Component } from 'react';
import VolumeUp from 'react-icons/lib/fa/volume-up';
import '../stylesheets/header.css';

export class Header extends Component {

  constructor(props) {
    super(props)
    this.state = {
      voicesList: [],
      voiceShow: false,
      activeVoice: '',
      value: 33
    }
  }

  componentDidMount() {
    this.populateVoiceList()
  }

  populateVoiceList() {
    let voices;
    let activeVoice;
    window.speechSynthesis.onvoiceschanged = () => {
      voices = window.speechSynthesis.getVoices();
      if (voices.some(e => (e.name === 'Google UK English Female'))) {
        activeVoice = 'Google UK English Female'
      } else {
        activeVoice = voices.filter(value => {
          return value.default === true
        })
      }

      this.setState({
        voicesList: voices,
        activeVoice: activeVoice
      })
      this.props.updateVoice(activeVoice)
    };

    if( navigator.userAgent.toLowerCase().indexOf('firefox') > -1 ){
      voices = window.speechSynthesis.getVoices();
      this.setState({
        voicesList: voices
      })
    }

  }

  toggleVoiceDD() {
    this.setState(prev => ({
      voiceShow: true
    })
    )
  }

  render() {

    const voicesList = this.state.voicesList.map((value, index, array) => {
      if (value.default === true
        || value.name === 'Google UK English Female'
        || value.name === 'Google UK English Male'
        || value.name === 'Google UK English Female'
        || value.name === 'Google US English'
        || value.name.includes('Microsoft')
        || value.name.includes('apple')
      ) {
        return <li className={value.name === this.props.activeVoice ? "voiceDDItem active": "voiceDDItem"} onClick={() => this.props.updateVoice(value.name)} key={value.name}>{value.name}</li>
      }
      return null;
    })

    return (
      <div className="header">
        <h2>Spelling Analyser</h2>
        <div className="settingsOption settingsOptionVoices">
            <ul className="voiceList">
              <li className="voiceOption" onClick={() =>
                  this.toggleVoiceDD()}>Voices &nbsp; &#9662;</li>
              <ul className={this.state.voiceShow ? "voiceDD" : 'voiceDD hide'}>
                {voicesList}
              </ul>
            </ul>
        </div>
        <div className="settingsOption">
          <VolumeUp className='setting__volume'/>
          <div className="slidecontainer">

              <input type='range'
                defaultValue={100}
                min={1}
                max={100}
                onChange={this.props.handleVolumeChange}
                className='slider'/>
          </div>

        </div>
      </div>
    )
  }
}
