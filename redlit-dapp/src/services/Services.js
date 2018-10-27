import {EventEmitter} from 'fbemitter';
import EthereumIdentitySDK from 'universal-login-sdk';
import ethers from 'ethers';
import config, {clickerContractAddress, tokenContractAddress, litTokenAddress} from '../../config/config';
import IdentityService from './IdentityService';
import ClickerService from './ClickerService';
import EnsService from './EnsService';
import AuthorisationService from './AuthorisationService';
import TokenService from './TokenService';
import LitTokenService from './LitTokenService';
import IdentitySelectionService from './IdentitySelectionService';
import BackupService from './BackupService';
import GreetingService from './GreetingService';
import StorageService from './StorageService';

class Services {
  constructor() {
    this.config = config;
    this.emitter = new EventEmitter();
    this.provider = new ethers.providers.JsonRpcProvider(this.config.jsonRpcUrl);
    this.sdk = new EthereumIdentitySDK(this.config.relayerUrl, this.provider);
    this.ensService = new EnsService(this.sdk, this.provider);
    this.tokenService = new TokenService(tokenContractAddress, this.provider);
    this.storageService = new StorageService();
    this.identityService = new IdentityService(this.sdk, this.emitter, this.storageService, this.provider, this.config.swarmProvider);
    this.backupService = new BackupService(this.identityService);
    this.clickerService = new ClickerService(this.identityService, clickerContractAddress, this.provider, this.ensService);
    this.authorisationService = new AuthorisationService(this.sdk, this.emitter);
    this.identitySelectionService = new IdentitySelectionService(this.sdk, config.ensDomains);
    this.rednitTokenService = new LitTokenService(litTokenAddress, this.identityService, this.ensService, this.provider)
    this.greetingService = new GreetingService(this.provider);
  }

  start() {
    this.sdk.start();
  }

  stop() {
    this.sdk.stop();
  }
}

export default Services;
