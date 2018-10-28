import ethers, {utils, Interface} from 'ethers';
import Token from '../../build/Token';
import {tokenContractAddress} from '../../config/config';
import DEFAULT_PAYMENT_OPTIONS from '../../config/defaultPaymentOptions';
import LitToken from '../../build/LitToken';
import image2base64 from 'image-to-base64';
import ipfsAPI from 'ipfs-api';

const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'})

class LitTokenService {
  constructor(litTokenContractAddress, identityService, ensService, provider) {
    this.litTokenContractAddress = litTokenContractAddress;
    this.identityService = identityService;
    this.provider = provider;
  }

  async getBalance(address) {
    this.litTokenContract = new ethers.Contract(
      this.litTokenContractAddress,
      LitToken.interface,
      this.provider
    );
    return await this.litTokenContract.balances(address);
  };

  async sendToRelation(address) {
    return await this.litTokenContract.balance(address);
  }

  async withdrawFromRelation(address) {
    return await this.litTokenContract.balance(address);
  }

  async sendRelationRequest(address) {
    return await this.litTokenContract.balance(address);
  }

  async acceptRelationRequest(address) {
    return await this.litTokenContract.balance(address);
  }

  async register() {
    const {data} = new Interface(LitToken.interface).functions.register();
    const message = {
      to: this.litTokenContractAddress,
      from: this.identityService.identity.address,
      value: 0,
      data,
      gasToken: tokenContractAddress,
      ...DEFAULT_PAYMENT_OPTIONS
    }
    await this.identityService.execute(message);
  }

  async editProfile(name, description, file, contact) {
    console.log("editing")
    const userProfile = {};
    userProfile.image = await image2base64(file);;
    userProfile.description = description;
    userProfile.name = name;
    userProfile.contact= contact;
    const buffer = new Buffer(JSON.stringify(userProfile));
    await ipfs.add(buffer, async (err, profileHash) => {
      if (err) return console.log(err);
      console.log(profileHash[0].hash);
      await this.executeEditProfile(profileHash[0].hash);
    })
  }

  async executeEditProfile(profileHash) {
    const {data} = new Interface(LitToken.interface).functions.editProfile(profileHash);
    const message = {
      to: this.litTokenContractAddress,
      from: this.identityService.identity.address,
      value: 0,
      data,
      gasToken: tokenContractAddress,
      ...DEFAULT_PAYMENT_OPTIONS
    }
    await this.identityService.execute(message);
  }


  async getUserProfile(userAddress=this.identityService.identity.address) {
    const profileEditEvent = new Interface(LitToken.interface).events.ProfileEdit;
    var profileEdit = '';
    const filter = {
      fromBlock: 0,
      address: this.litTokenContractAddress,
      topics: [profileEditEvent.topics]
    };
    const events = await this.provider.getLogs(filter);
    for (const event of events) {
      const eventArguments = profileEditEvent.parse(profileEditEvent.topics, event.data);
      if (eventArguments.user === userAddress) {
        profileEdit = eventArguments.profileHash;
      }
    }

    if (profileEdit !== '') { 
      let content = await ipfs.cat(profileEdit).catch(err => console.log(err));
      profileEdit = JSON.parse(content.toString('utf8'));
    }

    return profileEdit;
  }

  async getRegisteredUsers() {
    const registerUserEvent = new Interface(LitToken.interface).events.RegisterUser;
    var registeredUsers = [];
    const filter = {
      fromBlock: 0,
      address: this.litTokenContractAddress,
      topics: [registerUserEvent.topics]
    };
    const events = await this.provider.getLogs(filter);
    for (const event of events) {
      const eventArguments = registerUserEvent.parse(registerUserEvent.topics, event.data);
      registeredUsers.push(eventArguments.user);
    }
    return registeredUsers;
  }
}
export default LitTokenService;
