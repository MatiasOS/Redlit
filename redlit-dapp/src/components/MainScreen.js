import React, {Component} from 'react';
import MainScreenView from '../views/MainScreenView';
import HeaderView from '../views/HeaderView';
import RequestsBadge from './RequestsBadge';
import AccountLink from './AccountLink';
import ProfileIdentity from './ProfileIdentity';
import PropTypes from 'prop-types';

class MainScreen extends Component {
  constructor(props) {
    super(props);
    this.litTokenService = this.props.services.litTokenService;
    this.ensService = this.props.services.ensService;
    this.state = {events: [], profile: [], ensName: '', address: ''};
    this.getProfile();
  }

  async getProfile(){
    const profiles = await this.litTokenService.getRegisteredUsers();
    const rand = Math.floor(Math.random() * profiles.length);
    const ensName = await this.ensService.getEnsName(profiles[rand]);
    var profile = await this.litTokenService.getUserProfile(profiles[rand]);
    if (profile === ''){
      profile = [];
      profile.name = ensName;
      profile.description = 'No description given';
      profile.image = 'default';
      profile.contact = 'No contact';
    }
    this.setState({ address: profiles[rand], ensName: ensName, profile: profile })

  }

  setView(view) {
    const {emitter} = this.props.services;
    emitter.emit('setView', view);
  }


  componentDidMount() {
    this.timeout = setTimeout(this.update.bind(this), 0);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  goToProfile(){
    this.setView("Account");
  }

  goToRelations() {
    this.setView("Relation");
  }

  async rejectProfile() {
    this.getProfile();
  }

  async update() {
    // const {tokenService} = await this.props.services;
    // const {identityService} = this.props.services;
    // const {address} = identityService.identity;
    // setTimeout(this.update.bind(this), 1000);
  }

  render() {
    return (
      <div>
        <RequestsBadge setView={this.setView.bind(this)} services={this.props.services}/>
        <MainScreenView name={this.state.profile.name} image={this.state.profile.image} description={this.state.profile.description} contact={this.state.profile.contact} rejectProfile={this.rejectProfile.bind(this)} goToRelations={this.goToRelations.bind(this)} goToProfile={this.goToProfile.bind(this)} events={this.state.events} />
      </div>
      )
  }
}

MainScreen.propTypes = {
  services: PropTypes.object
};

export default MainScreen;
