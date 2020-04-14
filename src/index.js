import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Same beep sound from free code camp
const BEEPSRC = "https://goo.gl/65cBl1"

class PomodoroClock extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      timeLeft: {
        minutes: 25,
        seconds: 0
      },
      isSession: true,
      isPaused: true,
      timerID: null, 
    }
  }
  // Can only increase/decrease when isPaused is true ??

  incrementBreak = () => {
    if (this.state.breakLength + 1 > 60){
      console.warn(`User cannot set break length greater than 60`);
    } else {
      this.setState(
        {
          breakLength: this.state.breakLength + 1,
          sessionLength: this.state.sessionLength,
          timeLeft: {
            minutes: this.state.isSession ? this.state.timeLeft.minutes :  this.state.breakLength + 1,
            seconds: this.state.timeLeft.seconds
          },
          isSession: this.state.isSession,
          isPaused: this.state.isPaused,
          timerID: this.state.timerID,
        }
      )
    }
  }

  decrementBreak = () => {
    if (this.state.breakLength - 1 < 1){
      console.warn(`User cannot set break length less than 1`);
    } else {
      this.setState(
        {
          breakLength: this.state.breakLength - 1,
          sessionLength: this.state.sessionLength,
          timeLeft: {
            minutes: this.state.isSession ? this.state.timeLeft.minutes :  this.state.breakLength - 1,
            seconds: this.state.timeLeft.seconds
          },
          isSession: this.state.isSession,
          isPaused: this.state.isPaused,
          timerID: this.state.timerID,
        }
      )
    }
  }

  decrementSession= () => {
    if (this.state.sessionLength - 1 < 1){
      console.warn(`User cannot set session length less than 1`);
    } else {
      this.setState(
        {
          breakLength: this.state.breakLength,
          sessionLength: this.state.sessionLength - 1,
          timeLeft: {
            minutes: this.state.isSession ? this.state.sessionLength - 1 :  this.state.timeLeft.minutes,
            seconds: this.state.timeLeft.seconds
          },
          isSession: this.state.isSession,
          isPaused: this.state.isPaused,
          timerID: this.state.timerID,
        }
      )
    }
  }

  incrementSession = () => {
    if (this.state.sessionLength + 1 > 60){
      console.warn(`User cannot set session length greater than 60`);
    } else {
      this.setState(
        {
          breakLength: this.state.breakLength,
          sessionLength: this.state.sessionLength + 1,
          timeLeft: {
            minutes: this.state.isSession ? this.state.sessionLength - 1 :  this.state.timeLeft.minutes,
            seconds: this.state.timeLeft.seconds
          },
          isSession: this.state.isSession,
          isPaused: this.state.isPaused,
          timerID: this.state.timerID,
        }
      )
    }
  }

  reset = () => {
    // Stop beep sound and rewount to the beginning
    let beep = document.getElementById('beep'); 
    beep.pause();
    beep.currentTime = 0;

    if (this.state.timerID){
      clearInterval(this.state.timerID);
    }

    this.setState({
      breakLength: 5,
      sessionLength: 25,
      timeLeft: {
        minutes: 25,
        seconds: 0
      },
      isSession: true,
      isPaused: true,
      timerID: null 
    });
  }

  stopTimer = () => {
    if (this.state.timerID){
      clearInterval(this.state.timerID);
    };

    this.setState({
      breakLength: this.state.breakLength,
      sessionLength: this.state.sessionLength,
      timeLeft: {
          minutes: this.state.timeLeft.minutes,
          seconds: this.state.timeLeft.seconds,
        },
      isSession: this.state.isSession,
      isPaused: true,
      timerID: null, 
    });
  }

  startTimer = () => {
    this.setState(
      {
        breakLength: this.state.breakLength,
        sessionLength: this.state.sessionLength,
        timeLeft: {
          minutes: this.state.timeLeft.minutes,
          seconds: this.state.timeLeft.seconds
        },
        isSession: this.state.isSession,
        isPaused: false,
        timerID: setInterval(this.updateClock, 1000),
      }
    );
  }

  triggerPlayOrPause = () => {
    let newState = !this.state.isPaused;
    if (newState === true) {
      this.stopTimer();
    } else {
      this.startTimer();
    }
  }

  updateClock = () => {
    // decrease the clock by 1 second
    let newSeconds;
    let newMinutes;
    let newSession = false;
    if (this.state.timeLeft.seconds === 0) {
      if (this.state.timeLeft.minutes === 0){ 
        // switch between break and session
        newSession = true;
        newSeconds = 0;
        if (this.state.isSession){
          newMinutes = this.state.breakLength;
        } else {
          newMinutes = this.state.sessionLength;
        }
        // play beep sound
        let beep = document.getElementById('beep'); 
        beep.play();
      } else {
        newSeconds = 59;
        newMinutes = this.state.timeLeft.minutes - 1;
      }
    } else {
      newMinutes = this.state.timeLeft.minutes;
      newSeconds = this.state.timeLeft.seconds - 1;
    }

    this.setState({
      breakLength: this.state.breakLength,
      sessionLength: this.state.sessionLength,
      timeLeft: {
        minutes: newMinutes,
        seconds: newSeconds,
        },
      isSession: newSession ? !this.state.isSession : this.state.isSession,
      isPaused: this.state.isPaused,
      timerID: this.state.timerID,
    });
    
  }

  
  render(){
    return (
      <div id='pomodoro-clock'>
        <h1 id='pomodoro-clock-title'>Pomodoro Clock</h1>
        <div id='break-container'>
          <label id='break-label' for='break-length'>Break Length</label>
          <p id='break-length'>{this.state.breakLength}</p>
        </div>
        <button id='break-increment' onClick={this.incrementBreak}>Increase break</button>
        <button id='break-decrement' onClick={this.decrementBreak}>Decrease break</button>
        <div id='session-container'>
          <label id='session-label' for='sesion-length'>Session Length</label>
          <p id='session-length'>{this.state.sessionLength}</p>
        </div>
        <button id='session-increment' onClick={this.incrementSession}>Increase session</button>
        <button id='session-decrement' onClick={this.decrementSession}>Decrease session</button>
        <div id='timer-container'>
          <label id='timer-label' for='time-left'>{this.state.isSession? 'Session': 'Break'}</label>
          <br></br>
          <time id='time-left'>
            {this.state.timeLeft.minutes < 10? 
              '0' + this.state.timeLeft.minutes.toString() :
              this.state.timeLeft.minutes}:
            {this.state.timeLeft.seconds < 10? 
              '0' + this.state.timeLeft.seconds.toString() :
              this.state.timeLeft.seconds
            }
          </time>
        </div>
        <button id='start_stop' onClick={this.triggerPlayOrPause}> Start/Stop</button>
        <button id='reset' onClick={this.reset}>Reset</button>
        <audio id='beep' preload='auto' src={BEEPSRC}></audio>
      </div>
    );

  }
}



ReactDOM.render(
  <PomodoroClock />,
  document.getElementById('root')
);
