import React from 'react'
export default class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state={
      gameNumber:0
    }
  }
  static winningSuit = "";
  static team1Points = 0;
  static team2Points = 0;
  static lastPlayer = "";
  static tableSet = {};
  static whoPlayedFirst=""
}
