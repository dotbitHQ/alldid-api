import { Test, TestingModule } from '@nestjs/testing';
import { CacheModule } from '@nestjs/common'
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('isSupported', () => {
    it('should return "{ is_supported: true }"', async () => {
      expect(await appController.isSupported({
        name: 'leon.bit'
      })).toEqual({ is_supported: true });
    });

    it('should return "{ is_supported: false }"', async () => {
      expect(await appController.isSupported({
        name: 'leon.bieet'
      })).toEqual({ is_supported: false });
    });
  });

  describe('isRegistered', () => {
    it('should return "{ is_registered: true }"', async () => {
      expect(await appController.isRegistered({
        name: 'leon.bit'
      })).toEqual({ is_registered: true });
    });

    it('should return "{ is_registered: false }"', async () => {
      expect(await appController.isRegistered({
        name: 'leont.bit'
      })).toEqual({ is_registered: false });
    });
  });
  
  describe('isAvailable', () => {
    it('should return "{ is_available: true }"', async () => {
      expect(await appController.isAvailable({
        name: 'leont.bit'
      })).toEqual({ is_available: true });
    });

    it('should return "{ is_available: false }"', async () => {
      expect(await appController.isAvailable({
        name: 'leon.bit'
      })).toEqual({ is_available: false });
    });
  });

  describe('findOwnerByName', () => {
    it('should return "{ owner: true }"', async () => {
      expect(await appController.findOwnerByName({
        name: 'leon.bit'
      })).toEqual({ owner: '0x0403d6d288db8908b5ff21b60d347c6e450eb828' });
    });

    it('should return "Error: Unregistered domain name"', async () => {
      await expect(appController.findOwnerByName({
        name: 'leont.bit'
      })).rejects.toThrow(`Unregistered domain name`)
    });
  });

  describe('findManagerByName', () => {
    it('should return { manager: "0x0403d6d288db8908b5ff21b60d347c6e450eb828" }', async () => {
      expect(await appController.findManagerByName({
        name: 'leon.bit'
      })).toEqual({ manager: '0x0403d6d288db8908b5ff21b60d347c6e450eb828' });
    });

    it('should return "Error: Unregistered domain name"', async () => {
      await expect(appController.findManagerByName({
        name: 'leont.bit'
      })).rejects.toThrow(`Unregistered domain name`)
    });
  });

  describe('findTokenIdByName', () => {
    it('should return "{ owner: true }"', async () => {
      expect(await appController.findTokenIdByName({
        name: 'leon.bit'
      })).toEqual({ token_id: '0x38ae79fc97c608c6a9707d5df4bf44d1a4d8d6ab' });
    });
  });

  describe('findRecordsByName', () => {
    it('should return "[ data ]"', async () => {
      expect(await appController.findRecordsByName({
        name: 'leonx.bit',
      }, {
        keys: '["address.eth"]'
      })).toEqual(
        [
          {
            "key": "address.eth",
            "type": "address",
            "subtype": "eth",
            "label": "",
            "value": "0xC72B6f66017246d6A7f159F5C2BF358188AD9ECa",
            "ttl": 300
          }
        ]
      );
    });

    it('should return "Error: Unregistered domain name"', async () => {
      await expect(appController.findRecordsByName({
        name: 'leont.bit',
      }, {
        keys: '["address.eth"]'
      })).rejects.toThrow(`Unregistered domain name`)
    });
  });

  describe('findAddrsByName', () => {
    it('should return "[ data ]"', async () => {
      expect(await appController.findAddrsByName({
        name: 'leonx.bit',
      }, {
        keys: '["eth"]'
      })).toEqual(
        [
          {
            "key": "address.eth",
            "type": "address",
            "subtype": "eth",
            "label": "",
            "value": "0xC72B6f66017246d6A7f159F5C2BF358188AD9ECa",
            "ttl": 300,
            "symbol": "ETH"
          }
        ]
      );
    });

    it('should return "Error: Unregistered domain name"', async () => {
      await expect(appController.findAddrsByName({
        name: 'leont.bit',
      }, {
        keys: '["eth"]'
      })).rejects.toThrow(`Unregistered domain name`)
    });
  });
  
  describe('findRegistryByName', () => {
    it('should return "[ data ]"', async () => {
      expect(await appController.findRegistryByName({
        name: 'leon.eth',
      })).toEqual({"registry_address": "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"});
    });

    it('should return "Error: Unsupported Method"', async () => {
      await expect(appController.findRegistryByName({
        name: 'leont.bit',
      })).rejects.toThrow(`Unsupported Method`)
    });
  });

});
