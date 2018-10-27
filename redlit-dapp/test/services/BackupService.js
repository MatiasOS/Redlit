import {expect} from 'chai';
import BackupService from '../../src/services/BackupService';

describe('BackupService', async () => {
  let backupService;
  let identityService;

  before(async () => {
    identityService = [];
    identityService.identity = [];
    identityService.identity.name = 'kyle';
    backupService = new BackupService(identityService);
  });
  describe('Backup Codes', async () => {
    it('generates one backup code', async () => {
      await backupService.generateBackupCodes(1);
      expect(backupService.backupCodes.length).to.eq(1);
      expect(backupService.backupCodes[0]).to.match(/^\w+(-\w+)+$/);
    });

    it('generates more than one backup code', async () => {
      await backupService.generateBackupCodes(2);
      expect(backupService.backupCodes.length).to.eq(3);
    });

    it('clears backup codes', async () => {
      await backupService.clearBackupCodes();
      expect(backupService.backupCodes.length).to.eq(0);
    });
  });
});
