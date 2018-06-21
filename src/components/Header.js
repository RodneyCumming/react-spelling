import '../stylesheets/Header.css';
import React, { Component } from 'react';
import VolumeUp from 'react-icons/lib/fa/volume-up';
import '../stylesheets/Header.css';

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
    //window.addEventListener('mouseup', () => this.hideDropDown())
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


    // for(let i = 0; i < voices.length ; i++) {
    //   console.log(voices[i])
    //   // var option = <option>;
    //   // option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
    //   //
    //   // if(voices[i].default) {
    //   //   option.textContent += ' -- DEFAULT';
    //   // }
    //   //
    //   // option.setAttribute('data-lang', voices[i].lang);
    //   // option.setAttribute('data-name', voices[i].name);
    //   // </option>
    // }
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
